import pool from '../config/database.js';

/**
 * Driver Model - PostgreSQL operations
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
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
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

      const result = await pool.query(query, values);
      return this.mapRowToDriver(result.rows[0]);
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
      const query = 'SELECT * FROM drivers WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToDriver(result.rows[0]) : null;
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
      let paramCount = 1;

      if (filters.status) {
        query += ` AND status = $${paramCount++}`;
        values.push(filters.status);
      } else if (!filters.includeInactive) {
        // By default, only show active drivers unless includeInactive is true
        query += ` AND status = $${paramCount++}`;
        values.push('active');
      }

      query += ' ORDER BY display_order ASC, created_at DESC';

      if (filters.limit) {
        query += ` LIMIT $${paramCount++}`;
        values.push(filters.limit);
      }

      if (filters.offset) {
        query += ` OFFSET $${paramCount++}`;
        values.push(filters.offset);
      }

      const result = await pool.query(query, values);
      return result.rows.map(row => this.mapRowToDriver(row));
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
      let paramCount = 1;

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
          updates.push(`${dbKey} = $${paramCount++}`);
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
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return this.mapRowToDriver(result.rows[0]);
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
      const query = 'DELETE FROM drivers WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToDriver(result.rows[0]) : null;
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

