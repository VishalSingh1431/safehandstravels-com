import pool from '../config/database.js';

function cleanAmpersands(text) {
  if (!text || typeof text !== 'string') return text;
  // Replace &amp; or &amp with simple &
  // We use a regex that matches &amp;? to cover both cases
  return text.replace(/&amp;?/g, '&');
}

function cleanAmpersandsInObject(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    return cleanAmpersands(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanAmpersandsInObject(item));
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = cleanAmpersandsInObject(obj[key]);
    }
    return newObj;
  }
  return obj;
}

async function fixAmpersands() {
  try {
    const [trips] = await pool.query('SELECT * FROM trips');
    console.log(`Checking ampersands for ${trips.length} trips...`);
    
    let updatedCount = 0;
    
    for (const trip of trips) {
      const updatedTitle = cleanAmpersands(trip.title || '');
      const updatedIntro = cleanAmpersands(trip.intro || '');
      const updatedSubtitle = cleanAmpersands(trip.subtitle || '');
      
      const parseJsonSafe = (val) => {
        try {
          return typeof val === 'string' ? JSON.parse(val) : (val || []);
        } catch {
          return [];
        }
      };
      
      const itinerary = parseJsonSafe(trip.itinerary);
      const included = parseJsonSafe(trip.included);
      const notIncluded = parseJsonSafe(trip.not_included);
      const notes = parseJsonSafe(trip.notes);
      const faq = parseJsonSafe(trip.faq);
      
      const updatedItinerary = cleanAmpersandsInObject(itinerary);
      const updatedIncluded = cleanAmpersandsInObject(included);
      const updatedNotIncluded = cleanAmpersandsInObject(notIncluded);
      const updatedNotes = cleanAmpersandsInObject(notes);
      const updatedFaq = cleanAmpersandsInObject(faq);
      
      const hasChanges = 
        updatedTitle !== trip.title ||
        updatedIntro !== trip.intro ||
        updatedSubtitle !== trip.subtitle ||
        JSON.stringify(updatedItinerary) !== JSON.stringify(itinerary) ||
        JSON.stringify(updatedIncluded) !== JSON.stringify(included) ||
        JSON.stringify(updatedNotIncluded) !== JSON.stringify(notIncluded) ||
        JSON.stringify(updatedNotes) !== JSON.stringify(notes) ||
        JSON.stringify(updatedFaq) !== JSON.stringify(faq);
        
      if (hasChanges) {
        await pool.query(
          `UPDATE trips SET title = ?, intro = ?, subtitle = ?, itinerary = ?, included = ?, not_included = ?, notes = ?, faq = ? WHERE id = ?`,
          [
            updatedTitle,
            updatedIntro,
            updatedSubtitle,
            JSON.stringify(updatedItinerary),
            JSON.stringify(updatedIncluded),
            JSON.stringify(updatedNotIncluded),
            JSON.stringify(updatedNotes),
            JSON.stringify(updatedFaq),
            trip.id
          ]
        );
        console.log(`Updated Trip ID ${trip.id}: "${trip.title}" -> "${updatedTitle}"`);
        updatedCount++;
      }
    }
    
    console.log(`Successfully fixed ampersands in ${updatedCount} trips!`);
  } catch (error) {
    console.error('Failed to fix ampersands:', error);
  } finally {
    process.exit(0);
  }
}

fixAmpersands();
