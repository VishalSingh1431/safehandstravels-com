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

function extractKeywords(title) {
  const matched = [];
  const normalizedTitle = title.toLowerCase();
  
  for (const mapping of keywordMapping) {
    for (const key of mapping.keys) {
      if (normalizedTitle.includes(key)) {
        matched.push(mapping.search);
        break;
      }
    }
  }
  
  if (matched.length === 0) {
    if (normalizedTitle.includes('south india')) return ['South India'];
    if (normalizedTitle.includes('golden triangle')) return ['Golden Triangle'];
    return ['India Tourism'];
  }
  
  return [...new Set(matched)];
}

async function fetchPexelsPhotos(keyword, page = 1) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(keyword)}&per_page=30&page=${page}`;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': PEXELS_API_KEY }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.photos || [];
  } catch (e) {
    console.error(`Pexels error for keyword ${keyword}:`, e);
    return [];
  }
}

async function uploadToCloudinary(url) {
  const imageRes = await fetch(url);
  if (!imageRes.ok) throw new Error(`Fetch image failed: ${imageRes.statusText}`);
  const arrayBuffer = await imageRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'trips' }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    }).end(buffer);
  });
}

async function makeImagesUnique() {
  try {
    const [trips] = await pool.query('SELECT id, title FROM trips WHERE status = "active"');
    console.log(`Starting unique image assignment for ${trips.length} active trips...`);
    
    const usedPhotoIds = new Set();
    let updatedCount = 0;
    
    for (const trip of trips) {
      const keywords = extractKeywords(trip.title);
      console.log(`\n========================================`);
      console.log(`Trip ID ${trip.id}: "${trip.title}" -> Keywords: ${keywords.join(', ')}`);
      
      const candidatePhotos = [];
      
      // Fetch photos for each keyword
      for (const kw of keywords) {
        let page = 1;
        let photos = await fetchPexelsPhotos(kw, page);
        
        // Find photos not yet used
        let foundUnused = photos.filter(p => !usedPhotoIds.has(p.id));
        candidatePhotos.push(...foundUnused);
        
        // If not enough photos, fetch page 2
        if (candidatePhotos.length < 5 && photos.length === 30) {
          page = 2;
          let photosPage2 = await fetchPexelsPhotos(kw, page);
          let foundUnusedPage2 = photosPage2.filter(p => !usedPhotoIds.has(p.id));
          candidatePhotos.push(...foundUnusedPage2);
        }
      }
      
      if (candidatePhotos.length === 0) {
        console.log(`⚠️ No unused photos found for keywords!`);
        continue;
      }
      
      // Select the first unused photo as main image
      const mainPhoto = candidatePhotos[0];
      usedPhotoIds.add(mainPhoto.id);
      
      // Select up to 4 other unused photos as gallery
      const galleryPhotos = candidatePhotos.slice(1, 5);
      galleryPhotos.forEach(p => usedPhotoIds.add(p.id));
      
      console.log(`📸 Selected unique photo ID: ${mainPhoto.id} for main image.`);
      console.log(`📸 Selected ${galleryPhotos.length} unique photos for gallery.`);
      
      try {
        console.log(`☁️ Uploading main image to Cloudinary...`);
        const mainUpload = await uploadToCloudinary(mainPhoto.src.large);
        await sleep(500);
        
        const galleryUploads = [];
        for (const photo of galleryPhotos) {
          console.log(`☁️ Uploading gallery image (ID: ${photo.id}) to Cloudinary...`);
          const upload = await uploadToCloudinary(photo.src.large);
          galleryUploads.push(upload);
          await sleep(500);
        }
        
        // Update DB
        await pool.query(
          'UPDATE trips SET image_url = ?, image_public_id = ?, gallery = ?, gallery_public_ids = ? WHERE id = ?',
          [
            mainUpload.secure_url,
            mainUpload.public_id,
            JSON.stringify(galleryUploads.map(img => img.secure_url)),
            JSON.stringify(galleryUploads.map(img => img.public_id)),
            trip.id
          ]
        );
        
        console.log(`✅ Successfully updated trip ID ${trip.id} with unique images!`);
        updatedCount++;
      } catch (err) {
        console.error(`Error uploading images for trip ID ${trip.id}:`, err);
      }
    }
    
    console.log(`\n========================================`);
    console.log(`Completed unique image assignment!`);
    console.log(`Successfully updated ${updatedCount} trips.`);
  } catch (err) {
    console.error(`Failed to assign unique images:`, err);
  } finally {
    process.exit(0);
  }
}

makeImagesUnique();
