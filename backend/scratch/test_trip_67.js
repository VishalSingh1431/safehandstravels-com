
import pool from '../config/database.js';
import Trip from '../models/Trip.js';

async function testTrip67() {
  try {
    const id = 67;
    console.log(`--- Testing Trip ${id} ---`);
    
    // Check if trip exists
    const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log(`Trip ${id} not found in database.`);
      process.exit(0);
    }
    
    const trip = rows[0];
    console.log('Current city in DB:', trip.city);
    
    const newCity = 'Trip67City ' + Date.now();
    console.log(`Updating to: ${newCity}`);
    
    const updated = await Trip.update(id, { city: newCity });
    console.log('Result from Trip.update:', updated.city);
    
    // Final check in DB
    const [finalRows] = await pool.query('SELECT city FROM trips WHERE id = ?', [id]);
    console.log('Final city in DB:', finalRows[0].city);
    
    if (finalRows[0].city === newCity) {
      console.log('SUCCESS: Persistence verified for trip 67!');
    } else {
      console.log('FAILURE: Persistence FAILED for trip 67!');
    }

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    process.exit(0);
  }
}

testTrip67();
