import pool, { queryWithRetry } from '../config/database.js';

/**
 * Certificate Model - MySQL operations
 */
class Certificate {
  /**
   * Create a new certificate
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO certificates (
          title, description, images, images_public_ids, status, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.title,
        data.description || null,
        JSON.stringify(data.images || []),
        JSON.stringify(data.imagesPublicIds || []),
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted certificate
      const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [result.insertId]);
      return this.mapRowToCertificate(rows[0]);
    } catch (error) {
      console.error('Certificate.create error:', error);
      throw error;
    }
  }

  /**
   * Find certificate by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM certificates WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToCertificate(rows[0]) : null;
    } catch (error) {
      console.error('Certificate.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all certificates (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM certificates WHERE 1=1';
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
      return rows.map(row => this.mapRowToCertificate(row));
    } catch (error) {
      console.error('Certificate.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update certificate
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fields = {
        title: data.title,
        description: data.description,
        images: data.images,
        imagesPublicIds: 'images_public_ids',
        status: data.status,
      };

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && data[key] !== undefined) {
          const dbKey = typeof value === 'string' ? value : key;
          if (['images', 'imagesPublicIds'].includes(key)) {
            updates.push(`${dbKey === 'imagesPublicIds' ? 'images_public_ids' : dbKey} = ?`);
            values.push(JSON.stringify(data[key]));
          } else {
            updates.push(`${dbKey} = ?`);
            values.push(data[key]);
          }
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE certificates 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated certificate
      const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
      return this.mapRowToCertificate(rows[0]);
    } catch (error) {
      console.error('Certificate.update error:', error);
      throw error;
    }
  }

  /**
   * Delete certificate
   */
  static async delete(id) {
    try {
      // First get the certificate before deleting
      const [rows] = await pool.query('SELECT * FROM certificates WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM certificates WHERE id = ?', [id]);
      return this.mapRowToCertificate(rows[0]);
    } catch (error) {
      console.error('Certificate.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to certificate object
   */
  static mapRowToCertificate(row) {
    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      images: Array.isArray(row.images) ? row.images : (row.images ? JSON.parse(row.images) : []),
      imagesPublicIds: Array.isArray(row.images_public_ids) ? row.images_public_ids : (row.images_public_ids ? JSON.parse(row.images_public_ids) : []),
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Certificate;
