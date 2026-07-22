import pool from '../config/database.js';

async function addThreeTrips() {
  try {
    const query = `
      INSERT INTO trips (
        title, location, duration, price, 
        image_url, subtitle, intro, is_popular, slug, status,
        itinerary, included, not_included
      ) VALUES ?
    `;

    // 1. Cultural Rajasthan Tour
    const rajasthanItinerary = [
      { day: "Day 01", title: "Delhi - Mandawa", activities: ["Welcome to India! Arrival at Delhi Airport, drive to Mandawa (Open Art Gallery).", "Visit 18th Century Mandawa Fort, Gulab Rai Ki Haveli, Hanuman Prasad Goenka haveli."], stay: "Overnight stay at the Hotel" },
      { day: "Day 02", title: "Mandawa - Bikaner", activities: ["Drive to Bikaner. Visit Junagarh Fort, Lallgarh Palace, and the Camel breeding farm."], stay: "Overnight stay at the Hotel" },
      { day: "Day 03", title: "Bikaner – Jaislamer", activities: ["Drive to Jaisalmer. Visit Sam Sand Dunes with Camel ride to view the sunset."], stay: "Overnight stay at the Hotel" },
      { day: "Day 04", title: "In Jaisalmer", activities: ["Visit Jaisalmer Fort (Sonar Kila), Jain temple, Patwon Ki Haveli, Salim Singh ki Haveli, and Gadisagar Lake."], stay: "Overnight stay at the Hotel" },
      { day: "Day 05", title: "Jaisalmer – Jodhpur", activities: ["Drive to Jodhpur. Visit Mehrangarh Fort (Moti Mahal, Phool Mahal) and Jaswant Thada memorial."], stay: "Overnight stay at the Hotel" },
      { day: "Day 06", title: "Jodhpur – Deogarh", activities: ["Drive to Deogarh. Enjoy a jeep safari drive through a pastoral setting and visit a cave temple."], stay: "Overnight stay at the Hotel" },
      { day: "Day 07", title: "Deogarh – Udaipur", activities: ["Drive to Udaipur (City of Lakes). Proceed for a Boat Ride on Lake Pichola."], stay: "Overnight stay at the Hotel" },
      { day: "Day 08", title: "In Udaipur", activities: ["Visit City Palace complex, Jagdish Temple, and Bhartiya Lok Kala Museum."], stay: "Overnight stay at the Hotel" },
      { day: "Day 09", title: "Udaipur - Chittorgarh – Bundi", activities: ["Drive to Bundi. En route visit the Famous Chittorgarh Fort."], stay: "Overnight stay at the Hotel" },
      { day: "Day 10", title: "Bundi – Ranthambore", activities: ["Visit Bundi Palace notable for lavish murals. Drive to Ranthambore."], stay: "Overnight stay – Hotel" },
      { day: "Day 11", title: "Ranthambore", activities: ["Early morning Jeep safari through Ranthambhore. Afternoon Jeep safari."], stay: "Overnight stay at the Hotel" },
      { day: "Day 12", title: "Ranthambore - Jaipur", activities: ["Drive to Jaipur (Pink City). Visit Amer Fort, City Palace, Jantar Mantar, and Hawa Mahal."], stay: "Overnight stay at the Hotel" },
      { day: "Day 13", title: "Jaipur – Agra", activities: ["Drive to Agra. Visit Agra Fort and the Taj Mahal at Sunset."], stay: "Overnight stay at the Hotel" },
      { day: "Day 14", title: "Agra – Delhi And Departure", activities: ["Drive to Delhi. Visit India Gate and President House. Transfer to the airport."], stay: "Tour concludes" }
    ];
    
    // 2. Kerala Tour
    const keralaItinerary = [
      { day: "Day 01", title: "Arrive Kochi", activities: ["Arrival at Kochi international airport.", "Transfer to hotel and relax."], stay: "Over-night stay at hotel" },
      { day: "Day 02", title: "Kochi Sightseeing", activities: ["Visit St. Francis church and see Chinese Fishing Nets.", "Explore Mattancherry, Jew Town, Jewish Synagogue, and the spice market.", "Proceed to Alleppey."], stay: "Over-night stay at houseboat" },
      { day: "Day 03", title: "Alleppey - Periyar", activities: ["Drive to Periyar. Enjoy bamboo rafting.", "Interact with elephants and watch Kalaripayattu martial arts.", "Stroll in the jungle trail."], stay: "Over-night stay at hotel" },
      { day: "Day 04", title: "Periyar - Munnar", activities: ["Drive to Munnar, a lush green tea plantation hill station.", "Enjoy the scenic drive and local culture."], stay: "Over-night stay at Hotel" },
      { day: "Day 05", title: "Munnar (Sightseeing)", activities: ["Visit the 100 years old TATA Tea Factory (Tea Museum).", "Visit Mattupetty Dam and trek through the manicured tea gardens."], stay: "Over-night stay at Hotel" },
      { day: "Day 06", title: "Munnar - Kochi Shopping & Depart", activities: ["Drive to Kochi for last-minute shopping.", "Transfer to Airport to board flight home."], stay: "Tour concludes" }
    ];

    // 3. Kashmir Tour
    const kashmirItinerary = [
      { day: "Day 01", title: "Arrival Delhi", activities: ["Arrival at Delhi airport, representative will meet and assist."], stay: "Overnight Stay at Hotel" },
      { day: "Day 02", title: "Delhi – Srinagar (Flight) & Sightseeing", activities: ["Flight to Srinagar.", "Visit Mughal Gardens, Nishat Garden.", "Evening shikhara ride on Dal Lake. Visit Adi Shankara Temple."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 03", title: "Srinagar - Day trip to Gulmarg", activities: ["Drive to Gulmarg (Meadow of Flowers).", "Enjoy Gondola Ride up to 1st or 2nd Phase.", "See the Gulmarg Golf Course."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 04", title: "Srinagar - Day trip to Sonmarg", activities: ["Drive to Sonmarg (Meadow of Gold).", "Visit Thajiwas glacier by pony ride or trekking."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 05", title: "Srinagar – Pahalgam", activities: ["Drive to Pahalgam (Valley of Shepherds).", "Visit Aru Valley, Betaab Valley, and Chandanwari."], stay: "Dinner & Overnight stay at hotel" },
      { day: "Day 06", title: "Pahalgam - Srinagar - Delhi (Flight) & Depart", activities: ["Drive to Srinagar airport.", "Flight to Delhi.", "Transfer to hometown flight."], stay: "Tour concludes" }
    ];

    const values = [
      [
        'Cultural Rajasthan Tour', 'Rajasthan, India', '14 Days / 13 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Experience the Royal Heritage of Rajasthan', 'A comprehensive 14-day cultural journey through the majestic forts, palaces, and deserts of Rajasthan.',
        true, 'cultural-rajasthan-tour-' + Date.now(), 'active',
        JSON.stringify(rajasthanItinerary), JSON.stringify(["Accommodation", "Breakfast", "Guide", "Camel Safari", "Boat ride"]), JSON.stringify(["Airfare", "Personal expenses"])
      ],
      [
        'Kerala Tour Package', 'Kerala, India', '06 Days / 05 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Gods Own Country Experience', 'A beautiful 6-day journey through the backwaters, tea gardens, and wildlife of Kerala.',
        true, 'kerala-tour-' + Date.now(), 'active',
        JSON.stringify(keralaItinerary), JSON.stringify(["Accommodation", "Breakfast & Dinner", "Transportation"]), JSON.stringify(["Airfare", "Personal expenses"])
      ],
      [
        'Kashmir Tour Package 2025', 'Kashmir, India', '06 Days / 05 Nights', 'On Request',
        'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        'Paradise on Earth', 'Explore the snowy peaks and serene lakes of Srinagar, Gulmarg, Sonmarg, and Pahalgam.',
        true, 'kashmir-tour-' + Date.now(), 'active',
        JSON.stringify(kashmirItinerary), JSON.stringify(["Accommodation", "Breakfast & Dinner", "Shikara Ride"]), JSON.stringify(["Airfare", "Gondola Phase 2"])
      ]
    ];

    const [result] = await pool.query(query, [values]);
    console.log(`✅ 3 Trips added successfully! Affected Rows: ${result.affectedRows}`);
  } catch (error) {
    console.error('❌ Failed to add trips:', error);
  } finally {
    process.exit(0);
  }
}

addThreeTrips();
