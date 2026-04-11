
import pool from '../config/database.js';
import Trip from '../models/Trip.js';

async function testFullUpdate() {
  try {
    const [trips] = await pool.query('SELECT * FROM trips LIMIT 1');
    if (trips.length === 0) {
      console.log('No trips found');
      process.exit(0);
    }
    const trip = trips[0];
    const tripData = { ...trip, oldPrice: trip.old_price }; // Map snake_case to camelCase as frontend does
    
    console.log('--- Testing Full Update ---');
    console.log('Original city:', trip.city);
    
    const newCity = 'FullUpdateCity ' + Date.now();
    tripData.city = newCity;
    
    // Simulate frontend behavior: send everything
    console.log('Performing update with full data object...');
    const result = await Trip.update(trip.id, tripData);
    console.log('Updated city:', result.city);
    
    if (result.city === newCity) {
      console.log('SUCCESS: Full update worked!');
    } else {
      console.log('FAILURE: Full update did not work!');
    }

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    process.exit(0);
  }
}

testFullUpdate();
