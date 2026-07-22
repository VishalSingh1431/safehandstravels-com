import pool from '../config/database.js';

async function insertBatch3() {
  try {
    const doDhamHelicopter = {
      title: "Do Dham Yatra By Charter Helicopter 2025",
      location: "Kedarnath & Badrinath",
      duration: "5 Days / 4 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Helicopter pilgrimage to Kedarnath and Badrinath",
      intro: "An exclusive helicopter tour to the sacred Do Dham shrines - Kedarnath and Badrinath, starting from Dehradun.",
      is_popular: 1,
      slug: "do-dham-yatra-by-charter-helicopter-2025",
      status: "active",
      included: [
        "04 Nights' accommodation.",
        "Daily Breakfast & Dinner throughout the tour.",
        "Exclusive Helicopter services from Dehradun (Sahastradhara Helipad) to the Do Dham shrines & back.",
        "Local Sight Seeing with our guides at both destinations.",
        "VIP Darshans at shrines.",
        "Shri Kedarnath ji helicopter shuttle services: Sersi – Kedar - Sersi.",
        "Helicopter handling charges.",
        "Taxes, facilitation charges of various authorities & other Government levy.",
        "All expenses related to the vehicle.",
        "02 bottles of mineral water in the car per person / per day."
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature i.e. Mini Bar, Laundry, Drinks.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "IMP – Domestic flights allows 15kg Luggage Only."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Delhi",
          activities: [
            "Welcome to <strong>Delhi</strong>!!",
            "Upon arrival at <strong>Lucknow airport</strong>, a SafeHands representative/Driver will warmly meet , greet and assist you at the arrival lounge of the airport.",
            "Later you will drive to your <strong>hotel</strong>, Check in at hotel .",
            "<strong>Overnight stay at hotel.</strong>"
          ],
          stay: "Overnight stay at hotel"
        },
        {
          day: "Day 02",
          title: "Delhi – Dehradun (Flight)",
          activities: [
            "Morning Post Breakfast there will be a transfer from Hotel to Airport to Board the flight to <strong>Dehradun</strong>.",
            "<strong>Dehradun</strong> is a notable academic and research hub, home to several educational and research institutions, including the <strong>Indian Military Academy</strong> and the <strong>Forest Research Institute</strong>.",
            "The city is also a popular tourist destination, known for its natural beauty, including <strong>botanical gardens, waterfalls, and mountain peaks</strong>.",
            "On Arrival at <strong>Dehradun Airport</strong> Our Representative/Driver will meet you and transfer to the pre booked <strong>Hotel</strong> & help you in smooth check in."
          ],
          stay: "Dinner & Overnight Stay At Hotel."
        },
        {
          day: "Day 03",
          title: "Dehraun – Kedarnath – Guptkashi (By Helicopter)",
          activities: [
            "Morning Post Breakfast We will reach to <strong>Sahastradhara Helipad</strong>.",
            "On arrival at <strong>Sahastradhara Helipad</strong>, we fly to <strong>Sersi Helipad</strong>. Then we again fly/continue to Kedarnath from same Helipad. Temple is approx. 500 meters away from helipad and will take approx. 15 min to reach.",
            "Our representative will accompany the group and lead us for the <strong>VIP darshan</strong> at <strong>Kedarnath temple</strong>. After darshan and Poojan, the group will fly back to Sersi helipad.",
            "We will have lunch & Overnight stay at <strong>Guptkashi</strong> located at the banks of the river Mandakini."
          ],
          stay: "Dinner & Overnight Stay at Hotel."
        },
        {
          day: "Day 04",
          title: "Guptkashi – Badrinath (By Helicopter)",
          activities: [
            "Morning Post Breakfast The group is headed towards the <strong>Helipad</strong> at Sersi.",
            "From the <strong>Helipad</strong> we proceed to <strong>Badrinath ji</strong>. On arrival at <strong>Badrinath Helipad</strong>, the group will be Check-In to the hotel.",
            "After Lunch, we will be going to <strong>Mana village</strong>, the last border village of India with China for sightseeing.",
            "In the evening, Passengers will attend <strong>Swarna Aarti</strong> at Badrinath temple & then take dinner and overnight stay at <strong>Badrinath</strong>."
          ],
          stay: "Dinner & Overnight Stay at Hotel."
        },
        {
          day: "Day 05",
          title: "Badrinath – Dehradun (By Helicopter) - Delhi (Flight & Depart)",
          activities: [
            "After the breakfast, while we are heading back to Dehradun, we will see the beautiful overview of the Region, especially the picturesque view of the confluences, which is an eye-candy for nature lovers.",
            "We will fly between the beautiful valleys of thick forest and over five confluences like <strong>Vishnu Prayag, Nanda Prayag, Karna Prayag, Rudra Prayag and Dev Prayag</strong>. We will come back and drop to helipad.",
            "Afterwards <strong>We will drive to Airport to Board Flight to Delhi</strong> & After that we will board flight to your hometown.",
            "Thank you for taking a tour <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
          ],
          stay: "Tour concludes"
        }
      ]
    };

    const doDhamYatra2026 = {
      title: "Do Dham Yatra Tour 2026",
      location: "Kedarnath & Badrinath",
      duration: "9 Days / 8 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Scenic pilgrimage to Kedarnath and Badrinath",
      intro: "Embark on a spiritual journey of a lifetime to the twin Himalayan shrines of Kedarnath and Badrinath.",
      is_popular: 0,
      slug: "do-dham-yatra-tour-2026",
      status: "active",
      included: [
        "08 Nights' Accommodation on Double Sharing Basis.",
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
          day: "Day 07",
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
          day: "Day 08",
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
          day: "Day 09",
          title: "HARIDWAR –DELHI Shopping & Depart",
          activities: [
            "Morning Breakfast at the Hotel.",
            "Afterwards you will start your drive to <strong>Delhi</strong>.",
            "Upon arrival at <strong>Delhi</strong> if you want you can do last minute shopping. <strong>Delhi</strong> offers vibrant shopping from bustling street markets like <strong>Chandni Chowk</strong> for spices and jewelry, <strong>Sarojini Nagar</strong> for trendy export surplus clothes, and <strong>Karol Bagh</strong> for bridal wear. Upscale spots such as <strong>Khan Market</strong> feature luxury brands and boutiques, while <strong>Lajpat Nagar</strong> excels in fabrics and ethnic outfits at bargain prices.",
            "Afterwards you will be transferred to <strong>Delhi Airport</strong> to board your flight to your <strong>Hometown</strong>."
          ],
          stay: "THANK YOU"
        }
      ]
    };

    const kashiStandard2026 = {
      title: "Kashi Ayodhya & Prayagraj Tour Standard 2026",
      location: "Varanasi, Ayodhya & Prayagraj",
      duration: "5 Days / 4 Nights",
      price: "On Request",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Classic tour of Kashi, Ayodhya, and Prayagraj",
      intro: "Experience the timeless spirituality of Kashi, the sacred birthplace of Lord Rama in Ayodhya, and the holy confluence of Sangam in Prayagraj.",
      is_popular: 1,
      slug: "kashi-ayodhya-prayagraj-tour-standard-2026",
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
        "All Taxes"
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

    const kashiGroupTour2026 = {
      title: "Kashi Ayodhya & Prayagraj Tour Standard Group Tour 2026",
      location: "Varanasi, Ayodhya & Prayagraj",
      duration: "5 Days / 4 Nights",
      price: "RM 1290",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      subtitle: "Group tour of Kashi, Ayodhya, and Prayagraj",
      intro: "Join our spiritual group tour to the ancient town of Kashi, the birth site of Lord Rama in Ayodhya, and the confluence of holy rivers in Prayagraj.",
      is_popular: 0,
      slug: "kashi-ayodhya-prayagraj-tour-standard-group-tour-2026",
      status: "active",
      included: [
        "04 Nights' Accommodation.",
        "Daily Breakfast & Dinner throughout the tour.",
        "Air-conditioned transportation throughout the tour.",
        "All expenses related to the vehicle.",
        "Early Morning Boat ride on the River Ganges in Varanasi.",
        "Evening Ganga Aarti on the River Ganges in Varanasi.",
        "Evening Aarti at River Saryu in Ayodhya.",
        "VIP Darshan ticket to Kashi Vishwanath temple & Ram Mandir.",
        "Monument fees (One time).",
        "English-Speaking Local tour guide in each city.",
        "Assistance by priest for Ancestor Prayers.",
        "02 bottles of mineral water in the car per person / per day.",
        "All Taxes"
      ],
      excluded: [
        "Any meals other than those specified in the program.",
        "Expenses of person nature i.e. Mini Bar, Laundry, Drinks.",
        "Any Special prayer during the Trip.",
        "Any claim due to natural calamity, medical emergencies or evacuation.",
        "Anything not mentioned in cost inclusions."
      ],
      itinerary: [
        {
          day: "Day 01",
          title: "Arrive Varanasi (Drive 320 Km / 06 Hrs)",
          activities: [
            "Upon arrival in <strong>Varanasi</strong> check in at hotel .",
            "<strong>Varanasi</strong> or <strong>Banaras</strong> or <strong>Kashi</strong>, are the various names of one of the most ancient living cities of the world. Known for narrow lanes, chanting monks, illuminated ghats and aimless crowd searching for their own rendezvous with meaning of life, Varanasi is definitely a completely different experience to be enthralled with.",
            "Afterwards First you will visit <strong>Kaal Bhairav Temple in Varanasi</strong> is one of the oldest and most revered shrines dedicated to Lord Shiva’s fierce form, Bhairava, known as the guardian deity or <strong>‘Kotwal’ of Kashi</strong>.",
            "Later on visit of the city including temples, like <strong>Sankatmochan (Hanuman) Temple, Tulsi Mata Temple</strong>.",
            "Evening you will witness one of the most spectacular experiences of <strong>Ganga Aarti (Prayer)</strong> at River Ganga."
          ],
          stay: "Overnight Stay at Hotel."
        },
        {
          day: "Day 02",
          title: "Varanasi Sightseeing",
          activities: [
            "Early morning drive to Ghat to experience <strong>Dwan Boat Ride</strong> on the river <strong>Ganges</strong>. You will board the boat and sail through from the <strong>Assi Ghat</strong> till <strong>Manikarnika Ghat</strong>, the biggest cremation ground.",
            "Return to the hotel , Breakfast.",
            "You will visit <strong>Kashi Vishwanath Temple</strong>. One among the 12 Jyotirlingas, Kashi Vishwanath Temple is one of the most renowned temples of Varanasi. Afterwards you will visit <strong>Vashalakshi Temple, Annapurna Mata Temple</strong>.",
            "<strong>Today you can also do special prayers performed by the priest as per your requirements (Please confirm the particular prayer you would like to organise and for these prayers payment will be made directly to priest).</strong>",
            "Explore local Bazar & free walk in the evening"
          ],
          stay: "Overnight stay at hotel"
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

    const newTrips = [doDhamHelicopter, doDhamYatra2026, kashiStandard2026, kashiGroupTour2026];

    for (const trip of newTrips) {
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
    
    console.log("✅ Batch 3 (4 new trips) inserted successfully with rich text and bold tags!");
  } catch (error) {
    console.error('❌ Failed to insert Batch 3:', error);
  } finally {
    process.exit(0);
  }
}

insertBatch3();
