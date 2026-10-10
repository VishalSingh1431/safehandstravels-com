import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const faqs = [
  {
    question: 'How do I book a trip with Safe Hands Travels?',
    answer: 'Booking is simple! Browse our trips on the website, click any trip you like, and fill out the enquiry form. Our travel expert will call you within 24 hours to discuss the itinerary, customise it to your needs, and confirm the booking. You can also WhatsApp or call us directly.',
    order: 1,
  },
  {
    question: 'Can I customise a trip itinerary as per my preferences?',
    answer: 'Absolutely! Every trip we offer can be fully customised. Whether you want to add extra days, change hotels, include specific temples or attractions, adjust the pace of travel, or modify the departure date — we tailor every journey to match your requirements. Just let us know what you have in mind.',
    order: 2,
  },
  {
    question: 'What does the trip price include?',
    answer: 'Our trip prices typically include accommodation (as specified), meals (as mentioned in the itinerary), all transfers and transportation, sightseeing as per the itinerary, and a dedicated guide or tour manager. Airfare, personal expenses, travel insurance, and optional items are generally not included. Each trip page clearly lists what is and is not included.',
    order: 3,
  },
  {
    question: 'Is Safe Hands Travels government registered?',
    answer: 'Yes, Safe Hands Travels is a fully registered and licensed travel company. We comply with all government regulations for tour operators in India. Our team has years of experience organising pilgrimages, cultural tours, and adventure trips across India.',
    order: 4,
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer: 'Cancellations made 30+ days before departure receive a full refund minus booking charges. Cancellations 15-29 days prior receive a 50% refund. Cancellations within 14 days of departure are non-refundable. In case of natural disasters or government travel advisories, we offer full credit for rescheduling. Please contact us directly for any special circumstances.',
    order: 5,
  },
  {
    question: 'Do you arrange Kedarnath helicopter bookings?',
    answer: 'Yes! We assist with Kedarnath helicopter bookings from Phata, Sirsi, and Guptkashi helipads. Since helicopter seats are limited and book up very quickly, we strongly recommend reaching out to us at least 2-3 months before your planned travel date, especially for peak season (May-June).',
    order: 6,
  },
  {
    question: 'Are your trips suitable for senior citizens and elderly pilgrims?',
    answer: 'Absolutely. We specialise in pilgrimage tours and have extensive experience handling senior travellers. We arrange pony rides, palanquins (dolis/palkis), wheelchair-accessible hotels where available, and ensure a relaxed pace of travel. Our guides are trained to assist elderly travellers at every step. Please inform us of any special requirements at the time of booking.',
    order: 7,
  },
  {
    question: 'Can you arrange group tours for families or corporate teams?',
    answer: 'Yes, we organise group tours for families, friend groups, corporate teams, and religious groups of all sizes. Group bookings receive special pricing and our team can arrange dedicated buses, customised meals, team-building activities, and group accommodation. Contact us with your group size and destination for a custom quote.',
    order: 8,
  },
  {
    question: 'What safety measures do you have in place during trips?',
    answer: 'Safety is our highest priority — it is in our name! Every trip includes a trained guide or tour manager, 24/7 helpline access, verified and inspected accommodation, well-maintained vehicles with experienced drivers, and a medical emergency protocol. For adventure or high-altitude trips, we carry first-aid kits and coordinate with local medical facilities.',
    order: 9,
  },
  {
    question: 'Do you offer travel insurance?',
    answer: 'While we do not sell travel insurance directly, we strongly recommend that all travellers purchase a comprehensive travel insurance policy before their trip — especially for adventure travel, Himalayan treks, or international journeys. We can guide you on which type of coverage is recommended for your specific trip.',
    order: 10,
  },
  {
    question: 'How far in advance should I book my trip?',
    answer: 'For popular pilgrimage circuits (Char Dham, Vaishno Devi, Tirupati) and peak season travel (April-June, October-November), we recommend booking at least 2-3 months in advance. For Kedarnath helicopter and certain Rajasthan heritage hotels, even earlier is better. For offseason or less popular routes, 2-4 weeks is usually sufficient.',
    order: 11,
  },
  {
    question: 'Do you arrange airport and railway station pickups?',
    answer: 'Yes, all our packages include airport and railway station pick-up and drop-off as standard. Our drivers will meet you with a name board at the arrival gate. If your travel plans change, just inform us of the updated flight or train details and we will adjust accordingly at no extra charge.',
    order: 12,
  },
  {
    question: 'What types of accommodation do you provide?',
    answer: 'Depending on the package and budget, we offer a range of accommodation from comfortable 3-star hotels and budget dharamshalas (for pilgrimage tours) to premium 4-5 star hotels and heritage palace hotels. All properties are personally vetted by our team for cleanliness, safety, and service quality. We can upgrade or downgrade accommodation as per your preference.',
    order: 13,
  },
  {
    question: 'Can I travel solo with Safe Hands Travels?',
    answer: 'Definitely! We welcome solo travellers and offer both group join-in packages (where you travel with other like-minded travellers) and private solo packages (your own vehicle, guide, and personalised itinerary). Solo travel with us is completely safe and well-supported — many of our repeat customers are solo women travellers and senior solo travellers.',
    order: 14,
  },
  {
    question: 'What is the best time to visit North India for pilgrimage tours?',
    answer: 'For North India pilgrimage circuits (Varanasi, Prayagraj, Ayodhya, Mathura), October to March is ideal — pleasant weather and clear skies. For the Char Dham Yatra (Kedarnath, Badrinath, Gangotri, Yamunotri), the temples open in late April/May and close in November. Avoid July-August for Himalayan destinations due to heavy monsoon rains.',
    order: 15,
  },
];

async function addFAQs() {
  try {
    console.log('Adding 15 FAQs...');
    for (const faq of faqs) {
      await pool.query(
        'INSERT INTO faqs (question, answer, display_order, status) VALUES (?, ?, ?, ?)',
        [faq.question, faq.answer, faq.order, 'active']
      );
      console.log(`  ✅ FAQ ${faq.order}: ${faq.question.substring(0, 55)}...`);
    }
    console.log('\n✅ All 15 FAQs added successfully!');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    process.exit(0);
  }
}

addFAQs();
