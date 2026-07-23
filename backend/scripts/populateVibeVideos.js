import pool from '../config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const vibeVideos = [
  {
    youtubeUrl: 'https://www.youtube.com/shorts/lqEwA7Q_EHE',
    youtubeId: 'lqEwA7Q_EHE',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/y25wXfJj19A',
    youtubeId: 'y25wXfJj19A',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/6T-N4Ppe32A',
    youtubeId: '6T-N4Ppe32A',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/0rG_GZJqU5w',
    youtubeId: '0rG_GZJqU5w',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/n3kU2sW-Ysc',
    youtubeId: 'n3kU2sW-Ysc',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/7e67-d86R-g',
    youtubeId: '7e67-d86R-g',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/9rW8yZfE-5w',
    youtubeId: '9rW8yZfE-5w',
    isTall: true
  },
  {
    youtubeUrl: 'https://www.youtube.com/shorts/d2uCmg7W6Bw',
    youtubeId: 'd2uCmg7W6Bw',
    isTall: true
  }
];

async function populateVibeVideos() {
  try {
    console.log('Starting vibe videos population in app_settings table...');
    
    const videosJson = JSON.stringify(vibeVideos);
    
    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES ('vibe_videos', ?)
      ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP
    `, [videosJson, videosJson]);
    
    console.log('✅ Successfully populated vibe videos in database!');
  } catch (error) {
    console.error('❌ Failed to populate vibe videos:', error);
  } finally {
    process.exit(0);
  }
}

populateVibeVideos();
