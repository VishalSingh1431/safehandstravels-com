import pool from '../config/database.js';

/**
 * User Model - MySQL operations
 */
class User {
  /**
   * Create a new user
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO users (email, name, phone, bio, picture, google_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.email.toLowerCase(),
        data.name || null,
        data.phone || null,
        data.bio || null,
        data.picture || null,
        data.googleId || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted user
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      return this.mapRowToUser(rows[0]);
    } catch (error) {
      console.error('User.create error:', error);
      console.error('Error code:', error.code);
      // Re-throw with more context for database connection errors
      if (
        error.code === 'ENOTFOUND' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message.includes('connection') ||
        error.message.includes('timeout')
      ) {
        const dbError = new Error('Database connection failed. Please check your database configuration.');
        dbError.code = error.code;
        dbError.originalError = error.message;
        throw dbError;
      }
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const [rows] = await pool.query(query, [email.toLowerCase()]);
      return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
    } catch (error) {
      console.error('User.findByEmail error:', error);
      console.error('Error code:', error.code);
      // Re-throw with more context for database connection errors
      if (
        error.code === 'ENOTFOUND' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message.includes('connection') ||
        error.message.includes('timeout')
      ) {
        const dbError = new Error('Database connection failed. Please check your database configuration.');
        dbError.code = error.code;
        dbError.originalError = error.message;
        throw dbError;
      }
      throw error;
    }
  }

  /**
   * Find user by Google ID
   */
  static async findByGoogleId(googleId) {
    const query = 'SELECT * FROM users WHERE google_id = ?';
    const [rows] = await pool.query(query, [googleId]);
    return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await pool.query(query, [id]);
    return rows.length > 0 ? this.mapRowToUser(rows[0]) : null;
  }

  /**
   * Update user
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      if (data.name !== undefined) {
        updates.push(`name = ?`);
        values.push(data.name);
      }
      if (data.phone !== undefined) {
        updates.push(`phone = ?`);
        values.push(data.phone);
      }
      if (data.bio !== undefined) {
        updates.push(`bio = ?`);
        values.push(data.bio);
      }
      if (data.picture !== undefined) {
        updates.push(`picture = ?`);
        values.push(data.picture);
      }
      if (data.googleId !== undefined) {
        updates.push(`google_id = ?`);
        values.push(data.googleId);
      }
      if (data.role !== undefined) {
        updates.push(`role = ?`);
        values.push(data.role);
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE users 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated user
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return this.mapRowToUser(rows[0]);
    } catch (error) {
      console.error('User.update error:', error);
      console.error('Error code:', error.code);
      // Re-throw with more context for database connection errors
      if (
        error.code === 'ENOTFOUND' || 
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.message.includes('connection') ||
        error.message.includes('timeout')
      ) {
        const dbError = new Error('Database connection failed. Please check your database configuration.');
        dbError.code = error.code;
        dbError.originalError = error.message;
        throw dbError;
      }
      throw error;
    }
  }

  /**
   * Get all users (for admin panel)
   */
  static async findAll(limit = 100, offset = 0) {
    try {
      const query = `
        SELECT * FROM users 
        ORDER BY created_at DESC 
        LIMIT ? OFFSET ?
      `;
      const [rows] = await pool.query(query, [limit, offset]);
      return rows.map(row => this.mapRowToUser(row));
    } catch (error) {
      console.error('User.findAll error:', error);
      throw error;
    }
  }

  /**
   * Search users by email or name
   */
  static async search(searchTerm, limit = 50) {
    try {
      const searchPattern = `%${searchTerm}%`;
      const query = `
        SELECT * FROM users 
        WHERE LOWER(email) LIKE LOWER(?) OR LOWER(name) LIKE LOWER(?)
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      const [rows] = await pool.query(query, [searchPattern, searchPattern, limit]);
      return rows.map(row => this.mapRowToUser(row));
    } catch (error) {
      console.error('User.search error:', error);
      throw error;
    }
  }

  /**
   * Get user count
   */
  static async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
      return parseInt(rows[0].count);
    } catch (error) {
      console.error('User.count error:', error);
      throw error;
    }
  }

  /**
   * Map database row to user object
   */
  static mapRowToUser(row) {
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      phone: row.phone,
      bio: row.bio,
      picture: row.picture,
      googleId: row.google_id,
      role: row.role || 'user',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default User;
