import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Enquiry from '../models/Enquiry.js';
import Trip from '../models/Trip.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

async function addTestEnquiries() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized');

    // Get existing trips to create enquiries for
    console.log('\n📋 Fetching existing trips...');
    const trips = await Trip.findAll({ includeDraft: true });
    
    if (trips.length === 0) {
      console.log('⚠️  No trips found. Please add trips first using addTestTrips.js');
      process.exit(0);
    }

    console.log(`✅ Found ${trips.length} trips\n`);

    const testEnquiries = [
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'December 2025',
        numberOfTravelers: 2,
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@example.com',
        phone: '+91 9876543210',
        message: 'Hi, I am interested in this trip. Can you provide more details about the accommodation and transportation?',
        status: 'pending'
      },
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'January 2026',
        numberOfTravelers: 4,
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 9876543211',
        message: 'We are a group of 4 friends planning to visit. Is there any group discount available?',
        status: 'contacted'
      },
      {
        tripId: trips[1]?.id || trips[0]?.id || null,
        tripTitle: trips[1]?.title || trips[0]?.title || 'Spiti Valley Expedition',
        tripLocation: trips[1]?.location || trips[0]?.location || 'Spiti Valley',
        tripPrice: trips[1]?.price || trips[0]?.price || '₹18,999',
        selectedMonth: 'February 2026',
        numberOfTravelers: 1,
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        phone: '+91 9876543212',
        message: 'Solo traveler here. Is it safe for solo travelers?',
        status: 'booked'
      },
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'March 2026',
        numberOfTravelers: 3,
        name: 'Sneha Verma',
        email: 'sneha.verma@example.com',
        phone: '+91 9876543213',
        message: 'Interested in booking for March. What is the weather like during that time?',
        status: 'pending'
      },
      {
        tripId: trips[1]?.id || trips[0]?.id || null,
        tripTitle: trips[1]?.title || trips[0]?.title || 'Spiti Valley Expedition',
        tripLocation: trips[1]?.location || trips[0]?.location || 'Spiti Valley',
        tripPrice: trips[1]?.price || trips[0]?.price || '₹18,999',
        selectedMonth: 'December 2025',
        numberOfTravelers: 2,
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        phone: '+91 9876543214',
        message: 'Planning a winter trip. What kind of winter gear should we carry?',
        status: 'contacted'
      },
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'April 2026',
        numberOfTravelers: 5,
        name: 'Meera Joshi',
        email: 'meera.joshi@example.com',
        phone: '+91 9876543215',
        message: 'Family of 5 including 2 children (ages 8 and 12). Is this trip suitable for children?',
        status: 'pending'
      },
      {
        tripId: trips[1]?.id || trips[0]?.id || null,
        tripTitle: trips[1]?.title || trips[0]?.title || 'Spiti Valley Expedition',
        tripLocation: trips[1]?.location || trips[0]?.location || 'Spiti Valley',
        tripPrice: trips[1]?.price || trips[0]?.price || '₹18,999',
        selectedMonth: 'January 2026',
        numberOfTravelers: 1,
        name: 'Rahul Desai',
        email: 'rahul.desai@example.com',
        phone: null,
        message: 'Interested in the winter expedition. Can you share the detailed itinerary?',
        status: 'booked'
      },
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'May 2026',
        numberOfTravelers: 2,
        name: 'Anjali Reddy',
        email: 'anjali.reddy@example.com',
        phone: '+91 9876543216',
        message: null,
        status: 'cancelled'
      },
      {
        tripId: trips[2]?.id || trips[0]?.id || null,
        tripTitle: trips[2]?.title || trips[0]?.title || 'Varanasi Spiritual Journey',
        tripLocation: trips[2]?.location || trips[0]?.location || 'Varanasi',
        tripPrice: trips[2]?.price || trips[0]?.price || '₹12,999',
        selectedMonth: 'February 2026',
        numberOfTravelers: 3,
        name: 'Kiran Nair',
        email: 'kiran.nair@example.com',
        phone: '+91 9876543217',
        message: 'Looking for a spiritual experience. What are the main highlights of this trip?',
        status: 'contacted'
      },
      {
        tripId: trips[0]?.id || null,
        tripTitle: trips[0]?.title || 'Meghalaya Adventure',
        tripLocation: trips[0]?.location || 'Meghalaya',
        tripPrice: trips[0]?.price || '₹22,999',
        selectedMonth: 'June 2026',
        numberOfTravelers: 6,
        name: 'Deepak Malhotra',
        email: 'deepak.malhotra@example.com',
        phone: '+91 9876543218',
        message: 'Group of 6 friends. Can we get a custom itinerary?',
        status: 'pending'
      }
    ];

    console.log('📝 Adding test enquiries...\n');

    for (let i = 0; i < testEnquiries.length; i++) {
      const enquiryData = testEnquiries[i];
      try {
        // Create enquiry without status (it will default to 'pending')
        const enquiry = await Enquiry.create({
          tripId: enquiryData.tripId,
          tripTitle: enquiryData.tripTitle,
          tripLocation: enquiryData.tripLocation,
          tripPrice: enquiryData.tripPrice,
          selectedMonth: enquiryData.selectedMonth,
          numberOfTravelers: enquiryData.numberOfTravelers,
          name: enquiryData.name,
          email: enquiryData.email,
          phone: enquiryData.phone,
          message: enquiryData.message,
        });

        // Update status if not pending
        if (enquiryData.status !== 'pending') {
          await Enquiry.updateStatus(enquiry.id, enquiryData.status);
        }

        console.log(`✅ Enquiry ${i + 1} created: ${enquiry.name} - ${enquiry.tripTitle} (${enquiryData.status})`);
      } catch (error) {
        console.error(`❌ Error creating enquiry ${i + 1} (${enquiryData.name}):`, error.message);
      }
    }

    console.log('\n✨ Test enquiries addition completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestEnquiries();





