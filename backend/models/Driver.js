import pool from '../config/database.js';

/**
 * Driver Model - MySQL operations
 */
class Driver {
  /**
   * Create a new driver
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO drivers (
          name, car, experience, photo_url, photo_public_id, status, display_order, five_driver
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.name,
        data.car,
        data.experience,
        data.photoUrl || null,
        data.photoPublicId || null,
        data.status || 'active',
        data.displayOrder || 0,
        data.fiveDriver || false,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted driver
      const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ?', [result.insertId]);
      return this.mapRowToDriver(rows[0]);
    } catch (error) {
      console.error('Driver.create error:', error);
      throw error;
    }
  }

  /**
   * Find driver by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM drivers WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToDriver(rows[0]) : null;
    } catch (error) {
      console.error('Driver.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all drivers (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM drivers WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      } else if (!filters.includeInactive) {
        // By default, only show active drivers unless includeInactive is true
        query += ` AND status = ?`;
        values.push('active');
      }

      query += ' ORDER BY display_order ASC, created_at DESC';

      if (filters.limit) {
        query += ` LIMIT ?`;
        values.push(filters.limit);
      }

      if (filters.offset) {
        query += ` OFFSET ?`;
        values.push(filters.offset);
      }

      const [rows] = await pool.query(query, values);
      return rows.map(row => this.mapRowToDriver(row));
    } catch (error) {
      console.error('Driver.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update driver
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fields = {
        name: data.name,
        car: data.car,
        experience: data.experience,
        photoUrl: 'photo_url',
        photoPublicId: 'photo_public_id',
        status: data.status,
        displayOrder: 'display_order',
        fiveDriver: 'five_driver',
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
        UPDATE drivers 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated driver
      const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ?', [id]);
      return this.mapRowToDriver(rows[0]);
    } catch (error) {
      console.error('Driver.update error:', error);
      throw error;
    }
  }

  /**
   * Delete driver
   */
  static async delete(id) {
    try {
      // First get the driver before deleting
      const [rows] = await pool.query('SELECT * FROM drivers WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM drivers WHERE id = ?', [id]);
      return this.mapRowToDriver(rows[0]);
    } catch (error) {
      console.error('Driver.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to driver object
   */
  static mapRowToDriver(row) {
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      car: row.car,
      experience: row.experience,
      photoUrl: row.photo_url,
      photoPublicId: row.photo_public_id,
      status: row.status,
      displayOrder: row.display_order,
      fiveDriver: row.five_driver || false,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Driver;
