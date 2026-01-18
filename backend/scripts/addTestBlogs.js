import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Blog from '../models/Blog.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const demoBlogs = [
  {
    title: 'Exploring the Mystical Beauty of Ladakh',
    description: 'Ladakh, often called the "Land of High Passes," is a region in the Indian state of Jammu and Kashmir that offers breathtaking landscapes, rich culture, and unforgettable adventures.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Nestled in the northernmost part of India, Ladakh is a destination that captivates travelers with its stark beauty, ancient monasteries, and warm-hearted people. This high-altitude desert region offers a unique blend of natural wonders and cultural experiences that make it a must-visit destination for adventure seekers and culture enthusiasts alike.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Majestic Landscapes</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        One of the most striking features of Ladakh is its dramatic landscapes. From the snow-capped peaks of the Himalayas to the vast expanses of the Nubra Valley, every turn reveals a new vista that takes your breath away. The region is home to some of the world's highest motorable passes, including Khardung La at 18,380 feet.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ancient Monasteries and Culture</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Ladakh is deeply rooted in Tibetan Buddhism, and this is evident in its numerous monasteries, or gompas, that dot the landscape. The Hemis Monastery, Thiksey Monastery, and Diskit Monastery are among the most famous, each offering a glimpse into the region's rich spiritual heritage.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Adventure Activities</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        For adventure enthusiasts, Ladakh offers a plethora of activities. Trekking through the Markha Valley, white-water rafting on the Zanskar River, and mountain biking on challenging terrains are just a few of the thrilling experiences available.
      </p>
    `,
    category: 'Destinations',
    tags: ['Ladakh', 'Himalayas', 'Adventure', 'Culture'],
    featured: true,
    status: 'published',
    displayOrder: 1,
    metaTitle: 'Exploring the Mystical Beauty of Ladakh | Safe Hands Travels',
    metaDescription: 'Discover the stunning landscapes, ancient monasteries, and adventure activities in Ladakh. Your complete guide to exploring this high-altitude desert region.',
    metaKeywords: ['Ladakh', 'India travel', 'Himalayas', 'Adventure', 'Monasteries'],
    publishedAt: new Date(),
  },
  {
    title: 'Spiritual Journey Through Varanasi',
    description: 'Varanasi, also known as Kashi, is one of the oldest continuously inhabited cities in the world and a spiritual hub for millions of pilgrims seeking spiritual enlightenment.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Varanasi, the spiritual capital of India, is a city that has been drawing pilgrims and travelers for thousands of years. Situated on the banks of the sacred Ganges River, this ancient city offers a profound spiritual experience that transcends time.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">The Ganga Aarti Ceremony</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The evening Ganga Aarti at Dashashwamedh Ghat is a mesmerizing spectacle. Hundreds of devotees gather every evening to witness priests perform rituals with fire, incense, and prayers, creating an atmosphere of divine spirituality.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ancient Temples</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Varanasi is home to over 2,000 temples, each with its own unique story. The Kashi Vishwanath Temple, dedicated to Lord Shiva, is one of the most sacred Hindu temples and attracts millions of devotees every year.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Boat Rides on the Ganges</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        A boat ride on the Ganges at sunrise is an unforgettable experience. As you glide along the sacred river, you witness the city coming to life, with devotees performing morning rituals on the ghats.
      </p>
    `,
    category: 'Spiritual',
    tags: ['Varanasi', 'Kashi', 'Spiritual', 'Ganges'],
    featured: true,
    status: 'published',
    displayOrder: 2,
    metaTitle: 'Spiritual Journey Through Varanasi | Safe Hands Travels',
    metaDescription: 'Experience the spiritual essence of Varanasi with Ganga Aarti, ancient temples, and sacred ghats. Your guide to India\'s holiest city.',
    metaKeywords: ['Varanasi', 'Kashi', 'Spiritual', 'Ganges', 'Pilgrimage'],
    publishedAt: new Date(),
  },
  {
    title: 'Wellness Retreats in the Himalayas',
    description: 'Discover rejuvenating wellness experiences in the serene Himalayas, where ancient yoga practices meet modern spa therapies in pristine mountain settings.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The Himalayas offer the perfect setting for wellness retreats, combining breathtaking natural beauty with ancient healing practices. From yoga ashrams to luxury spa resorts, the mountains provide a sanctuary for those seeking physical, mental, and spiritual rejuvenation.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Yoga and Meditation</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The birthplace of yoga, India offers authentic experiences in the Himalayas. Retreat centers in Rishikesh, Dharamshala, and other mountain towns provide intensive yoga and meditation programs led by experienced instructors.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ayurvedic Treatments</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Traditional Ayurvedic treatments use natural herbs and oils to restore balance in the body. These holistic therapies, practiced in mountain retreat centers, offer deep healing and relaxation.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Natural Healing</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The pure mountain air, natural hot springs, and tranquil environment of the Himalayas create the perfect conditions for healing and wellness. Many retreat centers are located near natural healing sites.
      </p>
    `,
    category: 'Wellness',
    tags: ['Himalayas', 'Wellness', 'Yoga', 'Retreat'],
    featured: false,
    status: 'published',
    displayOrder: 3,
    metaTitle: 'Wellness Retreats in the Himalayas | Safe Hands Travels',
    metaDescription: 'Experience wellness retreats in the Himalayas with yoga, meditation, and Ayurvedic treatments. Rejuvenate your mind, body, and soul.',
    metaKeywords: ['Wellness', 'Himalayas', 'Yoga', 'Retreat', 'Ayurveda'],
    publishedAt: new Date(),
  },
  {
    title: 'Wildlife Safari in Ranthambore',
    description: 'Experience the thrill of spotting the majestic Royal Bengal Tiger in Ranthambore National Park, one of India\'s most famous tiger reserves.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Ranthambore National Park in Rajasthan is one of the best places in India to spot tigers in their natural habitat. The park's diverse landscape, from dense forests to open grasslands, provides an ideal environment for wildlife photography and safaris.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Tiger Spotting</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The park is home to over 80 Royal Bengal Tigers. Early morning and evening safaris offer the best chances of spotting these magnificent creatures. Expert guides help track tigers and other wildlife through the park.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Other Wildlife</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Besides tigers, Ranthambore is home to leopards, sloth bears, wild boars, sambar deer, and over 300 species of birds. The park's biodiversity makes every safari a unique experience.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Ranthambore Fort</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        The historic Ranthambore Fort, located within the park, adds a cultural dimension to the wildlife experience. The fort dates back to the 10th century and offers panoramic views of the park.
      </p>
    `,
    category: 'Wildlife',
    tags: ['Ranthambore', 'Tiger', 'Wildlife', 'Safari'],
    featured: false,
    status: 'published',
    displayOrder: 4,
    metaTitle: 'Wildlife Safari in Ranthambore | Safe Hands Travels',
    metaDescription: 'Spot the Royal Bengal Tiger and other wildlife in Ranthambore National Park. Experience thrilling safaris in one of India\'s top tiger reserves.',
    metaKeywords: ['Ranthambore', 'Tiger', 'Wildlife', 'Safari', 'National Park'],
    publishedAt: new Date(),
  },
  {
    title: 'Cultural Heritage of Rajasthan',
    description: 'Explore the vibrant culture, majestic palaces, and colorful traditions of Rajasthan, India\'s most culturally rich state.',
    content: `
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Rajasthan, the "Land of Kings," is a cultural treasure trove that showcases India's royal heritage through magnificent palaces, colorful festivals, and rich traditions. Every city in Rajasthan tells a story of valor, romance, and grandeur.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Magnificent Palaces</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Rajasthan is home to some of the world's most beautiful palaces, including the City Palace in Udaipur, Amer Fort in Jaipur, and Mehrangarh Fort in Jodhpur. These architectural marvels reflect the opulence of Rajput royalty.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Colorful Festivals</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        Rajasthan comes alive during festivals like Pushkar Fair, Desert Festival in Jaisalmer, and the vibrant Holi celebrations. These festivals showcase the state's rich cultural heritage through music, dance, and traditional arts.
      </p>
      
      <h2 class="text-3xl font-bold text-gray-900 mb-4 mt-8">Traditional Arts and Crafts</h2>
      <p class="mb-6 text-lg leading-relaxed text-gray-700">
        From intricate block printing and colorful textiles to exquisite jewelry and handcrafted pottery, Rajasthan is a paradise for art lovers and collectors seeking authentic handicrafts.
      </p>
    `,
    category: 'Culture',
    tags: ['Rajasthan', 'Culture', 'Heritage', 'Palaces'],
    featured: true,
    status: 'published',
    displayOrder: 5,
    metaTitle: 'Cultural Heritage of Rajasthan | Safe Hands Travels',
    metaDescription: 'Discover the royal heritage of Rajasthan through magnificent palaces, colorful festivals, and traditional arts. Experience India\'s cultural richness.',
    metaKeywords: ['Rajasthan', 'Culture', 'Heritage', 'Palaces', 'Festivals'],
    publishedAt: new Date(),
  },
];

async function addTestBlogs() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized\n');

    console.log('📝 Adding demo blog posts...\n');

    for (let i = 0; i < demoBlogs.length; i++) {
      const blogData = demoBlogs[i];
      try {
        const blog = await Blog.create(blogData);
        console.log(`✅ Blog ${i + 1} created: ${blog.title}`);
      } catch (error) {
        console.error(`❌ Error creating Blog ${i + 1} (${blogData.title.substring(0, 30)}...):`, error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
          console.log(`   ⚠️  Blog with this slug already exists, skipping...`);
        }
      }
    }

    console.log('\n✨ Demo blogs addition completed!');
    console.log(`\n📊 Summary: ${demoBlogs.length} blog posts added`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestBlogs();

