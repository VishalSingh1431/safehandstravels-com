import pool from '../config/database.js';

/**
 * FAQ Model - MySQL operations
 */
class FAQ {
  /**
   * Create a new FAQ
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO faqs (question, answer, display_order, status, created_by)
        VALUES (?, ?, ?, ?, ?)
      `;

      const values = [
        data.question,
        data.answer,
        data.displayOrder || 0,
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted FAQ
      const [rows] = await pool.query('SELECT * FROM faqs WHERE id = ?', [result.insertId]);
      return this.mapRowToFAQ(rows[0]);
    } catch (error) {
      console.error('FAQ.create error:', error);
      throw error;
    }
  }

  /**
   * Find FAQ by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM faqs WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToFAQ(rows[0]) : null;
    } catch (error) {
      console.error('FAQ.findById error:', error);
      throw error;
    }
  }

  /**
   * Find all FAQs
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM faqs WHERE 1=1';
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
      return rows.map(row => this.mapRowToFAQ(row));
    } catch (error) {
      console.error('FAQ.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update FAQ
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      const fieldMapping = {
        question: 'question',
        answer: 'answer',
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
        UPDATE faqs 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated FAQ
      const [rows] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
      return this.mapRowToFAQ(rows[0]);
    } catch (error) {
      console.error('FAQ.update error:', error);
      throw error;
    }
  }

  /**
   * Delete FAQ
   */
  static async delete(id) {
    try {
      // First get the FAQ before deleting
      const [rows] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM faqs WHERE id = ?', [id]);
      return this.mapRowToFAQ(rows[0]);
    } catch (error) {
      console.error('FAQ.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to FAQ object
   */
  static mapRowToFAQ(row) {
    if (!row) return null;

    return {
      id: row.id,
      question: row.question,
      answer: row.answer,
      displayOrder: row.display_order,
      status: row.status,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default FAQ;
