import pool, { queryWithRetry } from '../config/database.js';

/**
 * Review Model - PostgreSQL operations
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
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

      const result = await pool.query(query, values);
      return this.mapRowToReview(result.rows[0]);
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
      const query = 'SELECT * FROM reviews WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToReview(result.rows[0]) : null;
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
      let paramCount = 1;

      if (filters.status) {
        query += ` AND status = $${paramCount++}`;
        values.push(filters.status);
      } else if (!filters.includeDraft) {
        query += ` AND status = $${paramCount++}`;
        values.push('active');
      }

      query += ' ORDER BY created_at DESC';

      if (filters.limit) {
        query += ` LIMIT $${paramCount++}`;
        values.push(filters.limit);
      }

      if (filters.offset) {
        query += ` OFFSET $${paramCount++}`;
        values.push(filters.offset);
      }

      const result = await queryWithRetry(() => pool.query(query, values));
      return result.rows.map(row => this.mapRowToReview(row));
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
      let paramCount = 1;

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
          updates.push(`${dbKey} = $${paramCount++}`);
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
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return this.mapRowToReview(result.rows[0]);
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
      const query = 'DELETE FROM reviews WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToReview(result.rows[0]) : null;
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
