import pool from '../config/database.js';

async function deleteDuplicates() {
  try {
    // Find duplicate titles
    const [duplicates] = await pool.query(
      'SELECT title, COUNT(*) as count FROM trips GROUP BY title HAVING count > 1'
    );
    
    console.log(`Found ${duplicates.length} duplicate titles to resolve.`);
    
    for (const dup of duplicates) {
      // Get all IDs for this title
      const [rows] = await pool.query(
        'SELECT id FROM trips WHERE title = ? ORDER BY id ASC',
        [dup.title]
      );
      
      // Keep the first ID, delete the rest
      const keepId = rows[0].id;
      const deleteIds = rows.slice(1).map(r => r.id);
      
      console.log(`For "${dup.title}": Keeping ID ${keepId}, deleting IDs: ${deleteIds.join(', ')}`);
      
      await pool.query('DELETE FROM trips WHERE id IN (?)', [deleteIds]);
    }
    
    console.log('✅ Duplicates deleted successfully!');
  } catch (error) {
    console.error('❌ Failed to delete duplicates:', error);
  } finally {
    process.exit(0);
  }
}

deleteDuplicates();
