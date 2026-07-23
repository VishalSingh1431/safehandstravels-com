import pool from '../config/database.js';

const trip = {
  title: "Spirituality of India Tour for Sudha Jee X01",
  location: "Varanasi, Prayagraj, Ayodhya, Lucknow",
  duration: "5 Days / 4 Nights",
  price: "On Request",
  image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
  subtitle: "A spiritual and cultural journey",
  intro: "Welcome to a 5-day journey that captures the spiritual and cultural essence of Northern India! Crafted for European travelers, this adventure blends the sacred serenity of Varanasi, Prayagraj, and Ayodhya with the regal charm of Lucknow. From Ganges rituals to Nawabi palaces, every day is filled with wonder. With a flight, train, private transfers, cozy hotels, and a friendly, sales-oriented tone, this itinerary promises a hassle-free and enchanting experience. Let’s dive into your day-by-day plan!",
  is_popular: 0,
  slug: "15-spirituality-of-india-delhi-2n-varanasi2n-prayagra1n-ayodhya1n-lucknow1n-delhi-docx",
  status: "active",
  itinerary: [
    {
      day: "Day 01",
      title: "Delhi - Varanasi (Flight TBA)",
      activities: [
        "Varanasi, one of the world’s oldest cities, is revered for its spiritual significance. Known for its Ghats, Temples, and Ganga Aarti, it captivates travelers seeking spirituality.",
        "Later, head to Sarnath, where Buddha gave his first sermon. Its Dhamek Stupa and Museum with ancient artifacts attract travelers seeking Buddhist heritage.",
        "Thereafter, drive to Varanasi City & check in at the hotel for some relaxation.",
        "In the evening, stroll along the Ghats, feeling the pulse of this ancient city, and shop for Banarasi silk scarves in nearby markets, a perfect souvenir. Varanasi’s mystical allure will captivate your heart!"
      ],
      stay: "Overnight stay in Varanasi."
    },
    {
      day: "Day 02",
      title: "Varanasi Sightseeing",
      activities: [
        "Morning breakfast at the hotel.",
        "Start your day with an early morning Boat Ride on the River Ganga, witnessing devotees bathing and praying as the sun rises, a serene experience for travelers.",
        "After completing the boat ride, walk through the temple lane and visit various temples like Kashi Vishwanath Temple rebuilt in 1780, this sacred temple dedicated to Shiva is one of the 12 Jyotirlingas & Vishalakshi Temple, dedicated to Goddess Parvati, and Annapurna Temple, honoring the goddess of nourishment, both vibrant with rituals.",
        "Afterwards, visit Banaras Hindu University and its Bharat Kala Bhavan. Located in Banaras Hindu University, this museum houses Indian art, from Mughal miniatures to sculptures. Its vast collection fascinates travelers interested in cultural heritage.",
        "Thereafter, visit Bharat Mata Temple in Varanasi, a unique place that honors Mother India. Instead of idols, it has a huge marble map of the country, showing mountains, rivers, and plains. The temple celebrates unity and patriotism, making it a meaningful stop for visitors.",
        "Subsequently, shop in the local market and purchase some famous things.",
        "In the evening, witness the mesmerizing Ganga Aarti at Dashashwamedh Ghat, where priests perform a captivating ritual with glowing lamps and devotional chants, a spiritual highlight for travelers."
      ],
      stay: "Overnight stay in Varanasi."
    },
    {
      "day": "Day 03",
      title: "Varanasi - Prayagraj - Ayodhya (Road: 240 km, 4 hours)",
      activities: [
        "Morning breakfast at the hotel.",
        "After breakfast, drive to Prayagraj, earlier known as Allahabad, another important destination for Hindu Pilgrimage. Prayagraj is famous for Sangam, the confluence of three rivers Ganga, Yamuna, and the mythical river Saraswati.",
        "Upon arrival, visit Triveni Sangam, the holy meeting point of the Ganges, Yamuna, and mythical Saraswati rivers—a spiritually uplifting experience for European travelers. Take a Boat Ride to the Sangam, learning about its significance during the Kumbh Mela.",
        "Next, have Darshan of Lord Hanuman Jee near Sangam. (Tuesdays are a busy day at this temple). The towering statue of Lord Hanuman exudes strength and devotion. This temple, where the idol lies in a reclining position, holds deep spiritual significance for devotees.",
        "Afterwards, visit Alopi Devi Shakti Peeth Temple, one of Shakti Peeth of Mata from their 51 Shaktipeethas. On Navratris this temple has more popularity & crowd.",
        "Continue driving to Ayodhya– Arrival and check in at your hotel.",
        "By evening, join the Aarti at the Sarayu River, a soul-stirring experience that fosters a sense of spiritual connection and devotion among the devotees."
      ],
      stay: "Overnight stay in Ayodhya."
    },
    {
      "day": "Day 04",
      title: "Ayodhya - Lucknow (Road: 135 km, 3 hours)",
      activities: [
        "Morning breakfast at the hotel.",
        "Post breakfast, our representative/tour guide will meet you & proceed to visit Hanuman Garhi, Ayodhya, a 10th-century temple dedicated to the Hindu God, Hanuman. It is one of the most important temples in Ayodhya as it is customary to visit Hanuman Garhi before visiting the Ram Temple in Ayodhya. It is believed that Lord Hanuman lived at the temple site guarding Ayodhya.",
        "Continue to visit Ram Mandir (Ram Janmabhoomi Temple). The Ram Mandir holds immense spiritual significance for millions of Hindus. Inaugurated on 22 January 2024, the sacred site is believed to be Rama’s birthplace, with its stunning architecture and spiritual vibe—a highlight for travelers seeking India’s mythological heritage.",
        "Later, visit Kanak Bhawan, a beautiful temple gifted to Sita by Rama’s mother, adorned with intricate carvings. It is a holy site dedicated to the Hindu deity Lord Rama and his wife, Goddess Sita.",
        "After the Sightseeing drive to Lucknow. Upon arrival check in your hotel and relax."
      ],
      stay: "Overnight stay in Ayodhya."
    },
    {
      "day": "Day 05",
      title: "Lucknow (Sightseeing) & Depart",
      activities: [
        "Begin your day with a hearty breakfast at your hotel in Lucknow. After savoring the flavors, Dive straight into Lucknow's historical heart.",
        "Start with the majestic <strong>Bara Imambara</strong>, an 18th-century wonder featuring a vast hall and the enigmatic Bhulbhulaiya maze—a thrilling labyrinth that's an absolute delight for adventurous explorers. Next, head to the <strong>Chota Imambara</strong>, built in 1838, where glittering chandeliers and lavish ornate details create a mesmerizing spectacle, enchanting architecture enthusiasts with its refined elegance.",
        "Continue your journey to <strong>Constantia House (La Martiniere College)</strong>, a stunning colonial-era gem blending European grandeur with Indian influences. Commissioned by the visionary Frenchman Claude Martin, this imposing structure now thrives as La Martiniere College, weaving layers of history into every stone.",
        "As the sun dips, wander through the lively yet sophisticated <strong>Hazratganj Market</strong>, Lucknow's premier shopping hub brimming with exquisite Chikankari embroidery, signature perfumes, and artisanal keepsakes. It's a perfect spot for European travelers to pick up elegant souvenirs amid the vibrant, nawabi charm.",
        "Conclude your Lucknow escapade with a seamless transfer to Lucknow Railway Station/ Airport."
      ],
      stay: "Overnight stay"
    }
  ],
  included: [
    "04 nights’ accommodation.",
    "Daily Breakfast throughout the tour",
    "Air-conditioned transportation throughout the tour",
    "All expenses related to the vehicle",
    "Boat ride on the River Ganges in Varanasi & Prayagraj",
    "Ganga aarti on the River Ganges in Varanasi & Aarti at River Saryu in Ayodhya",
    "VIP Darshan ticket to Kashi Vishwanath temple & Lord Rama temple in Ayodhya",
    "Rickshaw ride in Varanasi and Ayodhya.",
    "English-speaking tour guide in each city.",
    "Assistance by English, Hindi or Tamil-speaking priest in Varanasi for any special prayer. (Any expenses related to prayer will be paid by the guests only)",
    "02 bottles of mineral water per person per day"
  ],
  excluded: [
    "Any meals other than those specified in the program",
    "Expenses of person nature",
    "Any Special prayer during the Trip",
    "Any claim due to natural calamity, medical emergencies or evacuation.",
    "Airfare is given separately"
  ]
};

async function fixTrip() {
  try {
    const updateQuery = `
      UPDATE trips SET
        title=?, location=?, duration=?, price=?, 
        image_url=?, subtitle=?, intro=?, is_popular=?, status=?,
        itinerary=?, included=?, not_included=?
      WHERE slug = '15-spirituality-of-india-delhi-2n-varanasi2n-prayagra1n-ayodhya1n-lucknow1n-delhi-docx'
      OR slug = 'spirituality-of-india-tour-for-sudha-jee-x01-docx'
      OR slug = 'spirituality-of-india-tour-for-sudha-jee-x01'
    `;
    await pool.query(updateQuery, [
      trip.title, trip.location, trip.duration, trip.price,
      trip.image_url, trip.subtitle, trip.intro, trip.is_popular, trip.status,
      JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded)
    ]);
    console.log("✅ Sudha Jee trip fixed in DB.");
  } catch (error) {
    console.error('❌ Failed to fix trip:', error);
  } finally {
    process.exit(0);
  }
}

fixTrip();
