import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Banner from '../models/Banner.js';

const router = express.Router();

// Get all banners (public - only active)
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.findAll({
      status: 'active',
    });

    res.json({
      banners,
      count: banners.length,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Get all banners (Admin - includes drafts)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const banners = await Banner.findAll({
      status,
      includeDraft: true,
    });

    res.json({
      banners,
      count: banners.length,
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Get banner by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    if (banner.status !== 'active') {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({ banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    res.status(500).json({ error: 'Failed to fetch banner' });
  }
});

// Create banner (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      message: 'Banner created successfully',
      banner,
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ 
      error: 'Failed to create banner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update banner (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.update(id, req.body);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({
      message: 'Banner updated successfully',
      banner,
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ 
      error: 'Failed to update banner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete banner (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.delete(id);

    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }

    res.json({
      message: 'Banner deleted successfully',
      banner,
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ 
      error: 'Failed to delete banner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

