import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get location filters (public)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT setting_value 
      FROM app_settings 
      WHERE setting_key = 'location_filters'
    `);

    // Default filters if not set
    const defaultFilters = [
      'All',
      'Meghalaya',
      'Spiti Valley',
      'Tirthan Valley',
      'Himachal Pradesh',
      'Shimla',
      'Varanasi',
      'Rishikesh',
      'Kerala Backwaters'
    ];

    let filters = defaultFilters;
    if (result.rows.length > 0 && result.rows[0].setting_value) {
      try {
        filters = typeof result.rows[0].setting_value === 'string' 
          ? JSON.parse(result.rows[0].setting_value)
          : result.rows[0].setting_value;
      } catch (e) {
        filters = defaultFilters;
      }
    }

    res.json({ filters });
  } catch (error) {
    console.error('Error fetching location filters:', error);
    res.status(500).json({ error: 'Failed to fetch location filters' });
  }
});

// Get location filters (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT setting_value 
      FROM app_settings 
      WHERE setting_key = 'location_filters'
    `);

    // Default filters if not set
    const defaultFilters = [
      'All',
      'Meghalaya',
      'Spiti Valley',
      'Tirthan Valley',
      'Himachal Pradesh',
      'Shimla',
      'Varanasi',
      'Rishikesh',
      'Kerala Backwaters'
    ];

    let filters = defaultFilters;
    if (result.rows.length > 0 && result.rows[0].setting_value) {
      try {
        filters = typeof result.rows[0].setting_value === 'string' 
          ? JSON.parse(result.rows[0].setting_value)
          : result.rows[0].setting_value;
      } catch (e) {
        filters = defaultFilters;
      }
    }

    res.json({ filters });
  } catch (error) {
    console.error('Error fetching location filters:', error);
    res.status(500).json({ error: 'Failed to fetch location filters' });
  }
});

// Update location filters (Admin only)
router.put('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { filters } = req.body;

    if (!Array.isArray(filters)) {
      return res.status(400).json({ error: 'Filters must be an array' });
    }

    // Ensure 'All' is always first
    const processedFilters = filters.includes('All') 
      ? ['All', ...filters.filter(f => f !== 'All')]
      : ['All', ...filters];

    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES ('location_filters', $1::jsonb)
      ON CONFLICT (setting_key) 
      DO UPDATE SET setting_value = $1::jsonb, updated_at = CURRENT_TIMESTAMP
    `, [JSON.stringify(processedFilters)]);

    res.json({
      message: 'Location filters updated successfully',
      filters: processedFilters
    });
  } catch (error) {
    console.error('Error updating location filters:', error);
    res.status(500).json({ 
      error: 'Failed to update location filters',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

