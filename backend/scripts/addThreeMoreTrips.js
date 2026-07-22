import pool from '../config/database.js';

async function addThreeMoreTrips() {
  try {
    const query = `
      INSERT INTO trips (
        title, location, duration, price, 
        image_url, subtitle, intro, is_popular, slug, status,
        itinerary, included, not_included
      ) VALUES ?
    `;

    // 1. Shimla Manali Tour
    const shimlaItinerary = [
      { day: "Day 01", title: "Arrive Amritsar", activities: ["Welcome to Amritsar! Transfer to hotel."], stay: "Overnight stay at Hotel" },
      { day: "Day 02", title: "Amritsar sightseeing – Dharamshala", activities: ["Drive to Dharamshala. Afternoon sightseeing covering Mcleodganj, Dalai lama temple, Bhagsu Nag and Naddi."], stay: "Dinner & Overnight at Hotel" },
      { day: "Day 03", title: "Dharamshala – Manali", activities: ["Depart for Manali enroute visiting St. John Church in the Wilderness, and Norbulingka institute."], stay: "Dinner & Overnight at hotel" },
      { day: "Day 04", title: "Manali (Solang Valley and Sissu Lake)", activities: ["Proceed to Solang valley for Skiing, Snowboarding. Afternoon visit Sissu lake via Atal Tunnel."], stay: "Dinner & Overnight Stay At Hotel" },
      { day: "Day 05", title: "Manali (Naggar excursion & Local Sightseeing)", activities: ["Visit Naggar Castle and Roriech art Gallery. Afternoon visit Hadimba Devi Temple, Club House, Tibetan monastery and Vashisht village."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 06", title: "Manali – Shimla", activities: ["Drive to Shimla. Walk on the Mall Road, or visit Jakhu Hill."], stay: "Dinner Overnight stay at Hotel" },
      { day: "Day 07", title: "Shimla (Kufri excursion & Local sightseeing)", activities: ["Excursion to Kufri. Afternoon sightseeing of Jakhoo temple, Himachal State Museum, Christ Church."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 08", title: "Shimla – Amritsar & Depart", activities: ["Depart from Shimla to Amritsar Airport to board a flight to your Hometown."], stay: "Tour concludes" }
    ];
    
    // 2. South India Leisure Trip
    const southIndiaItinerary = [
      { day: "Day 01", title: "Arrive Bangalore Sightseeing", activities: ["Visit Lalbagh Botanical Garden, Bull Temple, Tipu Sultan's Summer Palace, and Bangalore Palace. Drive to Mysore."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 02", title: "Bangalore Sightseeing", activities: ["Visit Shri Gavi Gangadhareshwara Swamy Temple and Shree Kadu Mallikarjunaswamy Temple."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 03", title: "Bangalore - Mysore Sightseeing", activities: ["Drive to Mysore. Visit Mysore Palace, Chamundi Temple, and Brindavan Gardens."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 04", title: "Mysore - Ooty Sightseeing", activities: ["Drive to Ooty. Visit Ooty Lake, Doddabetta Peak, and Ooty Botanical Garden."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 05", title: "Ooty - Coimbatore", activities: ["Drive to Coimbatore. Visit Marudhamalai Temple, Isha Foundation, and Perur pateeswarar temple."], stay: "Dinner And Overnight Stay at Hotel" },
      { day: "Day 06", title: "Coimbatore - Trichy", activities: ["Drive to Trichy. Visit Vekkaliamman Temple, Srirangam Temple, and Jambukeswarar Temple."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 07", title: "Trichy - Kumbakonam – Pondicherry", activities: ["Drive to Pondicherry via Kumbakonam Temple. Visit Pondicherry Museum and The Aurobindo Ashram."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 08", title: "Pondicherry - Chennai", activities: ["Drive to Chennai. Visit Auroville, Mahabalipuram (Shore Temple, Five Rathas), and Kapaleeshwarar Temple."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 09", title: "Chennai – Day Trip to Kalahasti", activities: ["Day trip to Sri Kalahasteeswara Temple."], stay: "Dinner & Overnight Stay at Hotel" },
      { day: "Day 10", title: "Chennai Shopping & Depart", activities: ["Shopping in Pondy Bazaar. Transfer to Airport."], stay: "Tour concludes" }
    ];

    // 3. Char Dham Yatra
    const charDhamItinerary = [
      { day: "Day 01", title: "ARRIVAL DELHI", activities: ["Arrival at Delhi airport, transfer to hotel."], stay: "Overnight stay at Hotel" },
      { day: "Day 02", title: "DELHI – RISHIKESH", activities: ["Drive to Rishikesh. Visit Ram Jhula, Bajrang Setu. Evening Ganga Aarti at Parmarth Niketan."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 03", title: "RISHIKESH – BARKOT", activities: ["Drive to Barkot. Enroute visit Lakhamandal."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 04", title: "BARKOT - YAMUNOTRI - BARKOT", activities: ["Trek to Yamunotri. Visit Surya Kund. Trek back to Barkot."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 05", title: "BARKOT - UTTARKASHI", activities: ["Drive to Uttarkashi. Visit Shiv Gufa and Vishwanath Temple."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 06", title: "UTTARKASHI - GANGOTRI - UTTARKASHI", activities: ["Drive to Gangotri. Visit Gangotri Temple. Return to Uttarakashi via Harshil Village."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 07", title: "UTTARKASHI – SONPRAYAG", activities: ["Drive to Sonprayag. Visit Kashi Vishwanath Temple in Guptkashi."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 08", title: "SONPRAYAG – GOURIKUND - KEDARNATH", activities: ["Trek to Kedarnath. Visit the Kedarnath Baba temple."], stay: "Dinner & Overnight stay at Guest House" },
      { day: "Day 09", title: "KEDARNATH – GAURIKUND - SONPRAYAG", activities: ["Visit Bhairav Baba Temple and Adi Shankaracharya Samadhi. Trek down to Gaurikund."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 10", title: "SONPRAYAG - BADRINATH", activities: ["Drive to Badrinath. Visit Badrinath Temple for Lord Badrivishal."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 11", title: "BADRINATH - RUDRAPRAYAG", activities: ["Visit Mana Village. Drive to Rudraprayag via Joshimath (Narsimha Temple)."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 12", title: "RUDRAPRAYAG – HARIDWAR", activities: ["Drive to Haridwar. Visit Mansa Devi Temple. Evening Ganga Aarti at Har Ki Pauri."], stay: "Dinner & Overnight stay at Hotel" },
      { day: "Day 13", title: "HARIDWAR –DELHI & DEPART", activities: ["Drive to Delhi. Shopping. Transfer to Delhi Airport."], stay: "Tour concludes" }
    ];

    const values = [
      [
        'Shimla Manali Tour 2025', 'Shimla, Manali, Dharamshala', '08 Days / 07 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Top Tourist Destinations in India', 'A beautiful tour of the majestic hills of Shimla, Manali, Dharamshala, and the Golden Temple in Amritsar.',
        true, 'shimla-manali-tour-2025-' + Date.now(), 'active',
        JSON.stringify(shimlaItinerary), JSON.stringify(["7 nights accommodation", "Breakfast & Dinner", "Transportation"]), JSON.stringify(["Airfare", "Adventure activities"])
      ],
      [
        'South India Leisure Trip', 'South India', '10 Days / 09 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'South India Leisure Trip', 'Explore the diverse culture, grand temples, and scenic landscapes of South India.',
        true, 'south-india-leisure-trip-' + Date.now(), 'active',
        JSON.stringify(southIndiaItinerary), JSON.stringify(["9 nights accommodation", "Breakfast", "Transportation"]), JSON.stringify(["Airfare", "Personal expenses"])
      ],
      [
        'Char Dham Yatra Tour 2026', 'Uttarakhand, India', '13 Days / 12 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Yamunotri, Gangotri, Kedarnath, Badrinath', 'A sacred pilgrimage to the four holy shrines of the Himalayas.',
        true, 'char-dham-yatra-2026-' + Date.now(), 'active',
        JSON.stringify(charDhamItinerary), JSON.stringify(["12 Nights Accommodation", "Breakfast & Dinner", "Transportation"]), JSON.stringify(["Airfare", "Helicopter/Pony rides"])
      ]
    ];

    const [result] = await pool.query(query, [values]);
    console.log(`✅ 3 More Trips added successfully! Affected Rows: ${result.affectedRows}`);
  } catch (error) {
    console.error('❌ Failed to add trips:', error);
  } finally {
    process.exit(0);
  }
}

addThreeMoreTrips();
