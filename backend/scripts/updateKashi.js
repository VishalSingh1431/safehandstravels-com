import pool from '../config/database.js';

async function updateKashiTrip() {
  try {
    const itinerary = [
      {
        day: "Day 01",
        title: "Arrival Delhi (Flight TBA)",
        activities: [
          "Jai Shree Ram",
          "Welcome to Delhi!!",
          "Upon arrival at Delhi airport, a SafeHands representative will warmly meet and assist you at the arrival lounge of the airport and accompany you to your hotel for smooth check-in."
        ],
        stay: "Overnight stay at hotel"
      },
      {
        day: "Day 02",
        title: "Delhi - Varanasi (By Flight)",
        activities: [
          "Morning Post Breakfast we will transfer to Airport to board flight to Varanasi.",
          "Upon Arrival at Varanasi SafeHands Travels represantive/driver will meet you at airport.",
          "Afterwards we will drive to visit Swardev Mahamandir like a lotus blooming beside the holy Ganges, stands Swarved Mahamandir. Imagine a dazzling white structure, seven stories high, shimmering in the sunlight. It's the world's biggest meditation center, welcoming 20,000 seekers at once!.",
          "Afterwards we will check in at the Hotel and take some rest.",
          "By evening will get ready to experience one of the most spectacular experiences of Ganga Aarti (Prayer) by crossing the narrow lanes of the city. You will return to your hotel post Ganga Aarti via same narrow lanes with rickshaw ride."
        ],
        stay: "Dinner & Overnight Stay at Hotel"
      },
      {
        day: "Day 03",
        title: "In Varanasi (Sightseeing)",
        activities: [
          "Today, you we will get up early in the morning before sunrise for a boat ride on the river Ganges. You will board the boat and sail through from the Assi Ghat till Manikarnika Ghat, the biggest cremation ground.",
          "Afterwards we will visit Kashi Vishwanath Temple. One among the 12 Jyotirlingas, Kashi Vishwanath Temple is one of the most renowned temples of Varanasi. Known as the golden temple dedicated to Lord Shiva, it acts as a core of faith for millions of Hindus.",
          "Today you can also do special prayers performed by the priest as per your requirements (Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest).",
          "We will also visit the other important temples like Vashalakshi temple, Annapurna mata temple, Sankatmochan (Hanuman) temple, Tulsi Mata temple and Bhairav baba temple."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 04",
        title: "Varanasi – Prayagraj - Ayodhya (Drive 170 Km / 04 Hrs)",
        activities: [
          "Morning Post Breakfast we will drive to Prayagraj which is now known as Allahabad also known as Sangam because of the confluence of three rivers Ganga, Yamuna, and the mythical river Saraswathy.",
          "Upon arrival in Prayagraj, will reach to Sangam by Boat and your tour guide will assist you to safely reach there and have a Holy Dip In the Sangam. Later will return by boat and will have the darshan of Lord Hanuman Jee near Sangam.",
          "By evening will visit Alopi Sankari Devi Shakti Peeth Temple, housing the last of Goddess Sati's body parts, The Alopi Devi Mandir counts among the Shakti Peethas of the country.",
          "Afterwards we will drive to Ayodhya.",
          "If time allows we will join the Aarti at the Sarayu River, which is a soul-stirring experience that fosters a sense of spiritual connection and devotion among the devotees."
        ],
        stay: "Dinner & Overnight stay at hotel"
      },
      {
        day: "Day 05",
        title: "In Ayodhya (Sightseeing)",
        activities: [
          "Morning post breakfast will proceed to visit Hanuman Garhi, Ayodhya, a 10th-century temple dedicated to the Hindu God, Hanuman. It is customary to visit Hanuman Garhi Before visiting the Ram Temple in Ayodhya.",
          "Next will visit Ram Mandir (Ram Janam Bhoomi). The Ram Mandir holds immense spiritual significance for millions of Hindus. Ram Mandir was Inaugrated by Prime Minister of India on 22 January 2024.",
          "Afterwards We will visit Nageshwarnath Temple, established in the name of the local deity, Lord Nageshwarnath, the Nageshwarnath Temple is located adjacent to the Theri Bazaar in Ayodhya. It is believed to have been set up by Kush or Kusha, Lord Rama's son.",
          "After That you will visit Sita Ki Rasoi (Kitchen of Mother Sita) and Kanak Bhawan, this temple is also known as Sone-ka-Ghar (House of Gold). It is a holy site dedicated to the Hindu deity Lord Rama and his wife, Goddess Sita.",
          "Afterwards We will drive to Lucknow."
        ],
        stay: "Dinner And Overnight Stay at Hotel"
      },
      {
        day: "Day 06",
        title: "Ayodhya - Delhi (Flight)",
        activities: [
          "Morning Post Breakfast We will drive to Ayodhya Airport (Mahrishi Valmiki Airport) to board Flight to Delhi.",
          "If time allows and anyone wants to visit any place again then they can do.",
          "Upon arrival at Airport, You will Board Flight to Your Hometown.",
          "Thank you for taking a tour SafeHands Travels. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help."
        ],
        stay: "Tour concludes"
      }
    ];

    const query = `
      UPDATE trips 
      SET itinerary = ? 
      WHERE slug LIKE 'kashi-ayodhya-prayagraj-tour-%'
    `;

    const [result] = await pool.query(query, [JSON.stringify(itinerary)]);
    console.log(`✅ Kashi Trip updated successfully! Affected Rows: ${result.affectedRows}`);
  } catch (error) {
    console.error('❌ Failed to update Kashi trip:', error);
  } finally {
    process.exit(0);
  }
}

updateKashiTrip();
