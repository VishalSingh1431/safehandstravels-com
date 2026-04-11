
import pool from '../config/database.js';
import Trip from '../models/Trip.js';

async function testFullFlow() {
  try {
    console.log('--- Testing Full Flow ---');
    
    // 1. Create a trip with city
    const tripData = {
      title: 'Full Flow Test ' + Date.now(),
      location: ['TestState'],
      city: 'OriginalCity',
      duration: '5 days',
      price: '5000',
      category: ['Adventure'],
      slug: 'test-flow-' + Date.now(),
      status: 'active'
    };
    
    console.log('Creating trip...');
    const createdTrip = await Trip.create(tripData);
    console.log('Created Trip ID:', createdTrip.id);
    console.log('Created Trip City:', createdTrip.city);

    if (createdTrip.city !== 'OriginalCity') {
      console.error('FAILURE: City not saved during create!');
    }

    // 2. Update the trip city
    const updatedCity = 'UpdatedCity';
    console.log('Updating trip city to:', updatedCity);
    const updatedTrip = await Trip.update(createdTrip.id, { city: updatedCity });
    console.log('Updated Trip City:', updatedTrip.city);

    if (updatedTrip.city !== updatedCity) {
      console.error('FAILURE: City not saved during update!');
    }

    // 3. Cleanup
    console.log('Cleaning up...');
    await pool.query('DELETE FROM trips WHERE id = ?', [createdTrip.id]);
    console.log('SUCCESS: Full flow test completed.');

  } catch (error) {
    console.error('Test Error:', error);
  } finally {
    process.exit(0);
  }
}

testFullFlow();
