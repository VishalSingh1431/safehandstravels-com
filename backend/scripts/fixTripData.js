import pool from '../config/database.js';

function fixStrongTags(text) {
  if (!text || typeof text !== 'string') return text;
  // Replace <strong> followed by non-tag, non-newline characters, wrapping in </strong>
  return text.replace(/<strong>([^<\n\r]*)/g, '<strong>$1</strong>');
}

function fixStrongInArray(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(item => {
    if (typeof item === 'string') {
      return fixStrongTags(item);
    } else if (item && typeof item === 'object') {
      const newItem = { ...item };
      for (let key in newItem) {
        if (typeof newItem[key] === 'string') {
          newItem[key] = fixStrongTags(newItem[key]);
        } else if (Array.isArray(newItem[key])) {
          newItem[key] = fixStrongInArray(newItem[key]);
        }
      }
      return newItem;
    }
    return item;
  });
}

async function fixTripData() {
  const [trips] = await pool.query('SELECT * FROM trips');
  console.log(`Fetched ${trips.length} trips from database.`);

  let fixedCount = 0;
  let parsedItineraryCount = 0;

  for (const trip of trips) {
    let updatedIntro = fixStrongTags(trip.intro || '');
    let updatedSubtitle = fixStrongTags(trip.subtitle || '');
    
    // Parse itinerary safely
    let itinerary = [];
    try {
      itinerary = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : (trip.itinerary || []);
    } catch (e) {
      itinerary = [];
    }
    
    let updatedItinerary = fixStrongInArray(itinerary);
    
    // Check if itinerary is empty and needs to be parsed from intro
    let itineraryParsed = false;
    if (updatedItinerary.length === 0 && updatedIntro.trim().length > 1000) {
      console.log(`\n----------------------------------------`);
      console.log(`Trip "${trip.title}" has empty itinerary but long intro (${updatedIntro.length} chars). Parsing...`);
      
      const lines = updatedIntro.split('\n');
      const newItinerary = [];
      let currentDay = null;
      const newIntroLines = [];
      
      for (let line of lines) {
        line = line.trim();
        if (!line) continue;
        
        // Match day headers like Day 1 - ... or 20th Feb: ... or 20 Feb: ...
        // We require a colon or dash to avoid matching normal text starting with numbers.
        const dayMatch = line.match(/^<strong>(?:Day\s*\d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)\s*[:-]\s*(.*?)<\/strong>$/i) || 
                         line.match(/^(?:Day\s*\d+|[0-9]{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+)\s*[:-]\s*(.*?)$/i);
                         
        if (dayMatch) {
          if (currentDay) {
            newItinerary.push(currentDay);
          }
          currentDay = {
            day: line.replace(/<\/?strong>/g, ''),
            title: dayMatch[1].trim(),
            activities: []
          };
        } else if (currentDay) {
          currentDay.activities.push(line);
        } else {
          newIntroLines.push(line);
        }
      }
      
      if (currentDay) {
        newItinerary.push(currentDay);
      }
      
      if (newItinerary.length > 0) {
        updatedItinerary = newItinerary;
        updatedIntro = newIntroLines.join('\n\n');
        itineraryParsed = true;
        parsedItineraryCount++;
        console.log(`Successfully parsed ${newItinerary.length} days. Truncated intro to ${updatedIntro.length} chars.`);
      } else {
        console.log(`Failed to parse any itinerary days for "${trip.title}".`);
      }
    }
    
    // Also fix strong tags in other rich text arrays
    const fixRichTextColumn = (col) => {
      try {
        const parsed = typeof col === 'string' ? JSON.parse(col) : col;
        return JSON.stringify(fixStrongInArray(parsed || []));
      } catch {
        return JSON.stringify([]);
      }
    };

    const updatedIncluded = fixRichTextColumn(trip.included);
    const updatedNotIncluded = fixRichTextColumn(trip.not_included);
    const updatedNotes = fixRichTextColumn(trip.notes);
    const updatedFaq = fixRichTextColumn(trip.faq);
    
    // Check if we actually made any changes
    const originalItineraryStr = JSON.stringify(itinerary);
    const updatedItineraryStr = JSON.stringify(updatedItinerary);
    
    const hasChanges = 
      updatedIntro !== trip.intro ||
      updatedSubtitle !== trip.subtitle ||
      updatedItineraryStr !== originalItineraryStr ||
      updatedIncluded !== (typeof trip.included === 'string' ? trip.included : JSON.stringify(trip.included)) ||
      updatedNotIncluded !== (typeof trip.not_included === 'string' ? trip.not_included : JSON.stringify(trip.not_included)) ||
      updatedNotes !== (typeof trip.notes === 'string' ? trip.notes : JSON.stringify(trip.notes)) ||
      updatedFaq !== (typeof trip.faq === 'string' ? trip.faq : JSON.stringify(trip.faq));
      
    if (hasChanges) {
      await pool.query(
        `UPDATE trips SET intro = ?, subtitle = ?, itinerary = ?, included = ?, not_included = ?, notes = ?, faq = ? WHERE id = ?`,
        [updatedIntro, updatedSubtitle, updatedItineraryStr, updatedIncluded, updatedNotIncluded, updatedNotes, updatedFaq, trip.id]
      );
      fixedCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Data cleanup finished!`);
  console.log(`Total trips checked: ${trips.length}`);
  console.log(`Total trips updated in DB: ${fixedCount}`);
  console.log(`Trips with newly parsed itineraries: ${parsedItineraryCount}`);
}

fixTripData()
  .then(() => {
    console.log('Script execution completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error executing script:', err);
    process.exit(1);
  });
