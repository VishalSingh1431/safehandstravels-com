import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Certificate from '../models/Certificate.js';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import WrittenReview from '../models/WrittenReview.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Test Certificates
const testCertificates = [
  {
    title: 'ISO 9001:2015 Quality Management',
    description: 'Certified for maintaining high quality standards in travel and tourism services. This certification ensures our commitment to customer satisfaction and continuous improvement.',
    images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'],
    imagesPublicIds: [],
    status: 'active'
  },
  {
    title: 'Travel Agent License - IATA',
    description: 'Authorized International Air Transport Association (IATA) travel agent. We are licensed to book flights, hotels, and travel packages worldwide.',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'],
    imagesPublicIds: [],
    status: 'active'
  },
  {
    title: 'Ministry of Tourism Recognition',
    description: 'Recognized by the Ministry of Tourism, Government of India. We are an approved tour operator providing authentic and quality travel experiences.',
    images: ['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'],
    imagesPublicIds: [],
    status: 'active'
  },
  {
    title: 'TripAdvisor Certificate of Excellence',
    description: 'Awarded Certificate of Excellence for consistently receiving outstanding reviews from travelers. This recognition reflects our dedication to exceptional service.',
    images: ['https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80'],
    imagesPublicIds: [],
    status: 'active'
  },
  {
    title: 'GST Registration Certificate',
    description: 'Registered under Goods and Services Tax (GST) for transparent and legal business operations. All our services are tax-compliant.',
    images: ['https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'],
    imagesPublicIds: [],
    status: 'active'
  }
];

// Test Destinations
const testDestinations = [
  {
    name: 'Varanasi',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    imagePublicId: '',
    status: 'active'
  },
  {
    name: 'Sarnath',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80',
    imagePublicId: '',
    status: 'active'
  },
  {
    name: 'Allahabad',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    imagePublicId: '',
    status: 'active'
  },
  {
    name: 'Ayodhya',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    imagePublicId: '',
    status: 'active'
  },
  {
    name: 'Chitrakoot',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    imagePublicId: '',
    status: 'active'
  }
];

// Test Reviews (Video Reviews)
const testReviews = [
  {
    name: 'Rajesh Kumar',
    rating: 5,
    location: 'Mumbai, Maharashtra',
    review: 'Amazing experience! The Varanasi Spiritual Journey was well-organized and the guide was very knowledgeable. The Ganga Aarti was mesmerizing. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '/video/Slider.mp4',
    videoPublicId: '',
    status: 'active'
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    location: 'Delhi, NCR',
    review: 'Excellent service from start to finish. The Golden Triangle with Varanasi tour covered all major attractions. Hotels were comfortable and transportation was smooth.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '/video/Slider.mp4',
    videoPublicId: '',
    status: 'active'
  },
  {
    name: 'Amit Patel',
    rating: 5,
    location: 'Ahmedabad, Gujarat',
    review: 'The Heritage Walk tour was fantastic! Learned so much about Varanasi\'s culture and history. The cooking class was a highlight. Great value for money.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '/video/Slider.mp4',
    videoPublicId: '',
    status: 'active'
  },
  {
    name: 'Sneha Verma',
    rating: 4,
    location: 'Bangalore, Karnataka',
    review: 'Good tour experience. The day trip to Varanasi and Sarnath was well-planned. The guide was friendly and informative. Would book again for longer trips.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '/video/Slider.mp4',
    videoPublicId: '',
    status: 'active'
  },
  {
    name: 'Vikram Singh',
    rating: 5,
    location: 'Pune, Maharashtra',
    review: 'Perfect photography tour! Got amazing shots of the ghats and temples. The photography guide was professional and helped me capture stunning images. Worth every rupee!',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    type: 'video',
    videoUrl: '/video/Slider.mp4',
    videoPublicId: '',
    status: 'active'
  },
  {
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
  }
];

// Test Written Reviews
const testWrittenReviews = [
  {
    name: 'Meera Joshi',
    rating: 5,
    date: '2024-11-15',
    title: 'Unforgettable Spiritual Journey',
    review: 'My trip to Varanasi with Safe Hands Travels was truly transformative. From the moment we arrived, everything was perfectly organized. The Ganga Aarti ceremony at Dashashwamedh Ghat was a spiritual experience I will never forget. The guide was knowledgeable and made the entire journey meaningful. The hotel was comfortable and the food was authentic. I highly recommend this tour to anyone seeking a genuine spiritual experience.',
    location: 'Hyderabad, Telangana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    status: 'active'
  },
  {
    name: 'Anil Desai',
    rating: 5,
    date: '2024-11-20',
    title: 'Exceeded All Expectations',
    review: 'The Golden Triangle with Varanasi tour was exceptional. We visited Delhi, Agra, Jaipur, and Varanasi - each city had its own charm. The Taj Mahal visit was breathtaking, and Varanasi added a spiritual dimension to our journey. The accommodations were excellent, and the transportation was comfortable. The team was responsive and professional throughout. This is definitely a tour worth taking!',
    location: 'Chennai, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    status: 'active'
  },
  {
    name: 'Kavita Reddy',
    rating: 5,
    date: '2024-12-01',
    title: 'Perfect Heritage Experience',
    review: 'The Varanasi Heritage Walk was exactly what I was looking for. We explored the old city, visited ancient temples, learned about traditional crafts, and even took a cooking class. The heritage hotel was beautiful and the location was perfect. The guide was passionate about Varanasi\'s history and culture. I came back with a deeper understanding of this incredible city. Highly recommended!',
    location: 'Kolkata, West Bengal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    status: 'active'
  },
  {
    name: 'Rohit Malhotra',
    rating: 4,
    date: '2024-12-05',
    title: 'Great Day Trip Experience',
    review: 'We had limited time in Varanasi, so we booked the day trip to Varanasi and Sarnath. It was perfect! We covered all the major attractions in one day. Sarnath was peaceful and informative, and the evening Ganga Aarti was spectacular. The guide was friendly and made sure we didn\'t miss anything important. The only minor issue was that lunch wasn\'t included, but we found good local restaurants nearby.',
    location: 'Jaipur, Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    status: 'active'
  },
  {
    name: 'Divya Nair',
    rating: 5,
    date: '2024-12-08',
    title: 'Photography Paradise',
    review: 'As a photography enthusiast, the Varanasi Photography Tour was a dream come true. We captured stunning sunrise and sunset shots at the ghats, documented daily life in the old city, and visited hidden photography spots. The photography guide was excellent and taught me new techniques. The image review sessions were helpful. I came back with a portfolio of amazing images. This tour is a must for photographers!',
    location: 'Kochi, Kerala',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80',
    avatarPublicId: '',
    status: 'active'
  }
];

async function addTestData() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized\n');

    // Add Certificates
    console.log('📜 Adding test certificates...');
    for (let i = 0; i < testCertificates.length; i++) {
      const certData = testCertificates[i];
      try {
        const certificate = await Certificate.create(certData);
        console.log(`✅ Certificate ${i + 1} created: ${certificate.title}`);
      } catch (error) {
        console.error(`❌ Error creating certificate ${i + 1} (${certData.title}):`, error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
          console.log(`   ⚠️  Certificate with this title already exists, skipping...`);
        }
      }
    }

    // Add Destinations
    console.log('\n🌍 Adding test destinations...');
    for (let i = 0; i < testDestinations.length; i++) {
      const destData = testDestinations[i];
      try {
        const destination = await Destination.create(destData);
        console.log(`✅ Destination ${i + 1} created: ${destination.name}`);
      } catch (error) {
        console.error(`❌ Error creating destination ${i + 1} (${destData.name}):`, error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
          console.log(`   ⚠️  Destination with this name already exists, skipping...`);
        }
      }
    }

    // Add Reviews
    console.log('\n⭐ Adding test reviews...');
    for (let i = 0; i < testReviews.length; i++) {
      const reviewData = testReviews[i];
      try {
        const review = await Review.create(reviewData);
        console.log(`✅ Review ${i + 1} created: ${review.name} (${review.rating}⭐)`);
      } catch (error) {
        console.error(`❌ Error creating review ${i + 1} (${reviewData.name}):`, error.message);
      }
    }

    // Add Written Reviews
    console.log('\n✍️  Adding test written reviews...');
    for (let i = 0; i < testWrittenReviews.length; i++) {
      const writtenReviewData = testWrittenReviews[i];
      try {
        const writtenReview = await WrittenReview.create(writtenReviewData);
        console.log(`✅ Written Review ${i + 1} created: ${writtenReview.name} - "${writtenReview.title}"`);
      } catch (error) {
        console.error(`❌ Error creating written review ${i + 1} (${writtenReviewData.name}):`, error.message);
      }
    }

    console.log('\n✨ Test data addition completed!');
    console.log('\n📊 Summary:');
    console.log(`   📜 Certificates: ${testCertificates.length}`);
    console.log(`   🌍 Destinations: ${testDestinations.length}`);
    console.log(`   ⭐ Reviews: ${testReviews.length}`);
    console.log(`   ✍️  Written Reviews: ${testWrittenReviews.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestData();

