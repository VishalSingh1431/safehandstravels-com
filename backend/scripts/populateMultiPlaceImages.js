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

// Map trip title substrings to search keywords
const keywordMapping = [
  { keys: ['varanasi', 'kashi'], search: 'Varanasi' },
  { keys: ['ayodhya'], search: 'Ayodhya' },
  { keys: ['prayagraj', 'prayagra'], search: 'Prayagraj' },
  { keys: ['delhi', 'dehli'], search: 'Delhi' },
  { keys: ['agra', 'taj mahal'], search: 'Taj Mahal' },
  { keys: ['jaipur'], search: 'Jaipur' },
  { keys: ['mumbai'], search: 'Mumbai' },
  { keys: ['bangalore', 'blr'], search: 'Bangalore' },
  { keys: ['mysore'], search: 'Mysore' },
  { keys: ['goa'], search: 'Goa' },
  { keys: ['kerala'], search: 'Kerala' },
  { keys: ['kashmir'], search: 'Kashmir' },
  { keys: ['shimla'], search: 'Shimla' },
  { keys: ['manali'], search: 'Manali' },
  { keys: ['sikkim'], search: 'Sikkim' },
  { keys: ['darjeeling'], search: 'Darjeeling' },
  { keys: ['gujarat'], search: 'Gujarat' },
  { keys: ['himachal'], search: 'Himachal' },
  { keys: ['leh', 'ladakh'], search: 'Ladakh' },
  { keys: ['uttarakhand'], search: 'Uttarakhand' },
  { keys: ['indore'], search: 'Indore' },
  { keys: ['ujjain'], search: 'Ujjain' },
  { keys: ['amritsar'], search: 'Amritsar' },
  { keys: ['haridwar'], search: 'Haridwar' },
  { keys: ['rishikesh'], search: 'Rishikesh' },
  { keys: ['ranthambore'], search: 'Ranthambore' },
  { keys: ['khajuraho'], search: 'Khajuraho' },
  { keys: ['aurangabad'], search: 'Aurangabad' },
  { keys: ['nashik', 'nasik'], search: 'Nashik' },
  { keys: ['ellora', 'ajanta'], search: 'Ellora Caves' },
  { keys: ['pondicherry', 'pondi'], search: 'Pondicherry' },
  { keys: ['madurai'], search: 'Madurai' },
  { keys: ['tanjore', 'thanjavur'], search: 'Thanjavur' },
  { keys: ['trichy'], search: 'Trichy' },
  { keys: ['kumbakonam'], search: 'Kumbakonam' },
  { keys: ['tirupati', 'thrupati'], search: 'Tirupati' },
  { keys: ['kanchipuram', 'kanchi'], search: 'Kanchipuram' },
  { keys: ['mahabalipuram', 'maha.b'], search: 'Mahabalipuram' },
  { keys: ['omkareshwar'], search: 'Omkareshwar' },
  { keys: ['mahakaleshwar'], search: 'Mahakaleshwar' },
  { keys: ['dwarka'], search: 'Dwarka' },
  { keys: ['somnath'], search: 'Somnath' }
];

function extractAllKeywords(title) {
  const matched = [];
  const normalizedTitle = title.toLowerCase();
  
  for (const mapping of keywordMapping) {
    for (const key of mapping.keys) {
      if (normalizedTitle.includes(key)) {
        matched.push(mapping.search);
        break; // Match only once per category mapping
      }
    }
  }
  return [...new Set(matched)];
}

async function getPexelsImages(keyword, count = 3) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=${count}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Authorization': PEXELS_API_KEY
      }
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !data.photos) return [];
    
    return data.photos.map(photo => photo.src.large);
  } catch (e) {
    console.error(`Failed to fetch Pexels images for ${keyword}:`, e);
    return [];
  }
}

async function populateMultiPlace() {
  try {
    const [trips] = await pool.query('SELECT id, title FROM trips');
    console.log(`Analyzing ${trips.length} trips for multiple places...`);
    
    let updatedCount = 0;
    
    for (const trip of trips) {
      const matchedPlaces = extractAllKeywords(trip.title);
      
      // We only update if there are 2 or more distinct destinations matched in the title
      if (matchedPlaces.length < 2) continue;
      
      console.log(`\n========================================`);
      console.log(`Trip ID ${trip.id}: "${trip.title}"`);
      console.log(`Matched Destinations (${matchedPlaces.length}): ${matchedPlaces.join(', ')}`);
      
      const allUrlsToUpload = [];
      
      for (const place of matchedPlaces) {
        console.log(`Searching 3 images for: "${place}"`);
        const urls = await getPexelsImages(place, 3);
        allUrlsToUpload.push(...urls);
      }
      
      if (allUrlsToUpload.length === 0) {
        console.log(`⚠️ No images found for any places.`);
        continue;
      }
      
      console.log(`☁️ Uploading ${allUrlsToUpload.length} total images to Cloudinary...`);
      const uploadedImages = [];
      
      for (const url of allUrlsToUpload) {
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
          await sleep(500); // Pause to prevent rate limits
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
        console.log(`✅ Gallery successfully updated for "${trip.title}"!`);
        updatedCount++;
      }
    }
    
    console.log(`\n========================================`);
    console.log(`Multi-place image population finished!`);
    console.log(`Total trips with multi-place updates: ${updatedCount}`);
  } catch (error) {
    console.error('Multi-place population script failed:', error);
  } finally {
    process.exit(0);
  }
}

populateMultiPlace();
