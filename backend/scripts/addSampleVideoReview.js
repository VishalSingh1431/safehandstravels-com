import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Review from '../models/Review.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Sample Video Review
const sampleVideoReview = {
  name: 'Anjali Mehta',
  rating: 5,
  location: 'Hyderabad, Telangana',
  review: 'Incredible spiritual journey! The Ganga Aarti ceremony was breathtaking. Our guide made the entire experience meaningful and memorable. Highly recommend this tour!',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  avatarPublicId: '',
  type: 'video',
  videoUrl: '/video/Slider.mp4',
  videoPublicId: '',
  status: 'active'
};

async function addSampleVideoReview() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized\n');

    console.log('🎥 Adding sample video review...');
    try {
      const review = await Review.create(sampleVideoReview);
      console.log(`✅ Video Review created successfully!`);
      console.log(`   Name: ${review.name}`);
      console.log(`   Rating: ${review.rating}⭐`);
      console.log(`   Location: ${review.location}`);
      console.log(`   Video URL: ${review.videoUrl}`);
      console.log(`   Type: ${review.type}`);
    } catch (error) {
      console.error(`❌ Error creating video review:`, error.message);
    }

    console.log('\n✨ Sample video review added!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSampleVideoReview();

