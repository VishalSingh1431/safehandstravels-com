import pool, { queryWithRetry } from '../config/database.js';

/**
 * Review Model - MySQL operations
 */
class Review {
  /**
   * Create a new review
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO reviews (
          name, rating, location, review, avatar, avatar_public_id, type, video_url, video_public_id, status, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.name,
        data.rating || 5,
        data.location || null,
        data.review,
        data.avatar || null,
        data.avatarPublicId || null,
        data.type || 'video',
        data.videoUrl || null,
        data.videoPublicId || null,
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted review
      const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [result.insertId]);
      return this.mapRowToReview(rows[0]);
    } catch (error) {
      console.error('Review.create error:', error);
      throw error;
    }
  }

  /**
   * Find review by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM reviews WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToReview(rows[0]) : null;
    } catch (error) {
      console.error('Review.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all reviews (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM reviews WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      } else if (!filters.includeDraft) {
        query += ` AND status = ?`;
        values.push('active');
      }

      query += ' ORDER BY created_at DESC';

      if (filters.limit) {
        query += ` LIMIT ?`;
        values.push(filters.limit);
      }

      if (filters.offset) {
        query += ` OFFSET ?`;
        values.push(filters.offset);
      }

      const [rows] = await queryWithRetry(() => pool.query(query, values));
      return rows.map(row => this.mapRowToReview(row));
    } catch (error) {
      console.error('Review.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update review
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fieldMapping = {
        name: 'name',
        rating: 'rating',
        location: 'location',
        review: 'review',
        avatar: 'avatar',
        avatarPublicId: 'avatar_public_id',
        type: 'type',
        videoUrl: 'video_url',
        videoPublicId: 'video_public_id',
        status: 'status',
      };

      for (const [key, dbKey] of Object.entries(fieldMapping)) {
        if (data[key] !== undefined) {
          updates.push(`${dbKey} = ?`);
          values.push(data[key]);
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE reviews 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated review
      const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
      return this.mapRowToReview(rows[0]);
    } catch (error) {
      console.error('Review.update error:', error);
      throw error;
    }
  }

  /**
   * Delete review
   */
  static async delete(id) {
    try {
      // First get the review before deleting
      const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
      return this.mapRowToReview(rows[0]);
    } catch (error) {
      console.error('Review.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to review object
   */
  static mapRowToReview(row) {
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      rating: row.rating,
      location: row.location,
      review: row.review,
      avatar: row.avatar,
      avatarPublicId: row.avatar_public_id,
      type: row.type || 'text',
      videoUrl: row.video_url,
      videoPublicId: row.video_public_id,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Review;
