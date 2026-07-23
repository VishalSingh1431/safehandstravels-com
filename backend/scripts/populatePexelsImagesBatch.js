import pool from '../config/database.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const PEXELS_API_KEY = 'jcJUOdTJBCXTM6bOX3mfNLJnj96iodG8L5MzRRSTdGE0oBf8VIevGAAW';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function extractKeyword(title) {
  title = title.toLowerCase();
  const keywords = [
    'varanasi', 'goa', 'rajasthan', 'kerala', 'kashmir', 'shimla', 'manali', 
    'sikkim', 'darjeeling', 'ayodhya', 'prayagraj', 'tirupati', 'kedarnath', 
    'shirdi', 'agra', 'jaipur', 'mumbai', 'bangalore', 'mysore', 'chennai', 
    'gujarat', 'himachal', 'mahakaleshwar', 'omkareshwar', 'dwarka', 'somnath', 
    'delhi', 'leh', 'ladakh', 'uttarakhand', 'indore', 'ujjain', 'arunachal', 'amritsar'
  ];
  
  for (let kw of keywords) {
    if (title.includes(kw)) return kw;
  }
  
  // Custom fallbacks
  if (title.includes('south india')) return "South India";
  if (title.includes('golden triangle')) return "Golden Triangle India";
  return "India tourism";
}

async function getPexelsImages(keyword) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=5`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (!res.ok) {
      console.error(`Pexels API error: ${res.statusText}`);
      return [];
    }
    
    const data = await res.json();
    if (!data || !data.photos) return [];
    
    return data.photos.map(photo => photo.src.large);
  } catch (e) {
    console.error(`Failed to fetch Pexels images for ${keyword}:`, e);
    return [];
  }
}

async function populateBatch() {
  try {
    const offset = parseInt(process.argv[2] || '0');
    const limit = parseInt(process.argv[3] || '10');
    const [trips] = await pool.query('SELECT id, title FROM trips ORDER BY id ASC LIMIT ? OFFSET ?', [limit, offset]);
    console.log(`Starting Pexels image population for trips with LIMIT ${limit} OFFSET ${offset}...`);
    
    for (const trip of trips) {
      const keyword = extractKeyword(trip.title);
      console.log(`\n----------------------------------------`);
      console.log(`ID ${trip.id} | Processing "${trip.title}" -> Keyword: "${keyword}"`);
      
      const imageUrls = await getPexelsImages(keyword);
      if (imageUrls.length === 0) {
        console.log(`⚠️ No images found on Pexels for "${keyword}"`);
        continue;
      }
      
      console.log(`☁️ Uploading ${imageUrls.length} images to Cloudinary via buffer...`);
      const uploadedImages = [];
      
      for (const url of imageUrls) {
        try {
          const imageRes = await fetch(url);
          if (!imageRes.ok) throw new Error(`Fetch failed: ${imageRes.statusText}`);
          
          const arrayBuffer = await imageRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'trips' }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }).end(buffer);
          });
          
          uploadedImages.push({ url: result.secure_url, public_id: result.public_id });
          await sleep(500);
        } catch (err) {
          console.error(`Failed to upload ${url}: ${err.message || err.toString()}`);
        }
      }
      
      if (uploadedImages.length > 0) {
        const mainImage = uploadedImages[0];
        const galleryImages = uploadedImages.slice(1);
        
        await pool.query(
          'UPDATE trips SET image_url = ?, image_public_id = ?, gallery = ?, gallery_public_ids = ? WHERE id = ?',
          [
            mainImage.url,
            mainImage.public_id,
            JSON.stringify(galleryImages.map(img => img.url)),
            JSON.stringify(galleryImages.map(img => img.public_id)),
            trip.id
          ]
        );
        console.log(`✅ Successfully updated images for "${trip.title}"!`);
      }
    }
  } catch (error) {
    console.error('Batch population script failed:', error);
  } finally {
    process.exit(0);
  }
}

populateBatch();
