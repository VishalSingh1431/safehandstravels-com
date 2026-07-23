import pool from '../config/database.js';

const rules = [
  {
    category: 'Spiritual',
    keywords: ['jyotirlinga', 'temple', 'yatra', 'kashi', 'ayodhya', 'prayagraj', 'varanasi', 'spiritual', 'tirupati', 'vaishno devi', 'kedarnath', 'shirdi', 'dham', 'mathura', 'haridwar', 'rishikesh', 'mahakaleshwar', 'omkareshwar', 'somnath', 'dwarka', 'pilgrimage', 'religious']
  },
  {
    category: 'Cultural',
    keywords: ['golden triangle', 'gt ', 'rajasthan', 'forts', 'palaces', 'heritage', 'culture', 'classical', 'historical', 'architecture']
  },
  {
    category: 'Heritage',
    keywords: ['heritage', 'palaces', 'forts', 'historical', 'monuments', 'unesco']
  },
  {
    category: 'Wildlife',
    keywords: ['wildlife', 'safari', 'ranthambore', 'periyar', 'national park', 'tiger']
  },
  {
    category: 'Beach',
    keywords: ['beach', 'goa', 'andaman', 'kovalam']
  },
  {
    category: 'Himalayan',
    keywords: ['himachal', 'shimla', 'manali', 'kashmir', 'sikkim', 'himalayan', 'darjeeling', 'srinagar', 'gulmarg', 'pahalgam', 'gangtok']
  },
  {
    category: 'Wellness',
    keywords: ['wellness', 'yoga', 'ayurveda', 'spa', 'meditation']
  },
  {
    category: 'Adventure',
    keywords: ['adventure', 'trek', 'rafting', 'camping']
  }
];

async function categorizeTrips() {
  try {
    const [trips] = await pool.query('SELECT id, slug, title, itinerary FROM trips');
    let updatedCount = 0;

    for (const trip of trips) {
      const titleLower = (trip.title || '').toLowerCase();
      const itineraryLower = (typeof trip.itinerary === 'string' ? trip.itinerary : JSON.stringify(trip.itinerary || [])).toLowerCase();
      const textToSearch = titleLower + ' ' + itineraryLower;
      
      let assignedCategories = [];

      for (const rule of rules) {
        if (rule.keywords.some(kw => textToSearch.includes(kw))) {
          assignedCategories.push(rule.category);
        }
      }

      // If empty array, it will just remain empty, which falls back to All India Tours.
      if (assignedCategories.length > 0) {
        // Remove duplicates just in case
        assignedCategories = [...new Set(assignedCategories)];

        const updateQuery = 'UPDATE trips SET category = ? WHERE id = ?';
        await pool.query(updateQuery, [JSON.stringify(assignedCategories), trip.id]);
        
        console.log(`✅ Categorized "${trip.title}": ${assignedCategories.join(', ')}`);
        updatedCount++;
      } else {
         console.log(`⚠️ No category matched for: "${trip.title}"`);
      }
    }

    console.log(`\n🎉 Successfully categorized ${updatedCount} trips.`);
  } catch (error) {
    console.error("❌ Failed to categorize:", error);
  } finally {
    process.exit(0);
  }
}

categorizeTrips();
