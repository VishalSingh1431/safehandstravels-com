import pool from '../config/database.js';

/**
 * Enquiry Model - MySQL operations
 */
class Enquiry {
  /**
   * Create a new enquiry
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO enquiries (
          trip_id, trip_title, trip_location, trip_price,
          selected_month, number_of_travelers,
          name, email, phone, message, destination, enquiry_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const nameValue = data.name != null && String(data.name).trim() !== ''
        ? data.name.trim()
        : (data.enquiryType === 'form2' ? 'Trip Enquiry' : 'Not provided');
      const values = [
        data.tripId || null,
        data.tripTitle || null,
        data.tripLocation || null,
        data.tripPrice || null,
        data.selectedMonth || data.monthOfTravel || null,
        data.numberOfTravelers ?? data.numPeople ?? 1,
        nameValue,
        data.email.toLowerCase(),
        data.phone || null,
        data.message || null,
        data.destination || null,
        data.enquiryType === 'form2' ? 'form2' : 'form1',
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted enquiry
      const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [result.insertId]);
      return this.mapRowToEnquiry(rows[0]);
    } catch (error) {
      console.error('Enquiry.create error:', error);
      throw error;
    }
  }

  /**
   * Find enquiry by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM enquiries WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToEnquiry(rows[0]) : null;
    } catch (error) {
      console.error('Enquiry.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all enquiries (Admin only)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM enquiries WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      }

      if (filters.tripId) {
        query += ` AND trip_id = ?`;
        values.push(filters.tripId);
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

      const [rows] = await pool.query(query, values);
      return rows.map(row => this.mapRowToEnquiry(row));
    } catch (error) {
      console.error('Enquiry.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update enquiry status
   */
  static async updateStatus(id, status) {
    try {
      const query = `
        UPDATE enquiries 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      await pool.query(query, [status, id]);
      // Get the updated enquiry
      const [rows] = await pool.query('SELECT * FROM enquiries WHERE id = ?', [id]);
      return rows.length > 0 ? this.mapRowToEnquiry(rows[0]) : null;
    } catch (error) {
      console.error('Enquiry.updateStatus error:', error);
      throw error;
    }
  }

  /**
   * Map database row to enquiry object
   */
  static mapRowToEnquiry(row) {
    if (!row) return null;

    return {
      id: row.id,
      tripId: row.trip_id,
      tripTitle: row.trip_title,
      tripLocation: row.trip_location,
      tripPrice: row.trip_price,
      selectedMonth: row.selected_month,
      numberOfTravelers: row.number_of_travelers,
      name: row.name,
      email: row.email,
      phone: row.phone,
      message: row.message,
      destination: row.destination,
      enquiryType: row.enquiry_type || 'form1',
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Enquiry;
