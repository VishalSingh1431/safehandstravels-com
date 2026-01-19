import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import FAQ from '../models/FAQ.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const testFAQs = [
  {
    question: 'What is the best time to visit Varanasi?',
    answer: 'The best time to visit Varanasi is from October to March when the weather is pleasant with temperatures ranging from 15°C to 25°C. The winter months (November to February) are ideal for sightseeing and outdoor activities. Avoid the summer months (April to June) due to extreme heat, and monsoon season (July to September) due to heavy rainfall.',
    displayOrder: 1,
    status: 'active'
  },
  {
    question: 'How do I book a trip with Safe Hands Travels?',
    answer: 'You can book a trip with us in three ways: 1) Online through our website by selecting your preferred trip package and filling out the booking form, 2) Contact us via phone or email to speak with our travel consultants, or 3) Visit our office for in-person booking assistance. Our team will guide you through the booking process and answer any questions you may have.',
    displayOrder: 2,
    status: 'active'
  },
  {
    question: 'What is included in the trip package?',
    answer: 'Our trip packages typically include accommodation in hotels, daily breakfast, all transportation (AC vehicle), entrance fees to monuments and attractions, professional guide services, and all applicable taxes. Specific inclusions vary by package, so please check the detailed itinerary for each trip. Lunch, dinner, personal expenses, and optional activities are usually not included unless specified.',
    displayOrder: 3,
    status: 'active'
  },
  {
    question: 'Can I customize my trip itinerary?',
    answer: 'Yes, we offer customizable trip packages to suit your preferences and schedule. You can modify the itinerary, add extra activities, extend your stay, or combine multiple destinations. Please contact our travel consultants with your requirements, and we will create a personalized itinerary that matches your interests and budget. Customizations may affect the package price.',
    displayOrder: 4,
    status: 'active'
  },
  {
    question: 'What is the cancellation and refund policy?',
    answer: 'Our cancellation policy varies based on the time of cancellation: Cancellations made 30 days or more before departure receive a full refund minus processing fees. Cancellations made 15-30 days before departure receive 50% refund. Cancellations made less than 15 days before departure are non-refundable. Refunds are processed within 7-10 business days. Please refer to our terms and conditions for detailed cancellation policies.',
    displayOrder: 5,
    status: 'active'
  },
  {
    question: 'Do you provide airport/railway station pick-up and drop services?',
    answer: 'Yes, we provide airport and railway station pick-up and drop services for all our trip packages. The service is included in the package price. Please provide us with your flight or train details (flight number, arrival time, terminal/station) at least 48 hours before your arrival, and our representative will be there to receive you. For packages without transfers, we can arrange them at an additional cost.',
    displayOrder: 6,
    status: 'active'
  },
  {
    question: 'What types of accommodation do you provide?',
    answer: 'We offer a range of accommodation options to suit different budgets and preferences, including 3-star, 4-star, and 5-star hotels, heritage properties, and boutique hotels. All accommodations are carefully selected for their cleanliness, comfort, and convenient location. You can upgrade your accommodation category during booking for an additional cost. Specific hotel details are provided in the trip itinerary.',
    displayOrder: 7,
    status: 'active'
  },
  {
    question: 'Is travel insurance included in the package?',
    answer: 'Travel insurance is not automatically included in our trip packages, but we highly recommend purchasing travel insurance to cover medical emergencies, trip cancellations, lost baggage, and other unforeseen circumstances. You can purchase travel insurance through us or from your preferred insurance provider. Please check with our travel consultants for insurance options and coverage details.',
    displayOrder: 8,
    status: 'active'
  },
  {
    question: 'What should I pack for my trip to Varanasi?',
    answer: 'For your trip to Varanasi, we recommend packing comfortable cotton clothing (light colors for summer, warm layers for winter), modest attire for temple visits (covering shoulders and knees), comfortable walking shoes, sunscreen, hat/cap, sunglasses, personal medications, camera/phone for photos, and a water bottle. During winter (November-February), pack warm clothing as temperatures can drop to 5-10°C. Respectful clothing is required when visiting religious sites.',
    displayOrder: 9,
    status: 'active'
  },
  {
    question: 'Are the trips suitable for senior citizens and families with children?',
    answer: 'Yes, our trips are suitable for travelers of all ages, including senior citizens and families with children. We can customize itineraries to accommodate mobility requirements, dietary restrictions, and family-friendly activities. Many of our trips include comfortable transportation, moderate-paced itineraries, and flexible scheduling. Please inform us about any special requirements when booking, and we will make necessary arrangements to ensure a comfortable and enjoyable experience for everyone.',
    displayOrder: 10,
    status: 'active'
  },
  {
    question: 'Do you offer group discounts?',
    answer: 'Yes, we offer special discounts for group bookings. Discounts vary based on group size: 5-10 travelers receive 5% discount, 11-20 travelers receive 10% discount, and groups of 21+ travelers receive up to 15% discount. Group bookings also include complimentary services like a dedicated tour manager for larger groups. Contact our team with your group size and travel dates for a customized quote and group discount details.',
    displayOrder: 11,
    status: 'active'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept multiple payment methods for your convenience: Bank transfers (NEFT/RTGS/IMPS), Credit/Debit cards (Visa, Mastercard, RuPay), UPI payments (Google Pay, PhonePe, Paytm), Online payment gateways through our website, and Cash payments at our office. A booking confirmation requires a 30-50% advance payment, with the balance due 7-15 days before departure. Payment terms may vary for custom packages.',
    displayOrder: 12,
    status: 'active'
  }
];

async function addTestFAQs() {
  try {
    console.log('🔄 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialized\n');

    console.log('❓ Adding test FAQs...\n');

    for (let i = 0; i < testFAQs.length; i++) {
      const faqData = testFAQs[i];
      try {
        const faq = await FAQ.create(faqData);
        console.log(`✅ FAQ ${i + 1} created: ${faq.question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ Error creating FAQ ${i + 1} (${faqData.question.substring(0, 30)}...):`, error.message);
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
          console.log(`   ⚠️  FAQ with this question already exists, skipping...`);
        }
      }
    }

    console.log('\n✨ Test FAQs addition completed!');
    console.log(`\n📊 Summary: ${testFAQs.length} FAQs added`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestFAQs();

