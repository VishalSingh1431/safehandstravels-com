import pool from '../config/database.js';

async function updateBatch2() {
  try {
    const goldenTriangleItinerary = [
      {
        day: "Day 01",
        title: "Arrival Delhi (Flight TBA)",
        activities: [
          "Namaste! Welcome to India!",
          "Upon arrival at Delhi international airport T3, a SafeHands Travels representative will assist you at the arrival lounge and accompany you to the hotel."
        ],
        stay: "Overnight stay - Hotel"
      },
      {
        day: "Day 02",
        title: "Delhi Sightseeing",
        activities: [
          "Morning post breakfast will proceed for Delhi sightseeing though the preferred time is 8.00 am. We will begin our tour from Old Delhi with remarkable monument <strong>Red Fort (From outside)</strong>, built by the Mughal emperor Shah Jahan in 1638 and <strong>Jama Masjid</strong> located across the road. We will walk through the streets to see marvelous architectural vision and appreciate the work of some 5000 unknown artisans behind these great monuments. Further we will enjoy the <strong>rickshaw ride</strong> through various markets of <strong>Chandni Chowk</strong>",
          "By afternoons we will reach Lutyen’s Delhi and drive pass to <strong>India Gate</strong> which was built in the year 1931 to commemorate the Indian soldiers who died in the World War I & the Afghan Wars, and President House, the official residence of President of India, formally known as the viceroy’s house during British rule.",
          "Being lunch time now, we will taste some Indian food and proceed to five storey victory tower <strong>Qutab Minar</strong> built in 1193 by the founder of slave dynasty Qutab-ud-din-Aibak.",
          "Finally we will conclude Delhi sightseeing with <strong>Akshardham temple</strong> (closed on Monday) a Hindu temple complex displaying millennia of traditional Hinduism, Indian culture, spirituality, and architecture."
        ],
        stay: "Dinner Overnight stay – Hotel"
      },
      {
        day: "Day 03",
        title: "Delhi – Agra (Drive 210 km/04 Hrs.)",
        activities: [
          "Morning post breakfast will drive to <strong>Agra</strong>, once the capital city during the Mughal period and the hosting city of three <strong>UNESCO</strong> sites <strong>Agra Fort</strong>, Fatehpur Sikri and Taj Mahal itself describes the glory of the city.",
          "On arrival check in at the hotel.",
          "After some rest and freshen up or if you are hungry, you have your lunch and by afternoon will go to visit 11th century <strong>Agra Fort</strong>, a famous walled city and one of the most grandeur forts of India.",
          "Approximate 75 % of the fort is closed for the tourists due to military establishment and even remaining portion is huge so be prepared for some long ascending walks.",
          "By evening we will visit to <strong>Mehtab Bagh</strong>, is a charbagh garden complex and one of the last Mughal gardens in Agra. It is located just north to the Taj Mahal and overlooks the Agra Fort and Yamuna river on the opposite side. Perfectly aligned with the gardens of Taj Mahal, Mehtab Bagh provides a picture-perfect view of the Taj from the fountain at the front of the entrance gate."
        ],
        stay: "Dinner Overnight stay at the hotel"
      },
      {
        day: "Day 04",
        title: "Agra – Abhaneri – Jaipur (Drive 250 km / 05 Hrs.)",
        activities: [
          "We will start our day by exploring the <strong>Taj Mahal, (Closed on Friday)</strong> at Sunrise, this beautiful monument looks most beautiful when golden Sun rays create magic on the white marble dome. The entry gate to the <strong>Taj Mahal</strong> opens at Sunrise with a long queue during morning hours therefore we will reach at least 30 minutes before sunrise to be there on time to get the best glimpse of the Taj Mahal. <strong>(Note: Except for your passport & and camera nothing is allowed inside even water You will get along with the tickets so don’t carry anything)</strong>. To protect the monument from pollution our vehicle will be parked around a km before and from there either we can walk or have a <strong>Tanga ride</strong> or we can also have the battery bus. Taj Mahal is built in a huge complex and it would take around two hours to visit and then return to the hotel to have our breakfast.",
          "Later will drive to <strong>Jaipur</strong>. En-route will visit <strong>Abhaneri stepwell</strong>, Chand Baori, also known as <strong>Abhaneri Stepwell</strong>, is a massive 8th-9th century step well in Rajasthan, India with 3,500 steps over 13 stories extending 30 meters deep. Further, we drive to <strong>Jaipur</strong>."
        ],
        stay: "Dinner & Overnight stay at hotel in Jaipur."
      },
      {
        day: "Day 05",
        title: "Jaipur Sightseeing",
        activities: [
          "Today will start our sightseeing at around 8.00 am and proceed first to <strong>Hawa Mahal (Palace of Winds)</strong>, its beautiful 5 storeys façade having Jharokhsa (Smalls window) just besides the market road so your vehicle wouldn’t stop for more long and quickly clicks your photos and proceed to <strong>Amer Fort</strong>.",
          "Upon arrival at <strong>Amer Fort</strong>, a large number of approximate 300 + elephants will be queued to offer rides to tourists. Approximate 700 meter ascending elephant ride is fully safe and you can enjoy your ride to reach uphill. Like other fort this fort too a large fort and you can see the Hindu architecture in the building.",
          "Next will visit <strong>City Palace</strong>, the part of palace is converted into the museum and part is still a Royal residence and only museum part is open for public to visit. Next to Palace will visit the impressive <strong>Jantar – Mantar</strong>, which is an observatory containing 19 astronomical objects dating back to the time of Rajput King Sawai Jai Singh. It is world famous for its sundial along with other astronomical objects. This UNESCO world heritage site also includes brass and stone instruments.",
          "Your Jaipur tour will be incomplete if you don’t visit the <strong>local markets</strong> not for shopping but to experience and live the local life for a while, the colorful market, people and Indian handicrafts will be fascinating and pose you some magnificent shots to capture in your camera. It would a good idea to spend some time here and as souvenirs you can buy handicrafts or cloths however I do not recommend you to buy any expensive items as it’s not guaranteed."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 06",
        title: "Jaipur – Delhi (260 km / 06 Hrs.) + Shopping & Departure",
        activities: [
          "Morning post breakfast drive <strong>Delhi</strong>.",
          "Upon arrival in Delhi, In case you are interested in some <strong>last-minute shopping</strong> by evening will organize a farewell dinner before we go off to each other we would be happy to know and discuss your experience about the India tour.",
          "Afterwards you will transfer to Delhi Airport to Board your Flight to Hometown.",
          "Our tour concludes: SafeHands Travels thank you for your patronage and ensures a punctual transfer to the Airport for onward travel"
        ],
        stay: "Tour concludes"
      }
    ];

    const southIndiaItinerary = [
      {
        day: "Day 01",
        title: "Arrive Bangalore Sightseeing",
        activities: [
          "Upon arrival at <strong>Bangalore</strong> airport, a SafeHands representative will warmly meet and assist you to Hotel.",
          "Afterwards you will visit to the sprawling <strong>Lalbagh Botanical Garden</strong>, a verdant oasis in the heart of the city. From delicate orchids to towering trees, Lalbagh showcases the incredible biodiversity of the region.",
          "Next, make your way to the iconic <strong>Bull Temple</strong>, a 16th-century shrine dedicated to Nandi, the sacred bull.",
          "Continue your exploration of Bangalore's rich history and architecture by visiting the <strong>Tipu Sultan's Summer Palace</strong>.",
          "In the afternoon, visit the <strong>Bangalore Palace</strong>, a stunning example of Indo-Saracenic architecture.",
          "Afterwards You will drive towards to the <strong>Mysore</strong>."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 02",
        title: "Bangalore Sightseeing",
        activities: [
          "Morning after breakfast You drive to <strong>Shri Gavi Gangadhareshwara Swamy Temple</strong>.",
          "This is an ancient cave temple dedicated to Lord Shiva believed to be built in the Vedic period, it was renovated in the 16th century by Kempe Gowda, the founder of Bangalore. The temple is famous for its mysterious stone discs and its architectural marvel.",
          "After this we shall head to <strong>Shree Kadu Mallikarjunaswamy Temple</strong>.",
          "Also known as Kadu Malleshwara Temple, it is a 17th-century shrine dedicated to Lord Shiva. Built in Dravidian style, it's one of Bangalore's oldest temples."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 03",
        title: "Bangalore - Mysore Sightseeing ( 124 KM/3Hrs)",
        activities: [
          "Morning after breakfast check-out and drive to <strong>Mysore</strong>.",
          "On Arriving <strong>Mysore</strong>, you shall head to visit the majestic <strong>Mysore Palace</strong>, a symbol of grandeur and architectural beauty.",
          "Next, head to the <strong>Chamundi Temple</strong>, a sacred site atop Chamundi Hill offering panoramic views of the city.",
          "After a morning of sightseeing, visit the enchanting <strong>Brindavan Gardens</strong>, famous for its musical fountain and vibrant floral displays."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 04",
        title: "Mysore - Ooty Sightseeing( 124 KM/3Hrs)",
        activities: [
          "Morning Post Breakfast we will drive to <strong>Ooty</strong>, also known as <strong>Udhagamandalam</strong>, is a popular hill station in the <strong>Nilgiri Hills</strong> of Tamil Nadu, India.",
          "<strong>First we visit Ooty Lake</strong> is a serene and picturesque water body that attracts visitors from far and wide. Spanning over 65 acres, the lake is surrounded by lush green hills and offers stunning views of the surrounding landscape. Visitors can enjoy boating on the calm waters, taking in the tranquil atmosphere and admiring the reflections of the hills on the lake's surface.",
          "Afterwards <strong>Doddabetta Peak</strong> offers an exhilarating hiking experience. Standing at an impressive height of 2,623 meters, the peak provides panoramic views of the Nilgiri Hills and the surrounding landscape, making it a popular destination for trekkers and mountaineers.",
          "Afterwards Ooty Botanical Garden is a lush, sprawling oasis that showcases the diverse flora of the Nilgiri Hills. Visitors can stroll through the well-manicured gardens, admiring the vibrant flowers, towering trees, and serene ponds that create a tranquil and picturesque setting."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 05",
        title: "Ooty - Coimbatore (85 km/2.5Hrs)",
        activities: [
          "Morning post breakfast will drive to <strong>Coimbatore</strong>.",
          "Upon Arrival in <strong>Coimbatore</strong> we will visit <strong>Marudhamalai Temple</strong> is a significant Hindu temple dedicated to <strong>Lord Murugan</strong>, known for its beautiful architecture and serene surroundings.",
          "Later will visit <strong>Isha Foundation</strong> is a spiritual organization located in Coimbatore, Tamil Nadu, India. Founded by Sadhguru, it is a sacred space for self-transformation where spiritual seekers gather to pursue their spiritual paths.",
          "The foundation is known for its unique blend of spirituality, ecology, and social service.",
          "After visiting these attractions, we would head to <strong>Perur pateeswarar temple</strong>, dating back 1500 years, is a historic Hindu temple in Coimbatore dedicated to <strong>Lord Shiva</strong>. Devotees visit to seek blessings and marvel at the intricate carvings and golden statues, especially during the annual Panguni Uthram festival."
        ],
        stay: "Dinner And Overnight Stay at Hotel"
      },
      {
        day: "Day 06",
        title: "Coimbatore - Trichy (248 km/ 4.5 Hrs)",
        activities: [
          "Morning Post Breakfast you will drive to <strong>Trichy</strong>.",
          "Upon Arrival We will visit <strong>Vekkaliamman Temple in Woraiyur, Trichy</strong>, is a sacred destination for spiritual seekers. This ancient temple is dedicated to <strong>Goddess Parvathi</strong> and is believed to have magical powers. The temple's unique feature is its absence of a roof, allowing the deity to be open to the sky.",
          "Next, explore the majestic <strong>Srirangam Temple</strong>, one of the largest functioning Hindu temples in the world, known for its intricate architecture and spiritual significance.",
          "Don't miss the serene <strong>Jambukeswarar Temple</strong>, dedicated to <strong>Lord Shiva</strong> and surrounded by a peaceful atmosphere perfect for reflection and prayer."
        ],
        stay: "Dinner & Overnight stay at hotel"
      },
      {
        day: "Day 07",
        title: "Trichy - Kumbakonam - Pondicherry (203 Km/3.5 Hrs)",
        activities: [
          "Morning post breakfast we will drive towards the <strong>Pondicherry</strong>.",
          "<strong>Enroute will visit Kumbakonam Temple</strong>, a sacred site in the heart of Tamil Nadu, is a must-visit attraction. This ancient temple complex is home to numerous shrines and temples, each with its own unique architectural style and spiritual significance.",
          "Upon arrival will visit <strong>Pondicherry Museum</strong>, which showcases the city's rich cultural heritage through its exhibits and artifacts.",
          "Afterwards will visit <strong>The Aurobindo Ashram</strong> Founded in 1926, the Sri Aurobindo Ashram is a spiritual community focused on achieving inner peace through a unique form of yoga. Visitors today seek spiritual growth, meditation, and to learn about Sri Aurobindo and The Mother's teachings."
        ],
        stay: "Dinner & Overnight stay at hotel"
      },
      {
        day: "Day 08",
        title: "Pondicherry - Chennai (166 km/3Hrs)",
        activities: [
          "Morning post breakfast we will drive <strong>Chennai</strong>.",
          "<strong>Enroute We will visit Auroville</strong>, a unique international town that embodies the spirit of unity and harmony.",
          "<strong>Afterwards we will visit Mahabalipuram</strong>, a historic port city in Tamil Nadu, is a must-visit destination for travelers. It is famous for its rock-cut shore temples, including the UNESCO World Heritage Site Shore Temple and the Five <strong>Rathas</strong>.",
          "Now it is time to mingle into the divinity imbibed in the air at <strong>KAPALPESWARAR TEMPLE</strong> flaunting its Dravidian style of sculptures and architecture and mingle with the localities at the Marine drive where the water flowing would fill your heart with joy."
        ],
        stay: "Dinner & Overnight stay at hotel."
      },
      {
        day: "Day 09",
        title: "Chennai – Day Trip to Kalahasti (116Km/3Hrs)",
        activities: [
          "Morning post breakfast we will drive to <strong>Kalahasti</strong>.",
          "A day trip to <strong>Kalahasti</strong> from <strong>Chennai</strong> is a spiritual journey that takes you to the sacred <strong>Sri Kalahasteeswara Temple</strong>, a UNESCO World Heritage Site. The temple is dedicated to <strong>Lord Shiva</strong> and is known for its architectural beauty and historical significance.",
          "The temple complex houses various deities, including Subramanya, Sad. The trip includes a visit to other temples and landmarks, making it a fulfilling day of spiritual exploration.",
          "By evening will back to <strong>Chennai</strong>."
        ],
        stay: "Dinner & Overnight Stay at Hotel"
      },
      {
        day: "Day 10",
        title: "Chennai Shopping & Depart & Depart",
        activities: [
          "<strong>Chennai</strong>, the capital of Tamil Nadu, is a shopper's paradise. The city offers a wide range of shopping options, from traditional markets to modern malls.",
          "One of the most popular shopping destinations is <strong>Pondy Bazaar</strong>, which is known for its vibrant street life and affordable prices. Here, you can find everything from clothing and accessories to home goods and souvenirs.",
          "After you done with your shopping then you will transfer to <strong>Airport</strong> to board flight to your <strong>Hometown</strong>.",
          "Thank you for taking a tour <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
        ],
        stay: "Tour concludes"
      }
    ];

    const chardhamItinerary = [
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
        title: "RISHIKESH – BARKOT (190 KM DRIVE / 05 HR)",
        activities: [
          "Today morning after breakfast, drive to <strong>Barkot</strong>,",
          "Enroute visiting <strong>Lakhamandal</strong>, is a place which is very famous for its <strong>Mahabharat</strong> Era's relation. According to legends <strong>Pandav</strong> used to stay here in the period of Agyatvas. And the most important <strong>Lakshagriha (Wax house)</strong> remains are here.",
          "Here is an ancient Hindu temple (dedicated to lord Shiva) which is very popular among Shakti cult. The temple is surrounded by beautiful mountains and Yamuna River.",
          "Afterwards continue drive to <strong>Barkot</strong>.",
          "Barkot is a small town situated at an elevation of 1,280 m on Mussoorie–Yamunotri road. The mesmerizing view of the peaks of Bandar Poonch which remains snow-capped throughout the year is sure to remain embedded in your mind forever.",
          "Upon arrival in <strong>Barkot</strong>, check-in at the hotel."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 04",
        title: "BARKOT - YAMUNOTRI - BARKOT",
        activities: [
          "Today, bit early in the morning drive to <strong>JankiChatti</strong>.",
          "From here start trek to <strong>Yamunotri</strong>. Either by walk or by mule or by palanquin on own expenses.",
          "<strong>Yamunotri</strong> is the source of the sacred river <strong>Yamuna</strong> that originates from the glacial lake of Saptarishi Kund, at an altitude of 4,421 meters. Dedicated to capricious <strong>Goddess Yamuna</strong>, this ancient temple has been a pilgrimage for centuries.",
          "This divine abode radiates spiritual purity, where steaming <strong>Surya Kund</strong> hot springs purify souls and the rhythmic chants invoke boundless blessings for moksha and prosperity.",
          "After completing your darshan then you will trek down to <strong>Janki Chatti</strong> and from there vehicle will pick you and drive to Hotel in <strong>Barkot</strong>."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 05",
        title: "BARKOT - UTTARKASHI",
        activities: [
          "Today morning after breakfast, drive to <strong>Uttarkashi</strong>.",
          "En route visits the <strong>Shiv Gufa</strong> Is a naturally formed cave at Mehargaon on the Yamunotri– Uttarkashi Road. In the cave, one can see a naturally formed <strong>Shivling</strong> – water naturally falls on top of it continuously. The Guha also has naturally formed ice sculptors of <strong>Shiva, Ganesha, Trishul, Lotus and Om</strong>.",
          "<strong>After visiting the cave continue your drive to Uttarkashi. Upon arrival, check in at hotel.</strong>",
          "In the evening visit <strong>Vishwanath Temple</strong> is the most important and ancient holy shrine in this region. Of the many temples in Uttarkashi, the temple of Lord Vishwanath is unrivalled in importance. <strong>Shiva</strong>, the presiding deity of this temple, is worshipped all day here.",
          "Every evening, visitors are greeted by the sound of bells, and the chanting of mantras by pundits at the puja within the courtyard of the <strong>Vishwanath temple</strong>.",
          "Later come back to hotel and relax."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 06",
        title: "UTTARKASHI - GANGOTRI - UTTARKASHI",
        activities: [
          "Today after early breakfast, drive to <strong>Gangotri</strong>.",
          "<strong>GANGOTRI TEMPLE: It is the highest and the most important temple of Goddess Ganga.</strong> Gangotri is a small town centered on the Gangotri Temple of Goddess Ganga.",
          "The origin of <strong>Bhagirathi River, Gaumukh</strong> glacier is 18 kms from <strong>Gangotri</strong> and one must cover the distance on foot. Gangotri offers scenic vistas of rugged terrains, gushing water of <strong>Bhagirathi River</strong> and snow clad peaks. The place holds great importance amongst Hindus.",
          "After visiting Gangori temple return to <strong>Uttarakashi</strong>.",
          "On the way enjoy picturesque <strong>Harshil Village</strong> is an unspoiled and hidden jewel of Uttarakhand state, situated in a picturesque valley inhabited by the Bhotia Tribes at an altitude of around 2620 meters. The Temperature of Harsil remains pleasant during summers and reaches the freezing point during winters."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 07",
        title: "UTTARKASHI – SONPRAYAG (DRIVE 220 KM / 06 HRS)",
        activities: [
          "Morning post breakfast will drive to <strong>Sonprayag</strong>, the last point upto the place your vehicle can reach.",
          "Upon arrival in <strong>Sonprayag</strong>, check in at your hotel.",
          "<strong>SONPRAYAG</strong>, situated at an elevation of 1829 m is famous a site where <strong>Lord Shiva and Goddess Parvati were married</strong>. Flanked by nature's bounty and glorious snow capped peaks, it is also a place where River Mandakini meets River Basuki. It is a belief that devotees can achieve Baikunth Dham with the touch of water.",
          "You can also visit <strong>Kashi Vishwanath Temple</strong> in Guptkashi is an ancient Shiva shrine on the Kedarnath route, revered as a Himalayan counterpart of the famous <strong>Kashi Vishwanath in Varanasi</strong>."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 08",
        title: "SONPRAYAG – GOURIKUND - KEDARNATH (18 KM TREK)",
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
        day: "Day 09",
        title: "KEDARNATH – GAURIKUND - SONPRAYAG (18 KM TREK)",
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
        day: "Day 10",
        title: "SONPRAYAG - BADRINATH (DRIVE 200 KM / 08 HRS)",
        activities: [
          "Today morning after breakfast will drive to Badrinath.",
          "<strong>BADRINATH: One of the 'Four Dhams' and one of the most celebrated pilgrimage spots of the country and is situated at an elevation of 3,133 meters, guarded on either side by the two mountain ranges known as Nar & Narayan with the towering Neelkanth Peak providing a splendid backdrop.</strong>",
          "Upon arrival you will check into your hotel.",
          "Afterwards you will go to <strong>Badrinath Temple</strong> for <strong>Lord Badrivishal</strong> is revered as Vaikuntha on Earth, where a single darshan is believed to cleanse lifetimes of karma and lead towards moksha.",
          "Afterwards return back to your Hotel."
        ],
        stay: "Dinner & Overnight stay at Hotel"
      },
      {
        day: "Day 11",
        title: "BADRINATH - RUDRAPRAYAG (DRIVE 200 KM / 08 HRS)",
        activities: [
          "Today morning after breakfast will drive to visit <strong>Mana Village</strong> which is the last village at Indo –china border. Also visit <strong>Bhimpul, Saraswati River, Vyas gufa, Ganesh Gufa</strong>, and other important sites.",
          "<strong>MANA VILLAGE</strong> is the last village at the Indio-/China border. Mana is inhabited by Indo-Mongolian tribes often called as Bhotias. It is being designated as a <strong>“Tourism Village”</strong> by the Uttarakhand Government. It is one of the best tourist destinations near Badrinath, just 03 km from drivable distance from <strong>Badrinath Town</strong>.",
          "<strong>Afterwards you will continue your drive to Rudraprayag. Enroute in Joshimath, the sacred Narsimha Temple enshrines Lord Narasimha, the fierce yet protective incarnation of Vishnu, who vanquished evil to safeguard devotee Prahlada.</strong>",
          "Later om continue your drive to <strong>Rudraprayag</strong>."
        ],
        stay: "Dinner & Overnight stay at Hotel"
      },
      {
        day: "Day 12",
        title: "RUDRAPRAYAG – HARIDWAR (Drive 160 KM / 5 HRS)",
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
        day: "Day 13",
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
    ];

    const kedarnathItinerary = [
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
        title: "RISHIKESH – SONPRAYAG (DRIVE 220 KM / 06 HRS)",
        activities: [
          "Morning post breakfast will drive to <strong>Sonprayag</strong>, the last point upto the place your vehicle can reach.",
          "Upon arrival in <strong>Sonprayag</strong>, check in at your hotel.",
          "<strong>SONPRAYAG</strong>, situated at an elevation of 1829 m is famous a site where <strong>Lord Shiva and Goddess Parvati were married</strong>. Flanked by nature's bounty and glorious snow capped peaks, it is also a place where River Mandakini meets River Basuki. It is a belief that devotees can achieve Baikunth Dham with the touch of water.",
          "You can also visit <strong>Kashi Vishwanath Temple</strong> in Guptkashi is an ancient Shiva shrine on the Kedarnath route, revered as a Himalayan counterpart of the famous <strong>Kashi Vishwanath in Varanasi</strong>."
        ],
        stay: "Dinner & Overnight stay at Hotel."
      },
      {
        day: "Day 04",
        title: "SONPRAYAG – GOURIKUND - KEDARNATH (18 KM TREK)",
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
        title: "KEDARNATH – GAURIKUND - SONPRAYAG (18 KM TREK)",
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
        title: "HARIDWAR –DELHI Shopping & Departure",
        activities: [
          "Morning Breakfast at the Hotel.",
          "Afterwards you will start your drive to <strong>Delhi</strong>.",
          "Upon arrival at <strong>Delhi</strong> if you want you can do last minute shopping. <strong>Delhi</strong> offers vibrant shopping from bustling street markets like <strong>Chandni Chowk</strong> for spices and jewelry, <strong>Sarojini Nagar</strong> for trendy export surplus clothes, and <strong>Karol Bagh</strong> for bridal wear. Upscale spots such as <strong>Khan Market</strong> feature luxury brands and boutiques, while <strong>Lajpat Nagar</strong> excels in fabrics and ethnic outfits at bargain prices.",
          "Afterwards you will be transferred to <strong>Delhi Airport</strong> to board your flight to your <strong>Hometown</strong>.",
          "Thank you for choosing <strong>SafeHands Travels</strong> for your tour. We are very happy to serve you and ensure a memorable journey. Looking forward to welcoming you on your next trip with us."
        ],
        stay: "THANK YOU"
      }
    ];

    const shirdi3DaysItinerary = [
      {
        day: "Day 01",
        title: "Chennai – Shirdi(Flight 14:40 Hrs – 16:40 Hrs )",
        activities: [
          "Upon Arrival at Shirdi Airport Our Driver/Representative will meet you at Airport.",
          "Then you will be drive to Hotel.",
          "If time allow we will have the pleasure of participating in the <strong>Evening Aarti</strong> ceremony at the <strong>Sai Baba Temple</strong>. During this special time, we can sing along with the devotional hymns, wave the lit camphor lamps, and feel the sense of community and connection as we honor Sai Baba together."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 02",
        title: "Shirdi – Local sightseeing",
        activities: [
          "After having the breakfast, we will head to temple for the darshan at <strong>Shri Sai Baba Sansthan Temple</strong>, a religious place in Shirdi, Maharashtra in India, that is dedicated to Shri Sai Baba, who is considered to be one of the greatest saints to have been born in India.",
          "Sai Baba is believed to have been blessed with unprecedented powers, and he is worshipped as God incarnate in the <strong>Shri Sai Baba Sansthan Temple</strong>.",
          "<strong>Khandoba temple:</strong> The Khandoba Temple in Shirdi is a significant religious site associated with Sai Baba's early days in Shirdi. This temple is dedicated to Lord Khandoba, considered to be another form of Lord Shiva, and is located on the main road in Shirdi."
        ],
        stay: "Overnight stay in the hotel."
      },
      {
        day: "Day 03",
        title: "Shirdi - Chennai (Flight) & Depart",
        activities: [
          "After having the breakfast at the hotel, we will drive to airport to board a flight to <strong>Chennai</strong>.",
          "Upon arrival at Chennai Airport you will wait for your flight to your hometown.",
          "Thank you for taking tour from <strong>SafeHands Travels</strong>. We are happy to organize your tour and will meet on next trip."
        ],
        stay: "Tour concludes"
      }
    ];

    const shirdi3JyotirlingaItinerary = [
      {
        day: "Day 01",
        title: "Arrival Mumbai",
        activities: [
          "Namaste! Welcome!",
          "Upon arrival at <strong>Mumbai airport</strong>, our representative will assist you at the arrival lounge. After receiving you at the airport the representative will take you to your hotel."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 02",
        title: "Mumbai – Nashik",
        activities: [
          "Today morning post breakfast will drive to <strong>Nashik</strong>, upon arrival check-in to hotel.",
          "Situated on the banks of the <strong>Godavari River, Nashik</strong> is an important pilgrimage site, famous for hosting the <strong>Kumbh Mela</strong> every twelve years, which attracts millions of devotees.",
          "The city is also recognized as the <strong>\"Wine Capital of India,\"</strong> as it houses many vineyards and wineries, contributing significantly to the country's wine production. Nashik features several notable temples, including the <strong>Trimbakeshwar Temple</strong>, which is one of the twelve Jyotirlingas, making it a key destination for Hindu worshippers."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 03",
        title: "Nashik – Trimbakeshwar - Aurangabad",
        activities: [
          "Today morning post breakfast will drive to <strong>Nashik</strong>, upon arrival check-in to hotel.",
          "Later afternoon will visit to <strong>Trimbakeshwar Jyotirlinga</strong>. This Shaiva temple is found at the foot of <strong>Brahmagiri Hills</strong>. Established by the <strong>Maratha ruler, Peshwa Nana Saheb</strong> in the 18th century, the temple is mentioned in the powerful Mrityunjaya Mantra that bestows immortality and longevity.",
          "It is unique among the Jyotirlingas as the Shivalinga here has three faces representing the Hindu trinity of <strong>Brahma, Vishnu and Shiva</strong>, all within a single linga.",
          "<strong>Trimbakeshwar</strong> is an important Hindu pilgrimage site, with the <strong>Kumbh Mela</strong> festival occurring here once every 12 years"
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 04",
        title: "Aurangabad – Grishneshwar - Shirdi",
        activities: [
          "Morning post-breakfast will to <strong>Ellora</strong> and proceed for darshan <strong>Grishneshwar Jyotirlinga</strong>, the temple is believed to have been built by the <strong>Maratha ruler, Ahilyabai Holkar</strong> in the 18th century.",
          "The temple complex consists of a central shrine, which houses the <strong>Jyotirlinga</strong>, and several smaller shrines and halls. The temple also has beautiful and intricate architecture, with intricate carvings, sculptures, and paintings adorning the walls and the ceilings.",
          "The temple is also a popular pilgrimage site and attracts many devotees each year, who come to worship the <strong>Jyotirlinga</strong> and offer prayers. The temple is also significant due to its historical significance and its association with the great <strong>Maratha ruler, Ahilyabai Holkar</strong>.",
          "If time permits can visit to <strong>Ellora Caves</strong>. Afterwards drive <strong>Shirdi</strong>."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 05",
        title: "Shirdi – Temple Tour",
        activities: [
          "Morning post breakfast proceed for proceed to Darshan <strong>Shri Sai Baba Sansthan Temple</strong>, a religious place in <strong>Shirdi</strong>, Maharashtra in India, that is dedicated to Shri Sai Baba, who is considered to be one of the greatest saints to have been born in India. <strong>Sai Baba</strong> is believed to have been blessed with unprecedented powers, and he is worshipped as God incarnate in the <strong>Shri Sai Baba Sansthan Temple</strong>. This is a must-visit holy place for all devotees of <strong>Sai Baba</strong> who wish to experience what pure tranquillity and bliss feel like and be closer to God for a while.",
          "Next will proceed to visit <strong>Dwarkamai</strong> is a mosque in Shirdi where Sai Baba spent a significant portion of his life. It is considered a sacred place by devotees and is known for the stone on which <strong>Sai Baba</strong> used to sit and the dhuni (sacred fire) that he maintained.",
          "Thereafter will proceed for visit <strong>Khandoba Temple</strong>, this temple is dedicated to <strong>Lord Khandoba</strong>, a regional deity. Sai Baba was also an ardent devotee of Lord Khandoba, and it is believed that he received the name \"Sai\" at this temple."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 06",
        title: "Shirdi – Bhimashankar – Mumbai",
        activities: [
          "Morning post breakfast will proceed to <strong>Bhimashankar temple</strong>, the temple is a well-known <strong>Jyotirlinga</strong> among the twelve Jyotirlingas situated all over India. The holy shrine of <strong>Bhimashankar</strong> is a work of Naga style of architecture. The temple brilliantly showcases the intelligent work of Vishwakarma sculptors of ancient times. Situated atop the hills, the place is perfect for all nature lovers and trekkers.",
          "According to Hindu mythology, the <strong>Bhimashankar Jyotirlinga</strong> originated as a divine column of light during a dispute between <strong>Lord Brahma and Lord Vishnu</strong>. The ancient temple, built around the 13th century, features intricate carvings, sculptures, and scenes from mythology.",
          "Later will continue driving to <strong>Mumbai</strong>. On arrival will check in at the hotel."
        ],
        stay: "Overnight Stay at Hotel."
      },
      {
        day: "Day 07",
        title: "Mumbai Sightseeing & Depart",
        activities: [
          "Morning post breakfast will proceed for visit <strong>The Gateway of India”</strong> was built during <u>British Rule</u> in <strong>Mumbai</strong> City. It is located on the waterfront in the <u>Apollo Bunder</u> area in <u>South Mumbai</u> and overlooks the <u>Arabian Sea</u>.",
          "Afterwards We will visit <strong>The Shri Siddhivinayak Ganapati Mandir</strong> is a famous Hindu temple dedicated to <strong>Lord Ganesha</strong>. It was originally built in 1801 by <strong>Laxman Vithu and Deubai Patil</strong>. The temple has a small mandap (hall) with the shrine for <strong>Siddhi Vinayak</strong>, meaning \"Ganesha who grants your wish\".",
          "The temple is known for its stunning architecture, with a dome-shaped shikhara (tower) and gold-plated kalash (finial) on top.",
          "Afterwards We will transfer to Airport to boar flight to your <strong>Hometown</strong>."
        ],
        stay: "Overnight Stay at Hotel."
      }
    ];

    const updates = [
      { slug: 'golden-triangle-tour-package-', data: goldenTriangleItinerary },
      { slug: 'south-india-leisure-tour-', data: southIndiaItinerary },
      { slug: 'char-dham-yatra-tour-2026-by-safehands-travels-', data: chardhamItinerary },
      { slug: 'kedarnath-dream-of-temple-', data: kedarnathItinerary },
      { slug: 'shirdi-3-days-2-nights-tour-', data: shirdi3DaysItinerary },
      { slug: 'shirdi-with-3-jyotirlinga-tour-7-days-6-nights-', data: shirdi3JyotirlingaItinerary }
    ];

    for (const update of updates) {
      await pool.query(
        "UPDATE trips SET itinerary = ? WHERE slug LIKE ?",
        [JSON.stringify(update.data), `${update.slug}%`]
      );
    }
    
    console.log("✅ Batch 2 (6 trips) updated successfully with rich text and bold tags!");
  } catch (error) {
    console.error('❌ Failed to update Batch 2:', error);
  } finally {
    process.exit(0);
  }
}

updateBatch2();
