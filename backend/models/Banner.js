import pool from '../config/database.js';

/**
 * Banner Model - PostgreSQL operations
 */
class Banner {
  /**
   * Create a new banner
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO banners (image_url, image_public_id, title, subtitle, display_order, status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [
        data.imageUrl || null,
        data.imagePublicId || null,
        data.title || null,
        data.subtitle || null,
        data.displayOrder || 0,
        data.status || 'active',
        data.createdBy || null,
      ];

      const result = await pool.query(query, values);
      return this.mapRowToBanner(result.rows[0]);
    } catch (error) {
      console.error('Banner.create error:', error);
      throw error;
    }
  }

  /**
   * Find banner by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM banners WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToBanner(result.rows[0]) : null;
    } catch (error) {
      console.error('Banner.findById error:', error);
      throw error;
    }
  }

  /**
   * Find all banners
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM banners WHERE 1=1';
      const values = [];
      let paramCount = 1;

      if (filters.status) {
        query += ` AND status = $${paramCount++}`;
        values.push(filters.status);
      }

      if (!filters.includeDraft) {
        query += ` AND status = 'active'`;
      }

      query += ' ORDER BY display_order ASC, id ASC';

      const result = await pool.query(query, values);
      return result.rows.map(row => this.mapRowToBanner(row));
    } catch (error) {
      console.error('Banner.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update banner
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];
      let paramCount = 1;

      const fieldMapping = {
        imageUrl: 'image_url',
        imagePublicId: 'image_public_id',
        title: 'title',
        subtitle: 'subtitle',
        displayOrder: 'display_order',
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
        UPDATE banners 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return this.mapRowToBanner(result.rows[0]);
    } catch (error) {
      console.error('Banner.update error:', error);
      throw error;
    }
  }

  /**
   * Delete banner
   */
  static async delete(id) {
    try {
      const query = 'DELETE FROM banners WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToBanner(result.rows[0]) : null;
    } catch (error) {
      console.error('Banner.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to banner object
   */
  static mapRowToBanner(row) {
    if (!row) return null;

    return {
      id: row.id,
      imageUrl: row.image_url,
      imagePublicId: row.image_public_id,
      title: row.title,
      subtitle: row.subtitle,
      displayOrder: row.display_order,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Banner;

