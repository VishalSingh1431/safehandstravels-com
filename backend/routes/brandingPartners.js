import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import BrandingPartner from '../models/BrandingPartner.js';
import { deleteFile } from '../utils/cloudinaryService.js';

const router = express.Router();

// Get all partners (public - only active)
router.get('/', async (req, res) => {
  try {
    const partners = await BrandingPartner.findAll({
      status: 'active',
    });

    res.json({
      partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get all partners (Admin - includes drafts)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const partners = await BrandingPartner.findAll({
      status,
      includeDraft: true,
    });

    res.json({
      partners,
      count: partners.length,
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get partner by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await BrandingPartner.findById(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (partner.status !== 'active') {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json({ partner });
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// Create partner (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    if (!req.body.name?.trim()) {
      return res.status(400).json({ error: 'Partner name is required' });
    }

    const partnerData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const partner = await BrandingPartner.create(partnerData);

    res.status(201).json({
      message: 'Partner created successfully',
      partner,
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ 
      error: 'Failed to create partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update partner (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existingPartner = await BrandingPartner.findById(id);
    if (!existingPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    const updateData = { ...req.body };

    // If new logo uploaded, delete old one
    if (updateData.logoUrl && existingPartner.logoPublicId && updateData.logoUrl !== existingPartner.logoUrl) {
      try {
        await deleteFile(existingPartner.logoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting old partner logo:', err);
      }
    }

    const partner = await BrandingPartner.update(id, updateData);

    res.json({
      message: 'Partner updated successfully',
      partner,
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ 
      error: 'Failed to update partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete partner (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await BrandingPartner.findById(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    if (partner.logoPublicId) {
      try {
        await deleteFile(partner.logoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting partner logo from Cloudinary:', err);
      }
    }

    await BrandingPartner.delete(id);

    res.json({
      message: 'Partner deleted successfully',
      partner,
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ 
      error: 'Failed to delete partner',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

