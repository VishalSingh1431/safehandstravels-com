import mysql from 'mysql2/promise';

async function checkDb() {
  try {
    const connection = await mysql.createConnection('mysql://sht_user:SafeHands1431%40@200.141.0.251:3306/safehands_vps_db');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('Database has no tables.');
      await connection.end();
      return;
    }
    
    console.log(`Found ${tables.length} tables. Checking for data...`);
    let totalRows = 0;
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      const count = countResult[0].count;
      totalRows += count;
      if (count > 0) {
        console.log(`Table '${tableName}' has ${count} rows.`);
      }
    }
    
    if (totalRows === 0) {
      console.log('All tables are empty. The database has no data.');
    } else {
      console.log(`\nTotal rows across all tables: ${totalRows}`);
    }
    
    await connection.end();
  } catch (error) {
    console.error('Error connecting to or querying the database:', error.message);
  }
}

checkDb();
