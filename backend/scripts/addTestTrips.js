import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Trip from '../models/Trip.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const testTrips = [
  {
    title: 'Varanasi Spiritual Journey',
    location: 'Varanasi, Uttar Pradesh',
    duration: '3 days / 2 nights',
    price: '₹12,999',
    oldPrice: '₹15,999',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Experience the spiritual essence of the oldest living city',
    intro: 'Discover the mystical city of Varanasi, where ancient traditions meet modern spirituality. This journey takes you through the sacred ghats, ancient temples, and the vibrant culture of Kashi.',
    whyVisit: [
      'Witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat',
      'Explore ancient temples including Kashi Vishwanath Temple',
      'Experience the spiritual atmosphere of the oldest living city',
      'Take a boat ride on the holy Ganges River',
      'Visit Sarnath, where Buddha gave his first sermon'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival and Ghat Exploration',
        activities: 'Arrive in Varanasi, check-in to hotel. Evening visit to Dashashwamedh Ghat for Ganga Aarti ceremony. Explore the narrow lanes of the old city and enjoy local street food.'
      },
      {
        day: 'Day 2',
        title: 'Temple Tour and Boat Ride',
        activities: 'Early morning boat ride on Ganges. Visit Kashi Vishwanath Temple, Sankat Mochan Temple, and Tulsi Manas Temple. Afternoon visit to Banaras Hindu University and Bharat Mata Temple.'
      },
      {
        day: 'Day 3',
        title: 'Sarnath Excursion and Departure',
        activities: 'Morning visit to Sarnath - visit Dhamek Stupa, Mulagandha Kuti Vihar, and Sarnath Museum. Afternoon shopping at local markets. Evening departure.'
      }
    ],
    included: [
      '2 nights accommodation in 3-star hotel',
      'Daily breakfast',
      'All transportation (AC vehicle)',
      'Boat ride on Ganges',
      'Entrance fees to monuments',
      'Professional guide',
      'All applicable taxes'
    ],
    notIncluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Camera fees at monuments',
      'Any additional activities not mentioned'
    ],
    notes: [
      'Dress modestly while visiting temples',
      'Remove shoes before entering temple premises',
      'Photography may be restricted at some places',
      'Carry water bottle and sun protection'
    ],
    faq: [
      {
        question: 'What is the best time to visit Varanasi?',
        answer: 'The best time to visit Varanasi is from October to March when the weather is pleasant. Avoid monsoon season (July-September) and peak summer (April-June).'
      },
      {
        question: 'Is it safe to travel to Varanasi?',
        answer: 'Yes, Varanasi is generally safe for tourists. However, be cautious of pickpockets in crowded areas and follow local customs and traditions.'
      },
      {
        question: 'What should I wear in Varanasi?',
        answer: 'Wear modest clothing covering shoulders and knees, especially when visiting temples. Comfortable walking shoes are recommended.'
      }
    ],
    reviews: [
      {
        rating: 5,
        text: 'An absolutely spiritual and transformative experience. The Ganga Aarti was mesmerizing!',
        author: 'Priya Sharma'
      },
      {
        rating: 5,
        text: 'Well organized trip with knowledgeable guide. Varanasi exceeded all expectations.',
        author: 'Rajesh Kumar'
      }
    ],
    gallery: [],
    status: 'active'
  },
  {
    title: 'Golden Triangle with Varanasi',
    location: 'Delhi, Agra, Jaipur, Varanasi',
    duration: '7 days / 6 nights',
    price: '₹35,999',
    oldPrice: '₹42,999',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Explore India\'s iconic destinations including the spiritual capital',
    intro: 'A perfect blend of history, culture, and spirituality. This comprehensive tour covers the famous Golden Triangle (Delhi, Agra, Jaipur) plus the spiritual city of Varanasi.',
    whyVisit: [
      'Visit the iconic Taj Mahal in Agra',
      'Explore the royal palaces of Jaipur',
      'Discover the historical monuments of Delhi',
      'Experience the spiritual essence of Varanasi',
      'Witness diverse cultures and traditions'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Delhi Arrival',
        activities: 'Arrive in Delhi, transfer to hotel. Afternoon city tour covering India Gate, Red Fort, and Jama Masjid. Evening explore Connaught Place.'
      },
      {
        day: 'Day 2',
        title: 'Delhi to Agra',
        activities: 'Morning drive to Agra. Visit the magnificent Taj Mahal, Agra Fort, and Itmad-ud-Daulah\'s Tomb. Overnight in Agra.'
      },
      {
        day: 'Day 3',
        title: 'Agra to Jaipur',
        activities: 'Drive to Jaipur via Fatehpur Sikri. Afternoon visit to City Palace, Hawa Mahal, and Jantar Mantar. Evening shopping at local markets.'
      },
      {
        day: 'Day 4',
        title: 'Jaipur Exploration',
        activities: 'Morning visit to Amber Fort with elephant ride. Afternoon visit to Albert Hall Museum and Birla Temple. Evening at leisure.'
      },
      {
        day: 'Day 5',
        title: 'Jaipur to Varanasi',
        activities: 'Morning flight to Varanasi. Check-in and evening Ganga Aarti at Dashashwamedh Ghat. Explore the old city lanes.'
      },
      {
        day: 'Day 6',
        title: 'Varanasi Spiritual Tour',
        activities: 'Early morning boat ride on Ganges. Visit Kashi Vishwanath Temple and other important temples. Afternoon visit to Sarnath.'
      },
      {
        day: 'Day 7',
        title: 'Departure',
        activities: 'Morning at leisure. Transfer to airport for departure.'
      }
    ],
    included: [
      '6 nights accommodation in 3-star hotels',
      'Daily breakfast',
      'All transportation (AC vehicle + domestic flight)',
      'Entrance fees to monuments',
      'Professional guide',
      'Boat ride in Varanasi',
      'All applicable taxes'
    ],
    notIncluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Camera fees',
      'Tips and gratuities'
    ],
    notes: [
      'Comfortable walking shoes recommended',
      'Carry valid ID proof',
      'Dress code applies at religious sites',
      'Book in advance for better rates'
    ],
    faq: [
      {
        question: 'What is included in the Golden Triangle tour?',
        answer: 'The tour includes accommodation, breakfast, transportation, entrance fees, guide services, and boat ride in Varanasi. Lunch and dinner are not included.'
      },
      {
        question: 'Is the flight included?',
        answer: 'Yes, one-way flight from Jaipur to Varanasi is included in the package.'
      }
    ],
    reviews: [
      {
        rating: 5,
        text: 'Amazing tour covering all major attractions. Well planned and executed.',
        author: 'Amit Patel'
      }
    ],
    gallery: [],
    status: 'active'
  },
  {
    title: 'Varanasi and Sarnath Day Trip',
    location: 'Varanasi, Sarnath',
    duration: '1 day',
    price: '₹2,999',
    oldPrice: '₹3,499',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'A perfect day tour of Varanasi and Sarnath',
    intro: 'Experience the best of Varanasi and Sarnath in a single day. Perfect for travelers with limited time who want to explore the spiritual and historical significance of this region.',
    whyVisit: [
      'Visit the sacred city of Varanasi',
      'Explore Sarnath, where Buddha preached',
      'Witness the evening Ganga Aarti',
      'Visit ancient temples and monuments',
      'Experience the local culture'
    ],
    itinerary: [
      {
        day: 'Morning',
        title: 'Sarnath Tour',
        activities: 'Visit Dhamek Stupa, Mulagandha Kuti Vihar, Sarnath Archaeological Museum, and Chaukhandi Stupa. Learn about Buddhist history and architecture.'
      },
      {
        day: 'Afternoon',
        title: 'Varanasi Temple Tour',
        activities: 'Visit Kashi Vishwanath Temple, Sankat Mochan Temple, and Tulsi Manas Temple. Explore the narrow lanes of the old city.'
      },
      {
        day: 'Evening',
        title: 'Ganga Aarti',
        activities: 'Evening boat ride on Ganges River. Witness the spectacular Ganga Aarti ceremony at Dashashwamedh Ghat. Enjoy the spiritual atmosphere.'
      }
    ],
    included: [
      'Transportation (AC vehicle)',
      'Professional guide',
      'Boat ride on Ganges',
      'Entrance fees',
      'All applicable taxes'
    ],
    notIncluded: [
      'Meals',
      'Hotel accommodation',
      'Personal expenses',
      'Camera fees'
    ],
    notes: [
      'Tour starts at 8:00 AM',
      'Wear comfortable walking shoes',
      'Dress modestly for temple visits',
      'Carry water and sun protection'
    ],
    faq: [
      {
        question: 'What time does the tour start?',
        answer: 'The tour starts at 8:00 AM from your hotel or a designated pickup point in Varanasi.'
      },
      {
        question: 'Is lunch included?',
        answer: 'No, lunch is not included. However, we can arrange lunch at a local restaurant (additional cost).'
      }
    ],
    reviews: [
      {
        rating: 4,
        text: 'Great day tour! Covered all major attractions. The guide was knowledgeable.',
        author: 'Sneha Verma'
      }
    ],
    gallery: [],
    status: 'active'
  },
  {
    title: 'Varanasi Heritage Walk',
    location: 'Varanasi',
    duration: '4 days / 3 nights',
    price: '₹18,999',
    oldPrice: '₹22,999',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Immerse yourself in the rich heritage of Varanasi',
    intro: 'A detailed exploration of Varanasi\'s heritage, culture, and traditions. This tour takes you deep into the heart of the old city, exploring ancient temples, ghats, and local crafts.',
    whyVisit: [
      'Explore the 84 ghats of Varanasi',
      'Visit ancient temples and learn their history',
      'Experience traditional crafts and workshops',
      'Taste authentic Banarasi cuisine',
      'Understand the cultural significance of the city'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival and Ghat Exploration',
        activities: 'Arrive and check-in. Evening heritage walk through the old city. Visit Manikarnika Ghat, Harishchandra Ghat, and other significant ghats. Evening Ganga Aarti.'
      },
      {
        day: 'Day 2',
        title: 'Temple Trail and Cultural Sites',
        activities: 'Morning visit to Kashi Vishwanath Temple, Annapurna Temple, and Durga Temple. Afternoon visit to Banaras Hindu University, Bharat Mata Temple, and Ramnagar Fort.'
      },
      {
        day: 'Day 3',
        title: 'Crafts and Cuisine',
        activities: 'Morning visit to silk weaving centers and traditional craft workshops. Afternoon cooking class to learn Banarasi cuisine. Evening cultural show or music performance.'
      },
      {
        day: 'Day 4',
        title: 'Sarnath and Departure',
        activities: 'Morning visit to Sarnath. Explore Buddhist monuments and museum. Afternoon shopping for souvenirs. Evening departure.'
      }
    ],
    included: [
      '3 nights accommodation in heritage hotel',
      'Daily breakfast',
      'All transportation',
      'Heritage walk with expert guide',
      'Cooking class',
      'Cultural show tickets',
      'Entrance fees',
      'All applicable taxes'
    ],
    notIncluded: [
      'Lunch and dinner',
      'Personal expenses',
      'Shopping expenses',
      'Additional activities'
    ],
    notes: [
      'Comfortable walking required',
      'Respect local customs and traditions',
      'Photography restrictions at some sites',
      'Carry cash for local markets'
    ],
    faq: [
      {
        question: 'What type of accommodation is provided?',
        answer: 'Accommodation is provided in a heritage hotel near the ghats, offering traditional architecture and modern amenities.'
      },
      {
        question: 'Is the cooking class included?',
        answer: 'Yes, a traditional Banarasi cooking class is included where you can learn to prepare local dishes.'
      }
    ],
    reviews: [
      {
        rating: 5,
        text: 'Excellent heritage tour! Learned so much about Varanasi\'s culture and history.',
        author: 'Meera Joshi'
      }
    ],
    gallery: [],
    status: 'active'
  },
  {
    title: 'Varanasi Photography Tour',
    location: 'Varanasi',
    duration: '5 days / 4 nights',
    price: '₹24,999',
    oldPrice: '₹29,999',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Capture the essence of Varanasi through your lens',
    intro: 'A specialized photography tour designed for photography enthusiasts. Visit the best spots for capturing stunning images of ghats, temples, people, and the daily life of Varanasi.',
    whyVisit: [
      'Photograph the iconic Ganga Aarti ceremony',
      'Capture sunrise and sunset at the ghats',
      'Document the daily life and culture',
      'Visit hidden photography spots',
      'Learn from professional photography guide'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Arrival and Orientation',
        activities: 'Arrive and check-in. Evening orientation session with photography guide. Introduction to Varanasi\'s best photography locations. Sunset photography at Assi Ghat.'
      },
      {
        day: 'Day 2',
        title: 'Morning Ghat Photography',
        activities: 'Early morning (5:00 AM) boat ride for sunrise photography. Capture the morning rituals, people bathing, and the golden hour. Afternoon visit to temples for architecture photography.'
      },
      {
        day: 'Day 3',
        title: 'Street and Culture Photography',
        activities: 'Morning walk through old city lanes for street photography. Visit local markets, workshops, and capture daily life. Evening Ganga Aarti photography session.'
      },
      {
        day: 'Day 4',
        title: 'Sarnath and Portrait Photography',
        activities: 'Morning visit to Sarnath for architectural photography. Afternoon portrait photography session with locals. Evening review session of captured images.'
      },
      {
        day: 'Day 5',
        title: 'Final Session and Departure',
        activities: 'Final morning photography session. Image review and editing tips. Afternoon departure.'
      }
    ],
    included: [
      '4 nights accommodation',
      'Daily breakfast',
      'Professional photography guide',
      'Boat rides for photography',
      'All transportation',
      'Entrance fees',
      'Photography permissions where required',
      'Image review sessions',
      'All applicable taxes'
    ],
    notIncluded: [
      'Lunch and dinner',
      'Camera equipment',
      'Personal expenses',
      'Additional memory cards or storage'
    ],
    notes: [
      'Bring your own camera equipment',
      'Extra batteries and memory cards recommended',
      'Respect privacy while photographing people',
      'Some locations may require special permissions',
      'Tripod allowed at most locations'
    ],
    faq: [
      {
        question: 'What camera equipment should I bring?',
        answer: 'Bring your DSLR or mirrorless camera with lenses. Wide-angle and telephoto lenses are recommended. Tripod is optional but useful.'
      },
      {
        question: 'Is photography allowed everywhere?',
        answer: 'Most places allow photography, but some temples may have restrictions. Our guide will inform you about photography rules at each location.'
      }
    ],
    reviews: [
      {
        rating: 5,
        text: 'Perfect tour for photographers! Got amazing shots and learned new techniques.',
        author: 'Vikram Singh'
      }
    ],
    gallery: [],
    status: 'active'
  }
];

async function addTestTrips() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized');

    console.log('\n📝 Adding 5 sample trips...\n');

    // Add only first 5 trips
    const tripsToAdd = testTrips.slice(0, 5);
    for (let i = 0; i < tripsToAdd.length; i++) {
      const tripData = tripsToAdd[i];
      try {
        const trip = await Trip.create(tripData);
        console.log(`✅ Trip ${i + 1} created: ${trip.title}`);
      } catch (error) {
        console.error(`❌ Error creating trip ${i + 1} (${tripData.title}):`, error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
          console.log(`   ⚠️  Trip with this title already exists, skipping...`);
        }
      }
    }

    console.log('\n✨ Test trips addition completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestTrips();

