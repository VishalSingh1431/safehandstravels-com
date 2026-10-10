import pool from '../config/database.js';

/**
 * Blog Model - MySQL operations
 */
class Blog {
  /**
   * Create a new blog
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO blogs (
          title, slug, description, content, hero_image, hero_image_public_id,
          category, tags, author, author_id, featured, status, display_order,
          views, meta_title, meta_description, meta_keywords, published_at,
          created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const baseSlug = data.slug || this.generateSlug(data.title || 'untitled');
      const uniqueSlug = await this.getUniqueSlug(baseSlug);

      const values = [
        data.title || '',
        uniqueSlug,
        data.description || null,
        data.content || '',
        data.heroImage || null,
        data.heroImagePublicId || null,
        data.category || null,
        JSON.stringify(data.tags || []),
        data.author || null,
        data.authorId || null,
        Boolean(data.featured),
        data.status || 'draft',
        data.displayOrder || 0,
        data.views || 0,
        data.metaTitle || data.title || '',
        data.metaDescription || data.description || null,
        JSON.stringify(data.metaKeywords || []),
        data.publishedAt || null,
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted blog
      const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
      return this.mapRowToBlog(rows[0]);
    } catch (error) {
      console.error('Blog.create error:', error);
      throw error;
    }
  }

  /**
   * Get unique slug for blog
   */
  static async getUniqueSlug(baseSlug, excludeId = null) {
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      let query = 'SELECT id FROM blogs WHERE slug = ?';
      const params = [slug];
      if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
      }
      const [rows] = await pool.query(query, params);
      if (rows.length === 0) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title) {
    return (title || 'untitled')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Find blog by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM blogs WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToBlog(rows[0]) : null;
    } catch (error) {
      console.error('Blog.findById error:', error);
      throw error;
    }
  }

  /**
   * Find blog by slug
   */
  static async findBySlug(slug) {
    try {
      const query = 'SELECT * FROM blogs WHERE slug = ?';
      const [rows] = await pool.query(query, [slug]);
      return rows.length > 0 ? this.mapRowToBlog(rows[0]) : null;
    } catch (error) {
      console.error('Blog.findBySlug error:', error);
      throw error;
    }
  }

  /**
   * Find all blogs
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM blogs WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      }

      if (filters.category) {
        query += ` AND category = ?`;
        values.push(filters.category);
      }

      if (filters.featured !== undefined) {
        query += ` AND featured = ?`;
        values.push(filters.featured);
      }

      if (!filters.includeDraft) {
        query += ` AND status = 'published'`;
      }

      if (filters.search) {
        query += ` AND (title LIKE ? OR description LIKE ? OR content LIKE ?)`;
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm, searchTerm);
      }

      // Order by display_order, then published date (newest first), then id
      query += ' ORDER BY display_order ASC, published_at DESC, id DESC';

      if (filters.limit) {
        query += ` LIMIT ?`;
        values.push(parseInt(filters.limit));
      }

      if (filters.offset) {
        query += ` OFFSET ?`;
        values.push(parseInt(filters.offset));
      }

      const [rows] = await pool.query(query, values);
      return rows.map(row => this.mapRowToBlog(row));
    } catch (error) {
      console.error('Blog.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update blog
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fieldMapping = {
        title: 'title',
        slug: 'slug',
        description: 'description',
        content: 'content',
        heroImage: 'hero_image',
        heroImagePublicId: 'hero_image_public_id',
        category: 'category',
        tags: 'tags',
        author: 'author',
        authorId: 'author_id',
        featured: 'featured',
        status: 'status',
        displayOrder: 'display_order',
        views: 'views',
        metaTitle: 'meta_title',
        metaDescription: 'meta_description',
        metaKeywords: 'meta_keywords',
        publishedAt: 'published_at',
      };

      for (const [key, dbKey] of Object.entries(fieldMapping)) {
        if (key === 'slug') continue;
        if (data[key] !== undefined) {
          if (key === 'tags' || key === 'metaKeywords') {
            updates.push(`${dbKey} = ?`);
            values.push(JSON.stringify(data[key]));
          } else if (key === 'featured') {
            updates.push(`${dbKey} = ?`);
            values.push(Boolean(data[key]));
          } else {
            updates.push(`${dbKey} = ?`);
            values.push(data[key]);
          }
        }
      }

      if (data.slug) {
        const uniqueSlug = await this.getUniqueSlug(data.slug, id);
        updates.push('slug = ?');
        values.push(uniqueSlug);
      } else if (data.title) {
        const blog = await this.findById(id);
        if (blog && blog.title !== data.title) {
          const uniqueSlug = await this.getUniqueSlug(this.generateSlug(data.title), id);
          updates.push('slug = ?');
          values.push(uniqueSlug);
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE blogs 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated blog
      const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
      return this.mapRowToBlog(rows[0]);
    } catch (error) {
      console.error('Blog.update error:', error);
      throw error;
    }
  }

  /**
   * Delete blog
   */
  static async delete(id) {
    try {
      // First get the blog before deleting
      const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
      return this.mapRowToBlog(rows[0]);
    } catch (error) {
      console.error('Blog.delete error:', error);
      throw error;
    }
  }

  /**
   * Increment views
   */
  static async incrementViews(id) {
    try {
      await pool.query('UPDATE blogs SET views = views + 1 WHERE id = ?', [id]);
      return await this.findById(id);
    } catch (error) {
      console.error('Blog.incrementViews error:', error);
      throw error;
    }
  }

  /**
   * Map database row to Blog object
   */
  static mapRowToBlog(row) {
    if (!row) return null;

    const safeParse = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      if (typeof val === 'string') {
        const trimmed = val.trim();
        if (!trimmed) return [];
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          if (trimmed.includes(',')) {
            return trimmed.split(',').map(s => s.trim()).filter(Boolean);
          }
          return [trimmed];
        }
      }
      return [];
    };

    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      content: row.content,
      heroImage: row.hero_image,
      heroImagePublicId: row.hero_image_public_id,
      category: row.category,
      tags: safeParse(row.tags),
      author: row.author,
      authorId: row.author_id,
      featured: Boolean(row.featured),
      status: row.status,
      displayOrder: row.display_order,
      views: row.views || 0,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      metaKeywords: safeParse(row.meta_keywords),
      publishedAt: row.published_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
    };
  }
}

export default Blog;

