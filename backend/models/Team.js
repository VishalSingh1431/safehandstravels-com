import pool from '../config/database.js';

/**
 * Team Model - MySQL operations
 */
class Team {
  /**
   * Create a new team member
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO teams (
          name, position, bio, photo_url, photo_public_id, email, phone, 
          social_linkedin, social_twitter, social_facebook, status, display_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.name,
        data.position || null,
        data.bio || null,
        data.photoUrl || null,
        data.photoPublicId || null,
        data.email || null,
        data.phone || null,
        data.socialLinkedIn || null,
        data.socialTwitter || null,
        data.socialFacebook || null,
        data.status || 'active',
        data.displayOrder || 0,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted team member
      const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [result.insertId]);
      return this.mapRowToTeam(rows[0]);
    } catch (error) {
      console.error('Team.create error:', error);
      throw error;
    }
  }

  /**
   * Find team member by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM teams WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToTeam(rows[0]) : null;
    } catch (error) {
      console.error('Team.findById error:', error);
      throw error;
    }
  }

  /**
   * Get all team members (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM teams WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      } else if (!filters.includeInactive) {
        // By default, only show active team members unless includeInactive is true
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
      return rows.map(row => this.mapRowToTeam(row));
    } catch (error) {
      console.error('Team.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update team member
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      // Field mapping: frontend key -> database column name
      const fieldMapping = {
        name: 'name',
        position: 'position',
        bio: 'bio',
        photoUrl: 'photo_url',
        photoPublicId: 'photo_public_id',
        email: 'email',
        phone: 'phone',
        socialLinkedIn: 'social_linkedin',
        socialTwitter: 'social_twitter',
        socialFacebook: 'social_facebook',
        status: 'status',
        displayOrder: 'display_order',
      };

      // Process each field
      for (const [frontendKey, dbColumn] of Object.entries(fieldMapping)) {
        if (data[frontendKey] !== undefined) {
          updates.push(`${dbColumn} = ?`);
          // Handle null/empty strings properly
          const value = data[frontendKey] === '' ? null : data[frontendKey];
          values.push(value);
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE teams 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      await pool.query(query, values);
      // Get the updated team member
      const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
      return this.mapRowToTeam(rows[0]);
    } catch (error) {
      console.error('Team.update error:', error);
      throw error;
    }
  }

  /**
   * Delete team member
   */
  static async delete(id) {
    try {
      // First get the team member before deleting
      const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM teams WHERE id = ?', [id]);
      return this.mapRowToTeam(rows[0]);
    } catch (error) {
      console.error('Team.delete error:', error);
      throw error;
    }
  }

  /**
   * Map database row to team object
   */
  static mapRowToTeam(row) {
    if (!row) return null;

    return {
      id: row.id,
      name: row.name,
      position: row.position,
      bio: row.bio,
      photoUrl: row.photo_url,
      photoPublicId: row.photo_public_id,
      email: row.email,
      phone: row.phone,
      socialLinkedIn: row.social_linkedin,
      socialTwitter: row.social_twitter,
      socialFacebook: row.social_facebook,
      status: row.status,
      displayOrder: row.display_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export default Team;

