import pool from '../config/database.js';

/**
 * FAQ Model - PostgreSQL operations
 */
class FAQ {
  /**
   * Create a new FAQ
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO faqs (question, answer, display_order, status, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const values = [
        data.question,
        data.answer,
        data.displayOrder || 0,
        data.status || 'active',
        data.createdBy || null,
      ];

      const result = await pool.query(query, values);
      return this.mapRowToFAQ(result.rows[0]);
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
      const query = 'SELECT * FROM faqs WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToFAQ(result.rows[0]) : null;
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
      return result.rows.map(row => this.mapRowToFAQ(row));
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
      let paramCount = 1;

      const fieldMapping = {
        question: 'question',
        answer: 'answer',
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
        UPDATE faqs 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return this.mapRowToFAQ(result.rows[0]);
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
      const query = 'DELETE FROM faqs WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? this.mapRowToFAQ(result.rows[0]) : null;
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

