import pool from '../config/database.js';

function trimIntroText(intro) {
  if (!intro || typeof intro !== 'string') return intro;
  
  const lines = intro.split('\n');
  const cleanLines = [];
  
  const stopKeywords = [
    'key points', 
    'overview', 
    'why this tour', 
    'why visit', 
    'detailed itinerary', 
    'tour highlights',
    'program details',
    'important information',
    'note:',
    'notes:'
  ];
  
  for (let line of lines) {
    const trimmedLine = line.trim().toLowerCase();
    
    // Check if we hit a stop keyword (either exact match or starting with it)
    const shouldStop = stopKeywords.some(keyword => {
      // Remove symbols like asterisks, strong tags, dashes to check match
      const cleanLine = trimmedLine.replace(/[\*#\-:_]/g, '').replace(/<\/?strong>/g, '').trim();
      return cleanLine.startsWith(keyword) || cleanLine === keyword;
    });
    
    if (shouldStop && cleanLines.join('').trim().length > 100) {
      break;
    }
    
    cleanLines.push(line);
  }
  
  // Reconstruct the trimmed intro, join with newline, and trim trailing newlines/spaces
  return cleanLines.join('\n').trim();
}

async function trimIntros() {
  try {
    const [trips] = await pool.query('SELECT id, title, intro FROM trips WHERE CHAR_LENGTH(intro) > 1000');
    console.log(`Found ${trips.length} trips with long intros to trim.`);
    
    let updatedCount = 0;
    
    for (const trip of trips) {
      const trimmed = trimIntroText(trip.intro);
      
      if (trimmed !== trip.intro && trimmed.length > 50) { // Safety check: don't save if it turns out empty or extremely small due to false matches
        await pool.query('UPDATE trips SET intro = ? WHERE id = ?', [trimmed, trip.id]);
        console.log(`Trimmed ID ${trip.id} ("${trip.title}"): ${trip.intro.length} chars -> ${trimmed.length} chars`);
        updatedCount++;
      } else if (trimmed.length <= 50) {
        console.log(`⏭️ Skipped ID ${trip.id} ("${trip.title}"): Trimmed text too short (${trimmed.length} chars).`);
      }
    }
    
    console.log(`Successfully trimmed intros for ${updatedCount} trips!`);
  } catch (error) {
    console.error('Failed to trim intros:', error);
  } finally {
    process.exit(0);
  }
}

trimIntros();
