import pool from '../config/database.js';

async function addDemoTrip() {
  try {
    const query = `
      INSERT INTO trips (
        title, location, duration, price, old_price, 
        image_url, subtitle, intro, is_popular, slug, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      'Demo Paris Trip',
      'Paris, France',
      '5 Days, 4 Nights',
      '49999',
      '59999',
      'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
      'Experience the magic of Paris',
      'This is a demo trip created to test the local frontend display.',
      true,
      'demo-paris-trip-' + Date.now(),
      'active'
    ];

    const [result] = await pool.query(query, values);
    console.log(`✅ Demo trip added successfully! Insert ID: ${result.insertId}`);
  } catch (error) {
    console.error('❌ Failed to add demo trip:', error);
  } finally {
    process.exit(0);
  }
}

addDemoTrip();
