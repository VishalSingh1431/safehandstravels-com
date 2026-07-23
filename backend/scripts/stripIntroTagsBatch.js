import pool from '../config/database.js';

async function stripAll() {
  const [trips] = await pool.query('SELECT id, title, intro FROM trips');
  console.log(`Starting to strip <strong> tags from intro for all ${trips.length} trips...`);
  
  let cleanedCount = 0;
  for (const trip of trips) {
    if (!trip.intro) continue;
    const cleanIntro = trip.intro.replace(/<\/?strong>/gi, '');
    
    if (cleanIntro !== trip.intro) {
      await pool.query('UPDATE trips SET intro = ? WHERE id = ?', [cleanIntro, trip.id]);
      cleanedCount++;
    }
  }
  
  console.log(`Successfully cleaned ${cleanedCount} trips!`);
}

stripAll()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
