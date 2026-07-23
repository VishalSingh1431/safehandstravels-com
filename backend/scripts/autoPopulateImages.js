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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getWikipediaImages(keyword) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(keyword)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&format=json`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'SafeHandsTravelsBot/1.0 (info@safehandstravels.com)' }
    });
    const data = await res.json();
    if (!data || !data.query || !data.query.pages) return [];
    
    const pages = data.query.pages;
    const images = [];
    for (const pageId in pages) {
       const imageInfo = pages[pageId].imageinfo;
       if (imageInfo && imageInfo.length > 0) {
         const imgUrl = imageInfo[0].url;
         // Ensure it's a standard image (not a pdf or svg)
         if (imgUrl.match(/\.(jpe?g|png)$/i)) {
             images.push(imgUrl);
         }
       }
    }
    return images.slice(0, 5);
  } catch(e) {
    console.error(`Failed to fetch wiki images for ${keyword}`);
    return [];
  }
}

function extractKeyword(title) {
   title = title.toLowerCase();
   const keywords = ['varanasi', 'goa', 'rajasthan', 'kerala', 'kashmir', 'shimla', 'manali', 'sikkim', 'darjeeling', 'ayodhya', 'prayagraj', 'tirupati', 'kedarnath', 'shirdi', 'agra', 'jaipur', 'mumbai', 'bangalore', 'mysore', 'chennai', 'gujarat', 'himachal'];
   
   for (let kw of keywords) {
      if (title.includes(kw)) return kw;
   }
   
   // Fallbacks
   if (title.includes('south india')) return "South India";
   if (title.includes('golden triangle')) return "Golden Triangle India";
   return "India Landmarks";
}

async function populateImages() {
  try {
    const [trips] = await pool.query('SELECT id, title, image_url FROM trips');
    let updatedCount = 0;

    console.log(`Starting image population for ${trips.length} trips...`);

    for (const trip of trips) {
      // Skip if it already has a valid image
      if (trip.image_url && trip.image_url !== 'null' && trip.image_url !== '[]' && trip.image_url.trim() !== '' && !trip.image_url.includes('sample.jpg')) {
        console.log(`⏭️ Skip: "${trip.title}" already has an image.`);
        continue;
      }

      const keyword = extractKeyword(trip.title);
      console.log(`🔍 Searching Wikipedia for "${trip.title}" -> "${keyword}"`);
      
      const imageUrls = await getWikipediaImages(keyword);
      if (imageUrls.length === 0) {
        console.log(`⚠️ No images found for "${keyword}"`);
        continue;
      }

      console.log(`☁️ Uploading ${imageUrls.length} images to Cloudinary via buffer...`);
      const uploadedImages = [];
      for (const url of imageUrls) {
          try {
             const imageRes = await fetch(url, { headers: { 'User-Agent': 'SafeHandsTravelsBot/1.0 (info@safehandstravels.com)' } });
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
             await sleep(500); // Small delay to prevent local rate limits
          } catch(err) {
             console.error(`Failed to upload ${url}: ${err.message || err.toString()}`);
          }
      }

      if (uploadedImages.length > 0) {
        const mainImage = uploadedImages[0];
        const galleryImages = uploadedImages.slice(1);
        
        const galleryUrls = galleryImages.map(img => img.url);
        const galleryIds = galleryImages.map(img => img.public_id);

        const updateQuery = `
          UPDATE trips SET 
            image_url = ?, 
            image_public_id = ?, 
            gallery = ?, 
            gallery_public_ids = ? 
          WHERE id = ?
        `;
        
        await pool.query(updateQuery, [
          mainImage.url, 
          mainImage.public_id, 
          JSON.stringify(galleryUrls), 
          JSON.stringify(galleryIds), 
          trip.id
        ]);
        
        console.log(`✅ Populated "${trip.title}" with ${uploadedImages.length} images!`);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Successfully populated ${updatedCount} trips with authentic images.`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    process.exit(0);
  }
}

populateImages();
