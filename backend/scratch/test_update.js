
import pool from '../config/database.js';
import Trip from '../models/Trip.js';

async function testUpdate() {
  try {
    // 1. Find an existing trip
    const [trips] = await pool.query('SELECT id, title, city FROM trips LIMIT 1');
    if (trips.length === 0) {
      console.log('No trips found to test');
      process.exit(0);
    }
    const trip = trips[0];
    console.log('Original Trip:', { id: trip.id, title: trip.title, city: trip.city });

    // 2. Perform update
    const testCity = 'Test City ' + Date.now();
    console.log('Updating city to:', testCity);
    const updatedTrip = await Trip.update(trip.id, { city: testCity });
    console.log('Updated Trip Result:', { id: updatedTrip.id, title: updatedTrip.title, city: updatedTrip.city });

    // 3. Verify in DB
    const [verifyRows] = await pool.query('SELECT city FROM trips WHERE id = ?', [trip.id]);
    console.log('Database Value:', verifyRows[0].city);

    if (verifyRows[0].city === testCity) {
      console.log('SUCCESS: Update worked!');
    } else {
      console.log('FAILURE: Update did not work!');
    }

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    process.exit(0);
  }
}

testUpdate();
