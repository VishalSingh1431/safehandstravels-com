import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Team from '../models/Team.js';
import { deleteFile } from '../utils/cloudinaryService.js';

const router = express.Router();

// Get all team members (public - only active)
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll({
      status: 'active',
    });

    res.json({
      teams,
      count: teams.length,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get all team members (Admin - includes inactive)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const teams = await Team.findAll({
      status,
      includeInactive: true,
    });

    res.json({
      teams,
      count: teams.length,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team member by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Only return active team members to public
    if (team.status !== 'active') {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({ team });
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create team member (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const team = await Team.create(req.body);

    res.status(201).json({
      message: 'Team member created successfully',
      team,
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ 
      error: 'Failed to create team member',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update team member (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Handle file deletion if new photo is uploaded
    const updateData = { ...req.body };
    
    // If new photo uploaded, delete old one
    if (updateData.photoUrl && existingTeam.photoPublicId && updateData.photoUrl !== existingTeam.photoUrl) {
      try {
        await deleteFile(existingTeam.photoPublicId);
      } catch (deleteError) {
        console.error('Error deleting old photo:', deleteError);
        // Continue even if deletion fails
      }
    }

    const team = await Team.update(id, updateData);

    res.json({
      message: 'Team member updated successfully',
      team,
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      updateData: updateData
    });
    res.status(500).json({ 
      error: 'Failed to update team member',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete team member (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingTeam = await Team.findById(id);
    if (!existingTeam) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    // Delete photo from Cloudinary if exists
    if (existingTeam.photoPublicId) {
      try {
        await deleteFile(existingTeam.photoPublicId);
      } catch (deleteError) {
        console.error('Error deleting photo:', deleteError);
        // Continue even if deletion fails
      }
    }

    await Team.delete(id);

    res.json({
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ 
      error: 'Failed to delete team member',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

