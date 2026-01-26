import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import HotelPartner from '../models/HotelPartner.js';
import { deleteFile } from '../utils/cloudinaryService.js';

const router = express.Router();

// Get all hotel partners (public - only active)
router.get('/', async (req, res) => {
  try {
    const partners = await HotelPartner.findAll({
      status: 'active',
    });

    res.json({
      partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Error fetching hotel partners:', error);
    res.status(500).json({ error: 'Failed to fetch hotel partners' });
  }
});

// Get all hotel partners (Admin - includes drafts)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const partners = await HotelPartner.findAll({
      status,
      includeDraft: true,
    });

    res.json({
      partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Error fetching hotel partners:', error);
    res.status(500).json({ error: 'Failed to fetch hotel partners' });
  }
});

// Get partner by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await HotelPartner.findById(id);

    if (!partner) {
      return res.status(404).json({ error: 'Hotel partner not found' });
    }

    if (partner.status !== 'active') {
      return res.status(404).json({ error: 'Hotel partner not found' });
    }

    res.json({ partner });
  } catch (error) {
    console.error('Error fetching hotel partner:', error);
    res.status(500).json({ error: 'Failed to fetch hotel partner' });
  }
});

// Create hotel partner (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ error: 'Hotel partner name is required' });
    }

    if (!req.body.logoUrl || !req.body.logoUrl.trim()) {
      return res.status(400).json({ error: 'Logo image is required' });
    }

    const partnerData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const partner = await HotelPartner.create(partnerData);

    res.status(201).json({
      message: 'Hotel partner created successfully',
      partner,
    });
  } catch (error) {
    console.error('Error creating hotel partner:', error);
    res.status(500).json({ 
      error: 'Failed to create hotel partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update hotel partner (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingPartner = await HotelPartner.findById(id);
    if (!existingPartner) {
      return res.status(404).json({ error: 'Hotel partner not found' });
    }

    // Validate that logo is not being removed
    const updateData = { ...req.body };
    
    // If logoUrl is being updated, ensure it's not empty
    if (updateData.logoUrl !== undefined && (!updateData.logoUrl || !updateData.logoUrl.trim())) {
      return res.status(400).json({ error: 'Logo image is required and cannot be removed' });
    }

    // If new logo uploaded, delete old one from Cloudinary
    if (updateData.logoUrl && existingPartner.logoPublicId && updateData.logoUrl !== existingPartner.logoUrl) {
      try {
        await deleteFile(existingPartner.logoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting old logo:', err);
        // Continue with update even if deletion fails
      }
    }

    const partner = await HotelPartner.update(id, updateData);

    res.json({
      message: 'Hotel partner updated successfully',
      partner,
    });
  } catch (error) {
    console.error('Error updating hotel partner:', error);
    res.status(500).json({ 
      error: 'Failed to update hotel partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete hotel partner (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get partner first to check if exists and get logoPublicId
    const partner = await HotelPartner.findById(id);
    if (!partner) {
      return res.status(404).json({ error: 'Hotel partner not found' });
    }

    // Delete logo from Cloudinary if it exists
    if (partner.logoPublicId) {
      try {
        await deleteFile(partner.logoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting logo from Cloudinary:', err);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    // Delete from database
    await HotelPartner.delete(id);

    res.json({
      message: 'Hotel partner deleted successfully',
      partner,
    });
  } catch (error) {
    console.error('Error deleting hotel partner:', error);
    res.status(500).json({ 
      error: 'Failed to delete hotel partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

