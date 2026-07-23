import pool from '../config/database.js';

function cleanLastDayActivities(activities) {
  const stopKeywords = [
    'thank you',
    'the tour ends',
    'tour ends',
    'end of the tour',
    'end of tour',
    'travel logistics',
    'accommodations:',
    'accommodation:',
    'tips:',
    'why book this',
    'why choose this',
    'why book',
    'contact us',
    'book now',
    'key citations',
    'sources',
    'references',
    'notes:',
    'note:',
    'best time to travel'
  ];
  
  const stopExactKeywords = [
    'route',
    'distance',
    'mode',
    'duration'
  ];
  
  const shouldStopText = (text) => {
    if (!text || typeof text !== 'string') return false;
    const cleanText = text.trim().toLowerCase().replace(/[\*#_\-]/g, '').replace(/<\/?strong>/g, '').trim();
    
    // Check partial matches
    const hasPartial = stopKeywords.some(kw => cleanText.includes(kw));
    if (hasPartial) return true;
    
    // Check exact matches for table headers
    const hasExact = stopExactKeywords.some(kw => cleanText === kw);
    if (hasExact) return true;
    
    return false;
  };

  if (Array.isArray(activities)) {
    const newActivities = [];
    for (const act of activities) {
      if (shouldStopText(act)) {
        break;
      }
      newActivities.push(act);
    }
    return newActivities;
  } else if (typeof activities === 'string') {
    const lines = activities.split('\n');
    const newLines = [];
    for (const line of lines) {
      if (shouldStopText(line)) {
        break;
      }
      newLines.push(line);
    }
    return newLines.join('\n').trim();
  }
  
  return activities;
}

async function trimLastDayItineraries() {
  try {
    const [trips] = await pool.query('SELECT id, title, itinerary FROM trips');
    console.log(`Checking itineraries for ${trips.length} trips...`);
    
    let updatedCount = 0;
    
    for (const trip of trips) {
      let itinerary = trip.itinerary;
      if (!itinerary) continue;
      
      // If it's a string, parse it
      let isString = false;
      if (typeof itinerary === 'string') {
        try {
          itinerary = JSON.parse(itinerary);
          isString = true;
        } catch (e) {
          continue;
        }
      }
      
      if (!Array.isArray(itinerary) || itinerary.length === 0) continue;
      
      const lastIndex = itinerary.length - 1;
      const lastDay = itinerary[lastIndex];
      
      if (!lastDay || !lastDay.activities) continue;
      
      const originalLength = Array.isArray(lastDay.activities) 
        ? lastDay.activities.length 
        : String(lastDay.activities).length;
        
      const cleanedActivities = cleanLastDayActivities(lastDay.activities);
      
      const cleanedLength = Array.isArray(cleanedActivities)
        ? cleanedActivities.length
        : String(cleanedActivities).length;
        
      if (cleanedLength !== originalLength) {
        // Update the last day
        itinerary[lastIndex] = {
          ...lastDay,
          activities: cleanedActivities
        };
        
        await pool.query(
          'UPDATE trips SET itinerary = ? WHERE id = ?',
          [JSON.stringify(itinerary), trip.id]
        );
        
        console.log(`Cleaned last day for ID ${trip.id} ("${trip.title}"): Reduced activities from ${originalLength} to ${cleanedLength}`);
        updatedCount++;
      }
    }
    
    console.log(`Successfully cleaned up last day itineraries for ${updatedCount} trips!`);
  } catch (error) {
    console.error('Failed to trim last day itineraries:', error);
  } finally {
    process.exit(0);
  }
}

trimLastDayItineraries();
