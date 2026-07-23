import pool from '../config/database.js';

async function cleanUnderscores() {
  try {
    const [rows] = await pool.query('SELECT slug, title FROM trips WHERE title LIKE "%_%"');
    console.log(`Found ${rows.length} trips with underscores in the title.`);
    
    for (const row of rows) {
      let clean = row.title.replace(/_/g, '-').replace(/\s*-\s*/g, ' - ').replace(/\s{2,}/g, ' ').trim();
      
      // Some formatting cleanup specifically for titles like "Spirituality of India _ Delhi..."
      // Let's replace underscore with a simple dash or just space.
      clean = row.title.replace(/_/g, ' ').replace(/\s{2,}/g, ' ').trim();

      await pool.query('UPDATE trips SET title = ? WHERE slug = ?', [clean, row.slug]);
      console.log(`Updated: "${row.title}" -> "${clean}"`);
    }
    
    console.log("✅ Underscores removed from all headings!");
  } catch (error) {
    console.error('❌ Failed to clean underscores:', error);
  } finally {
    process.exit(0);
  }
}

cleanUnderscores();
