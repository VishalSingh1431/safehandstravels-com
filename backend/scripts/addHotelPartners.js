import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pool from '../config/database.js';
import HotelPartner from '../models/HotelPartner.js';
import { initializeDatabase } from '../config/database.js';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const hotelPartners = [
  { name: 'Taj Hotels', link: 'https://www.tajhotels.com/' },
  { name: 'Oberoi Hotels', link: 'https://www.oberoihotels.com/' },
  { name: 'Leela', link: 'https://www.theleela.com/' },
  { name: 'Radisson', link: 'https://www.radissonhotels.com/' },
  { name: 'Sarovar Hotels', link: 'https://www.sarovarhotels.com/' },
  { name: 'Clarks', link: 'https://www.clarks.in/' },
  { name: 'ITC', link: 'https://www.itchotels.in/' },
  { name: 'The Lalit', link: 'https://www.thelalit.com/' },
  { name: 'The Park', link: 'https://www.theparkhotels.com/' },
  { name: 'CGH Earth', link: 'https://www.cghearth.com/' },
];

async function addHotelPartners() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    
    console.log('Starting to add hotel partners...');
    
    for (let i = 0; i < hotelPartners.length; i++) {
      const partner = hotelPartners[i];
      
      // Check if partner already exists
      const existing = await pool.query(
        'SELECT id FROM hotel_partners WHERE name = $1',
        [partner.name]
      );
      
      if (existing.rows.length > 0) {
        console.log(`✓ ${partner.name} already exists, skipping...`);
        continue;
      }
      
      // Create new partner
      await HotelPartner.create({
        name: partner.name,
        link: partner.link,
        displayOrder: i + 1,
        status: 'active',
      });
      
      console.log(`✓ Added: ${partner.name}`);
    }
    
    console.log('\n✅ All hotel partners added successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding hotel partners:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run the script
addHotelPartners();

