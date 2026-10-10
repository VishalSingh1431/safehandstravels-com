import pool from '../config/database.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PEXELS_API_KEY = 'jcJUOdTJBCXTM6bOX3mfNLJnj96iodG8L5MzRRSTdGE0oBf8VIevGAAW';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getPexelsImage(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`;
  const res = await fetch(url, { headers: { Authorization: PEXELS_API_KEY } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.photos || data.photos.length === 0) return null;
  // Pick 2nd photo if available to vary results
  const photo = data.photos[Math.min(1, data.photos.length - 1)];
  return photo.src.large2x || photo.src.large;
}

async function uploadToCloudinary(imageUrl, folder) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) throw new Error(`Fetch failed: ${imageRes.statusText}`);
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).end(buffer);
  });
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// =====================================================================
// 1. WRITTEN REVIEWS
// =====================================================================
const writtenReviews = [
  {
    name: 'Aarav Sharma',
    rating: 5,
    date: 'June 2025',
    title: 'Unforgettable Varanasi Experience!',
    review: 'Safe Hands Travels made our Varanasi pilgrimage absolutely divine. The guides were deeply knowledgeable about the ghats and the Ganga Aarti was perfectly timed. Every detail — from our hotel to the boat ride at sunrise — was impeccably arranged. Highly recommend to anyone seeking a spiritual journey.',
    location: 'Delhi, India',
    avatarQuery: 'indian man portrait smiling',
  },
  {
    name: 'Priya Mehta',
    rating: 5,
    date: 'March 2025',
    title: 'Kerala Backwaters — Pure Magic!',
    review: 'I have travelled with many agencies but Safe Hands Travels stands apart. The houseboat stay in Alleppey was straight out of a dream — calm backwaters, fresh seafood, and breathtaking sunsets. The team handled every single detail flawlessly. Will definitely travel with them again!',
    location: 'Mumbai, India',
    avatarQuery: 'indian woman smiling portrait',
  },
  {
    name: 'Rahul & Sunita Gupta',
    rating: 5,
    date: 'January 2025',
    title: 'Golden Triangle — Beyond Expectations',
    review: 'We did the Delhi-Agra-Jaipur trip for our anniversary and it was perfect in every way. The Taj Mahal at sunrise was breathtaking. Our guide was incredibly informative and patient. Safe Hands truly lives up to its name — we always felt safe, comfortable and cared for.',
    location: 'Bengaluru, India',
    avatarQuery: 'indian couple travel smiling',
  },
  {
    name: 'Sneha Patel',
    rating: 5,
    date: 'December 2024',
    title: 'Kashmir Trip — Heaven on Earth',
    review: 'Shikara rides on Dal Lake, snow-capped peaks of Gulmarg, saffron fields of Pampore — Safe Hands Travels gave us the complete Kashmir experience. The houseboat was luxurious and the local guide was excellent. We felt completely safe throughout our trip. 10/10!',
    location: 'Ahmedabad, India',
    avatarQuery: 'indian woman traveller portrait',
  },
  {
    name: 'Vikram Nair',
    rating: 5,
    date: 'November 2024',
    title: 'Spiritual South India Tour',
    review: 'Tirupati, Madurai, Rameswaram — the spiritual circuit of South India was covered beautifully by Safe Hands Travels. Every temple visit was well-planned, the accommodation was comfortable, and the driver was genuinely helpful. A deeply meaningful journey made even better by a professional team.',
    location: 'Hyderabad, India',
    avatarQuery: 'south indian man portrait',
  },
  {
    name: 'Anjali Verma',
    rating: 5,
    date: 'October 2024',
    title: 'Rajasthan — Royal Treatment!',
    review: 'From Jaipurs pink streets to Jodhpurs blue city and Udaipurs lakes, Safe Hands Travels gave us a truly royal Rajasthan experience. The heritage hotels, camel safari, and folk dance evening were highlights. Our trip coordinator was always reachable. Exceptional service!',
    location: 'Lucknow, India',
    avatarQuery: 'indian woman portrait travel',
  },
  {
    name: 'Mohan Krishnamurthy',
    rating: 4,
    date: 'September 2024',
    title: 'Char Dham Yatra — Well Organised',
    review: 'The Char Dham Yatra is a challenging pilgrimage and Safe Hands Travels made it manageable with great logistics. Kedarnath helicopter booking, Badrinath accommodation, and Gangotri darshan were all seamless. Only minor delay at Yamunotri, but the team handled it well.',
    location: 'Chennai, India',
    avatarQuery: 'indian elder man travel',
  },
  {
    name: 'Neha & Arjun Singh',
    rating: 5,
    date: 'August 2024',
    title: 'Manali Honeymoon — Perfect!',
    review: 'Our honeymoon in Manali was straight out of a fairy tale, thanks to Safe Hands Travels. Rohtang Pass covered in snow, the cosy river-facing cottage, candlelit dinner — every moment was curated with love. The team even surprised us with flower decorations on arrival. Forever grateful!',
    location: 'Jaipur, India',
    avatarQuery: 'indian couple honeymoon',
  },
];

// =====================================================================
// 2. VIDEO REVIEWS — fix names/locations for the 11 existing entries
// =====================================================================
const videoReviewUpdates = [
  { id: 1, name: 'Rohit Kapoor', location: 'Delhi, India', rating: 5 },
  { id: 2, name: 'Meena Iyer', location: 'Chennai, India', rating: 5 },
  { id: 3, name: 'Suresh Yadav', location: 'Varanasi, India', rating: 5 },
  { id: 4, name: 'Kavita Joshi', location: 'Pune, India', rating: 5 },
  { id: 5, name: 'Amit & Pooja Sharma', location: 'Bengaluru, India', rating: 5 },
  { id: 6, name: 'Divya Nair', location: 'Kochi, India', rating: 5 },
  { id: 7, name: 'Harish Chauhan', location: 'Shimla, India', rating: 5 },
  { id: 8, name: 'Ritika Malhotra', location: 'Chandigarh, India', rating: 5 },
  { id: 9, name: 'Sanjay Tripathi', location: 'Lucknow, India', rating: 5 },
  { id: 10, name: 'Ananya Bose', location: 'Kolkata, India', rating: 5 },
  { id: 11, name: 'Rajan & Sunita Verma', location: 'Jaipur, India', rating: 5 },
];

// =====================================================================
// 3. BLOGS
// =====================================================================
const blogPosts = [
  {
    title: '10 Reasons Why Varanasi Should Be on Every Traveller\'s Bucket List',
    category: 'Spiritual',
    tags: ['varanasi', 'spiritual', 'india travel', 'ganges', 'pilgrimage'],
    author: 'Safe Hands Travels',
    description: 'Varanasi, the spiritual capital of India, offers experiences that touch the soul. From the mesmerising Ganga Aarti to sunrise boat rides, here are 10 reasons to visit.',
    imageQuery: 'Varanasi Ganga Aarti ghats',
    metaTitle: '10 Reasons to Visit Varanasi | Safe Hands Travels',
    metaDescription: 'Discover why Varanasi is India\'s most spiritually powerful destination. Explore the ghats, Ganga Aarti, and ancient temples with Safe Hands Travels.',
    content: `
<h2>The Eternal City Awaits You</h2>
<p>Varanasi — also known as Kashi or Banaras — is one of the world's oldest continuously inhabited cities and India's most sacred destination. Situated on the western bank of the holy Ganges river, this city has been the spiritual heart of India for over 3,000 years. Here are 10 compelling reasons why Varanasi deserves a top spot on your travel list.</p>

<h2>1. The Mesmerising Ganga Aarti</h2>
<p>Every evening at Dashashwamedh Ghat, a spectacular ritual unfolds. Dozens of priests synchronously perform the Ganga Aarti — a ceremony of devotion to the sacred river — with flaming lamps, chanting mantras, and ringing bells. The sight is nothing short of divine. Arrive early to secure a good spot, or take a boat ride for a panoramic view.</p>

<h2>2. Sunrise Boat Rides on the Ganges</h2>
<p>As the golden sun rises over Varanasi's ghats, witnessing the city waking up from a boat on the Ganges is an experience that stays with you forever. You'll see pilgrims bathing, yogis meditating, children playing, and priests performing rituals — all simultaneously along the riverbank.</p>

<h2>3. The Sacred Kashi Vishwanath Temple</h2>
<p>Dedicated to Lord Shiva, the Kashi Vishwanath Temple is one of the twelve Jyotirlingas — the most sacred Shiva shrines in Hinduism. The newly developed Kashi Vishwanath Corridor has made it even more accessible and majestic. A visit here is considered to cleanse the soul of all sins.</p>

<h2>4. The 84 Ghats</h2>
<p>Varanasi's 84 ghats — stone steps leading down to the Ganges — each have their own story. From the sacred Manikarnika Ghat (the primary cremation ground) to the colourful Assi Ghat frequented by sadhus and foreigners, walking along the ghats is an immersion into India's living heritage.</p>

<h2>5. Sarnath — Where Buddha Preached His First Sermon</h2>
<p>Just 13 km from Varanasi lies Sarnath, where Gautam Buddha delivered his first sermon after attaining enlightenment. The Dhamek Stupa, Ashoka Pillar, and the local museum containing the Lion Capital of Ashoka (India's national emblem) make this a must-visit.</p>

<h2>6. The Silk Weaving Tradition</h2>
<p>Varanasi is world-famous for its Banarasi silk sarees — handwoven masterpieces adorned with intricate gold and silver brocade work. A visit to the weavers' quarters in Peeli Kothi or Madanpura offers a fascinating glimpse into this 500-year-old craft tradition.</p>

<h2>7. The Street Food Capital of North India</h2>
<p>Varanasi's street food scene is legendary. Kachori sabzi for breakfast, the iconic Banarasi paan, Malaiyo (frothy sweet milk dessert served only in winters), Tamatar chaat, and the finest Lassi you'll ever taste — the city is an absolute paradise for foodies.</p>

<h2>8. Dev Deepawali — The Festival of Lights</h2>
<p>Celebrated 15 days after Diwali, Dev Deepawali transforms Varanasi into a city of a million lamps. All 84 ghats are lit with earthen lamps (diyas), creating a reflection on the Ganges that looks like stars fallen to earth. It's one of India's most visually stunning festivals.</p>

<h2>9. Ramnagar Fort</h2>
<p>Sitting majestically across the Ganges from Varanasi's ghats, the Ramnagar Fort was built in the 18th century and is the ancestral home of the Maharaja of Varanasi. The museum inside houses vintage cars, royal costumes, ivory work, and an astronomical clock.</p>

<h2>10. A City That Changes You</h2>
<p>More than its temples and ghats, Varanasi offers something intangible — a confrontation with life's deepest questions. The open cremations at Manikarnika Ghat, the sadhus in deep meditation, the constant chanting — all remind you of what truly matters. Travellers often say Varanasi changes them in ways they can't quite explain.</p>

<h2>Plan Your Varanasi Trip with Safe Hands Travels</h2>
<p>At Safe Hands Travels, we offer expertly curated Varanasi packages that include guided ghat walks, priority Kashi Vishwanath darshan, sunrise boat rides, and comfortable accommodation. Our local guides bring the city's stories to life in ways no guidebook can.</p>
<p><strong>Ready to experience the eternal city? Get in touch with us today and let us craft the perfect Varanasi journey for you.</strong></p>
    `,
  },
  {
    title: 'The Ultimate Guide to Kerala: God\'s Own Country in 7 Days',
    category: 'Cultural',
    tags: ['kerala', 'backwaters', 'houseboat', 'south india', 'beach'],
    author: 'Safe Hands Travels',
    description: 'From the tranquil backwaters of Alleppey to the misty hills of Munnar and the golden beaches of Kovalam, plan your perfect 7-day Kerala itinerary.',
    imageQuery: 'Kerala houseboat backwaters',
    metaTitle: '7-Day Kerala Travel Guide | Safe Hands Travels',
    metaDescription: 'Explore Kerala in 7 days — backwaters, hill stations, temples, and beaches. Your complete travel guide by Safe Hands Travels.',
    content: `
<h2>Welcome to God's Own Country</h2>
<p>Kerala — nestled between the Western Ghats and the Arabian Sea — is one of India's most diverse and breathtaking destinations. With its tranquil backwaters, mist-covered tea plantations, ancient temples, vibrant culture, and pristine beaches, Kerala offers something extraordinary for every kind of traveller. Here's the ultimate 7-day itinerary.</p>

<h2>Day 1: Arrive in Kochi — The Queen of the Arabian Sea</h2>
<p>Begin your Kerala journey in Kochi (Cochin), a city where ancient history meets modern vibrancy. Explore <strong>Fort Kochi</strong> with its iconic Chinese fishing nets, St. Francis Church (where Vasco da Gama was originally buried), and the colourful Mattancherry spice market. In the evening, watch a <strong>Kathakali performance</strong> — Kerala's ancient classical dance form with dramatic costumes and facial expressions.</p>

<h2>Day 2: Munnar — The Land of Tea</h2>
<p>Drive to Munnar (4 hours), passing through rubber plantations and misty valleys. <strong>Munnar's endless tea estates</strong> rolling over the Ghats will take your breath away. Visit the Tea Museum to learn about tea processing, stroll through Eravikulam National Park (home to the endangered Nilgiri Tahr), and enjoy sunset at Top Station — the highest point in Munnar.</p>

<h2>Day 3: Thekkady — Spices, Wildlife, and Elephant Encounters</h2>
<p>Head to <strong>Thekkady</strong> — famous for the Periyar Wildlife Sanctuary. Take a boat ride on Periyar Lake, where you may spot elephants, bison, and deer coming to drink. Walk through spice plantations of cardamom, pepper, and cinnamon. In the evening, enjoy a <strong>Kalaripayattu</strong> martial arts performance — one of the world's oldest combat systems.</p>

<h2>Day 4: Alleppey — Houseboat Paradise</h2>
<p>Check into a traditional <strong>Kerala houseboat (kettuvallam)</strong> on the Alleppey backwaters — an experience unlike anything else in the world. Drift through narrow canals lined with coconut palms, past village life and lotus-filled lakes. Enjoy freshly cooked Kerala fish curry on board and sleep under the stars. This is the highlight of any Kerala trip.</p>

<h2>Day 5: Kumarakom & Vembanad Lake</h2>
<p>Explore <strong>Kumarakom Bird Sanctuary</strong> — a paradise for birdwatchers with Siberian cranes, herons, egrets, and teals. Vembanad Lake, the longest lake in India, offers spectacular boat rides. Visit a local toddy shop for a taste of Kerala's famous palm wine and fresh karimeen (pearl spot fish).</p>

<h2>Day 6: Kovalam — Beach Bliss</h2>
<p>Drive to <strong>Kovalam</strong>, Kerala's most famous beach destination. Lighthouse Beach is perfect for swimming while Hawa Beach is more secluded. Book an <strong>Ayurvedic massage</strong> — Kerala is the birthplace of Ayurveda and the massages here use traditional techniques passed down for generations. Watch the sunset from the iconic Kovalam lighthouse.</p>

<h2>Day 7: Thiruvananthapuram & Departure</h2>
<p>Spend your final morning at the <strong>Padmanabhaswamy Temple</strong> — one of India's wealthiest temples, known for its Dravidian architecture and the legendary underground vaults. Visit Napier Museum and the zoo before your departure from Trivandrum airport.</p>

<h2>Kerala Travel Tips</h2>
<ul>
<li><strong>Best time to visit:</strong> October to March (avoid monsoon June-September for beaches)</li>
<li><strong>Must try foods:</strong> Sadya (banana leaf meal), Appam with stew, Puttu, Karimeen Pollichathu</li>
<li><strong>Don't miss:</strong> Sunrise on the backwaters, Kathakali show, Ayurvedic spa</li>
</ul>

<h2>Book Your Kerala Trip with Safe Hands Travels</h2>
<p>Our Kerala packages include houseboat bookings, wildlife sanctuary permits, airport transfers, and handpicked heritage hotels. We take care of every detail so you can simply enjoy God's Own Country to the fullest.</p>
    `,
  },
  {
    title: 'Kedarnath Yatra: A Complete Pilgrim\'s Guide for 2025',
    category: 'Spiritual',
    tags: ['kedarnath', 'char dham', 'uttarakhand', 'pilgrimage', 'trek'],
    author: 'Safe Hands Travels',
    description: 'Everything you need to know about the Kedarnath Yatra — registration, trek route, helicopter options, best time to visit, and what to pack.',
    imageQuery: 'Kedarnath temple mountains snow',
    metaTitle: 'Kedarnath Yatra Complete Guide 2025 | Safe Hands Travels',
    metaDescription: 'Plan your Kedarnath pilgrimage with our complete guide covering trek routes, helicopter bookings, registration, weather, and packing tips.',
    content: `
<h2>The Sacred Call of Kedarnath</h2>
<p>Nestled at an altitude of 3,583 metres in the Garhwal Himalayas, Kedarnath is one of India's holiest pilgrimage sites and one of the twelve Jyotirlingas of Lord Shiva. The Kedarnath Temple, believed to have been built by the Pandavas and restored by Adi Shankaracharya in the 8th century, stands majestically against a backdrop of snow-capped peaks. Every year, hundreds of thousands of devotees undertake this challenging yatra to seek the blessings of Mahadev.</p>

<h2>When to Visit Kedarnath</h2>
<p>The Kedarnath Temple opens in late April or early May (on auspicious dates determined by the priests) and closes in November before the winter snows. The best time to visit is:</p>
<ul>
<li><strong>May-June:</strong> Peak season with pleasant weather and blooming rhododendrons</li>
<li><strong>September-November:</strong> Fewer crowds, clear skies, and stunning autumn colours</li>
<li><strong>Avoid:</strong> July-August (monsoon) — trail can be slippery and dangerous</li>
</ul>

<h2>How to Reach Kedarnath</h2>
<p><strong>By Air:</strong> Nearest airport is Jolly Grant Airport, Dehradun (250 km from Sonprayag)</p>
<p><strong>By Train:</strong> Nearest railway stations are Rishikesh and Haridwar</p>
<p><strong>By Road:</strong> Drive to Sonprayag/Gaurikund (base camp). From Delhi, it's approximately 450 km.</p>

<h2>The Trek to Kedarnath</h2>
<p>The main trek starts from <strong>Gaurikund</strong> (1,982 m) and covers <strong>16 km</strong> to reach the temple. The trail passes through dense forests, waterfalls, and high-altitude meadows. Key points along the trek:</p>
<ul>
<li><strong>Rambara (7 km):</strong> A refreshment stop with tea shops and basic facilities</li>
<li><strong>Linchaur (12 km):</strong> The trail becomes steeper here</li>
<li><strong>Kedarnath Base Camp (14 km):</strong> First view of the temple spire</li>
<li><strong>Kedarnath Temple (16 km):</strong> The divine destination</li>
</ul>
<p>The trek takes 6-8 hours depending on your fitness level. Ponies, dandis (chair carriers), and palkis are available for those who cannot walk.</p>

<h2>Helicopter Service to Kedarnath</h2>
<p>For those who prefer not to trek, helicopter services operate from Phata, Sirsi, and Guptkashi to a helipad near Kedarnath. The flight takes just 8-10 minutes but bookings must be made well in advance through the official IRCTC portal or through us at Safe Hands Travels.</p>

<h2>Mandatory Registration</h2>
<p>All pilgrims must complete biometric registration at designated centres in Haridwar, Rishikesh, or Sonprayag. Carry your Aadhaar card. Daily entry is regulated to prevent overcrowding.</p>

<h2>What to Pack</h2>
<ul>
<li>Warm woollen clothing (temperature can drop to -5°C at night)</li>
<li>Rain poncho or waterproof jacket</li>
<li>Sturdy trekking shoes with ankle support</li>
<li>High energy snacks — dry fruits, energy bars, glucose biscuits</li>
<li>Personal medications and a basic first aid kit</li>
<li>A walking stick (available for rent at Gaurikund)</li>
</ul>

<h2>Important Tips</h2>
<ul>
<li>Acclimatise at Haridwar or Rishikesh for a day before heading up</li>
<li>Start the trek very early (4 AM) to avoid afternoon crowds and unpredictable weather</li>
<li>Stay hydrated — drink at least 3 litres of water daily at altitude</li>
<li>Carry cash — ATMs at higher altitudes often run out</li>
</ul>

<h2>Plan Your Kedarnath Yatra with Safe Hands Travels</h2>
<p>We offer complete Kedarnath packages including helicopter booking, accommodation in Kedarnath/Guptkashi, pony/dandi arrangements, a dedicated guide, and medical support. Our team has helped thousands of pilgrims complete the Char Dham Yatra safely. Let us handle the logistics while you focus on your devotion.</p>
    `,
  },
  {
    title: 'Rajasthan in 10 Days: The Royal India Road Trip',
    category: 'Heritage',
    tags: ['rajasthan', 'jaipur', 'jodhpur', 'udaipur', 'heritage', 'road trip'],
    author: 'Safe Hands Travels',
    description: 'Explore the magnificent palaces, desert forts, blue cities, and lake cities of Rajasthan on an unforgettable 10-day royal road trip.',
    imageQuery: 'Rajasthan palace sunset',
    metaTitle: '10-Day Rajasthan Road Trip Itinerary | Safe Hands Travels',
    metaDescription: 'Plan the perfect Rajasthan road trip with our 10-day itinerary covering Jaipur, Jodhpur, Jaisalmer, Pushkar, and Udaipur.',
    content: `
<h2>The Land of Kings</h2>
<p>Rajasthan — literally meaning "Land of Kings" — is India's largest state and its most colourful. With magnificent forts, ornate palaces, camel-dotted deserts, vibrant folk culture, and world-class cuisine, Rajasthan is the quintessential Indian travel experience. Here's our ultimate 10-day road trip itinerary.</p>

<h2>Day 1-2: Jaipur — The Pink City</h2>
<p>Begin your Rajasthan adventure in Jaipur, the state capital. The city's pink sandstone buildings give it an enchanting rosy glow. Must-visits include:</p>
<ul>
<li><strong>Amber Fort:</strong> A UNESCO World Heritage site with stunning mirror work and intricate carvings — take an elephant or jeep ride up the hill</li>
<li><strong>City Palace:</strong> The royal residence housing a museum of royal costumes, weapons, and paintings</li>
<li><strong>Hawa Mahal:</strong> The iconic "Palace of Winds" with 953 small windows</li>
<li><strong>Jantar Mantar:</strong> A 18th-century astronomical observatory</li>
</ul>
<p>Evening: Shop for blue pottery, block-print textiles, and gemstones at Johari Bazaar.</p>

<h2>Day 3: Pushkar — The Sacred Lake Town</h2>
<p>Drive 2 hours to Pushkar — one of India's most sacred cities. Walk around the <strong>Pushkar Lake</strong> lined with 52 ghats, visit the rare <strong>Brahma Temple</strong> (one of very few in the world), and explore the bazaar for silver jewellery and tie-dye clothing. Pushkar has a unique, laid-back charm that travellers love.</p>

<h2>Day 4-5: Jodhpur — The Blue City</h2>
<p>Continue to Jodhpur, where the houses of the Brahmin neighbourhood are painted in brilliant shades of blue. The highlights:</p>
<ul>
<li><strong>Mehrangarh Fort:</strong> One of India's largest and most impressive forts — the view from the ramparts is extraordinary</li>
<li><strong>Umaid Bhawan Palace:</strong> A luxury hotel that also houses a museum — a masterpiece of Indo-Deco architecture</li>
<li><strong>Jaswant Thada:</strong> A delicate marble memorial built in 1899</li>
</ul>
<p>Don't miss tasting the famous <strong>Mirchi Bada</strong> and <strong>Makhaniya Lassi</strong> at Shri Mishrilal Hotel near the clock tower.</p>

<h2>Day 6-7: Jaisalmer — The Golden City</h2>
<p>Drive to the Thar Desert for <strong>Jaisalmer</strong> — the golden sandstone city rising from the desert. Highlights:</p>
<ul>
<li><strong>Jaisalmer Fort (Sonar Quila):</strong> A living fort — 3,000 people still reside inside this UNESCO site</li>
<li><strong>Patwon Ki Haveli:</strong> Elaborate 19th-century merchant mansions with breathtaking carvings</li>
<li><strong>Sam Sand Dunes:</strong> A camel safari at sunset and a night in a desert camp under the stars is unmissable</li>
</ul>

<h2>Day 8: Bikaner — The Camel Country</h2>
<p>Stop at <strong>Bikaner</strong> on your drive back. Visit the impressive <strong>Junagarh Fort</strong>, the quirky <strong>Karni Mata Temple</strong> (famously inhabited by thousands of rats worshipped as holy), and the National Research Centre on Camel.</p>

<h2>Day 9-10: Udaipur — The City of Lakes</h2>
<p>End your royal road trip in Udaipur — perhaps Rajasthan's most romantic city. Highlights:</p>
<ul>
<li><strong>City Palace:</strong> The largest palace complex in Rajasthan overlooking Lake Pichola</li>
<li><strong>Lake Palace:</strong> A white marble palace floating on Lake Pichola (now a luxury hotel)</li>
<li><strong>Jagdish Temple:</strong> A stunning 17th-century Indo-Aryan temple</li>
<li><strong>Vintage Car Museum:</strong> A collection of maharaja's vintage cars</li>
</ul>

<h2>Book Your Royal Rajasthan Trip</h2>
<p>Safe Hands Travels specialises in curated Rajasthan journeys with private drivers, heritage hotel stays, and expert local guides who bring the stories of the maharajas to life. Contact us today for a personalised itinerary.</p>
    `,
  },
  {
    title: 'Top 5 Wildlife Sanctuaries in India You Must Visit',
    category: 'Wildlife',
    tags: ['wildlife', 'safari', 'tiger', 'ranthambore', 'jim corbett', 'nature'],
    author: 'Safe Hands Travels',
    description: 'India is home to some of the world\'s most spectacular wildlife. Discover the top 5 sanctuaries where you can spot tigers, elephants, rhinos, and exotic birds.',
    imageQuery: 'Bengal tiger wildlife India',
    metaTitle: 'Top 5 Wildlife Sanctuaries in India | Safe Hands Travels',
    metaDescription: 'Discover India\'s best wildlife sanctuaries for tiger sightings, elephant encounters, and bird watching. Expert guide by Safe Hands Travels.',
    content: `
<h2>India's Wild Heart</h2>
<p>India is home to extraordinary biodiversity — over 500 wildlife sanctuaries and 100+ national parks protect everything from Bengal tigers and Asian elephants to the one-horned rhinoceros and snow leopards. Here are the top 5 wildlife sanctuaries every nature lover must visit.</p>

<h2>1. Ranthambore National Park, Rajasthan</h2>
<p>Ranthambore is arguably India's finest tiger reserve and offers the best chances of spotting the Bengal tiger in the wild. The park's backdrop of a 10th-century fort and ancient ruins adds a dramatic historical dimension. <strong>Best time:</strong> October to June. <strong>Safari options:</strong> Canter (20-seater) and Jeep (6-seater) safaris available morning and afternoon.</p>
<p>Beyond tigers, look for leopards, sloth bears, marsh crocodiles, and over 270 bird species. Zone 3, 4, and 5 have historically provided the best tiger sightings.</p>

<h2>2. Jim Corbett National Park, Uttarakhand</h2>
<p>India's oldest national park — established in 1936 — is named after the legendary hunter-turned-conservationist Jim Corbett. Located in the foothills of the Himalayas, the park has a rich diversity of habitats — grasslands, marshlands, and dense forests. <strong>Best time:</strong> November to June. The Dhikala zone offers the most wildlife but requires advance booking of the forest rest house.</p>
<p>Jim Corbett is also home to the Indian elephant (over 600), Gharial crocodile, and over 600 species of birds.</p>

<h2>3. Kaziranga National Park, Assam</h2>
<p>A UNESCO World Heritage site, Kaziranga hosts two-thirds of the world's remaining <strong>one-horned rhinoceroses</strong>. The park's tall elephant grass and marshlands along the Brahmaputra river create a unique habitat. <strong>Best time:</strong> November to April (park closed May-October during floods). Elephant safaris at dawn provide incredibly close encounters with rhinos. The park is also India's most important habitat for water buffalo, and tigers are sighted here too.</p>

<h2>4. Periyar Wildlife Sanctuary, Kerala</h2>
<p>Set around a lake in the Cardamom Hills, Periyar is one of South India's finest wildlife reserves. Its boat safaris are unique — you drift silently across Periyar Lake watching herds of elephants come to drink. <strong>Best time:</strong> September to May. The sanctuary also offers trekking with tribal guides, bamboo rafting, and tiger trails. Species include gaur, sambar deer, Nilgiri langur, and a healthy elephant population.</p>

<h2>5. Sundarbans, West Bengal</h2>
<p>The Sundarbans is the world's largest mangrove forest — a UNESCO World Heritage site spread across India and Bangladesh. It is the only place in the world where tigers live in a tidal mangrove ecosystem, swimming between islands. <strong>Best time:</strong> October to March. Boat safaris through the narrow creeks are the only way to explore. The Sundarbans is also home to the Irrawaddy dolphin, estuarine crocodile, and the elusive fishing cat.</p>

<h2>Wildlife Safari Tips</h2>
<ul>
<li>Book safari permits well in advance — popular zones fill up months ahead</li>
<li>Wear neutral earth-toned clothing — avoid bright colours</li>
<li>Carry binoculars and a good camera with a zoom lens</li>
<li>Follow the park rules — switch off mobile phones, maintain silence</li>
<li>Go on early morning safaris for the best sightings</li>
</ul>

<h2>Book Your Wildlife Safari with Safe Hands Travels</h2>
<p>We arrange complete wildlife packages including permit bookings, jungle lodge stays, expert naturalist guides, and transport. Our wildlife experts help maximise your chances of spotting the Big Five — tiger, elephant, rhino, leopard, and lion.</p>
    `,
  },
];

// =====================================================================
// MAIN EXECUTION
// =====================================================================
async function runAll() {
  console.log('\n============================================');
  console.log('Starting mega populate script...');
  console.log('============================================\n');

  // --- STEP 1: Fix Video Reviews (update names/locations) ---
  console.log('📹 Step 1: Updating video review names and locations...');
  for (const upd of videoReviewUpdates) {
    try {
      await pool.query(
        'UPDATE reviews SET name=?, location=?, rating=? WHERE id=?',
        [upd.name, upd.location, upd.rating, upd.id]
      );
      console.log(`  ✅ Updated review ID ${upd.id} → ${upd.name}, ${upd.location}`);
    } catch (e) {
      console.error(`  ❌ Failed to update review ID ${upd.id}:`, e.message);
    }
  }

  // --- STEP 2: Add Written Reviews ---
  console.log('\n✍️ Step 2: Adding written reviews with avatars...');
  for (const wr of writtenReviews) {
    try {
      // Try to get avatar from Pexels
      let avatarUrl = null;
      let avatarPublicId = null;
      try {
        const imgUrl = await getPexelsImage(wr.avatarQuery);
        if (imgUrl) {
          const upload = await uploadToCloudinary(imgUrl, 'avatars');
          avatarUrl = upload.secure_url;
          avatarPublicId = upload.public_id;
        }
      } catch (imgErr) {
        console.log(`    ⚠️ Avatar upload failed for ${wr.name}, skipping avatar`);
      }

      await pool.query(
        'INSERT INTO written_reviews (name, rating, date, title, review, location, avatar, avatar_public_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [wr.name, wr.rating, wr.date, wr.title, wr.review, wr.location, avatarUrl, avatarPublicId, 'active']
      );
      console.log(`  ✅ Added written review from ${wr.name}`);
      await sleep(300);
    } catch (e) {
      console.error(`  ❌ Failed to add review for ${wr.name}:`, e.message);
    }
  }

  // --- STEP 3: Add Blog Posts ---
  console.log('\n📝 Step 3: Adding blog posts with hero images...');
  for (const blog of blogPosts) {
    try {
      // Get hero image from Pexels
      let heroImage = null;
      let heroImagePublicId = null;
      const imgUrl = await getPexelsImage(blog.imageQuery);
      if (imgUrl) {
        const upload = await uploadToCloudinary(imgUrl, 'blog_heroes');
        heroImage = upload.secure_url;
        heroImagePublicId = upload.public_id;
        console.log(`  ☁️ Hero image uploaded for: ${blog.title.substring(0, 50)}...`);
      }

      const slug = slugify(blog.title);
      const tagsJson = JSON.stringify(blog.tags);
      const keywordsJson = JSON.stringify(blog.tags);

      await pool.query(
        `INSERT INTO blogs (title, slug, description, content, hero_image, hero_image_public_id, category, tags, author, featured, status, meta_title, meta_description, meta_keywords, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          blog.title,
          slug,
          blog.description,
          blog.content.trim(),
          heroImage,
          heroImagePublicId,
          blog.category,
          tagsJson,
          blog.author,
          1,
          'published',
          blog.metaTitle,
          blog.metaDescription,
          keywordsJson,
        ]
      );
      console.log(`  ✅ Added blog: ${blog.title.substring(0, 60)}...`);
      await sleep(500);
    } catch (e) {
      console.error(`  ❌ Failed to add blog "${blog.title.substring(0, 40)}...":`, e.message);
    }
  }

  // --- STEP 4: Link blogs to trips ---
  console.log('\n🔗 Step 4: Linking blogs to related trips...');
  try {
    const [blogs] = await pool.query('SELECT id, category FROM blogs WHERE status=\'published\'');
    for (const blog of blogs) {
      const [trips] = await pool.query(
        'SELECT id FROM trips WHERE status=\'active\' AND JSON_CONTAINS(category, ?) LIMIT 3',
        [JSON.stringify(blog.category)]
      );
      if (trips.length > 0) {
        const tripIds = trips.map(t => t.id);
        await pool.query(
          'UPDATE trips SET related_blog_ids=? WHERE id IN (?)',
          [JSON.stringify([blog.id]), tripIds]
        );
        console.log(`  ✅ Linked blog ID ${blog.id} (${blog.category}) to trip IDs: ${tripIds.join(', ')}`);
      }
    }
  } catch (e) {
    console.error('  ❌ Blog-trip linking failed:', e.message);
  }

  console.log('\n============================================');
  console.log('✅ ALL DONE! Summary:');
  console.log(`  - ${videoReviewUpdates.length} video reviews updated`);
  console.log(`  - ${writtenReviews.length} written reviews added`);
  console.log(`  - ${blogPosts.length} blog posts added with hero images`);
  console.log('  - Blog-trip relationships linked');
  console.log('============================================\n');

  process.exit(0);
}

runAll().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
