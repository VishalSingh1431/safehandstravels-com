import pool from '../config/database.js';

async function addGoldenTriangleTrip() {
  try {
    const query = `
      INSERT INTO trips (
        title, location, duration, price, 
        image_url, subtitle, intro, is_popular, slug, status,
        itinerary, included, not_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const itinerary = [
      {
        day: "Day 01",
        title: "Arrival Delhi (Flight TBA)",
        activities: ["Welcome to India! Upon arrival at Delhi international airport T3, a representative will assist you at the arrival lounge and accompany you to the hotel."],
        stay: "Overnight stay - Hotel"
      },
      {
        day: "Day 02",
        title: "Delhi Sightseeing",
        activities: ["Morning post breakfast will proceed for Delhi sightseeing.", "Visit Old Delhi with remarkable monument Red Fort (From outside) and Jama Masjid.", "Enjoy a rickshaw ride through various markets of Chandni Chowk.", "By afternoon, drive past India Gate and President House.", "Taste some Indian food and proceed to Qutab Minar.", "Conclude Delhi sightseeing with Akshardham temple."],
        stay: "Dinner Overnight stay – Hotel"
      },
      {
        day: "Day 03",
        title: "Delhi – Agra (Drive 210 km/04 Hrs.)",
        activities: ["Morning post breakfast will drive to Agra.", "Visit 11th century Agra Fort, a famous walled city.", "By evening, visit Mehtab Bagh, a charbagh garden complex overlooking the Taj Mahal."],
        stay: "Dinner Overnight stay at the hotel"
      },
      {
        day: "Day 04",
        title: "Agra – Abhaneri – Jaipur (Drive 250 km / 05 Hrs.)",
        activities: ["Start the day by exploring the Taj Mahal at Sunrise.", "Later drive to Jaipur.", "En-route visit Abhaneri stepwell (Chand Baori).", "Drive to Jaipur."],
        stay: "Dinner & Overnight stay at hotel in Jaipur."
      },
      {
        day: "Day 05",
        title: "Jaipur Sightseeing",
        activities: ["Start sightseeing at around 8.00 am and proceed first to Hawa Mahal (Palace of Winds).", "Proceed to Amer Fort for an ascending elephant ride.", "Visit City Palace and Jantar – Mantar.", "Experience the colorful local markets."],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 06",
        title: "Jaipur – Delhi (260 km / 06 Hrs.) + Shopping & Departure",
        activities: ["Morning post breakfast drive to Delhi.", "Last-minute shopping and farewell dinner.", "Transfer to Delhi Airport to Board your Flight to Hometown."],
        stay: "Tour concludes"
      }
    ];

    const included = [
      "05 Nights’ accommodation on a double sharing basis.",
      "Daily breakfast and Dinner in the hotel restaurant.",
      "Air-conditioned Transportation throughout the itinerary including all airports transfers.",
      "Local English-speaking tour guide throughout the tour.",
      "Monument entry fees – One-time entry",
      "Tanga ride in Agra.",
      "Elephant ride in Jaipur.",
      "All presently applicable taxes including 5 % GST."
    ];

    const not_included = [
      "Any airfare or airport tax.",
      "Expenses of a personal nature.",
      "Any other expenses not mentioned in the cost included"
    ];

    const values = [
      'Golden Triangle Tour Package',
      'Delhi - Agra - Jaipur',
      '06 Days / 05 Nights',
      'On Request', // Price not in PDF
      'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', // Placeholder image
      'Experience the Golden Triangle of India',
      'A 6-day cultural journey through Delhi, Agra, and Jaipur, exploring iconic monuments like the Taj Mahal, Amer Fort, and Qutab Minar.',
      true,
      'golden-triangle-tour-' + Date.now(),
      'active',
      JSON.stringify(itinerary),
      JSON.stringify(included),
      JSON.stringify(not_included)
    ];

    const [result] = await pool.query(query, values);
    console.log(`✅ Golden Triangle Trip added successfully! Insert ID: ${result.insertId}`);
  } catch (error) {
    console.error('❌ Failed to add Golden Triangle trip:', error);
  } finally {
    process.exit(0);
  }
}

addGoldenTriangleTrip();
