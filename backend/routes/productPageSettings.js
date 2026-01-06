import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import ProductPageSettings from '../models/ProductPageSettings.js';

const router = express.Router();

// Get product page settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await ProductPageSettings.get();
    res.json({ settings });
  } catch (error) {
    console.error('Error fetching product page settings:', error);
    res.status(500).json({ error: 'Failed to fetch product page settings' });
  }
});

// Get product page settings (Admin)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = await ProductPageSettings.get();
    res.json({ settings });
  } catch (error) {
    console.error('Error fetching product page settings:', error);
    res.status(500).json({ error: 'Failed to fetch product page settings' });
  }
});

// Update product page settings (Admin only)
router.put('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const settings = await ProductPageSettings.update(req.body);
    res.json({
      message: 'Product page settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Error updating product page settings:', error);
    res.status(500).json({ 
      error: 'Failed to update product page settings',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

