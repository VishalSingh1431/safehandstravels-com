import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const TARGET_DIR = 'C:/Users/visha/Downloads/European Final-20260722T175314Z-1-001';
const OUT_FILE = 'C:/Users/visha/Desktop/safehandstravels-com/backend/scripts/generated_batch_insert.js';

// Helper to recursively get all docx files
function getDocxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getDocxFiles(filePath, fileList);
    } else if (filePath.toLowerCase().endsWith('.docx') && !file.startsWith('~$')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Very basic heuristic parser
function parseHtmlToTrip(html, filename) {
  const trip = {
    title: filename.replace('.docx', '').trim(),
    location: '',
    duration: '',
    price: 'On Request',
    image_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
    subtitle: '',
    intro: '',
    is_popular: 0,
    slug: filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    status: 'active',
    included: [],
    excluded: [],
    itinerary: []
  };

  let blocks = html.split(/<\/p>\s*<p>/i);
  blocks = blocks.map(b => b.replace(/<\/?p>/ig, '').trim()).filter(b => b);

  let currentSection = 'intro';
  let currentDay = null;

  for (let block of blocks) {
    const textOnly = block.replace(/<[^>]+>/g, '').toLowerCase().trim();
    
    if (textOnly.includes('cost includes') || textOnly.includes('inclusions') || textOnly.includes('included')) {
      currentSection = 'included';
      continue;
    }
    if (textOnly.includes('cost excludes') || textOnly.includes('exclusions') || textOnly.includes('not included')) {
      currentSection = 'excluded';
      continue;
    }
    if (textOnly.match(/^day\s*\d+/)) {
      currentSection = 'itinerary';
      
      const dayMatch = block.match(/^(<[^>]+>)?(Day\s*\d+)(<[^>]+>)?[\s:-]+(.*)$/i);
      let dayTitle = "Activity";
      let dayNumber = textOnly.match(/^day\s*\d+/)[0];

      if (dayMatch) {
        dayNumber = dayMatch[2];
        dayTitle = dayMatch[4].replace(/<[^>]+>/g, '').trim();
      }

      currentDay = {
        day: dayNumber.trim(),
        title: dayTitle || "Activity",
        activities: [],
        stay: "Overnight stay"
      };
      trip.itinerary.push(currentDay);
      continue;
    }

    if (currentSection === 'included') {
      trip.included.push(block);
    } else if (currentSection === 'excluded') {
      trip.excluded.push(block);
    } else if (currentSection === 'itinerary' && currentDay) {
      if (textOnly.includes('overnight') || textOnly.includes('dinner &')) {
        currentDay.stay = block;
      } else {
        currentDay.activities.push(block);
      }
    } else if (currentSection === 'intro') {
      if (!trip.intro) trip.intro = block;
    }
  }

  return trip;
}

async function main() {
  console.log('Starting ingestion...');
  const files = getDocxFiles(TARGET_DIR);
  console.log(`Found ${files.length} .docx files.`);

  const trips = [];
  
  for (const file of files) {
    try {
      const result = await mammoth.convertToHtml({ path: file });
      const filename = path.basename(file);
      const trip = parseHtmlToTrip(result.value, filename);
      trips.push(trip);
      console.log(`Parsed: ${filename}`);
    } catch (err) {
      console.error(`Error parsing ${file}:`, err);
    }
  }

  const fileContent = `import pool from '../config/database.js';

const newTrips = ${JSON.stringify(trips, null, 2)};

async function insertBatch4() {
  try {
    for (const trip of newTrips) {
      const query = \`
        INSERT INTO trips (
          title, location, duration, price, 
          image_url, subtitle, intro, is_popular, slug, status,
          itinerary, included, not_included
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      \`;
      await pool.query(query, [
        trip.title, trip.location, trip.duration, trip.price,
        trip.image_url, trip.subtitle, trip.intro, trip.is_popular, trip.slug, trip.status,
        JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded)
      ]);
    }
    console.log("✅ Batch 4 (" + newTrips.length + " new trips) inserted successfully with rich text and bold tags!");
  } catch (error) {
    console.error('❌ Failed to insert Batch 4:', error);
  } finally {
    process.exit(0);
  }
}

insertBatch4();
`;

  fs.writeFileSync(OUT_FILE, fileContent);
  console.log(`Successfully generated ${OUT_FILE} with ${trips.length} trips.`);
}

main();
