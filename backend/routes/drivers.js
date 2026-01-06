import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Driver from '../models/Driver.js';
import { deleteFile } from '../utils/cloudinaryService.js';

const router = express.Router();

// Get all drivers (public - only active drivers)
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      status: 'active',
    });

    res.json({
      drivers,
      count: drivers.length,
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get all drivers (Admin - includes inactive)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const drivers = await Driver.findAll({
      status,
      includeInactive: true,
    });

    res.json({
      drivers,
      count: drivers.length,
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get driver by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await Driver.findById(id);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Only return active drivers to public
    if (driver.status !== 'active') {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({ driver });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Create driver (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const driver = await Driver.create(req.body);

    res.status(201).json({
      message: 'Driver created successfully',
      driver,
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ 
      error: 'Failed to create driver',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update driver (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingDriver = await Driver.findById(id);
    if (!existingDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Handle file deletion if new photo is uploaded
    const updateData = { ...req.body };
    
    // If new photo uploaded, delete old one
    if (updateData.photoUrl && existingDriver.photoPublicId && updateData.photoUrl !== existingDriver.photoUrl) {
      try {
        await deleteFile(existingDriver.photoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting old photo:', err);
      }
    }

    const driver = await Driver.update(id, updateData);

    res.json({
      message: 'Driver updated successfully',
      driver,
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    res.status(500).json({ 
      error: 'Failed to update driver',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete driver (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Delete associated photo from Cloudinary
    if (driver.photoPublicId) {
      try {
        await deleteFile(driver.photoPublicId, 'image');
      } catch (err) {
        console.error('Error deleting driver photo:', err);
      }
    }

    // Delete driver from database
    await Driver.delete(id);

    res.json({
      message: 'Driver deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ 
      error: 'Failed to delete driver',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

