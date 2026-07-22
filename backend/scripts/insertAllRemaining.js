import pool from '../config/database.js';

async function insertAllRemaining() {
  try {
    // 1. Kashi Ayodhya & Prayagraj Tour via Lucknow 2025
    const kashiLucknow2025 = {
      title: "Kashi Ayodhya & Prayagraj Tour via Lucknow 2025",
      location: "Varanasi, Ayodhya, Prayagraj & Lucknow",
      duration: "6 Days / 5 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Scenic tour of Kashi, Ayodhya, Prayagraj starting from Lucknow",
      intro: "Journey through Lucknow, the heritage city of Nawabs, to the holy sites of Varanasi, Ayodhya, and Prayagraj.",
      is_popular: 0,
      slug: "kashi-ayodhya-prayagraj-tour-via-lucknow-2025",
      status: "active",
      included: [
        "05 nights' accommodation.",
        "Daily Breakfast throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Evening Ganga Aarti on the River Ganges in Varanasi.",
        "Evening Aarti at River Saryu in Ayodhya.",
        "VIP Entry For Ram Mandir In Ayodhya.",
        "Monument fees (One time).",
        "Assistance by English / Tamil-Speaking Hindu priest in Varanasi for ancestors' prayer.",
        "Assistance For Visa.",
        "02 bottles of mineral water in the car per person / per day.",
        "All Taxes."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature i.e. Mini Bar, Laundry, Drinks.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "IMP – Domestic flights allows only 15 Kg Check in baggage."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Lucknow",
          activities: [
            "Welcome to <strong>BHARAT</strong>.",
            "Upon arrival at <strong>Lucknow airport</strong>, a SafeHands representative/Driver will warmly meet , greet and assist you at the arrival lounge of the airport.",
            "Later you will drive to your hotel, Check in at hotel"
          ],
          stay: "<strong>Overnight stay at hotel.</strong>"
        },
        {
          day: "Day 02",
          title: "Lucknow - Varanasi (Drive 320 Km / 05 Hrs)",
          activities: [
            "Morning Post Breakfast drive to <strong>Varanasi</strong>.",
            "<strong>Varanasi</strong> or <strong>Banaras</strong> or <strong>Kashi</strong>, are the various names of one of the most ancient living cities of the world. Known for narrow lanes, chanting monks, illuminated ghats and aimless crowd searching for their own rendezvous with meaning of life, Varanasi is definitely a completely different experience to be enthralled with.",
            "Upon Arrival you will visit <strong>Swardev Mahamandir</strong> like a lotus blooming beside the holy Ganges, stands Swarved Mahamandir. Imagine a dazzling white structure, seven stories high, shimmering in the sunlight. It's the world's biggest meditation center, welcoming 20,000 seekers at once!.",
            "Afterwards check in at hotel.",
            "By Evening you will witness one of the most spectacular experiences of <strong>Ganga Aarti (Prayer)</strong> at River Ganga. It is a soul-stirring evening ritual on the ghats of the Ganges, where synchronized chants, lamps, and incense create a powerful spiritual atmosphere that every traveler should experience at least once."
          ],
          stay: "<strong>Dinner & Overnight Stay at Hotel.</strong>"
        },
        {
          day: "Day 03",
          title: "Varanasi Sightseeing",
          activities: [
            "Early morning drive to Ghat to experience <strong>Dwan Boat Ride</strong> on the river <strong>Ganges</strong>. You will board the boat and sail through from the <strong>Assi Ghat</strong> till <strong>Manikarnika Ghat</strong>, the biggest cremation ground.",
            "Return to the hotel , Breakfast.",
            "Today you can also do special prayers performed by the priest as per your requirements <strong>(Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest)</strong>.",
            "You will visit <strong>Kashi Vishwanath Temple</strong>. One among the 12 Jyotirlingas, Kashi Vishwanath Temple is one of the most renowned temples of Varanasi. Afterwards you will visit <strong>Vashalakshi Temple, Annapurna Mata Temple</strong>.",
            "Afternoon visit of the city including temples, like <strong>Sankatmochan (Hanuman) Temple, Tulsi Mata Temple and Bhairav Baba Temple</strong>."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel</strong>"
        },
        {
          day: "Day 04",
          title: "Varanasi - Prayagraj – Ayodhya ( 200 Kms/5 Hours)",
          activities: [
            "Morning post Breakfast drive to Prayagraj.",
            "You will drive to <strong>Prayagraj</strong> earlier known as <strong>Allahabad</strong>, another important destination for the Hindu Pilgrimage. Prayagraj is famous for <strong>Sangam</strong> which is the confluence of three rivers <strong>Ganga, Yamuna, and the mythical river Saraswathy</strong>.",
            "Upon arrival you will reach to <strong>Sangam</strong> middle part where 3 rivers meet to have a Holy Dip.",
            "Afterwards You will have Darshan of <strong>Lord Hanuman Jee</strong> near Sangam. (Tuesdays are a busy day at this temple).",
            "Afterwards you will visit <strong>Alopi Devi Shakti Peeth Temple which is one of Shakti Peeth of Mata from their 51 Shaktipeethas. On Navratris this temple have more popularity & crowd</strong>.",
            "Continue drive to <strong>Ayodhya</strong> – Arrival and check in at your hotel"
          ],
          stay: "<strong>Dinner & Overnight Stay at Hotel.</strong>"
        },
        {
          day: "Day 05",
          title: "Ayodhya ( Full day sightseeing )",
          activities: [
            "Post Breakfast our representative/tour guide will meet you & proceed to visit <strong>Hanuman Garhi, Ayodhya</strong>, a 10th-century temple dedicated to the Hindu God, Hanuman.",
            "It is one of the most important temples in Ayodhya as it is customary to visit <strong>Hanuman Garhi Before</strong> visiting the <strong>Ram Temple</strong> in Ayodhya. It is believed that <strong>Lord Hanuman</strong> lived at the temple site guarding <strong>Ayodhya</strong>.",
            "Continue visit to <strong>Ram Mandir (Ram Janam Bhoomi)</strong>. The <strong>Ram Mandir</strong> holds immense spiritual significance for millions of Hindus. Which was inaugurated on 22 January 2024.",
            "Later you will visit <strong>Sita Ki Rasoi</strong> (Kitchen of Mother Sita) and <strong>Kanak Bhawan</strong>, this temple is also known as Sone-ka-Ghar (House of Gold). It is a holy site dedicated to the Hindu deity <strong>Lord Rama and his wife</strong>, Goddess Sita.",
            "By evening will join the <strong>Aarti at the Sarayu River</strong>, which is a soul-stirring experience that fosters a sense of spiritual connection and devotion among the devotees."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel.</strong>"
        },
        {
          day: "Day 06",
          title: "Ayodhya - Lucknow (By Drive 150 km/03 Hrs) & Depart",
          activities: [
            "Breakfast at hotel.",
            "Checkout and drive to Lucknow.",
            "<strong>Lucknow</strong> is known for its traditional markets and modern malls, offering a variety of shopping experiences. Popular markets include Hazratganj, Aminabad, and Chowk, where you can find <strong>Chikankari Embroidery, Jewellery, and Handicrafts</strong>. Hazratganj has a mix of old and new, while Aminabad is one of the <strong>oldest markets</strong> with affordable items. Chowk is known for its cultural significance and vintage charm.",
            "Afterwards our vehicle will drop you at <strong>Lucknow Airport</strong> to board a flight to your hometown."
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 2. Kashi Ayodhya and Prayagraj Tour With Haridwar & Rishikesh
    const kashiHaridwarRishikesh = {
      title: "Kashi Ayodhya and Prayagraj Tour With Haridwar & Rishikesh",
      location: "Varanasi, Ayodhya, Prayagraj, Haridwar & Rishikesh",
      duration: "8 Days / 7 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Complete North India Spiritual Pilgrimage",
      intro: "This extensive pilgrimage combines the holy triangle of Varanasi, Ayodhya, Prayagraj with the divine cities of Haridwar and Rishikesh in the Himalayas.",
      is_popular: 1,
      slug: "kashi-ayodhya-prayagraj-tour-with-haridwar-rishikesh",
      status: "active",
      included: [
        "07 nights' accommodation.",
        "Daily Breakfast & Dinner throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Boat ride on the River Ganges in Varanasi / Prayagraj.",
        "Ganga aarti on the River Ganges in Varanasi & Aarti at River Saryu in Ayodhya.",
        "VIP Darshan ticket to Kashi Vishwanath temple.",
        "Rickshaw ride in Varanasi and Ayodhya.",
        "English-speaking tour guide in Ayodhya, Varanasi, Haridwar & Rishikesh.",
        "Assistance by English or Tamil-speaking – Hindi priest in Varanasi for ancestors' prayer.",
        "02 bottles of mineral water per person per day."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Airfare for the sector Delhi – Ayodhya (Lucknow).",
        "Trainfare (VandeBharat) for the sector Varanasi – Delhi."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrival Delhi (Flight TBA)",
          activities: [
            "Jai Shree Ram",
            "Welcome to <strong>Delhi</strong>!!",
            "Upon arrival at Delhi airport, a SafeHands representative will warmly meet and assist you at the arrival lounge of the airport and accompany you to your hotel for smooth check-in."
          ],
          stay: "<strong>Overnight stay at hotel</strong>"
        },
        {
          day: "Day 02",
          title: "Delhi - Varanasi (By Flight)",
          activities: [
            "Morning Post Breakfast we will transfer to Railway Station to board <strong>Vande Bharat Train</strong> to Varanasi.",
            "Upon Arrival at <strong>Varanasi</strong> SafeHands Travels represantive/driver will meet you at Station.",
            "Afterwards will visit <strong>Mani Mandir draws you in with its 11 glistening peaks and carved red stone</strong>. Inside, a giant Shiva lingam (sacred symbol) takes center stage, surrounded by 151 smaller ones.",
            "Afterwards we will check in at the <strong>Hotel</strong> and take some rest.",
            "By evening will get ready to experience one of the most spectacular experiences of <strong>Ganga Aarti (Prayer)</strong> by crossing the narrow lanes of the city. You will return to your hotel post <strong>Ganga Aarti</strong> via same narrow lanes with rickshaw ride."
          ],
          stay: "Dinner & Overnight Stay at Hotel"
        },
        {
          day: "Day 03",
          title: "In Varanasi (Sightseeing)",
          activities: [
            "Today, you we will get up early in the morning before <strong>sunrise for a boat ride</strong> on the river <strong>Ganges</strong>. You will board the boat and sail through from the <strong>Assi Ghat</strong> till <strong>Manikarnika Ghat</strong>, the biggest cremation ground.",
            "Afterwards we will visit <strong>Kashi Vishwanath Temple</strong>. One among the 12 <strong>Jyotirlingas, Kashi Vishwanath Temple</strong> is one of the most renowned temples of Varanasi. Known as the golden temple dedicated to Lord Shiva, it acts as a core of faith for millions of Hindus.",
            "<strong>Today you can also do special prayers performed by the priest as per your requirements (Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest).</strong>",
            "We will also visit the other important temples like <strong>Vashalakshi temple, Annapurna mata temple, Sankatmochan (Hanuman) temple, Tulsi Mata temple and Bhairav baba temple</strong>."
          ],
          stay: "Dinner & Overnight stay at hotel."
        },
        {
          day: "Day 04",
          title: "Varanasi – Prayagraj - Ayodhya (Drive 170 Km / 04 Hrs)",
          activities: [
            "Morning Post Breakfast we will drive to Prayagraj which is now known as Allahabad also known as Sangam because of the confluence of three rivers Ganga, Yamuna, and the mythical river Saraswathy.",
            "Upon arrival in <strong>Prayagraj</strong>, will reach to Sangam by Boat and your tour guide will assist you to safely reach there and have a <strong>Holy Dip In the Sangam</strong>.",
            "Later will return by boat and will have the darshan of Lord <strong>Hanuman Jee</strong> near Sangam.",
            "By evening will visit <strong>Alopi Sankari Devi Shakti Peeth Temple</strong>, housing the last of <strong>Goddess Sati's body parts</strong>, The Alopi Devi Mandir counts among the <strong>Shakti Peethas</strong> of the country.",
            "Afterwards we will drive to <strong>Ayodhya</strong>.",
            "If time allows we will join the <strong>Aarti at the Sarayu River</strong>, which is a soul-stirring experience that fosters a sense of spiritual connection and devotion among the devotees."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 05",
          title: "In Ayodhya (Sightseeing)",
          activities: [
            "Morning post breakfast will proceed to visit <strong>Hanuman Garhi, Ayodhya</strong>, a 10th-century temple dedicated to the Hindu God, Hanuman. It is customary to visit <strong>Hanuman Garhi Before</strong> visiting the <strong>Ram Temple</strong> in Ayodhya.",
            "Next will visit <strong>Ram Mandir (Ram Janam Bhoomi)</strong>. The <strong>Ram Mandir</strong> holds immense spiritual significance for millions of Hindus. Ram Mandir was Inaugrated by <strong>Prime Minister of India</strong> on <strong>22 January 2024</strong>.",
            "Afterwards We will visit <strong>Nageshwarnath Temple</strong>, established in the name of the local deity, Lord Nageshwarnath, the <strong>Nageshwarnath Temple</strong> is located adjacent to the Theri Bazaar in Ayodhya. It is believed to have been set up by <strong>Kush or Kusha, Lord Rama's son</strong>.",
            "After That you will visit <strong>Sita Ki Rasoi</strong> (Kitchen of Mother Sita) and <strong>Kanak Bhawan</strong>, this temple is also known as <strong>Sone-ka-Ghar</strong> (House of Gold). It is a holy site dedicated to the Hindu deity <strong>Lord Rama and his wife</strong>, Goddess Sita.",
            "Afterwards We will drive to <strong>Lucknow</strong>."
          ],
          stay: "Dinner And Overnight Stay at Hotel"
        },
        {
          day: "Day 06",
          title: "Ayodhya - Delhi (Flight) - Haridwar (Drive 240Km/4Hr)",
          activities: [
            "Morning Post Breakfast We will drive to <strong>Ayodhya Airport</strong> to board Flight to <strong>Delhi</strong>.",
            "Upon arrival at <strong>Delhi Airport</strong>, Our Representative will meet & greet you and then we will transfer to Haridwar.",
            "On Arrival at <strong>Haridwar</strong> first we will check in at Hotel and do some rest.",
            "After some rest by evening will participate to the spectacular Ganga Aarti performed on the River bank <strong>Har-Ki-Pauri</strong> by a group of priest. A spectacle of sound and colour is seen when thousands of diyas, floral floats with lamps and incense on the river, commemorating their deceased ancestral."
          ],
          stay: "Dinner & Overnight Stay at Hotel"
        },
        {
          day: "Day 07",
          title: "Full Day Haridwar (Sightseeing)",
          activities: [
            "Morning Post Breakfast we will proceed to visit <strong>Mansa Devi Temple</strong> located on hill top <strong>Bilwa</strong> and will reach there by <strong>cable car</strong> and cable ride offers a picturesque view of the mountain and it is believed that with visit to <strong>Mansa Devi</strong> temple fulfils your desire.",
            "Afterwards we will visit <strong>Daksheswar Mahadev Temple</strong> is a holy place for Hindus in Haridwar. It is dedicated to <strong>Lord Shiva</strong> and has several shrines, including one for <strong>Daksha Prajapati</strong>, Shiva's father-in-law.",
            "Later we will visit <strong>Maya Devi Mandir</strong>, It is a revered Hindu temple dedicated to <strong>Goddess Maya</strong>. This ancient temple holds great religious importance and is a popular pilgrimage site known for its serene atmosphere and intricate architecture, attracting devotees and tourists alike seeking blessings and spiritual solace."
          ],
          stay: "Dinner & Overnight stay at Hotel."
        },
        {
          day: "Day 08",
          title: "Haridwar – Rishikesh (Sightseeing) - Delhi & Depart",
          activities: [
            "Morning post breakfast we will drive to <strong>Rishikesh</strong>.",
            "On arrival first we will vist <strong>Triveni Ghat</strong>, Ghat mean bank of river and <strong>Triveni Ghat</strong> is one of the largest and most renowned Ghats of the Rishikesh, which makes it one of the busiest ghat as well.",
            "Next you will see <strong>Hemkund Sahid</strong>, here the Sikh devotees had built a very beautiful Gurdwara where food and tea is served day and night.",
            "Next we will visit to <strong>Ram Jhula & Laxmian Jhula</strong> (Swinging bridge / subject to operational), 450 meter long bridge is built in 1939 and it’s around at height of 70 feet from the river. We will also visit to <strong>Tera Manzil Temple</strong>, this 13-storey temple is clearly visible from the Lakshman Jhula.",
            "Afterwards will drive to <strong>delhi Airport</strong>.",
            "Now You will wait to board flight for your <strong>hometown</strong>.",
            "Thank you for taking a tour <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 3. Kashmir With Agra Tour 2025
    const kashmirAgra2025 = {
      title: "Kashmir With Agra Tour 2025",
      location: "Kashmir & Agra",
      duration: "7 Days / 6 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Alpine beauty of Kashmir mixed with Taj Mahal",
      intro: "Explore the scenic valleys of Gulmarg, Sonmarg, and Pahalgam, and conclude with the iconic Taj Mahal in Agra.",
      is_popular: 0,
      slug: "kashmir-with-agra-tour-2025",
      status: "active",
      included: [
        "06 nights accommodation.",
        "Breakfast & and dinner throughout the tour.",
        "Economy class Delhi- Srinagar–Delhi flight with 15 kg check-in and 7 kg hand luggage.",
        "Non-air-conditioned transport throughout the tour.",
        "A/C Transportation in Delhi.",
        "All expenses related to vehicles.",
        "01 Hour Shikara ride on the Dal Lake.",
        "Gondola cable car rides in Gulmarg (Phase-1).",
        "Monument entry, wildlife, and Red Cross entry fees.",
        "02 bottles of mineral water per person per day.",
        "All presently applicable taxes."
      ],
      excluded: [
        "Expenses of a personal nature like any soft and hard drinks, phone calls, camera fees, etc.",
        "Any sports/adventure activities in Srinagar/Pony ride etc.",
        "Local transportation in Pahalgam & Gulmarg.",
        "Indian Visa.",
        "International Airfare.",
        "Hiring clothes to visit Gulmarg.",
        "Any portage expense.",
        "Travel insurance."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrival Delhi (Flight TBA)",
          activities: [
            "Namaste and welcome to Delhi!!",
            "Upon arrival at Delhi airport, a SafeHands representative will warmly meet and assist you at the airport and accompany you to your hotel."
          ],
          stay: "<strong>Overnight stay at hotel</strong>"
        },
        {
          day: "Day 02",
          title: "Delhi – Srinagar (Flight) & Sightseeing",
          activities: [
            "Morning on-time transfer to the airport to board the flight for Srinagar, is famous for its Mughal gardens, such as Nishat Bagh, Shalimar Bagh, and Chashme Shahi, which are meticulously manicured and adorned with vibrant flowers and fountains. These gardens offer a tranquil retreat and showcase the architectural splendor of the Mughal era.",
            "Upon arrival at Srinagar airport, our representative will meet and transfer to the hotel.",
            "By afternoon will visit <strong>Mughal Gardens, Nishat Garden</strong> known as the <strong>'Garden of Pleasure'</strong> built in the 16th century (1633) by Mughal King Asif Khan. In the evening you take a <strong>shikhara ride on the world-famous Dal Lake</strong>, where you visit the floating vegetable gardens & Open Dal Lake. While riding the Shikara there are plenty of opportunities for bird watching with plentiful species including Kingfisher, Little Bittern, Common Pariah Kites, Grebe, etc.",
            "By evening will visit Adi Shankara Temple and later visit to shop to buy some local handicrafts particularly famous for Pashmina."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel</strong>"
        },
        {
          day: "Day 03",
          title: "Srinagar - Day trip to Gulmarg (Drive 50 Km / 02 Hrs)",
          activities: [
            "Morning post breakfast will drive to Gulmarg, called as <strong>“Meadow of Flowers”</strong>.",
            "On arrival visit the Gulmarg is not merely a mountain resort of exceptional beauty- it also has the highest green golf course in the world, at an altitude of 2,650 m, and is the country's premier ski resort in the winter. One Can go for the <strong>Gondola Ride up to 1st or 2nd Phase</strong>. The Gulmarg <strong>Gondola</strong> is a tourist attraction in itself. It is one of the highest cable cars in the world, reaching 3,979 metres.",
            "The <strong>Affarwat ridge</strong> at 3850+ metres offer an avalanche-controlled ski area that offers a wide field of snow to descend 800 m in approximately 3 km of skiing, and is for advanced skiers only. Due to <strong>Gulmarg's</strong> steep terrain, the region is popular amongst advanced and extreme skiers from around the world and has been visited by a number of ski professionals and featured in a number of ski films also.",
            "The <strong>Gulmarg Golf Course</strong> is situated on the lower ranges of Gulmarg. Though golfing began in this region as early as the early 1920s, the present-day structure designed by Ranjit Nanda – a well-known golf course designer – was inaugurated only in 2011 by Omar Abdullah, the then Chief Minister of Jammu and Kashmir.",
            "Later will drive back to Srinagar."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel</strong>"
        },
        {
          day: "Day 04",
          title: "Srinagar - Day trip to Sonmarg (Drive 80 Km / 02 Hrs)",
          activities: [
            "Morning post breakfast will check out and drive to <strong>Sonmarg</strong>, also known as \"Meadow of Gold,\".",
            "<strong>Sonamarg</strong> is renowned for its breathtaking natural beauty, with snow-covered mountains, pristine glaciers, and colorful flower-filled meadows. The region is surrounded by majestic <strong>Himalayan peaks, including Kolhoi Peak and Amarnath Peak</strong>. It serves as a gateway to the famous Amarnath Yatra, an annual pilgrimage to the holy Amarnath Cave.",
            "On arrival, you will proceed to visit <strong>Thajiwas. Thajiwas</strong> is known for its stunning natural beauty, especially its snow-covered peaks, glaciers, and picturesque landscapes. We can reach Thajiwas by taking a short pony ride or trekking through the scenic trails.",
            "During the summer months, <strong>Thajiwas</strong> is a popular spot for picnics and outdoor activities. The meadows and rolling hills surrounding Thajiwas offer opportunities for leisurely walks, pony rides, and enjoying the pleasant weather. Many tourists visit Thajiwas to experience the breathtaking views of snow-capped mountains, vibrant flowers, and gushing streams.",
            "After this will back to Srinagar."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel</strong>"
        },
        {
          day: "Day 05",
          title: "Srinagar – Pahalgam (Drive 100 km / 3Hrs)",
          activities: [
            "After breakfast drive to <strong>“Pahalgam”</strong> called as <strong>“Valley of Shepherds”</strong>. <strong>Pahalgam</strong> is situated at the confluence of the streams flowing from Sheshnag Lake and the Lidder River, <strong>Pahalgam</strong> (2,130 m) was once a humble shepherd's village with breathtaking views. Enjoy the nature & walk around the bank of river Lidder. Pahalgam is famous for some trekking routes also & is the base camp for <strong>Amarnath Pilgrimage</strong>.",
            "<strong>Pahalgam</strong> is also famous for Indian film Industry (<strong>Bollywood</strong>). Now it is Kashmir's premier resort, cool even during the height of summer when the maximum temperature does not exceed 25 Degree C. Upon arrival, check in to the pre-arranged Hotel. Early afternoon we will leave for <strong>Pahalgam</strong> sightseeing to explore the Beauty of <strong>“Pahalgam</strong>.",
            "One can go to <strong>Aru</strong> (10 kms from <strong>Pahalgam</strong>) which is a fine meadow of picturesque scenery and starting point of trekking of (<strong>Liddarwat, Kolahoi Glacier & Trsar Lake) & Betaab Valley</strong>. We will visit one of the valleys as proposed below.",
            "On arrival will take the local vehicle and proceed for visit <strong>ARU VALLEY, BETAAB VALLEY, CHANDANWARI</strong>."
          ],
          stay: "<strong>Dinner & Overnight Stay at Hotel.</strong>"
        },
        {
          day: "Day 06",
          title: "Pahalgam – Srinagar (Drive 100 km/ 4 hrs) – Delhi (Flight) – Agra (230km/4Hrs)",
          activities: [
            "Morning at leisure and enjoy the beauty of Pahalgam.",
            "post breakfast will check out and drive to Srinagar airport to board the flight for Delhi.",
            "Upon arrival at Delhi airport, Our representative will warmly meet and assist you at the airport and drive to Agra.",
            "<strong>Agra</strong> is the home of one of the most Agra, the capital city during the Mughal period is famous for it's love story which lead to the establishment of the one of the seven wonders of the world. It is the hosting city of three <strong>UNESCO</strong> sites as it is glorified with the presence and <strong>Taj Mahal</strong> is one of them."
          ],
          stay: "<strong>Dinner & Overnight Stay at hotel</strong>"
        },
        {
          day: "Day 07",
          title: "Agra - Delhi & Depart (Drive 210 km/ 04 hrs)",
          activities: [
            "We will start our day by exploring the <strong>Taj Mahal, (Closed on Friday)</strong> at Sunrise, this beautiful monument looks most beautiful when golden Sun rays create magic on the white marble dome. The entry gate to the Taj Mahal opens at Sunrise with a long queue during morning hours therefore we will reach at least 30 minutes before sunrise to be there on time to get the best glimpse of the Taj Mahal. <strong>(Note: Except for your passport & and camera nothing is allowed inside even water, You will get a bottle of water along with the tickets so don’t carry anything)</strong>. To protect the monument from pollution our vehicle will be parked around a km before and from there either we can walk or have a Tanga ride or we can also have the battery bus. Taj Mahal is built in a huge complex and it would take around two hours to visit and then return to the hotel to have our breakfast.",
            "After breakfast will drive to <strong>Delhi Airport</strong>.",
            "Upon arrival in Delhi, You will board to Flight for your <strong>Hometown</strong>.",
            "Thank you for taking a tour with us. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!",
            "<strong>Our tour concludes: SafeHands Travels thank you for your patronage and ensures a punctual transfer to the Airport for onward travel.</strong>"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 4. Kashmir With Golden Triangle Tour Package
    const kashmirGT = {
      title: "Kashmir With Golden Triangle Tour Package",
      location: "Kashmir, Delhi, Agra & Jaipur",
      duration: "9 Days / 8 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Scenic Kashmir combined with Delhi, Agra & Jaipur",
      intro: "The ultimate North India tour: witness Srinagar, Gulmarg, and Pahalgam, and drive through Delhi, Agra, and Jaipur.",
      is_popular: 1,
      slug: "kashmir-with-golden-triangle-tour-package",
      status: "active",
      included: [
        "08 nights accommodation.",
        "Breakfast & and dinner throughout the tour.",
        "Non-air-conditioned transport throughout the tour.",
        "Local transportation in Pahalgam & Gulmarg.",
        "A/C Transportation in Delhi.",
        "All expenses related to vehicles.",
        "01 Hour Shikara ride on the Dal Lake.",
        "Gondola cable car rides in Gulmarg (Phase-1).",
        "Monument entry, wildlife, and Red Cross entry fees.",
        "02 bottles of mineral water per person day.",
        "All presently applicable taxes."
      ],
      excluded: [
        "Expenses of a personal nature like any soft and hard drinks, phone calls, camera fees, etc.",
        "Any sports/adventure activities in Srinagar/Pony ride etc.",
        "Economy class Delhi- Srinagar–Delhi flight with 15 kg check-in and 7 kg hand luggage.",
        "Indian Visa.",
        "International Airfare.",
        "Hiring clothes to visit Gulmarg.",
        "Any portage expense.",
        "Travel insurance."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrival Delhi (Flight TBA)",
          activities: [
            "Namaste and welcome to Bharat.",
            "Upon arrival at Delhi airport, a SafeHands representative will warmly meet and assist you at the airport and accompany you to your hotel.",
            "Overnight stay at hotel"
          ],
          stay: "Overnight stay at hotel"
        },
        {
          day: "Day 02",
          title: "Delhi – Srinagar (Flight) & Sightseeing",
          activities: [
            "Morning on-time transfer to the airport to board the flight for Srinagar, is famous for its Mughal gardens, such as Nishat Bagh, Shalimar Bagh, and Chashme Shahi, which are meticulously manicured and adorned with vibrant flowers and fountains. These gardens offer a tranquil retreat and showcase the architectural splendor of the Mughal era.",
            "Upon arrival at Srinagar airport, our representative will meet and transfer to the hotel.",
            "By afternoon will visit Mughal Gardens, Nishat Garden known as the <strong>'Garden of Pleasure'</strong> built in the 16th century (1633) by Mughal King Asif Khan. In the evening you take a <strong>shikhara ride on the world-famous Dal Lake</strong>, where you visit the floating vegetable gardens & Open Dal Lake. While riding the Shikara there are plenty of opportunities for bird watching with plentiful species including Kingfisher, Little Bittern, Common Pariah Kites, Grebe, etc.",
            "By evening will visit Adi Shankara Temple and later visit to shop to buy some local handicrafts particularly famous for Pashmina."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 03",
          title: "Srinagar - Day trip to Gulmarg (Drive 50 Km / 02 Hrs)",
          activities: [
            "Morning post breakfast will drive to Gulmarg, called as <strong>“Meadow of Flowers”</strong>.",
            "On arrival visit the Gulmarg is not merely a mountain resort of exceptional beauty- it also has the highest green golf course in the world, at an altitude of 2,650 m, and is the country's premier ski resort in the winter. One Can go for the <strong>Gondola Ride up to 1st or 2nd Phase</strong>. The Gulmarg <strong>Gondola</strong> is a tourist attraction in itself. It is one of the highest cable cars in the world, reaching 3,979 metres.",
            "The <strong>Affarwat ridge</strong> at 3850+ metres offer an avalanche-controlled ski area that offers a wide field of snow to descend 800 m in approximately 3 km of skiing, and is for advanced skiers only. Due to <strong>Gulmarg's</strong> steep terrain, the region is popular amongst advanced and extreme skiers from around the world and has been visited by a number of ski professionals and featured in a number of ski films also.",
            "The <strong>Gulmarg Golf Course</strong> is situated on the lower ranges of Gulmarg. Though golfing began in this region as early as the early 1920s, the present-day structure designed by Ranjit Nanda – a well-known golf course designer – was inaugurated only in 2011 by Omar Abdullah, the then Chief Minister of Jammu and Kashmir.",
            "Later will drive back to Srinagar."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 04",
          title: "Srinagar - Day trip to Sonmarg (Drive 80 Km / 02 Hrs)",
          activities: [
            "Morning post breakfast will check out and drive to <strong>Sonmarg</strong>, also known as \"Meadow of Gold,\".",
            "<strong>Sonamarg</strong> is renowned for its breathtaking natural beauty, with snow-covered mountains, pristine glaciers, and colorful flower-filled meadows. The region is surrounded by majestic <strong>Himalayan peaks, including Kolhoi Peak and Amarnath Peak</strong>. It serves as a gateway to the famous Amarnath Yatra, an annual pilgrimage to the holy Amarnath Cave.",
            "On arrival, you will proceed to visit <strong>Thajiwas. Thajiwas</strong> is known for its stunning natural beauty, especially its snow-covered peaks, glaciers, and picturesque landscapes. We can reach Thajiwas by taking a short pony ride or trekking through the scenic trails.",
            "During the summer months, <strong>Thajiwas</strong> is a popular spot for picnics and outdoor activities. The meadows and rolling hills surrounding Thajiwas offer opportunities for leisurely walks, pony rides, and enjoying the pleasant weather. Many tourists visit Thajiwas to experience the breathtaking views of snow-capped mountains, vibrant flowers, and gushing streams.",
            "After this will back to Srinagar."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 05",
          title: "Srinagar – Pahalgam (Drive 100 km / 3Hrs)",
          activities: [
            "After breakfast drive to <strong>“Pahalgam”</strong> called as <strong>“Valley of Shepherds”</strong>. <strong>Pahalgam</strong> is situated at the confluence of the streams flowing from Sheshnag Lake and the Lidder River, <strong>Pahalgam</strong> (2,130 m) was once a humble shepherd's village with breathtaking views. Enjoy the nature & walk around the bank of river Lidder. Pahalgam is famous for some trekking routes also & is the base camp for <strong>Amarnath Pilgrimage</strong>.",
            "<strong>Pahalgam</strong> is also famous for Indian film Industry (<strong>Bollywood</strong>). Now it is Kashmir's premier resort, cool even during the height of summer when the maximum temperature does not exceed 25 Degree C. Upon arrival, check in to the pre-arranged Hotel. Early afternoon we will leave for <strong>Pahalgam</strong> sightseeing to explore the Beauty of <strong>“Pahalgam</strong>.",
            "One can go to <strong>Aru</strong> (10 kms from <strong>Pahalgam</strong>) which is a fine meadow of picturesque scenery and starting point of trekking of (<strong>Liddarwat, Kolahoi Glacier & Trsar Lake) & Betaab Valley</strong>. We will visit one of the valleys as proposed below.",
            "On arrival will take the local vehicle and proceed for visit <strong>ARU VALLEY, BETAAB VALLEY, CHANDANWARI</strong>."
          ],
          stay: "Dinner & Overnight Stay at Hotel."
        },
        {
          day: "Day 06",
          title: "Pahalgam – Srinagar – Delhi (Flight) – Agra (Drive)",
          activities: [
            "Morning at leisure and enjoy the beauty of Pahalgam.",
            "post breakfast will check out and drive to Srinagar airport to board the flight for Delhi.",
            "Upon arrival at Delhi airport, Our representative will warmly meet and assist you at the airport and drive to Agra.",
            "<strong>Agra</strong> is the home of one of the most Agra, the capital city during the Mughal period is famous for it's love story which lead to the establishment of the one of the seven wonders of the world. It is the hosting city of three <strong>UNESCO</strong> sites as it is glorified with the presence and <strong>Taj Mahal</strong> is one of them."
          ],
          stay: "Dinner & Overnight Stay at hotel"
        },
        {
          day: "Day 07",
          title: "Agra – Abhaneri – Jaipur (Drive 250 km / 05 Hrs.)",
          activities: [
            "We will start our day by exploring the <strong>Taj Mahal, (Closed on Friday)</strong> at Sunrise, this beautiful monument looks most beautiful when golden Sun rays create magic on the white marble dome. The entry gate to the Taj Mahal opens at Sunrise with a long queue during morning hours therefore we will reach at least 30 minutes before sunrise to be there on time to get the best glimpse of the Taj Mahal. <strong>(Note: Except for your passport & and camera nothing is allowed inside even water You will get along with the tickets so don’t carry anything)</strong>.",
            "<strong>Taj Mahal</strong> is built in a huge complex and it would take around two hours to visit and then return to the hotel to have our <strong>breakfast</strong>.",
            "Later will drive to <strong>Jaipur</strong>.",
            "En-route will visit <strong>Abhaneri</strong> stepwell, Chand Baori, also known as Abhaneri Stepwell, is a massive 8th-9th century step well in Rajasthan, India with 3,500 steps over 13 stories extending 30 meters deep. Further, we drive to <strong>Jaipur</strong>."
          ],
          stay: "Dinner & Overnight stay at hotel."
        },
        {
          day: "Day 08",
          title: "Jaipur Sightseeing",
          activities: [
            "Today will start our sightseeing at around 8.00 am and proceed first to <strong>Hawa Mahal (Palace of Winds)</strong>, its beautiful 5 storeys façade having Jharokhsa (Smalls window) just besides the market road so your vehicle wouldn't stop for more long and quickly clicks your photos.",
            "Next we will proceed to <strong>Amer Fort</strong> is a magnificent 16th-century fort in Jaipur, India. Known for its intricate architecture, it's a UNESCO World Heritage Site. The fort boasts beautiful courtyards, gardens, and stunning views of the Maota Lake.",
            "Next will visit <strong>City Palace</strong>, the part of palace is converted into the museum and part is still a Royal residence and only museum part is open for public to visit.",
            "Next to Palace will visit the impressive <strong>Jantar Mantar UNESCO site</strong>, which is an observatory containing 19 astronomical objects dating back to the time of <strong>Rajput King Sawai Jai Singh</strong>. It is world famous for its sundial along with other astronomical objects.",
            "Your Jaipur tour will be incomplete if you don’t visit the <strong>market</strong> may not for shopping but to experience and live the local life for a while, the colorful market, people"
          ],
          stay: "Dinner & Overnight Stay At Hotel."
        },
        {
          day: "Day 09",
          title: "Jaipur - Delhi Sightseeing & Depart",
          activities: [
            "Morning post breakfast will drive to Delhi and will begin our tour from <strong>Old Delhi</strong> with remarkable monument <strong>Red Fort (From outside)</strong>, built by the Mughal emperor Shah Jahan in 1638 and <strong>Jama Masjid</strong> located across the road.",
            "We will walk through the streets to see marvelous architectural vision and appreciate the work of some 5000 unknown artisans behind these great monuments. Further we will enjoy the <strong>rickshaw ride</strong> through various markets of <strong>Chandni Chowk</strong>",
            "By afternoons we will reach Lutyen's Delhi and drive pass to <strong>India Gate</strong> which was built in the year 1931 to commemorate the Indian soldiers who died in the World War I & the Afghan Wars, and President House, the official residence of President of India, formally known as the viceroy's house during British rule.",
            "Being lunch time now, we will taste some Indian food and proceed to five storey victory tower <strong>Qutab Minar</strong> built in 1193 by the founder of slave dynasty Qutab-ud-din-Aibak.",
            "Finally we will conclude Delhi sightseeing with <strong>Akshardham temple</strong> (closed on Monday) a Hindu temple complex displaying millennia of traditional Hinduism, Indian culture, spirituality, and architecture.",
            "After that transfer to <strong>Airport to Board your Flight to Your Hometown.</strong>"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 5. Kedarnath Baba Yatra 2026 Group Tour
    const kedarnathGroup2026 = {
      title: "Kedarnath Baba Yatra 2026 Group Tour By SafeHands Travels",
      location: "Kedarnath, Rishikesh, Haridwar",
      duration: "7 Days / 6 Nights",
      price: "RM 1755",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Group pilgrimage to Kedarnath Temple",
      intro: "Join our group pilgrimage to the divine temple of Kedarnath, nestled high in the Himalayas, starting from Delhi.",
      is_popular: 1,
      slug: "kedarnath-baba-yatra-2026-group-tour",
      status: "active",
      included: [
        "06 Nights' Accommodation on Double Sharing Basis.",
        "Breakfast & Dinner (No beverages included).",
        "Transportation as per program. (AC will be off during drive in hilly areas).",
        "All expenses related to vehicle and driver like toll tax, interstate tax, fuel, and driver's allowance.",
        "Local English-speaking guide in Rishikesh & Haridwar.",
        "Assistance by the priest to perform prayer in Kedarnath.",
        "All taxes"
      ],
      excluded: [
        "Any air fare or train fare & Any meals other than those specified in program.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Expenses of personal nature such as tips, telephone calls, laundry, liquor, medication etc.",
        "Portages, Ponies, Dolis during trekking to Kedarnath.",
        "Any cost incurred due to a change in the program due to unforeseen circumstances.",
        "Any other item not specified in 'cost includes'."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "ARRIVAL DELHI",
          activities: [
            "Namaste & Welcome India!!",
            "Upon arrival at Delhi airport, our representative will meet and assist you and transfer to your hotel in delhi for smooth check in."
          ],
          stay: "Overnight stay at Hotel."
        },
        {
          day: "Day 02",
          title: "DELHI – RISHIKESH (260 KM DRIVE / 05 HR)",
          activities: [
            "Early morning post breakfast at 07:30 Hrs you will drive to <strong>Rishikesh</strong>.",
            "<strong>Rishikesh</strong> has a rich spiritual heritage and is renowned for its ashrams (spiritual retreats), yoga schools, and meditation centers. Many people visit Rishikesh to engage in yoga and meditation practices, learn from experienced teachers, and immerse themselves in the serene and spiritual atmosphere.",
            "<strong>IMP: To visit Kedarnath and Badrinath your vehicle needs a fitness certificate and permission to visit there. Therefore, upon arrival, your driver will visit the permission center to complete the permit formalities.</strong>",
            "Upon arrival you will check into hotel.",
            "Later proceed to visit <strong>Ram Jhula</strong> in Rishikesh is a famous suspension bridge over the Ganga, & <strong>Bajrang Setu</strong> is a new glass suspension bridge on the Ganga, designed to replace Lakshman Jhula and attract travelers with spiritual vibes, panoramic views, and a unique glass-walk experience.",
            "In Evening you will go for <strong>Ganga Aarti at Parmarth Niketan</strong> in Rishikesh is a serene evening ritual on the banks of the Ganga, filled with devotional songs, Vedic chants, and the glow of countless diyas reflecting on the river."
          ],
          stay: "Dinner & Overnight stay at Hotel."
        },
        {
          day: "Day 03",
          title: "RISHIKESH – GUPTKASHI (DRIVE 220 KM / 06 HRS)",
          activities: [
            "Morning post breakfast will drive to <strong>Guptkashi</strong>, the last point upto the place your vehicle can reach.",
            "Upon arrival in <strong>Guptkashi</strong>, check in at your hotel.",
            "<strong>Guptkashi</strong>, situated at an elevation of 1829 m is famous a site where <strong>Lord Shiva and Goddess Parvati were married</strong>. Flanked by nature's bounty and glorious snow capped peaks, it is also a place where River Mandakini meets River Basuki. It is a belief that devotees can achieve Baikunth Dham with the touch of water.",
            "You can also visit <strong>Kashi Vishwanath Temple</strong> in Guptkashi is an ancient Shiva shrine on the Kedarnath route, revered as a Himalayan counterpart of the famous <strong>Kashi Vishwanath in Varanasi</strong>."
          ],
          stay: "Dinner & Overnight stay at Hotel."
        },
        {
          day: "Day 04",
          title: "GUPTKASHI – GOURIKUND - KEDARNATH (18 KM TREK)",
          activities: [
            "Today early morning will drive to reach to <strong>Gaurikund</strong>, your driver will assist you and from Gaurikund will start our trek to <strong>Kedarnath</strong>. Since it is long 18 km trek which normally takes -6-7 hours depending upon your speed.",
            "<strong>KEDARNATH: The Kedarnath shrine, one of the 12 jyotirlingas of Lord Shiva, is a scenic spot situated, against the backdrop of the majestic Kedarnath range. Kedar is another name of Lord Shiva, the protector and the destroyer.</strong>",
            "According to legend, the <strong>Pandavas</strong> built the <strong>Kedarnath Temple</strong> after the <strong>Kurukshetra war</strong> to seek Lord Shiva's forgiveness for their sins. Pursuing <strong>Shiva</strong>, who appeared as a bull and vanished into the ground, they enshrined his hump as the <strong>Jyotirlinga</strong> at this Himalayan site.",
            "On arrival at Kedarnath, will check in at the hotel.",
            "Later will proceed for a visit to the <strong>Kedarnath Baba temple.</strong>",
            "<strong>(Any expenses related to VIP darshan; prayer will be paid by the guests only)</strong>"
          ],
          stay: "Dinner & Overnight stay at Guest House."
        },
        {
          day: "Day 05",
          title: "KEDARNATH – GAURIKUND - Guptkashi(18 KM TREK)",
          activities: [
            "In the morning will proceed to visit <strong>Bhairav Baba Temple</strong>, located about 800 meters uphill from <strong>Kedarnath Temple</strong>, is dedicated to <strong>Bhairavnath</strong>, the fierce guardian form of <strong>Lord Shiva</strong>. Known as the <strong>Kshetrapal</strong>, it protects the <strong>Kedarnath</strong> shrine and valley during winter closures.",
            "Afterwards you will visit <strong>Adi Shankaracharya Samadhi</strong> in Kedarnath marks the site where the 8th-century philosopher attained samadhi at age 32, behind the main <strong>Kedarnath Temple</strong>.",
            "Later back to your Hotel.",
            "After breakfast will trek to Gaurikund.",
            "On arrival in Gaurikund, you will meet with your driver and drive to your Hotel..",
            "Upon Arrival at Hotel Check In & Relax."
          ],
          stay: "Dinner & Overnight stay at Hotel"
        },
        {
          day: "Day 06",
          title: "SONPRAYAG – HARIDWAR (Drive 160 KM / 5 HRS)",
          activities: [
            "Today morning after breakfast drive to <strong>Haridwar</strong>.",
            "<strong>Haridwar</strong>, it is situated on the banks of the <strong>Ganges River</strong> and is considered one of the seven holiest places in Hinduism. The name <strong>\"Haridwar\"</strong> means \"Gateway to God,\" and the city is a major pilgrimage site for Hindus.",
            "Upon Arrival Check into Hotel.",
            "Afterwards you will visit <strong>Mansa Devi Temple</strong> in Haridwar, perched atop Bilwa Parvat in the Shivalik Hills, is a revered Shakti Peeth dedicated to Goddess Mansa, who fulfills devotees' wishes",
            "In Evening you will go for <strong>Ganga Aarti</strong> at <strong>Har Ki Pauri</strong> in <strong>Haridwar</strong> is a mesmerizing evening ritual where priests perform prayers with fire lamps, bells, and chants to honor <strong>Goddess Ganga</strong>. Held daily at sunset on the sacred ghat steps, it draws thousands of devotees who float diyas on the river amid a vibrant display of lights and devotion."
          ],
          stay: "Dinner & Overnight stay at Hotel ."
        },
        {
          day: "Day 07",
          title: "HARIDWAR –DELHI (260 KM / 05 HRS.) & DEPART",
          activities: [
            "Morning Breakfast at the Hotel.",
            "Afterwards you will start your drive to <strong>Delhi</strong>.",
            "Upon arrival at <strong>Delhi</strong> if you want you can do last minute shopping. <strong>Delhi</strong> offers vibrant shopping from bustling street markets like <strong>Chandni Chowk</strong> for spices and jewelry, <strong>Sarojini Nagar</strong> for trendy export surplus clothes, and <strong>Karol Bagh</strong> for bridal wear. Upscale spots such as <strong>Khan Market</strong> feature luxury brands and boutiques, while <strong>Lajpat Nagar</strong> excels in fabrics and ethnic outfits at bargain prices.",
            "Afterwards you will be transferred to <strong>Delhi Airport</strong> to board your flight to your <strong>Hometown</strong>.",
            "Thank you for choosing <strong>SafeHands Travels</strong> for your tour. We are very happy to serve you and ensure a memorable journey. Looking forward to welcoming you on your next trip with us."
          ],
          stay: "THANK YOU"
        }
      ]
    };

    // 6. South India Religious Tour
    const southIndiaReligious = {
      title: "South India Religious Tour",
      location: "Chennai, Tirupati, Kanchipuram, Madurai & Rameshwaram",
      duration: "9 Days / 8 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Sacred South India Temples Pilgrimage",
      intro: "Visit the highly revered temples of Southern India, including Tirupati, Kanchipuram silk city, Rameshwaram, and Madurai.",
      is_popular: 1,
      slug: "south-india-religious-tour",
      status: "active",
      included: [
        "08 nights' accommodation.",
        "Daily Breakfast & Dinner throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Monument fees.",
        "Local Tour Guide.",
        "02 bottles of mineral water per person per day."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Any Airfare or Train Fare."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Chennai - Tirupati (By drive 140 km/3 hrs)",
          activities: [
            "Welcome to <strong>India</strong>!!",
            "Upon arrival at <strong>Chennai</strong> airport, a SafeHands representative will warmly meet and assist you at the arrival lounge of the airport and accompany you to your Vehicle.",
            "Afterwards we will drive to <strong>Tirupati</strong> is renowned for the <strong>Sri Venkateshwara Temple</strong>, one of the most visited and revered pilgrimage sites in India. The temple is situated on the seven hills of <strong>Tirumala</strong>, also known as the <strong>\"Saptagiri\" hills</strong>. The temple complex is a magnificent example of Dravidian architecture, featuring intricate carvings, sculptures, and ornate gopurams (gateway towers).",
            "Later we will drive to hotel."
          ],
          stay: "Overnight stay at hotel"
        },
        {
          day: "Day 02",
          title: "Tirupati - Kanchipuram (110 km/2Hrs)",
          activities: [
            "Morning Post Breakfast we will drive to <strong>Kanchipuram</strong>, a city known as the <strong>\"City of Thousand Temples.\"</strong> Kanchipuram is an ancient city that has been a center of religious, cultural, and educational importance for centuries. The city is renowned for its temples dedicated to various Hindu deities, as well as its rich heritage in silk weaving..",
            "Upon Arrival at <strong>Kanchipuram</strong>, we will proceed to visit <strong>Ekambareswarar Temple</strong>. This temple is dedicated to <strong>Lord Shiva</strong> and is known for its impressive <strong>Rajagopuram</strong> (main gateway tower) and intricate sculptures.",
            "Later we will visit <strong>Kailasanathar Temple</strong>. This temple, built in the 8th century, is one of the oldest in Kanchipuram. It features exquisite carvings and sculptures on its walls and pillars.",
            "Next temple we will proceed to visit <strong>Kamakshi Amman Temple</strong>. This temple is dedicated to the <strong>Goddess Kamakshi</strong>, an avatar of <strong>Parvati</strong>. The temple is known for its architectural beauty and spiritual significance.",
            "And today last temple we will visit <strong>Varadaraja Perumal Temple</strong>. This temple is dedicated to <strong>Lord Vishnu</strong> and is known for its beautiful sculptures and paintingst.",
            "Later we will drive to <strong>hotel</strong>."
          ],
          stay: "Dinner & Overnight stay at Hotel."
        },
        {
          day: "Day 03",
          title: "Kanchipuram - Thiruvannamalai (110 km/2Hrs)",
          activities: [
            "Morning post breakfast we will drive <strong>Thiruvannamalai</strong>, a town known for its spiritual significance and the Arunachaleswara Temple. The temple is dedicated to Lord Shiva and is one of the largest temples in India, covering an area of about 10 hectares.",
            "Upon arrival in <strong>Thiruvannamalai</strong>, you will visit the <strong>Arunachaleswara Temple</strong>, which is known for its impressive <strong>Rajagopuram</strong> and the <strong>Annamalai Hills</strong>, which are considered sacred. The temple is also known for its association with the famous saint and philosopher, <strong>Ramana Maharshi</strong>, who lived in the nearby Virupaksha Cave.",
            "You will have the opportunity to explore the <strong>temple complex</strong>, learn about its history and significance, and participate in the rituals and ceremonies performed at the site.",
            "Later we will visit some of the ashrams and spiritual centers in Thiruvannamalai, such as the <strong>Ramana Ashram</strong> and the <strong>Seshadri Swamigal Ashram</strong>.",
            "Later we will drive to hotel."
          ],
          stay: "Dinner & Overnight stay at hotel."
        },
        {
          day: "Day 04",
          title: "Thiruvannamalai - Kumbakonam (180 km/4Hrs)",
          activities: [
            "Morning Post Breakfast we will drive to <strong>Kumbakonam</strong>, a town known for its numerous ancient temples and its rich heritage in art and culture. Kumbakonam is located in the <strong>Cauvery delta region</strong> and is known as the <strong>\"temple town\"</strong> of Tamil Nadu.",
            "Upon arrive at will visit <strong>Kumbakonam Sarangapani Temple</strong>. This temple is dedicated to Lord Vishnu and is known for its beautiful sculptures and paintings.",
            "Next Temple we will visit <strong>Kumbeswarar Temple</strong>. This temple is dedicated to Lord Shiva and is known for its impressive <strong>Rajagopuram and intricate carvings</strong>.",
            "Later we will visit <strong>Adi Kumbeswarar Temple</strong>. This temple is dedicated to Lord Shiva and is known for its association with the famous saint and philosopher, Appar.",
            "Later we will drive to hotel."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 05",
          title: "Kumbakonam- Rameshwaram (270 km/5-6Hrs)",
          activities: [
            "Morning post breakfast will drive to <strong>Rameshwaram</strong>, a sacred island known for the <strong>Ramanathaswamy Temple</strong> and its religious significance in Hindu mythology. Rameshwaram is located at the tip of the <strong>Pamban Island</strong> and is connected to the mainland by the <strong>Pamban Bridge</strong>.",
            "Upon arrival in Rameshwaram, you will visit the <strong>Ramanathaswamy Temple</strong>, which is dedicated to Lord Shiva. The temple is known for its long corridors with 1,212 ornate pillars and its beautiful sculptures. You will also visit the <strong>Agnitheertham</strong>, a sacred tank where pilgrims take a dip before entering the temple.",
            "Later we will visit <strong>Dhanushkodi</strong>, a ghost town located at the tip of the island. <strong>Dhanushkodi</strong> was once a thriving town but was destroyed by a cyclone in 1964.",
            "Today, it is a popular tourist destination for its scenic beauty and spiritual significance.",
            "Later we will drive to hotel."
          ],
          stay: "Dinner And Overnight Stay at Hotel"
        },
        {
          day: "Day 06",
          title: "Rameshwaram - Madurai (150 km/3Hrs)",
          activities: [
            "Morning post breakfast we will drive to <strong>Madurai</strong>, a city known for the <strong>Meenakshi Amman Temple</strong> and its <strong>rich heritage</strong> in art and culture. Madurai is one of the oldest continuously inhabited cities in India and has been a center of learning and culture for centuries.",
            "In Madurai, you will visit the <strong>Meenakshi Amman Temple</strong>, which is dedicated to Goddess Meenakshi, an avatar of Parvati. The temple is known for its impressive Rajagopuram and intricate sculptures.",
            "You will also visit the <strong>Thirumalai Nayak Palace</strong>, a magnificent example of Indo-Islamic architecture, and the <strong>Gandhi Museum</strong>, which showcases the life and legacy of Mahatma Gandhi.",
            "You will have the opportunity to explore these sites, learn about their history and significance, and participate in the rituals and ceremonies performed at the temple.",
            "Later we will drive to hotel."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 07",
          title: "Madurai- Day trip to Palani (100 km / 2Hrs/one way)",
          activities: [
            "Morning post breakfast we will take a day trip to <strong>Palani</strong>, a town known for the <strong>Dandayudhapani Swamy Temple</strong>, which is dedicated to <strong>Lord Murugan</strong>. Palani is located about 100 km from Madurai and the drive will take approximately 2 hours each way.",
            "Upon arrival in <strong>Palani</strong>, you will visit the <strong>Dandayudhapani Swamy Temple</strong>, which is situated on a hilltop. The temple is known for its scenic beauty and spiritual significance. You will have the opportunity to explore the temple complex, learn about its history and significance, and participate in the rituals and ceremonies performed at the site.",
            "After your temple visit, you will have some free time to explore the town and its surroundings. You may also visit the <strong>Palani Hills</strong>, which offer panoramic views of the town and the surrounding countryside.",
            "Later we back to Madurai."
          ],
          stay: "Dinner & Overnight stay at hotel"
        },
        {
          day: "Day 08",
          title: "Madurai- Trichy (125 km/3Hrs)",
          activities: [
            "Morning post breakfast we will drive to will drive to <strong>Trichy</strong>, a city known for the <strong>Sri Ranganathaswamy Temple</strong> and its <strong>rich heritage in art and culture</strong>. Trichy is located on the banks of the Cauvery River and is known as the \"Rock Fort City\" due to the presence of a massive rock fort in the heart of the city.",
            "Upon arrival we will visit the <strong>Sri Ranganathaswamy Temple</strong>, which is dedicated to Lord Vishnu. The temple is known for its impressive <strong>Rajagopuram and intricate sculptures</strong>.",
            "Next will also visit the <strong>Rock Fort Temple</strong>, which is situated on top of a 273-foot-high rock. The temple offers panoramic views of the city and the surrounding countryside.",
            "You will have the opportunity to explore these sites, learn about their history and <strong>significance</strong>, and <strong>participate</strong> in the rituals and ceremonies performed at the temple.",
            "Later we will drive to hotel."
          ],
          stay: "Dinner & Overnight stay at hotel."
        },
        {
          day: "Day 09",
          title: "Trichy – Airport & Depart",
          activities: [
            "Morning post breakfast we will drive to <strong>Trichy Airport</strong> to board Flight to Hometown.",
            "Thank you for taking a tour <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 7. Special Offer - Kashi Ayodhya & Prayagraj Tour via Lucknow 2026
    const kashiLucknow2026 = {
      title: "Special Offer - Kashi Ayodhya & Prayagraj Tour via Lucknow 2026",
      location: "Varanasi, Ayodhya, Prayagraj & Lucknow",
      duration: "5 Days / 4 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Special promotion tour starting from Lucknow",
      intro: "Embark on our special offer 5-day tour to Kashi, Ayodhya, and Prayagraj via Lucknow.",
      is_popular: 1,
      slug: "special-offer-kashi-ayodhya-prayagraj-tour-via-lucknow-2026",
      status: "active",
      included: [
        "04 nights' accommodation.",
        "Daily Breakfast throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Evening Ganga Aarti on the River Ganges in Varanasi.",
        "Evening Aarti at River Saryu in Ayodhya.",
        "Monument fees (One time).",
        "Assistance by English / Tamil-Speaking Hindu priest in Varanasi for ancestors' prayer.",
        "Assistance For Visa.",
        "02 bottles of mineral water in the car per person / per day.",
        "All Taxes."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature i.e. Mini Bar, Laundry, Drinks.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Airfare for the sector Delhi – Ayodhya (Lucknow).",
        "Airfare for the sector Varanasi – Delhi with 15 kg check-in luggage."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Lucknow",
          activities: [
            "Welcome to <strong>BHARAT</strong>.",
            "Upon arrival at <strong>Lucknow airport</strong>, a SafeHands representative/Driver will warmly meet , greet and assist you at the arrival lounge of the airport.",
            "Later you will drive to your hotel, Check in at hotel"
          ],
          stay: "<strong>Overnight stay at hotel.</strong>"
        },
        {
          day: "Day 02",
          title: "Lucknow - Varanasi (Drive 320 Km / 05 Hrs)",
          activities: [
            "Morning Post Breakfast drive to Varanasi.",
            "<strong>Varanasi</strong> or <strong>Banaras</strong> or <strong>Kashi</strong>, are the various names of one of the most ancient living cities of the world. Known for narrow lanes, chanting monks, illuminated ghats and aimless crowd searching for their own rendezvous with meaning of life, Varanasi is definitely a completely different experience to be enthralled with.",
            "Upon Arrival you will visit <strong>Swardev Mahamandir</strong> like a lotus blooming beside the holy Ganges, stands Swarved Mahamandir. Imagine a dazzling white structure, seven stories high, shimmering in the sunlight. It's the world's biggest <strong>meditation center</strong>, welcoming <strong>20,000</strong> seekers at once!.",
            "Afterwards check in at the <strong>Hotel</strong> and take some rest.",
            "By evening will get ready to experience one of the most spectacular experiences of <strong>Ganga Aarti (Prayer)</strong> by crossing the narrow lanes of the city. You will return to your hotel post <strong>Ganga Aarti</strong> via same narrow lanes with rickshaw ride."
          ],
          stay: "<strong>Dinner & Overnight Stay at Hotel</strong>"
        },
        {
          day: "Day 03",
          title: "In Varanasi (Sightseeing)",
          activities: [
            "Today, you we will get up early in the morning before <strong>sunrise for a boat ride</strong> on the river <strong>Ganges</strong>. You will board the boat and sail through from the <strong>Assi Ghat</strong> till <strong>Manikarnika Ghat</strong>, the biggest cremation ground.",
            "Afterwards we will visit <strong>Kashi Vishwanath Temple</strong>. One among the 12 <strong>Jyotirlingas, Kashi Vishwanath Temple</strong> is one of the most renowned temples of Varanasi. Known as the golden temple dedicated to Lord Shiva, it acts as a core of faith for millions of Hindus.",
            "<strong>Today you can also do special prayers performed by the priest as per your requirements (Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest).</strong>",
            "We will also visit the other important temples like <strong>Vashalakshi temple, Annapurna mata temple, Sankatmochan (Hanuman) temple, Tulsi Mata temple and Bhairav baba temple</strong>."
          ],
          stay: "<strong>Dinner & Overnight stay at hotel.</strong>"
        },
        {
          day: "Day 04",
          title: "Varanasi – Prayagraj - Ayodhya (Drive 170 Km / 04 Hrs)",
          activities: [
            "Morning Post Breakfast we will drive to Prayagraj.",
            "You will drive to <strong>Prayagraj</strong> earlier known as <strong>Allahabad</strong>, another important destination for the Hindu Pilgrimage. Prayagraj is famous for <strong>Sangam</strong> which is the confluence of three rivers <strong>Ganga, Yamuna, and the mythical river Saraswathy</strong>.",
            "Upon arrival in <strong>Prayagraj</strong>, will reach to Sangam by Boat and your tour guide will assist you to safely reach there and have a <strong>Holy Dip In the Sangam</strong>.",
            "Later will return by boat and will have the darshan of Lord <strong>Hanuman Jee</strong> near Sangam.",
            "By evening will visit <strong>Alopi Devi Shakti Peeth Temple which is one of Shakti Peeth of Mata from their 51 Shaktipeethas. On Navratris this temple have more popularity & crowd</strong>.",
            "Continue drive to <strong>Ayodhya</strong> – Arrival and check in at your hotel"
          ],
          stay: "<strong>Dinner & Overnight Stay at Hotel.</strong>"
        },
        {
          day: "Day 05",
          title: "Ayodhya Sightseeing – Lucknow & Depart",
          activities: [
            "Post Breakfast our representative/tour guide will meet you & proceed to visit <strong>Hanuman Garhi, Ayodhya</strong>, a 10th-century temple dedicated to the Hindu God, Hanuman. It is customary to visit <strong>Hanuman Garhi Before</strong> visiting the <strong>Ram Temple</strong> in Ayodhya. It is believed that <strong>Lord Hanuman</strong> lived at the temple site guarding <strong>Ayodhya</strong>.",
            "Continue visit to <strong>Ram Mandir (Ram Janam Bhoomi)</strong>. The <strong>Ram Mandir</strong> holds immense spiritual significance for millions of Hindus. Which was inaugurated on 22 January 2024.",
            "Later you will visit <strong>Kanak Bhawan</strong>, this temple is also known as Sone-ka-Ghar (House of Gold). It is a holy site dedicated to the Hindu deity <strong>Lord Rama and his wife</strong>, Goddess Sita.",
            "Afterwards our vehicle will drop you at <strong>Lucknow Airport</strong> to board a flight to your hometown.",
            "Thank you for taking a tour from <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    // 8. Varanasi Ayodhya & Prayagraj Tour
    const varanasiAyodhyaPrayagraj = {
      title: "Varanasi Ayodhya & Prayagraj Tour",
      location: "Varanasi, Ayodhya & Prayagraj",
      duration: "5 Days / 4 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Spiritual highlights of Kashi, Ayodhya, and Prayagraj",
      intro: "This 5-day tour covers the absolute spiritual essentials of Varanasi, Ayodhya, and Prayagraj.",
      is_popular: 0,
      slug: "varanasi-ayodhya-prayagraj-tour",
      status: "active",
      included: [
        "04 Nights' Accommodation.",
        "Daily Breakfast & Dinner throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Early Morning Boat ride on the River Ganges in Varanasi.",
        "Boat Ride In Triveni Sangam (Prayagraj Allahabad).",
        "Chair For Ganga Aarti on the River Ganges in Varanasi.",
        "Evening Aarti at River Saryu in Ayodhya.",
        "VIP Darshan ticket to Kashi Vishwanath temple & Ram Mandir.",
        "Monument fees (One time).",
        "English-Speaking Local tour guide in each city.",
        "Rickshaw Ride In Varanasi & Ayodhya.",
        "02 bottles of mineral water in the car per person / per day.",
        "All Taxes."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of personal nature like i.e. Mini Bar, Laundry, Drinks.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Anything not mentioned in cost inclusions."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Varanasi (By Flight TBA)",
          activities: [
            "Upon arrival in <strong>Varanasi</strong> SafeHands Travels Representative/Driver will meet and greet you. Afterwards you will drive to Hotel.",
            "Upon arrival at Hotel you will check in & rest.",
            "<strong>Varanasi</strong> or <strong>Banaras</strong> or <strong>Kashi</strong>, are the various names of one of the most ancient living cities of the world. Known for narrow lanes, chanting monks, illuminated ghats and aimless crowd searching for their own rendezvous with meaning of life, Varanasi is definitely a completely different experience to be enthralled with.",
            "In Evening you will go for <strong>The Ganga Aarti</strong> in Varanasi is a mesmerizing evening ritual at <strong>Dashashwamedh Ghat</strong>, where seven priests in saffron robes perform synchronized offerings to the sacred <strong>River Ganges</strong> using brass lamps, incense, and rhythmic chants, creating a symphony of fire, sound, and devotion just after sunset.",
            "This 45-minute spectacle draws thousands of tourists for its vibrant energy, with flames dancing against the darkening sky and floating diyas illuminating the river."
          ],
          stay: "Overnight Stay at Hotel."
        },
        {
          day: "Day 02",
          title: "Varanasi Sightseeing",
          activities: [
            "Early morning drive to Ghat to experience <strong>Dwan Boat Ride</strong> on the river <strong>Ganges</strong>. You will board the boat and sail through from the <strong>Assi Ghat</strong> till <strong>Manikarnika Ghat</strong>, the biggest cremation ground.",
            "Afterwards First you will visit <strong>Kaal Bhairav Temple</strong> in <strong>Varanasi</strong> is one of the oldest and most revered shrines dedicated to Lord Shiva’s fierce form, Bhairava, known as the guardian deity or <strong>‘Kotwal’ of Kashi</strong>.",
            "Next You will visit <strong>Kashi Vishwanath Temple</strong>. One among the 12 Jyotirlingas, Kashi Vishwanath Temple is one of the most renowned temples of Varanasi.",
            "Then Return to the hotel for Breakfast.",
            "Afterwards you will visit <strong>Vashalakshi Temple, Annapurna Mata Temple, SankatMochan Hanuman Temple and Tulsi Manas Temple</strong>.",
            "<strong>Today you can also do special prayers performed by the priest as per your requirements (Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest).</strong>"
          ],
          stay: "Overnight Stay at hotel."
        },
        {
          day: "Day 03",
          title: "Varanasi - Prayagraj – Ayodhya ( 200 Kms/5 Hours)",
          activities: [
            "Morning post Breakfast drive to Prayagraj.",
            "You will drive to <strong>Prayagraj</strong> earlier known as <strong>Allahabad</strong>, another important destination for the Hindu Pilgrimage. Prayagraj is famous for <strong>Sangam</strong> which is the confluence of three rivers <strong>Ganga, Yamuna, and the mythical river Saraswathy</strong>.",
            "Upon arrival you will reach to <strong>Sangam</strong> middle part where 3 rivers meet to have a Holy Dip.",
            "Afterwards You will have Darshan of <strong>Lord Hanuman Jee</strong> near Sangam. (Tuesdays are a busy day at this temple).",
            "Afterwards you will visit <strong>Alopi Devi Shakti Peeth Temple which is one of Shakti Peeth of Mata from their 51 Shaktipeethas. On Navratris this temple have more popularity & crowd</strong>.",
            "Continue drive to <strong>Ayodhya</strong> – Arrival and check in at your hotel"
          ],
          stay: "Overnight Stay at Hotel."
        },
        {
          day: "Day 04",
          title: "Ayodhya ( Full day sightseeing )",
          activities: [
            "Post Breakfast our representative/tour guide will meet you & proceed to visit <strong>Hanuman Garhi, Ayodhya</strong>, a 10th-century temple dedicated to the Hindu God, Hanuman.",
            "It is one of the most important temples in Ayodhya as it is customary to visit <strong>Hanuman Garhi Before</strong> visiting the <strong>Ram Temple</strong> in Ayodhya. It is believed that <strong>Lord Hanuman</strong> lived at the temple site guarding <strong>Ayodhya</strong>.",
            "Continue visit to <strong>Ram Mandir (Ram Janam Bhoomi)</strong>. The <strong>Ram Mandir</strong> holds immense spiritual significance for millions of Hindus. Which was inaugurated on 22 January 2024.",
            "Later you will visit <strong>Sita Ki Rasoi</strong> (Kitchen of Mother Sita) and <strong>Kanak Bhawan</strong>, this temple is also known as Sone-ka-Ghar (House of Gold). It is a holy site dedicated to the Hindu deity <strong>Lord Rama and his wife</strong>, Goddess Sita.",
            "By evening will join the <strong>Aarti at the Sarayu River</strong>, which is a soul-stirring experience that fosters a sense of spiritual connection and devotion among the devotees."
          ],
          stay: "Overnight stay at hotel."
        },
        {
          day: "Day 05",
          title: "Ayodhya Airport Drop & Depart",
          activities: [
            "<strong>Breakfast</strong> at hotel",
            "Last time you can do some shopping Ayodhya offers a vibrant shopping experience with bustling local markets like <strong>Ram Ki Paidi and Chowk Bazaar</strong>, where visitors can find a wide range of <strong>religious souvenirs, handicrafts, and traditional textiles</strong>. The city is famous for its devotional items such as idols, puja essentials, and Ayodhya-themed keepsakes that reflect its spiritual heritage.",
            "Afterwards our vehicle will drop you at <strong>Ayodhya Airport to</strong> board a flight to your <strong>hometown</strong>.",
            "Thank you for taking a tour <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    const remainingTrips = [
      kashiLucknow2025,
      kashiHaridwarRishikesh,
      kashmirAgra2025,
      kashmirGT,
      kedarnathGroup2026,
      southIndiaReligious,
      kashiLucknow2026,
      varanasiAyodhyaPrayagraj
    ];

    for (const trip of remainingTrips) {
      const query = `
        INSERT INTO trips (
          title, location, duration, price, 
          image_url, subtitle, intro, is_popular, slug, status,
          itinerary, included, not_included
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.query(query, [
        trip.title, trip.location, trip.duration, trip.price,
        trip.image_url, trip.subtitle, trip.intro, trip.is_popular, trip.slug, trip.status,
        JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded)
      ]);
    }
    
    console.log("✅ All remaining 8 trips inserted successfully with rich text and bold tags!");
  } catch (error) {
    console.error('❌ Failed to insert remaining trips:', error);
  } finally {
    process.exit(0);
  }
}

insertAllRemaining();
