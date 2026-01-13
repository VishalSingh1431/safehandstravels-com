import pool, { queryWithRetry } from '../config/database.js';

/**
 * Destination Model - MySQL operations
 */
class Destination {
  /**
   * Create a new destination
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO destinations (
          name, image, image_public_id, status, created_by
        )
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        data.name,
        data.image || null,
        data.imagePublicId || null,
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted destination
      const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [result.insertId]);
      return this.mapRowToDestination(rows[0]);
    } catch (error) {
      console.error('Destination.create error:', error);
      throw error;
    }
  }

  /**
   * Find destination by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM destinations WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToDestination(rows[0]) : null;
    } catch (error) {
      console.error('Destination.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all destinations (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM destinations WHERE 1=1';
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
      return rows.map(row => this.mapRowToDestination(row));
    } catch (error) {
      console.error('Destination.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update destination
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fields = {
        name: data.name,
        image: 'image',
        imagePublicId: 'image_public_id',
        status: data.status,
      };

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && data[key] !== undefined) {
          const dbKey = typeof value === 'string' ? value : key;
          updates.push(`${dbKey} = ?`);
          values.push(data[key]);
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE destinations 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated destination
      const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [id]);
      return this.mapRowToDestination(rows[0]);
    } catch (error) {
      console.error('Destination.update error:', error);
      throw error;
    }
  }

  /**
   * Delete destination
   */
  static async delete(id) {
    try {
      // First get the destination before deleting
      const [rows] = await pool.query('SELECT * FROM destinations WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM destinations WHERE id = ?', [id]);
      return this.mapRowToDestination(rows[0]);
    } catch (error) {
      console.error('Destination.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to destination object
   */
  static mapRowToDestination(row) {
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      image: row.image,
      imagePublicId: row.image_public_id,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Destination;
