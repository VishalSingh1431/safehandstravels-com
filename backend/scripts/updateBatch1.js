import pool from '../config/database.js';

async function updateBatch1() {
  try {
    const rajasthanItinerary = [
      {
        day: "Day 01",
        title: "Delhi - Mandawa (Drive 260 km - 05 Hrs.)",
        activities: [
          "Namaste! Welcome to India!",
          "Upon arrival at Delhi International Airport T3, Our representative will assist you at arrival lounge and accompany you to the hotel. <strong>(Room holding from 09 Feb’23)</strong>",
          "Today post breakfast you will drive to Mandawa. Four hours drive from Jaipur, Mandawa is famously known as <strong>“Open Art Gallery”</strong>. More than 100 years ago, all houses also called forts and Havelis in Mandawa and entire Shekhawati region were coloured with beautiful paintings. During those days, the status of a family was decided on the basis of how beautifully their houses are decorated. Its magnificent paintings and ambience also attracts Bollywood directors for their film shooting. Some of the forts and Havelis have now been converted into hotels which give us an opportunity to stay like a king. Your half day sightseeing tours will begin with visiting 18th Century <strong>Mandawa Fort</strong> which dominates the town with its beautiful painting of Lord Krishna and cows. It is now converted into a heritage hotel. Next would be <strong>Gulab Rai Ki Haveli, Hanuman Prasad Goenka haveli</strong> which depicts Indra Dev (God of rain) on elephant and Lord Shiva on his Nandi bull."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 02",
        title: "Mandawa - Bikaner (Drive 190 km - 04 Hrs.)",
        activities: [
          "Post breakfast you will drive to Bikaner.",
          "Upon arrival in Bikaner, you will check-in to hotel and proceed for half day sightseeing including visit to unconquered <strong>Junagarh Fort</strong> now converted into the museum. This fort was tastefully architected and decorated by the various rulers and shows the peak of Indian architecture in Thar Desert. Murals of Royal suite of fort, the ornamented corridor, fine details of ceiling are the few highlights of the fort. Next will visit the <strong>Lallgarh Palace</strong>. This palace got smoking room and a pool inside and designed by a British architect Sir Samuel Jacob as Junagarh Fort was not considered to be modern enough for the young prince Ganga Singh. The part of palace is now converted into hotel and part into the museum which is open for the visitors. Today the tour will end by visiting the <strong>Camel breeding farm</strong> one of the unique research centre probably the only centre dedicated to enhance the quality of camel. Some of the high quality camels are used in Indian army as well."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 03",
        title: "Bikaner– Jaislamer (Drive 330 km - 05 Hrs.)",
        activities: [
          "Morning post breakfast will check out and drive to Jaisalmer.",
          "En-route will proceed for visit Sam Dunes with Camel ride",
          "The Sam Sand Dunes for visiting the typical Rajasthani Desert Village. View the sunset from the dunes as the sky is set on fire.",
          "Later will drive to the hotel. Check in at the hotel."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 04",
        title: "In Jaisalmer",
        activities: [
          "Morning post breakfast will drive to visit <strong>Jaisalmer Fort</strong> located on Trikula hill famously known as Sonar Kila (Golden Fort) due to its yellow sandstone which turns magical honey gold at night. It was built by the Bhati king Raja Jaisal in 12th century and is one of the fine examples of rich heritage of India. Next will visit <strong>Jain temple</strong>. Beautiful carvings of temple are dedicated to 16th century Tirthankar Shantinath. Thereafter next stop would be <strong>Patwon Ki Haveli</strong> located on walking distance from the fort by crossing the narrow lanes of the market. Next, you will head to 17th Century <strong>Salim Singh ki Haveli</strong>. It is bit different than the previous one having extended arched roof with 38 balconies peacock shape stands beautiful among the top rated Havelis of Jaisalmer.",
          "You can also visit the <strong>Vyas Chhatri</strong> dedicated to Sage Vyas who had written the Hindu epic Mahabharata, <strong>Gadisagar Lake, Amar Sagar lake</strong> or <strong>Mandir Palace</strong>.",
          "Later will check in at the hotel."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 05",
        title: "Jaisalmer – Jodhpur (Drive 280 km - 05 Hrs.)",
        activities: [
          "Morning post breakfast you will drive Jodhpur.",
          "On arrival you will procced for visit <strong>Mehrangarh Fort</strong> is considered as one of the best forts in India. You will begin your tour by visiting 15th century Mehrangarh Fort. It stands magnificently 400 feet above the city elegantly constructed by Rao Jodha which offers a stunning view of the city from the top of the fort. The huge fort has some interesting points known as Moti-Mahal (Pearl palace), Phool Mahal (Flower palace), Sheesh-Mahal (Mirror Palace) and many more. The palace has a fabulous collection of miniature paintings, musical instruments, costumes, furniture and palanquins. Next will proceed to visit <strong>Jaswant Thada</strong>, comparatively newly marble carved memorial. It was built at end of 19th century in the memory of Maharaja Jaswant Singh by his son Maharaja Sardar Singh and it is known for the impressive and architectural landmark.",
          "Later will check in at the hotel."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 06",
        title: "Jodhpur – Deogarh (Drive 130 Km – 03 Hrs)",
        activities: [
          "Morning post breakfast will drive to <strong>Deogarh</strong> a small princely state known as Jagirdar (A cluster of many villages) the head was also known as the King which is not much explored by many tourists due to several reasons and it is an opportunity to visit less explored places like Deogarh. <strong>Deogarh Mahal</strong> is one of the Palaces located between Jodhpur and Udaipur. It is a Palace converted into a hotel and the palace itself is a monument to explore and stay like a king. On arrival check in at the hotel. In the Afternoon enjoy the <strong>jeep safari</strong> drive through a pastoral setting where one explores the natural surroundings with people tending to their fields and cattle and living in complete harmony with nature. We visit a cave temple –a cavernous rock in which a shrine of Lord Shiva is ensconced. The top of this rock offers a panoramic view of the landscape of black volcanic rocks interspersed with green fields."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 07",
        title: "Deogarh – Udaipur (Drive 130 Km – 03 Hrs)",
        activities: [
          "Morning post breakfast will drive to <strong>Udaipur</strong> is known as the city of lakes and one of the most romantic cities in India. Udaipur, because of its location on the south slope of Aravali hills, is much greener and surrounded by several waters bodies like Lake Pichola and Fateh Sagar Lake.",
          "On arrival check-in at the hotel.",
          "Later you will proceed for Boat Ride on Lake Pichola (on seat sharing basis- subject to water level)"
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 08",
        title: "In Udaipur",
        activities: [
          "Morning post breakfast will check out and drive to visit <strong>City Palace</strong> just beside Lake Pichola. It was built in the 18th century however it was further added by 22 Maharajas till the 20th century, so, instead of just one palace it is a Palace complex. You will also see various styles and architecture as every next king redefined the construction as per his own taste. The crystal gallery, the vintage car museum, Daawat-i-Aam, Daawat-i-Khas, Maharani Palace, and the view of the city and Lake Pichola from the Palace are the major attractions.",
          "Next will proceed to visit the <strong>Jagdish Temple</strong> of Lord Vishnu built in Indi-Arya style by Maharaja Jagat Singh and finally will visit the <strong>Bhartiya Lok Kala Museum</strong> which displays the collection of Rajasthani culture and offers insight into the lifestyle of the Royal era in Udaipur."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 09",
        title: "Udaipur - Chittorgarh – Bundi (Drive 260 km/05 Hrs.)",
        activities: [
          "Morning post breakfast you will drive to Bundi.",
          "En route visit the Famous <strong>Chittorgarh Fort</strong> one of the most famous & renowned fort in the Rajasthan and also one of the largest.",
          "Later will continue driving to Bundi.",
          "On arrival check in at the hotel."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 10",
        title: "Bundi – Ranthambore (150 km/3 Hrs.)",
        activities: [
          "Post breakfast you will proceed to visit <strong>Bundi Palace</strong> is situated on the hillside adjacent to the Taragarh Fort and is notable for its lavish traditional murals and frescoes.",
          "Later continue drive to Ranthambore.",
          "On arrival check-in to the hotel.",
          "Evening leisure at hotel"
        ],
        stay: "<strong>Overnight stay – Hotel.</strong>"
      },
      {
        day: "Day 11",
        title: "Ranthambore",
        activities: [
          "Early morning, a personal wake-up call will include delivery of early morning tea, coffee and light breakfast before the game drive.",
          "Depart in a Jeep for safari <strong>(subject to jeep availability)</strong> through Ranthambhore dramatic landscape, from tropical forests and woodlands, to steep rocky hills with flat grasslands.",
          "Depending on their luck, they may get to see the regions rich wildlife including tiger, sloth bear, leopard, jungle cat, wild dog and a variety of birds.",
          "Return to resort for Breakfast. Day is at leisure.",
          "Afternoon Depart in a Jeep on safari <strong>(subject to jeep availability)</strong>",
          "After sunset, ice-cold signature non-cocktail/ House Pours (selected spirits & wines) at the Resort."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 12",
        title: "Ranthambore - Jaipur (Drive 320 km/07 Hrs.)",
        activities: [
          "Morning post breakfast you will drive to Jaipur, also known as the \"Pink City,\" is the capital city of the state of Rajasthan in India. It is a vibrant and culturally rich city that offers a blend of historical landmarks, colorful markets, and a royal ambiance.",
          "On arrival in Jaipur will proceed for visit <strong>Amer Fort</strong>, a large number of approximate 300 + elephants will be queued to offer rides to tourists. Please note, it would be bit crowded and surrounded with hawkers therefore be careful and ignore them. Approximate 700 meter ascending elephant ride is fully safe and you can enjoy your ride to reach uphill. Next will visit <strong>City Palace</strong>, the part of palace is converted into the museum and part is still a Royal residence and only museum part is open for public to visit. Next to Palace will visit the impressive <strong>Jantar – Mantar</strong>, which is an observatory containing 19 astronomical objects dating back to the time of Rajput King Sawai Jai Singh. Thereafter will proceed for visit <strong>Hawa Mahal (Palace of Winds)</strong>",
          "Your Jaipur tour will be incomplete if you don’t visit the local markets not for shopping but to experience and live the local life for a while, the colorful market,"
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 13",
        title: "Jaipur – Agra (Drive 260 km/05 Hrs.)",
        activities: [
          "Morning post breakfast will check out and drive to Agra.",
          "On arrival in Agra will proceed for a visit 11th century <strong>Agra Fort</strong>, a famous walled city and one of the most grandeur forts of India.",
          "In the evening will proceed to visit <strong>Taj Mahal, (Closed on Friday)</strong> at Sunset, this beautiful monument looks most beautiful when the Orange Sun creates magic on the white marble dome.",
          "Later will check in at the hotel."
        ],
        stay: "<strong>Overnight stay at the Hotel</strong>"
      },
      {
        day: "Day 14",
        title: "Agra – Delhi (Drive 240 km/04 Hrs.) And Departure",
        activities: [
          "Morning breakfast and drive to Delhi.",
          "On arrival Delhi proceeded for visit Lutyen’s Delhi and drive past to <strong>India Gate</strong> which was built in the year 1931to commemorate the Indian soldiers who died in the World War I & and the Afghan Wars, and President House, the official residence of President of India, formally known as the viceroy’s house during British rule.",
          "Before leaving for the airport will have some last-minute shopping <strong>(Depending upon available time)</strong>. Later transfer to the airport.",
          "Our tour concludes: SafeHands Travels thanks you for your patronage and ensures a punctual transfer to the Airport for onward travel. <strong>***see you on the next trip***</strong>"
        ],
        stay: "Tour concludes"
      }
    ];

    const keralaItinerary = [
      {
        day: "Day 01",
        title: "Arrive Kochi",
        activities: [
          "Namaste! Welcome to India!",
          "You would experience the serenity of <strong>Kerala</strong> even before reaching here, from the small glass of your plane where you can witness greenery all around through the clouds. We are looking forward to meet you at the <strong>Kochi international airport</strong> and start this surreal journey.",
          "With pleasant climate calling home a range of birds to the fragrance of spices luring you, every step you take will add on to the list of your experience. You can surrender yourself to this paradise and mingle in the clouds that would enter your hotel room through the huge windows. Make sure to take good rest and get ready to welcome the coming week as it is going to bring in a whole new vibe.",
          "<strong>Our representative</strong> will meet you at the airport and will greet you warmly. From there you will be taken to your hotel and the representative will help you in smooth check-in."
        ],
        stay: "<strong>Over-night stay at hotel.</strong>"
      },
      {
        day: "Day 02",
        title: "Kochi Sightseeing",
        activities: [
          "You would start by unwrapping the deep history by visiting the <strong>St. Francis</strong> church which has marked its presence since 1503 and today stands magnificently as the oldest European Church. Feel the thrill while trying the oldest fishing technique called the <strong>Chinese Fishing Nets</strong> which works on the principle of balance.",
          "After that we would advance to <strong>Mattanncherry</strong>, the land which is known for its hospitality and acceptance. The few jew families thriving in the <strong>JEW TOWN</strong> has their existence rooted here since 15th century. Explore the architectural excellence of the elegant <strong>JEWISH SYNAGOUGE</strong> with handmade Chinese tiles and Belgium chandeliers stealing your heart. Scout on the ancient lanes to be directed to <strong>Mattancherry palace</strong> which was scrupulously built in traditional Kerala architecture by the <strong>Portuguese</strong> as a gift to the king to win him hearts in exchange of the favor of establishing trading relation.",
          "Take a whiff of the spices in the spice market and you would be captivated by its aroma and pristine flavors.",
          "Accumulating all this experience we would proceed to <strong>Alleppey</strong> a cluster of little islands on <strong>Venbanad Lake</strong> which offers a unique experience of backwaters as well favorite haunts of several migratory birds."
        ],
        stay: "<strong>Over-night stay at houseboat.</strong>"
      },
      {
        day: "Day 03",
        title: "Alleppey - Periyar",
        activities: [
          "After having breakfast at the hotel, we will head towards <strong>Periyar</strong>. Enjoy rafting on the calm water sitting on a bamboo raft which exhibits its authenticity surpassing some of the most wealthiest forest tracts of <strong>Periyar Tiger Reserve</strong>.",
          "Adorn yourself in the traditional attire with the white <strong>chandan tilak</strong>, enhancing the look. Be a part of the herd of the elephants and pamper them, have a thrilling experience in scrubbing their huge bodies with the elephants spraying water with their trunk, find solace in feeding them and accumulate the adventure of riding on their back.",
          "You will not be able to control your amusement while watching the <strong>Kalaripayattu-</strong> the oldest of martial arts which is not only known for its form but its legacy all round the world.",
          "The adventure would reach its peak during the stay in the jungle lodge, in the lap of nature among the <strong>chirping of the birds, butterflies</strong> all around, sounds of the exotic animals. Let us wake up before dawn and stroll in the jungle trail accompanied by the naturalist guide to unlock every mystery of the jungle moving slowly towards the <strong>Periyar Lake</strong> to spot the wildlife there."
        ],
        stay: "<strong>Over-night stay at hotel.</strong>"
      },
      {
        day: "Day 04",
        title: "Periyar - Munnar (Sightseeing)",
        activities: [
          "After breakfast at hotel now, it’s time to get intrigued by the lush green tea plantation hill station <strong>Munnar</strong>, beholding the picturesque with local workers working with pride and smile, creating an ambience of warmth all around.",
          "This drive to <strong>Munnar</strong> will be one of the smoothest rides every crossing the lush greenery, tress on the dividers, clean and trafficless roads, breath filled with freshness, traditional cottage and people moving in their tradition attires.",
          "It would be less of a ride and more of a dive in the real culture of Kerala."
        ],
        stay: "<strong>Over-night stay at Hotel.</strong>"
      },
      {
        day: "Day 05",
        title: "Munnar (Sightseeing)",
        activities: [
          "<strong>Chai( tea)</strong> has been an integral part of <strong>Indian culture</strong>, ranging from sipping it while chit chatting or brewing it as a medicine. Every sip of it rejuvenates you for the coming task. The most captivating part is the story behind it’s preparation. With fresh leaves being hand picked by the local women labourers in their hand made bamboo baskets to drying it under the sun and processing in the factory you be witness the entire journey.",
          "100 years old <strong>TATA Tea Factory</strong> also known as <strong>Tea Museum</strong> has nurtured this tradition and will walk you through the whole mechanism. Be a part of the entire process while sipping freshly prepared tea and get some for friends and family back home.",
          "The one apt word for <strong>Munnar</strong> would be alluring with it’s exotic wildlife, exalted hills where the clouds would kiss your face, manicured tea gardens and the dedicated panoramic view of the magnificent Western Ghats.",
          "Awe- inspiring visit to the <strong>Mattupetty Dam</strong> which offers several fascinating delights to nature lovers, especially the lush green tea plantations and the rolling grass or a bewitching trek tour through the manicured tea gardens. The know how of the tour guide would further polish your trek.",
          "After an exciting day you deserve a good rest but the glimpse of the day would surely make your dreams worth seeing."
        ],
        stay: "<strong>Over-night stay at Hotel.</strong>"
      },
      {
        day: "Day 06",
        title: "Munnar - Kochi Shopping & Depart",
        activities: [
          "After having breakfast at the houseboat, we will head towards <strong>Kochi</strong>.",
          "After reaching <strong>Kochi</strong>, we will proceed for the <strong>shopping</strong>, to create memories of the beautiful place and take the along with you to your home. Take some great souvenirs with you for you and your loved ones.",
          "After the shopping we will heat towards <strong>Airport</strong> to board our flight to home.",
          "Glad to be a part of your journey."
        ],
        stay: "Tour concludes"
      }
    ];

    const kashmirItinerary = [
      {
        day: "Day 01",
        title: "Arrival Delhi",
        activities: ["Namaste and welcome to Bharat!!", "Upon arrival at Delhi airport, a SafeHands representative will warmly meet and assist you at the airport and accompany you to your hotel."],
        stay: "<strong>Overnight Stay at Hotel</strong>"
      },
      {
        day: "Day 02",
        title: "Delhi – Srinagar (Flight) & Sightseeing",
        activities: [
          "Morning on-time transfer to the airport to board the flight for <strong>Srinagar</strong>, is famous for its <strong>Mughal gardens</strong>, such as <strong>Nishat Bagh, Shalimar Bagh</strong>, and Chashme Shahi, which are meticulously manicured and adorned with vibrant flowers and fountains. These gardens offer a tranquil retreat and showcase the architectural splendor of the Mughal era.",
          "Upon arrival at Srinagar airport, our representative will meet and transfer to the hotel.",
          "By afternoon will visit <strong>Mughal Gardens, Nishat Garden</strong> known as the ‘Garden of Pleasure’ built in the 16th century (1633) by Mughal King Asif Khan. In the evening you take a <strong>shikhara ride on the world-famous Dal Lake</strong>, where you visit the floating vegetable gardens & Open Dal Lake. While riding the Shikara there are plenty of opportunities for bird watching with plentiful species including Kingfisher, Little Bittern, Common Pariah Kites, Grebe, etc.",
          "By evening will visit <strong>Adi Shankara Temple</strong> and later visit to shop to buy some local handicrafts particularly famous for Pashmina."
        ],
        stay: "<strong>Dinner & Overnight stay at hotel</strong>"
      },
      {
        day: "Day 03",
        title: "Srinagar - Day trip to Gulmarg",
        activities: [
          "Morning post breakfast will drive to <strong>Gulmarg</strong>, called as <strong>“Meadow of Flowers”</strong>.",
          "On arrival visit the <strong>Gulmarg</strong> is not merely a mountain resort of exceptional beauty- it also has the highest green golf course in the world, at an altitude of 2,650 m, and is the country's premier ski resort in the winter. One Can go for the Gondola Ride up to 1st or 2nd Phase. The Gulmarg <strong>Gondola</strong> is a tourist attraction in itself. It is one of the highest cable cars in the world, reaching 3,979 metres.",
          "The Affarwat ridge at 3850+ metres offer an avalanche-controlled ski area that offers a wide field of snow to descend 800 m in approximately 3 km of skiing, and is for advanced skiers only. Due to Gulmarg's steep terrain, the region is popular amongst advanced and extreme skiers from around the world and has been visited by a number of ski professionals and featured in a number of ski films also.",
          "The <strong>Gulmarg Golf Course</strong> is situated on the lower ranges of Gulmarg. Though golfing began in this region as early as the early 1920s, the present-day structure designed by Ranjit Nanda – a well-known golf course designer – was inaugurated only in 2011 by Omar Abdullah, the then Chief Minister of Jammu and Kashmir.",
          "Later will drive back to Srinagar."
        ],
        stay: "<strong>Dinner & Overnight stay at hotel</strong>"
      },
      {
        day: "Day 04",
        title: "Srinagar - Day trip to Sonmarg",
        activities: [
          "Morning post breakfast will check out and drive to <strong>Sonmarg</strong>, also known as <strong>\"Meadow of Gold,\"</strong>.",
          "Sonamarg is renowned for its breathtaking natural beauty, with snow-covered mountains, pristine glaciers, and colorful flower-filled meadows. The region is surrounded by majestic Himalayan peaks, including Kolhoi Peak and Amarnath Peak. It serves as a gateway to the famous Amarnath Yatra, an annual pilgrimage to the holy Amarnath Cave.",
          "On arrival, you will proceed to visit <strong>Thajiwas</strong>. Thajiwas is known for its stunning natural beauty, especially its snow-covered peaks, glaciers, and picturesque landscapes. We can reach Thajiwas by taking a short pony ride or trekking through the scenic trails.",
          "During the summer months, Thajiwas is a popular spot for picnics and outdoor activities. The meadows and rolling hills surrounding Thajiwas offer opportunities for leisurely walks, pony rides, and enjoying the pleasant weather. Many tourists visit Thajiwas to experience the breathtaking views of snow-capped mountains, vibrant flowers, and gushing streams.",
          "After this will back to <strong>Srinagar</strong>."
        ],
        stay: "<strong>Dinner & Overnight stay at hotel</strong>"
      },
      {
        day: "Day 05",
        title: "Srinagar – Pahalgam",
        activities: [
          "After breakfast drive to <strong>“Pahalgam”</strong> called as <strong>“Valley of Shepherds”</strong>. Pahalgam is situated at the confluence of the streams flowing from <strong>Sheshnag Lake</strong> and the <strong>Lidder River</strong>, Pahalgam (2,130 m) was once a humble shepherd's village with breathtaking views. Enjoy the nature & walk around the bank of river Lidder. <strong>Pahalgam</strong> is famous for some trekking routes also & is the base camp for <strong>Amarnath Pilgrimage</strong>.",
          "Pahalgam is also famous for Indian film Industry (Bollywood). Now it is Kashmir's premier resort, cool even during the height of summer when the maximum temperature does not exceed 25 Degree C. Early afternoon we will leave for <strong>Pahalgam</strong> sightseeing to explore the Beauty of <strong>“Pahalgam”</strong>.",
          "One can go to <strong>Aru</strong> (10 kms from Pahalgam) which is a fine meadow of picturesque scenery and starting point of trekking of (Liddarwat, Kolahoi Glacier &Trsar Lake) &Betaab Valley. We will visit one of the valleys as proposed below.",
          "On arrival will take the <strong>local vehicle</strong> and proceed for visit ARU VALLEY, BETAAB VALLEY, CHANDANWARI."
        ],
        stay: "<strong>Dinner & Overnight stay at hotel</strong>"
      },
      {
        day: "Day 06",
        title: "Pahalgam - Srinagar - Delhi (Flight) & Depart",
        activities: [
          "Morning post breakfast will check out and drive to <strong>Srinagar airport</strong> to board the flight for <strong>Delhi</strong>.",
          "On Arrival at <strong>Delhi Airport you</strong> will board flight to your <strong>hometown</strong>.",
          "<strong>There are no services in Delhi this day.</strong>",
          "Thank you for taking a tour with <strong>SafeHands Travels</strong>. We hope you enjoyed our services. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
        ],
        stay: "Tour concludes"
      }
    ];

    const shimlaItinerary = [
      {
        day: "Day 01",
        title: "Arrive Amritsar",
        activities: ["Welcome to Amritsar!!", "Upon arrival at <strong>Amritsar Airport</strong>, a SafeHands representative will warmly meet and assist you at the arrival lounge of the airport and accompany you to your hotel for smooth check-in."],
        stay: "<strong>Overnight stay at Hotel</strong>"
      },
      {
        day: "Day 02",
        title: "Amritsar sightseeing – Dharamshala",
        activities: [
          "Morning Post breakfast we will drive to <strong>Dharamshala</strong>.",
          "Upon Arrival at <strong>Dharamshala</strong> airport our representative will meet you and assist you and help you to smooth check in Hotel.",
          "<strong>Dharamshala</strong> is also known as little Lahsa, has been the seat of his Holiness, the Dalai Lama, the leader of the Tibetans, since 1960.",
          "Afternoon leave for Sightseeing covering <strong>Mcleodganj, Dalai lama temple, Bhagsu Nag</strong> and <strong>Naddi</strong>.",
          "Rest of the day at leisure."
        ],
        stay: "<strong>Dinner & Overnight at Hotel.</strong>"
      },
      {
        day: "Day 03",
        title: "Dharamshala – Manali",
        activities: [
          "Morning after breakfast depart for <strong>Manali</strong> enroute visiting <strong>St. John Church in the Wilderness, and Norbulingka institute</strong>.",
          "On arrival check in at hotel.",
          "<strong>Manali</strong> is located in the ancient Kullu valley, surrounded by towering peaks at an arms length.",
          "<strong>Manali</strong> is a beautiful place in the mountains. It's like a cool, green valley with tall trees and snowy mountains. People go there to enjoy the fresh air, explore the mountains, and relax. You can find lots of fun things to do, like hiking, visiting temples, or just enjoying the peaceful atmosphere."
        ],
        stay: "<strong>Dinner & Overnight at hotel.</strong>"
      },
      {
        day: "Day 04",
        title: "In Manali (Solang Valley and Sissu Lake excursion via Atal Tunnel)",
        activities: [
          "Morning after Breakfast proceed <strong>to Solang valley</strong> (a famous picnic spot & ski resort in winter). Enjoy Skiing, Snowboarding (in winters), Rope way ride and Paragliding (at your own cost). Afternoon continue towards Sissu via Atal Tunnel. Visit <strong>Sissu lake (10,235 ft)</strong>, where you can enjoy the beautiful view of the lake.",
          "<strong>Atal Tunnel is</strong> also known as Rohtang Tunnel is a highway tunnel built under the Rohtang Pass in the eastern Pir Panjal range of the Himalayas on the Leh-Manali Highway in Himachal Pradesh. At a length of 9.02 km, it is the longest tunnel above <strong>10,000 feet</strong> (3,048 m) in the world and is named after former Prime Minister of India Atal Bihari Vajpayee.",
          "Later return back to hotel for overnight.",
          "<span style='color:red;'>NOTE: Rohtang pass visit is not included. As we have to secure a permit which is only issued a day prior to the day of visit and same will be subject to availability.</span>"
        ],
        stay: "<strong>Dinner & Overnight Stay At Hotel.</strong>"
      },
      {
        day: "Day 05",
        title: "In Manali (Morning Naggar excursion/ Evening – Local Sightseeing)",
        activities: [
          "Morning, after breakfast proceed to visit the <strong>Naggar Castle</strong> and <strong>Roriech art Gallery</strong>.",
          "Afternoon proceed to visit <strong>Hadimba Devi Temple</strong> - the oldest temple in Manali built in 1553 with a superbly crafted four tiered pagoda roof; it is famous for its exquisitely carved doorway.",
          "Next will visit <strong>Club House</strong> with its comprehensive facilities that include a roller skating rink, an auditorium, billiards rooms, a library, a bar and restaurant makes wonderful outing for the day.",
          "<strong>Afterwards will visit Tibetan monastery</strong> and <strong>Vashisht village</strong> (known for its hot Sulpher springs). There are old temples dedicated to sage Vashisht and Lord Rama."
        ],
        stay: "<strong>Dinner & Overnight stay at hotel.</strong>"
      },
      {
        day: "Day 06",
        title: "Manali – Shimla",
        activities: [
          "Morning after breakfast we will drive to <strong>Shimla</strong>.",
          "Upon arrival check in at your hotel.",
          "<strong>Shimla</strong> is a beautiful hill station in <strong>India</strong>, known for its cool weather and stunning views of the mountains. It used to be the <strong>summer capital of British India</strong>, and you can still see many old British-style buildings there. Shimla is a great place to relax and enjoy nature, with lots of green hills, pine trees, and fresh air.",
          "You can take walks on the <strong>Mall Road</strong>, a famous shopping street, or visit <strong>Jakhu Hill</strong>, the highest point in Shimla, where you can see a big statue of <strong>Hanuman</strong>, the monkey god. Shimla is also a good place to go hiking, camping, and exploring the nearby mountains."
        ],
        stay: "<strong>Dinner Overnight stay at Hotel.</strong>"
      },
      {
        day: "Day 07",
        title: "In Shimla – (Morning: Kufri excursion / Evening: Local sightseeing)",
        activities: [
          "Morning after breakfast proceed for excursion tour of <strong>Kufri</strong>, It's a small picturesque hill station that offers stunning views, beautiful locales and serene ambience. Visit Indira Tourist Park at <strong>Chini Bunglow & Himalayan Wildlife Zoo</strong>.",
          "Afternoon return back <strong>to Shimla</strong> and proceed for half day sightseeing tour of ‘City beautiful’ covering <strong>Jakhoo temple, Himachal State Museum (Closed on Mondays) & Library and Indian Institute of Advance studies (Closed on Mondays)</strong>.",
          "Evening visit to <strong>Christ Church, Scandal Corner, Mall road & Ridge</strong>."
        ],
        stay: "<strong>Dinner & Overnight stay at Hotel.</strong>"
      },
      {
        day: "Day 08",
        title: "Shimla – Amritsar & Depart",
        activities: [
          "Early morning depart from <strong>Shimla to Amritsar</strong>.",
          "On arriving <strong>Amritsar</strong> we will drive to <strong>Amritsar Airport</strong> to board a flight to your <strong>Hometown</strong>.",
          "Thank you for Taking tour with <strong>SafeHands Travels</strong>. We'd love to have you join us again on another tour. Your feedback is important to us and will help us get better. Please share your thoughts. Thanks!"
        ],
        stay: "Tour concludes"
      }
    ];

    const updates = [
      { slug: 'cultural-rajasthan-tour-', data: rajasthanItinerary },
      { slug: 'kerala-tour-', data: keralaItinerary },
      { slug: 'kashmir-tour-', data: kashmirItinerary },
      { slug: 'shimla-manali-tour-2025-', data: shimlaItinerary }
    ];

    for (const update of updates) {
      await pool.query(
        "UPDATE trips SET itinerary = ? WHERE slug LIKE ?",
        [JSON.stringify(update.data), `${update.slug}%`]
      );
    }
    
    console.log("✅ Batch 1 (4 trips) updated successfully with rich text and bold tags!");
  } catch (error) {
    console.error('❌ Failed to update Batch 1:', error);
  } finally {
    process.exit(0);
  }
}

updateBatch1();
