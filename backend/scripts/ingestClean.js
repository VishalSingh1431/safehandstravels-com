import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pool from '../config/database.js';

const TARGET_DIR = 'C:/Users/visha/Downloads/European Final-20260722T175314Z-1-001';

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

function cleanTitle(filename) {
  // Removes leading "1.", "15 -", "Copy of ", etc. but keeps things like "05 Days"
  let title = filename.replace(/^(?:Copy of\s+)?(?:\d+[\.\-]\s+)?(.*)\.docx$/i, '$1').trim();
  // Sometimes files are named "13-central-india", we replace hyphens with spaces for the title if there are no spaces
  if (!title.includes(' ') && title.includes('-')) {
     title = title.replace(/-/g, ' ');
  }
  return title;
}

async function processFile(filePath) {
  const filename = path.basename(filePath);
  const slug = filename.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const title = cleanTitle(filename);

  const result = await mammoth.convertToHtml({ path: filePath });
  let html = result.value;
  
  html = html.replace(/<a\s+id="[^"]+"><\/a>/g, '');
  let blocks = html.split(/<\/?(?:p|h1|h2|h3|h4|h5|h6|ul|li)>/i);
  blocks = blocks.map(b => b.trim()).filter(b => b.length > 0);

  const trip = {
    title: title,
    slug: slug,
    intro: '',
    itinerary: [],
    included: [],
    excluded: []
  };

  let currentSection = 'intro';
  let currentDay = null;

  for (let block of blocks) {
    const textOnly = block.replace(/<[^>]+>/g, '').trim().toLowerCase();
    
    const dayMatch = block.match(/^(?:<strong>)?Day\s*(\d+)\s*[:-]?\s*(.*?)(?:<\/strong>)?$/i);
    
    if (dayMatch || block.startsWith('Day 0') || block.startsWith('Day 1') || block.startsWith('Day 2') || block.startsWith('Day 3') || block.startsWith('Day 4') || block.startsWith('Day 5') || block.startsWith('Day 6') || block.startsWith('Day 7') || block.startsWith('Day 8') || block.startsWith('Day 9')) {
      currentSection = 'itinerary';
      
      let dayNumberMatch = block.match(/Day\s*\d+/i);
      let dayNumber = dayNumberMatch ? dayNumberMatch[0] : 'Day';
      let dayTitle = block.replace(/^(?:<strong>)?Day\s*\d+\s*[:-]?\s*/i, '').replace(/<\/strong>$/, '').trim();
      dayTitle = dayTitle.replace(/<[^>]+>/g, '').trim();

      currentDay = {
        day: dayNumber,
        title: dayTitle,
        activities: [],
        stay: "Overnight stay"
      };
      trip.itinerary.push(currentDay);
      continue;
    }
    
    if (textOnly.includes('what\'s included') || textOnly.includes('tour cost includes') || textOnly.includes('cost includes') || textOnly.includes('inclusions')) {
      currentSection = 'included';
      continue;
    }
    if (textOnly.includes('what\'s not included') || textOnly.includes('tour cost excludes') || textOnly.includes('excludes') || textOnly.includes('cost excludes') || textOnly.includes('exclusions') || textOnly.includes('not included')) {
      currentSection = 'excluded';
      continue;
    }

    if (currentSection === 'itinerary' && currentDay) {
      if (textOnly.includes('overnight stay') || textOnly.includes('overnight at') || textOnly.includes('dinner & overnight') || textOnly.includes('dinner and overnight')) {
        currentDay.stay = block.replace(/<[^>]+>/g, '').trim();
      } else {
        let cleanBlock = block.replace(/<\/?(?!strong)[^>]+>/gi, '').trim();
        if (cleanBlock && cleanBlock !== '<strong></strong>') {
          currentDay.activities.push(cleanBlock);
        }
      }
    } else if (currentSection === 'included') {
      let cleanBlock = block.replace(/<\/?(?!strong)[^>]+>/gi, '').trim();
      if (cleanBlock && cleanBlock !== '<strong></strong>') trip.included.push(cleanBlock);
    } else if (currentSection === 'excluded') {
      let cleanBlock = block.replace(/<\/?(?!strong)[^>]+>/gi, '').trim();
      if (cleanBlock && cleanBlock !== '<strong></strong>') trip.excluded.push(cleanBlock);
    } else if (currentSection === 'intro') {
      let cleanBlock = block.replace(/<\/?(?!strong)[^>]+>/gi, '').trim();
      // Simple heuristic: If intro starts getting too long, maybe we just append to it
      if (cleanBlock && cleanBlock !== '<strong></strong>') {
         if (trip.intro) trip.intro += "\n\n" + cleanBlock;
         else trip.intro = cleanBlock;
      }
    }
  }

  return trip;
}

async function main() {
  console.log('Starting clean ingestion for 68 trips...');
  const files = getDocxFiles(TARGET_DIR);
  let updatedCount = 0;

  for (const file of files) {
    try {
      const trip = await processFile(file);
      
      const updateQuery = `
        UPDATE trips SET
          title=?, intro=?, itinerary=?, included=?, not_included=?
        WHERE slug=?
      `;
      
      const [result] = await pool.query(updateQuery, [
        trip.title, trip.intro, JSON.stringify(trip.itinerary), JSON.stringify(trip.included), JSON.stringify(trip.excluded), trip.slug
      ]);

      if (result.affectedRows > 0) {
        console.log(`✅ Updated: ${trip.slug}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Slug not found: ${trip.slug}`);
      }
    } catch (error) {
      console.error(`❌ Failed on file ${file}: `, error.message);
    }
  }
  
  console.log(`\n🎉 Clean ingestion complete! Successfully updated ${updatedCount} trips.`);
  process.exit(0);
}

main();
