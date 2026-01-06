import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import FAQ from '../models/FAQ.js';

const router = express.Router();

// Get all FAQs (public - only active)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.findAll({
      status: 'active',
    });

    res.json({
      faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get all FAQs (Admin - includes drafts)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    
    const faqs = await FAQ.findAll({
      status,
      includeDraft: true,
    });

    res.json({
      faqs,
      count: faqs.length,
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// Get FAQ by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findById(id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    if (faq.status !== 'active') {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({ faq });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Failed to fetch FAQ' });
  }
});

// Create FAQ (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const faqData = {
      ...req.body,
      createdBy: req.user.userId,
    };

    const faq = await FAQ.create(faqData);

    res.status(201).json({
      message: 'FAQ created successfully',
      faq,
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ 
      error: 'Failed to create FAQ',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update FAQ (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.update(id, req.body);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({
      message: 'FAQ updated successfully',
      faq,
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ 
      error: 'Failed to update FAQ',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete FAQ (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.delete(id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.json({
      message: 'FAQ deleted successfully',
      faq,
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ 
      error: 'Failed to delete FAQ',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

