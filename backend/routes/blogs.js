import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import Blog from '../models/Blog.js';
import { deleteFile } from '../utils/cloudinaryService.js';

const router = express.Router();

// Get all blogs (public - only published)
router.get('/', async (req, res) => {
  try {
    const { category, featured, search, limit, offset } = req.query;
    
    const blogs = await Blog.findAll({
      status: 'published',
      category,
      featured: featured === 'true',
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      includeDraft: false,
    });

    res.json({
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get all blogs (Admin - includes drafts)
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, category, featured, search, limit, offset } = req.query;
    
    console.log('GET /blogs/admin - Query params:', { status, category, featured, search, limit, offset });
    
    const blogs = await Blog.findAll({
      status: status || undefined, // Convert empty string to undefined
      category: category || undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      includeDraft: true,
    });

    console.log('GET /blogs/admin - Found blogs:', blogs.length);
    if (blogs.length > 0) {
      console.log('First blog:', blogs[0].title, blogs[0].status);
    }

    res.json({
      blogs,
      count: blogs.length,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get blog by ID (public - only published)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Only return published blogs to public
    if (blog.status !== 'published') {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment views
    await Blog.incrementViews(id);

    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Get blog by slug (public - only published)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findBySlug(slug);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Only return published blogs to public
    if (blog.status !== 'published') {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment views
    await Blog.incrementViews(blog.id);

    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create blog (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      createdBy: req.user.userId,
      authorId: req.user.userId,
      author: req.user.name || req.user.email,
    };

    // Set published_at if status is published
    if (blogData.status === 'published' && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      message: 'Blog created successfully',
      blog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ 
      error: 'Failed to create blog',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update blog (Admin only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Set published_at if status changed to published
    if (updateData.status === 'published') {
      const blog = await Blog.findById(id);
      if (blog && blog.status !== 'published' && !updateData.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const blog = await Blog.update(id, updateData);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ 
      error: 'Failed to update blog',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Delete blog (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Delete hero image from Cloudinary if exists
    if (blog.heroImagePublicId) {
      try {
        await deleteFile(blog.heroImagePublicId, 'image');
      } catch (deleteError) {
        console.error('Error deleting blog hero image:', deleteError);
        // Continue with blog deletion even if image deletion fails
      }
    }

    await Blog.delete(id);

    res.json({
      message: 'Blog deleted successfully',
      blog,
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ 
      error: 'Failed to delete blog',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;

