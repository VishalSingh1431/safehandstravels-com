import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get vibe videos (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT setting_value 
      FROM app_settings 
      WHERE setting_key = 'vibe_videos'
    `);

    // Default empty array if not set
    let videos = [];
    if (rows.length > 0 && rows[0].setting_value) {
      try {
        videos = typeof rows[0].setting_value === 'string' 
          ? JSON.parse(rows[0].setting_value)
          : rows[0].setting_value;
      } catch (e) {
        videos = [];
      }
    }

    res.json({ videos });
  } catch (error) {
    console.error('Error fetching vibe videos:', error);
    res.status(500).json({ error: 'Failed to fetch vibe videos' });
  }
});

// Get vibe videos (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT setting_value 
      FROM app_settings 
      WHERE setting_key = 'vibe_videos'
    `);

    // Default empty array if not set
    let videos = [];
    if (rows.length > 0 && rows[0].setting_value) {
      try {
        videos = typeof rows[0].setting_value === 'string' 
          ? JSON.parse(rows[0].setting_value)
          : rows[0].setting_value;
      } catch (e) {
        videos = [];
      }
    }

    res.json({ videos });
  } catch (error) {
    console.error('Error fetching vibe videos:', error);
    res.status(500).json({ error: 'Failed to fetch vibe videos' });
  }
});

// Update vibe videos (Admin only)
router.put('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { videos } = req.body;

    if (!Array.isArray(videos)) {
      return res.status(400).json({ error: 'Videos must be an array' });
    }

    // Validate each video has youtubeUrl
    for (const video of videos) {
      if (!video.youtubeUrl || !video.youtubeUrl.trim()) {
        return res.status(400).json({ error: 'Each video must have a YouTube URL' });
      }
    }

    await pool.query(`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES ('vibe_videos', ?)
      ON DUPLICATE KEY UPDATE setting_value = ?, updated_at = CURRENT_TIMESTAMP
    `, [JSON.stringify(videos), JSON.stringify(videos)]);

    res.json({
      message: 'Vibe videos updated successfully',
      videos
    });
  } catch (error) {
    console.error('Error updating vibe videos:', error);
    res.status(500).json({ 
      error: 'Failed to update vibe videos',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
