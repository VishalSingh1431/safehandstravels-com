import pool from '../config/database.js';

async function testParse() {
  const [rows] = await pool.query('SELECT intro FROM trips WHERE title = \'RAJASTHAN - Program for Sandra Switzerland - Feb 26\' LIMIT 1');
  let intro = rows[0].intro;
  
  // First, fix strong tags
  intro = intro.replace(/<strong>([^<\n\r]*)/g, '<strong>$1</strong>');
  
  // Now try to extract days
  // We look for patterns like: "Day 1:", "20th Feb:", etc.
  const dayRegex = /(?:<strong>)?(?:Day \d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)\s*[:-]?\s*(.*?)(?:<\/strong>)?(?=\n\n(?:<strong>)?(?:Day \d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)|$)/gis;
  
  // Wait, splitting by lines might be easier.
  const lines = intro.split('\n');
  const itinerary = [];
  let currentDay = null;
  let currentIntro = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Check if line is a day heading
    // e.g. <strong>20th Feb: Arrival in Delhi</strong>
    // e.g. <strong>Day 1 - Arrival</strong>
    const dayMatch = line.match(/^<strong>(?:Day\s*\d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)\s*[:-]\s*(.*?)<\/strong>$/i) || line.match(/^(?:Day\s*\d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)\s*[:-]\s*(.*?)$/i);
    
    if (dayMatch) {
      if (currentDay) {
        itinerary.push(currentDay);
      }
      currentDay = {
        day: line.replace(/<\/?strong>/g, ''), // Just store the raw matched line text as the day heading
        title: "",
        activities: []
      };
    } else if (currentDay) {
      currentDay.activities.push(line);
    } else {
      currentIntro.push(line);
    }
  }
  if (currentDay) itinerary.push(currentDay);
  
  console.log("Intro text:");
  console.log(currentIntro.join('\n'));
  
  console.log("\nParsed Days:", itinerary.length);
  if (itinerary.length > 0) {
    console.log("Day 1:", itinerary[0]);
    console.log("Day 2:", itinerary[1]);
  }
}

testParse().then(() => process.exit(0));
