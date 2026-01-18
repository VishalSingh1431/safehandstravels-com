import pool from '../config/database.js';

/**
 * Trip Model - MySQL operations
 */
class Trip {
  /**
   * Create a new trip
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO trips (
          title, location, duration, price, old_price, image_url, video_url,
          video_public_id, image_public_id, gallery, gallery_public_ids,
          subtitle, intro, why_visit, itinerary, included, not_included,
          notes, faq, reviews, category, recommended_trips, seats_left, is_popular, slug, status, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        data.title,
        Array.isArray(data.location) ? JSON.stringify(data.location) : (data.location || ''),
        data.duration,
        data.price,
        data.oldPrice || null,
        data.imageUrl || null,
        data.videoUrl || null,
        data.videoPublicId || null,
        data.imagePublicId || null,
        JSON.stringify(data.gallery || []),
        JSON.stringify(data.galleryPublicIds || []),
        data.subtitle || null,
        data.intro || null,
        JSON.stringify(data.whyVisit || []),
        JSON.stringify(data.itinerary || []),
        JSON.stringify(data.included || []),
        JSON.stringify(data.notIncluded || []),
        JSON.stringify(data.notes || []),
        JSON.stringify(data.faq || []),
        JSON.stringify(data.reviews || []),
        JSON.stringify(data.category || []),
        JSON.stringify(data.recommendedTrips || []),
        data.seatsLeft ? parseInt(data.seatsLeft) : null,
        data.isPopular || false,
        data.slug || this.generateSlug(data.title),
        data.status || 'active',
        data.createdBy || null,
      ];

      const [result] = await pool.query(query, values);
      // Get the inserted trip
      const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [result.insertId]);
      return this.mapRowToTrip(rows[0]);
    } catch (error) {
      console.error('Trip.create error:', error);
      throw error;
    }
  }

  /**
   * Find trip by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM trips WHERE id = ?';
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? this.mapRowToTrip(rows[0]) : null;
    } catch (error) {
      console.error('Trip.findById error:', error);
      throw error;
    }
  }

  /**
   * Find trip by slug
   */
  static async findBySlug(slug) {
    try {
      const query = 'SELECT * FROM trips WHERE slug = ? AND status = ?';
      const [rows] = await pool.query(query, [slug, 'active']);
      return rows.length > 0 ? this.mapRowToTrip(rows[0]) : null;
    } catch (error) {
      console.error('Trip.findBySlug error:', error);
      throw error;
    }
  }

  /**
   * Get all trips (with optional filters)
   */
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM trips WHERE 1=1';
      const values = [];

      if (filters.status) {
        query += ` AND status = ?`;
        values.push(filters.status);
      } else if (!filters.includeDraft) {
        // By default, only show active trips unless includeDraft is true
        query += ` AND status = ?`;
        values.push('active');
      }

      if (filters.location) {
        query += ` AND LOWER(location) LIKE LOWER(?)`;
        values.push(`%${filters.location}%`);
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
      return rows.map(row => this.mapRowToTrip(row));
    } catch (error) {
      console.error('Trip.findAll error:', error);
      throw error;
    }
  }

  /**
   * Update trip
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      // Map frontend field names to database column names
      const fieldMapping = {
        title: 'title',
        location: 'location',
        duration: 'duration',
        price: 'price',
        oldPrice: 'old_price',
        imageUrl: 'image_url',
        videoUrl: 'video_url',
        videoPublicId: 'video_public_id',
        imagePublicId: 'image_public_id',
        gallery: 'gallery',
        galleryPublicIds: 'gallery_public_ids',
        subtitle: 'subtitle',
        intro: 'intro',
        whyVisit: 'why_visit',
        itinerary: 'itinerary',
        included: 'included',
        notIncluded: 'not_included',
        notes: 'notes',
        faq: 'faq',
        reviews: 'reviews',
        category: 'category',
        recommendedTrips: 'recommended_trips',
        seatsLeft: 'seats_left',
        isPopular: 'is_popular',
        slug: 'slug',
        status: 'status',
      };

      // JSON fields that need to be stringified
      const jsonFields = ['gallery', 'galleryPublicIds', 'whyVisit', 'itinerary', 'included', 'notIncluded', 'notes', 'faq', 'reviews', 'category', 'location', 'recommendedTrips'];

      // Explicitly handle recommendedTrips first - always update if present in data (even if empty array)
      let recommendedTripsAdded = false;
      if ('recommendedTrips' in data) {
        updates.push('recommended_trips = ?');
        const recTrips = Array.isArray(data.recommendedTrips) ? data.recommendedTrips : [];
        values.push(JSON.stringify(recTrips));
        recommendedTripsAdded = true;
        console.log('Updating recommended_trips:', recTrips); // Debug log
      }

      // Explicitly handle seatsLeft - convert empty string to null
      let seatsLeftAdded = false;
      if ('seatsLeft' in data) {
        updates.push('seats_left = ?');
        const seatsValue = data.seatsLeft === '' || data.seatsLeft === null || data.seatsLeft === undefined 
          ? null 
          : parseInt(data.seatsLeft);
        values.push(seatsValue);
        seatsLeftAdded = true;
        console.log('Updating seats_left:', seatsValue); // Debug log
      }

      for (const [key, dbColumn] of Object.entries(fieldMapping)) {
        // Skip recommendedTrips and seatsLeft if already added above
        if ((key === 'recommendedTrips' && recommendedTripsAdded) || 
            (key === 'seatsLeft' && seatsLeftAdded)) {
          continue;
        }
        
        if (data[key] !== undefined) {
          updates.push(`${dbColumn} = ?`);
          if (jsonFields.includes(key)) {
            // Ensure arrays are properly formatted
            const jsonValue = Array.isArray(data[key]) ? data[key] : (data[key] || []);
            values.push(JSON.stringify(jsonValue));
          } else {
            values.push(data[key]);
          }
        }
      }

      if (updates.length === 0) {
        return await this.findById(id);
      }

      values.push(id);
      const query = `
        UPDATE trips 
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      console.log('UPDATE query:', query); // Debug log
      console.log('UPDATE values:', values); // Debug log
      await pool.query(query, values);
      // Get the updated trip
      const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [id]);
      const updatedTrip = this.mapRowToTrip(rows[0]);
      console.log('Updated trip recommendedTrips from DB:', rows[0]?.recommended_trips); // Debug log
      console.log('Parsed recommendedTrips:', updatedTrip?.recommendedTrips); // Debug log
      return updatedTrip;
    } catch (error) {
      console.error('Trip.update error:', error);
      throw error;
    }
  }

  /**
   * Delete trip
   */
  static async delete(id) {
    try {
      // First get the trip before deleting
      const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [id]);
      if (rows.length === 0) return null;
      
      await pool.query('DELETE FROM trips WHERE id = ?', [id]);
      return this.mapRowToTrip(rows[0]);
    } catch (error) {
      console.error('Trip.delete error:', error);
      throw error;
    }
  }

  /**
   * Generate slug from title
   */
  static generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Map database row to trip object
   */
  static mapRowToTrip(row) {
    if (!row) return null;

    try {
      console.log('mapRowToTrip - recommended_trips raw value:', row.recommended_trips, 'type:', typeof row.recommended_trips); // Debug log
      // Parse location - handle both JSON array and string (backward compatibility)
      let location = row.location || '';
      if (location && typeof location === 'string' && location.trim() !== '') {
        // Check if it looks like JSON (starts with [)
        if (location.trim().startsWith('[')) {
          try {
            const parsed = JSON.parse(location);
            location = Array.isArray(parsed) ? parsed : location; // If array, use it; else keep original
          } catch (e) {
            // Not valid JSON, keep as string (backward compatibility)
          }
        }
        // If it doesn't start with [, it's a plain string, keep it as is
      } else if (!location) {
        location = '';
      }

      return {
        id: row.id,
        title: row.title,
        location: location,
        duration: row.duration,
        price: row.price,
        oldPrice: row.old_price,
        image: row.image_url,
        imageUrl: row.image_url,
        video: row.video_url,
        videoUrl: row.video_url,
        videoPublicId: row.video_public_id,
        imagePublicId: row.image_public_id,
        gallery: Array.isArray(row.gallery) ? row.gallery : (row.gallery ? JSON.parse(row.gallery) : []),
        galleryPublicIds: Array.isArray(row.gallery_public_ids) ? row.gallery_public_ids : (row.gallery_public_ids ? JSON.parse(row.gallery_public_ids) : []),
        subtitle: row.subtitle,
        intro: row.intro,
        whyVisit: Array.isArray(row.why_visit) ? row.why_visit : (row.why_visit ? JSON.parse(row.why_visit) : []),
        itinerary: Array.isArray(row.itinerary) ? row.itinerary : (row.itinerary ? JSON.parse(row.itinerary) : []),
        included: Array.isArray(row.included) ? row.included : (row.included ? JSON.parse(row.included) : []),
        notIncluded: Array.isArray(row.not_included) ? row.not_included : (row.not_included ? JSON.parse(row.not_included) : []),
        notes: Array.isArray(row.notes) ? row.notes : (row.notes ? JSON.parse(row.notes) : []),
        faq: Array.isArray(row.faq) ? row.faq : (row.faq ? JSON.parse(row.faq) : []),
        reviews: Array.isArray(row.reviews) ? row.reviews : (row.reviews ? JSON.parse(row.reviews) : []),
        category: Array.isArray(row.category) ? row.category : (row.category ? JSON.parse(row.category) : []),
        seatsLeft: row.seats_left !== null && row.seats_left !== undefined ? parseInt(row.seats_left) : null,
        recommendedTrips: (() => {
          try {
            const recTrips = row.recommended_trips;
            
            // If already an array, return it
            if (Array.isArray(recTrips)) {
              return recTrips;
            }
            
            // If it's a string, try to parse it
            if (recTrips && typeof recTrips === 'string') {
              // Handle empty string or '[]'
              if (recTrips.trim() === '' || recTrips.trim() === '[]') {
                return [];
              }
              const parsed = JSON.parse(recTrips);
              return Array.isArray(parsed) ? parsed : [];
            }
            
            // If null or undefined, return empty array
            if (!recTrips) {
              return [];
            }
            
            // Fallback: try to parse as JSON (might be a JSON object already parsed by MySQL)
            try {
              const parsed = JSON.parse(recTrips);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          } catch (e) {
            console.error('Error parsing recommended_trips:', e, 'Value:', row.recommended_trips, 'Type:', typeof row.recommended_trips);
            return [];
          }
        })(),
        isPopular: Boolean(row.is_popular),
        slug: row.slug,
        status: row.status,
        createdBy: row.created_by,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    } catch (error) {
      console.error('Error mapping trip row:', error);
      console.error('Row data:', row);
      throw error;
    }
  }
}

export default Trip;
