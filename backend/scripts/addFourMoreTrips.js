import pool from '../config/database.js';

async function addFourMoreTrips() {
  try {
    const query = `
      INSERT INTO trips (
        title, location, duration, price, 
        image_url, subtitle, intro, is_popular, slug, status,
        itinerary, included, not_included
      ) VALUES ?
    `;

    // 1. Kashi Ayodhya Prayagraj Tour
    const kashiItinerary = [
      { day: "Day 01", title: "Arrival Delhi", activities: ["Arrival at Delhi airport, transfer to hotel."], stay: "Overnight stay at hotel" },
      { day: "Day 02", title: "Delhi - Gaya", activities: ["Flight to Gaya. Visit Bodh Gaya, Mahabodhi Temple, and Great Buddha Statue."], stay: "Overnight stay at hotel" },
      { day: "Day 03", title: "Gaya - Varanasi", activities: ["Drive to Varanasi. Visit Mani Mandir. Evening Ganga Aarti."], stay: "Overnight stay at Hotel" },
      { day: "Day 04", title: "In Varanasi", activities: ["Boat ride on river Ganges. Visit Kashi Vishwanath Temple, Vashalakshi temple, Annapurna mata temple."], stay: "Overnight stay at hotel" },
      { day: "Day 05", title: "Varanasi – Prayagraj - Ayodhya", activities: ["Drive to Prayagraj. Holy Dip in Sangam. Visit Alopi Sankari Devi Temple. Drive to Ayodhya."], stay: "Overnight stay at hotel" },
      { day: "Day 06", title: "In Ayodhya", activities: ["Visit Hanuman Garhi, Ram Mandir (Ram Janam Bhoomi), Nageshwarnath Temple, and Kanak Bhawan."], stay: "Overnight Stay at Hotel" },
      { day: "Day 07", title: "Ayodhya - Delhi & Depart", activities: ["Transfer to Ayodhya Airport to board Flight to Delhi. Fly to hometown."], stay: "Tour concludes" }
    ];
    
    // 2. Kedarnath Dream of Temple
    const kedarnathItinerary = [
      { day: "Day 01", title: "ARRIVAL DELHI", activities: ["Arrival at Delhi airport, transfer to hotel."], stay: "Overnight stay at Hotel" },
      { day: "Day 02", title: "DELHI – RISHIKESH", activities: ["Drive to Rishikesh. Visit Ram Jhula, Bajrang Setu. Evening Ganga Aarti at Parmarth Niketan."], stay: "Overnight stay at Hotel" },
      { day: "Day 03", title: "RISHIKESH – SONPRAYAG", activities: ["Drive to Sonprayag. Visit Kashi Vishwanath Temple in Guptkashi."], stay: "Overnight stay at Hotel" },
      { day: "Day 04", title: "SONPRAYAG – GOURIKUND - KEDARNATH", activities: ["Trek to Kedarnath. Visit the Kedarnath Baba temple."], stay: "Overnight stay at Guest House" },
      { day: "Day 05", title: "KEDARNATH – GAURIKUND - SONPRAYAG", activities: ["Visit Bhairav Baba Temple and Adi Shankaracharya Samadhi. Trek down to Gaurikund."], stay: "Overnight stay at Hotel" },
      { day: "Day 06", title: "SONPRAYAG – HARIDWAR", activities: ["Drive to Haridwar. Visit Mansa Devi Temple. Evening Ganga Aarti at Har Ki Pauri."], stay: "Overnight stay at Hotel" },
      { day: "Day 07", title: "HARIDWAR –DELHI & DEPART", activities: ["Drive to Delhi. Last minute shopping. Transfer to Delhi Airport."], stay: "Tour concludes" }
    ];

    // 3. Shirdi 3 Days 2 Nights Tour
    const shirdiItinerary = [
      { day: "Day 01", title: "Chennai – Shirdi", activities: ["Arrival at Shirdi Airport. Transfer to Hotel. Evening Aarti ceremony at the Sai Baba Temple."], stay: "Overnight Stay at Hotel" },
      { day: "Day 02", title: "Shirdi – Local sightseeing", activities: ["Darshan at Shri Sai Baba Sansthan Temple. Visit Khandoba temple."], stay: "Overnight stay in the hotel" },
      { day: "Day 03", title: "Shirdi - Chennai & Depart", activities: ["Transfer to airport to board a flight to Chennai."], stay: "Tour concludes" }
    ];

    // 4. Shirdi With 3 Jyotirlinga Tour
    const jyotirlingaItinerary = [
      { day: "Day 01", title: "Arrive Mumbai", activities: ["Arrival at Mumbai airport, transfer to hotel."], stay: "Overnight Stay at Hotel" },
      { day: "Day 02", title: "Mumbai – Nashik", activities: ["Drive to Nashik. Visit Trimbakeshwar Temple (Jyotirlinga)."], stay: "Overnight Stay at Hotel" },
      { day: "Day 03", title: "Nashik – Trimbakeshwar - Aurangabad", activities: ["Visit Trimbakeshwar Jyotirlinga. Continue to Aurangabad."], stay: "Overnight Stay at Hotel" },
      { day: "Day 04", title: "Aurangabad – Grishneshwar - Shirdi", activities: ["Visit Grishneshwar Jyotirlinga and Ellora Caves. Drive to Shirdi."], stay: "Overnight Stay at Hotel" },
      { day: "Day 05", title: "Shirdi – Temple Tour", activities: ["Darshan Shri Sai Baba Sansthan Temple. Visit Dwarkamai and Khandoba Temple."], stay: "Overnight Stay at Hotel" },
      { day: "Day 06", title: "Shirdi – Bhimashankar – Mumbai", activities: ["Visit Bhimashankar temple (Jyotirlinga). Drive to Mumbai."], stay: "Overnight Stay at Hotel" },
      { day: "Day 07", title: "Mumbai Sightseeing & Depart", activities: ["Visit The Gateway of India and Shri Siddhivinayak Ganapati Mandir. Transfer to Airport."], stay: "Tour concludes" }
    ];

    const values = [
      [
        'Kashi Ayodhya Prayagraj Tour', 'Gaya, Varanasi, Ayodhya, Prayagraj', '07 Days / 06 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Let\'s Explore Kashi - Ayodhya - Prayagraj', 'A spiritual journey covering the holiest cities of North India including Bodh Gaya, Varanasi, and Ayodhya.',
        true, 'kashi-ayodhya-prayagraj-tour-' + Date.now(), 'active',
        JSON.stringify(kashiItinerary), JSON.stringify(["6 nights accommodation", "Breakfast & Dinner", "VIP Darshan ticket to Kashi Vishwanath temple"]), JSON.stringify(["Airfare", "Personal expenses"])
      ],
      [
        'Kedarnath Dream of Temple', 'Kedarnath, Uttarakhand', '07 Days / 06 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Kedarnath Dream of Temple', 'A 7-day pilgrimage to the majestic Kedarnath temple and surrounding holy sites.',
        true, 'kedarnath-dream-of-temple-' + Date.now(), 'active',
        JSON.stringify(kedarnathItinerary), JSON.stringify(["6 Nights Accommodation", "Breakfast & Dinner", "Transportation"]), JSON.stringify(["Airfare", "Helicopter/Pony rides"])
      ],
      [
        'Shirdi 3 Days 2 Nights Tour', 'Shirdi, Maharashtra', '03 Days / 02 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Shirdi Weekend Getaway', 'A short and peaceful trip to seek blessings from Sai Baba in Shirdi.',
        true, 'shirdi-3-days-2-nights-tour-' + Date.now(), 'active',
        JSON.stringify(shirdiItinerary), JSON.stringify(["2 Nights accommodation", "Daily breakfast", "VIP Pass for Sai Baba Darshan"]), JSON.stringify(["Airfare", "Personal expenses"])
      ],
      [
        'Shirdi With 3 Jyotirlinga Tour', 'Maharashtra, India', '07 Days / 06 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Shirdi & Jyotirlingas', 'A divine journey covering Shirdi and the three powerful Jyotirlingas: Trimbakeshwar, Grishneshwar, and Bhimashankar.',
        true, 'shirdi-with-3-jyotirlinga-tour-' + Date.now(), 'active',
        JSON.stringify(jyotirlingaItinerary), JSON.stringify(["6 Nights accommodation", "Daily breakfast", "VIP Pass for Sai Baba Darshan"]), JSON.stringify(["Airfare", "Personal expenses"])
      ]
    ];

    const [result] = await pool.query(query, [values]);
    console.log(`✅ 4 More Trips added successfully! Affected Rows: ${result.affectedRows}`);
  } catch (error) {
    console.error('❌ Failed to add trips:', error);
  } finally {
    process.exit(0);
  }
}

addFourMoreTrips();
