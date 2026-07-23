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

const destinationsList = [
  { name: 'Varanasi', query: 'Varanasi ghat' },
  { name: 'Ayodhya', query: 'Ayodhya temple' },
  { name: 'Prayagraj', query: 'Prayagraj Triveni Sangam' },
  { name: 'Kashmir', query: 'Kashmir mountains' },
  { name: 'Goa', query: 'Goa beach' },
  { name: 'Kerala', query: 'Kerala houseboats' },
  { name: 'Jaipur', query: 'Jaipur palace' },
  { name: 'Agra', query: 'Taj Mahal' },
  { name: 'Delhi', query: 'Delhi Red Fort' },
  { name: 'Shimla', query: 'Shimla mountains' },
  { name: 'Manali', query: 'Manali mountains' },
  { name: 'Kedarnath', query: 'Kedarnath temple' },
  { name: 'Rishikesh', query: 'Rishikesh Laxman Jhula' },
  { name: 'Haridwar', query: 'Haridwar Ganga Aarti' },
  { name: 'Tirupati', query: 'Tirupati temple' },
  { name: 'Shirdi', query: 'Shirdi temple' },
  { name: 'Ranthambore', query: 'Ranthambore tiger' },
  { name: 'Darjeeling', query: 'Darjeeling tea garden' }
];

async function getPexelsImage(keyword) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=1`;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': PEXELS_API_KEY }
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.photos && data.photos.length > 0) {
      return data.photos[0].src.large;
    }
    return null;
  } catch (e) {
    console.error(`Pexels error for keyword ${keyword}:`, e);
    return null;
  }
}

async function uploadToCloudinary(url) {
  const imageRes = await fetch(url);
  if (!imageRes.ok) throw new Error(`Fetch image failed: ${imageRes.statusText}`);
  const arrayBuffer = await imageRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'destinations' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
}

async function populateDestinations() {
  try {
    console.log(`Starting destinations table population...`);
    
    // Clear existing destinations first
    await pool.query('DELETE FROM destinations');
    console.log(`🧹 Cleared old destinations.`);
    
    for (const dest of destinationsList) {
      console.log(`\n----------------------------------------`);
      console.log(`Processing "${dest.name}" (search: "${dest.query}")...`);
      
      const imageUrl = await getPexelsImage(dest.query);
      if (!imageUrl) {
        console.log(`⚠️ No image found on Pexels for "${dest.query}"`);
        continue;
      }
      
      try {
        console.log(`☁️ Uploading image to Cloudinary...`);
        const uploadResult = await uploadToCloudinary(imageUrl);
        
        await pool.query(
          'INSERT INTO destinations (name, image, image_public_id, status) VALUES (?, ?, ?, ?)',
          [dest.name, uploadResult.secure_url, uploadResult.public_id, 'active']
        );
        
        console.log(`✅ Successfully added ${dest.name} to destinations table!`);
        await sleep(500); // Prevents hitting rate limits
      } catch (uploadError) {
        console.error(`❌ Failed to upload/save destination ${dest.name}:`, uploadError);
      }
    }
    
    console.log(`\n========================================`);
    console.log(`Destinations population complete!`);
  } catch (err) {
    console.error(`Populate destinations script failed:`, err);
  } finally {
    process.exit(0);
  }
}

populateDestinations();
