import pool from '../config/database.js';

/**
 * OTP Model - MySQL operations
 */
class Otp {
  /**
   * Create a new OTP
   */
  static async create(email, otp, expiresAt) {
    const query = `
      INSERT INTO otps (email, otp, expires_at)
      VALUES (?, ?, ?)
    `;

    const values = [email.toLowerCase(), otp, new Date(expiresAt)];
    const [result] = await pool.query(query, values);
    // Get the inserted OTP
    const [rows] = await pool.query('SELECT * FROM otps WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  /**
   * Find valid OTP by email
   */
  static async findValidOtp(email, otp) {
    const query = `
      SELECT * FROM otps 
      WHERE email = ? 
        AND otp = ? 
        AND expires_at > CURRENT_TIMESTAMP 
        AND used = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const [rows] = await pool.query(query, [email.toLowerCase(), otp]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Mark OTP as used
   */
  static async markAsUsed(id) {
    const query = 'UPDATE otps SET used = TRUE WHERE id = ?';
    await pool.query(query, [id]);
  }

  /**
   * Clean up expired OTPs (optional cleanup function)
   */
  static async cleanupExpired() {
    const query = 'DELETE FROM otps WHERE expires_at < CURRENT_TIMESTAMP';
    const [result] = await pool.query(query);
    return result.affectedRows;
  }
}

export default Otp;
