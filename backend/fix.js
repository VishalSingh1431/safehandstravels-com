import fs from 'fs';

let content = fs.readFileSync('scripts/generated_batch_insert.js', 'utf8');
const idx = content.indexOf('async function insertBatch4()');
if (idx !== -1) {
  content = content.substring(0, idx);
  content += `
async function insertBatch4() {
  try {
    for (const trip of newTrips) {
      const [rows] = await pool.query('SELECT * FROM trips WHERE slug = ?', [trip.slug]);
      if (rows.length > 0) {
        const existing = rows[0];
        const newDataLen = JSON.stringify(trip).length;
        const oldDataLen = JSON.stringify(existing).length;
        if (newDataLen > oldDataLen) {
          console.log(\`Updating duplicate (new data is larger): \${trip.slug}\`);
          const updateQuery = \`
            UPDATE trips SET
              title=?, location=?, duration=?, price=?, 
              image_url=?, subtitle=?, intro=?, is_popular=?, status=?,
              itinerary=?, included=?, not_included=?
            WHERE slug = ?
          \`;
          await pool.query(updateQuery, [
            trip.title, trip.location, trip.duration, trip.price,
            trip.image_url, trip.subtitle, trip.intro, trip.is_popular, trip.status,
            JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded),
            trip.slug
          ]);
        } else {
          console.log(\`Skipping duplicate (existing has more data): \${trip.slug}\`);
        }
      } else {
        const insertQuery = \`
          INSERT INTO trips (
            title, location, duration, price, 
            image_url, subtitle, intro, is_popular, slug, status,
            itinerary, included, not_included
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        \`;
        await pool.query(insertQuery, [
          trip.title, trip.location, trip.duration, trip.price,
          trip.image_url, trip.subtitle, trip.intro, trip.is_popular, trip.slug, trip.status,
          JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded)
        ]);
        console.log(\`Inserted new trip: \${trip.slug}\`);
      }
    }
    console.log("✅ Batch 4 ingestion completed.");
  } catch (error) {
    console.error('❌ Failed to insert Batch 4:', error);
  } finally {
    process.exit(0);
  }
}
insertBatch4();
`;
  fs.writeFileSync('scripts/generated_batch_insert.js', content);
}
