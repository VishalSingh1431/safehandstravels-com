import pool from '../config/database.js';

async function cleanTitles() {
  try {
    const [trips] = await pool.query('SELECT id, title, slug FROM trips');
    console.log(`Checking titles for ${trips.length} trips...`);
    
    let updatedCount = 0;
    
    for (const trip of trips) {
      let cleanTitle = trip.title;
      
      // 1. Replace underscores with spaces
      cleanTitle = cleanTitle.replace(/_/g, ' ');
      
      // 2. Remove leading list numbering (e.g., "1. Selected..." -> "Selected...")
      // Only matches numbers followed by a dot (e.g. 1. or 01.)
      cleanTitle = cleanTitle.replace(/^\d+\.\s*/, '');
      
      // 3. Remove trailing copy numbers (e.g., "...Delhi(1)" -> "...Delhi")
      cleanTitle = cleanTitle.replace(/\s*\(\d+\)\s*$/, '');
      
      // 4. Remove multiple spaces and trim
      cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
      
      if (cleanTitle !== trip.title) {
        await pool.query('UPDATE trips SET title = ? WHERE id = ?', [cleanTitle, trip.id]);
        console.log(`Updated ID ${trip.id}: "${trip.title}" -> "${cleanTitle}"`);
        updatedCount++;
      }
    }
    
    console.log(`Successfully cleaned ${updatedCount} titles!`);
  } catch (error) {
    console.error('Failed to clean titles:', error);
  } finally {
    process.exit(0);
  }
}

cleanTitles();
