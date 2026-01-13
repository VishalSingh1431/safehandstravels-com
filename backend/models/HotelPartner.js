import pool from '../config/database.js';

/**
 * HotelPartner Model - MySQL operations
 */
class HotelPartner {
  /**
   * Create a new hotel partner
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO hotel_partners (name, logo_url, logo_public_id, link, display_order, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.name || null,
        data.logoUrl || null,
        data.logoPublicId || null,
        data.link || null,
        data.displayOrder || 0,
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted partner
      const [rows] = await pool.query('SELECT * FROM hotel_partners WHERE id = ?', [result.insertId]);
      return this.mapRowToPartner(rows[0]);
    } catch (error) {
      console.error('HotelPartner.create error:', error);
      throw error;
    }
  }

  /**
   * Find partner by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM hotel_partners WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToPartner(rows[0]) : null;
    } catch (error) {
      console.error('HotelPartner.findById error:', error);
      throw error;
    }
  }

  /**
   * Find all partners
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM hotel_partners WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      }

      if (!filters.includeDraft) {
        query += ` AND status = 'active'`;
      }

      query += ' ORDER BY display_order ASC, id ASC';

      const [rows] = await pool.query(query, values);
      return rows.map(row => this.mapRowToPartner(row));
    } catch (error) {
      console.error('HotelPartner.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update partner
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fieldMapping = {
        name: 'name',
        logoUrl: 'logo_url',
        logoPublicId: 'logo_public_id',
        link: 'link',
        displayOrder: 'display_order',
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
        UPDATE hotel_partners 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated partner
      const [rows] = await pool.query('SELECT * FROM hotel_partners WHERE id = ?', [id]);
      return this.mapRowToPartner(rows[0]);
    } catch (error) {
      console.error('HotelPartner.update error:', error);
      throw error;
    }
  }

  /**
   * Delete partner
   */
  static async delete(id) {
    try {
      // First get the partner before deleting
      const [rows] = await pool.query('SELECT * FROM hotel_partners WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM hotel_partners WHERE id = ?', [id]);
      return this.mapRowToPartner(rows[0]);
    } catch (error) {
      console.error('HotelPartner.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to partner object
   */
  static mapRowToPartner(row) {
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      logoUrl: row.logo_url,
      logoPublicId: row.logo_public_id,
      link: row.link,
      displayOrder: row.display_order,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default HotelPartner;
