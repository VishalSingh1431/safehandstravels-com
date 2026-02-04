import pool from '../config/database.js';

/**
 * Trip Model - MySQL operations
 */
class Trip {
  /** Safe parse JSON column; return fallback on invalid JSON so mapRowToTrip never throws */
  static safeParseJson(val, fallback = []) {
    if (val == null || val === '') return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }

  /**
   * Create a new trip
   */
  static async create(data) {
    try {
      const query = `
        INSERT INTO trips (
          title, location, duration, price, old_price, image_url, video_url,
          video_public_id, image_public_id, gallery, gallery_public_ids,
          hero_images, hero_images_public_ids, subtitle, intro, why_visit, itinerary, included, not_included,
          notes, faq, reviews, category, recommended_trips, related_blogs, seats_left, is_popular, slug, status, enquiry_form_type, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        JSON.stringify(data.heroImages || []),
        JSON.stringify(data.heroImagesPublicIds || []),
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
        JSON.stringify(data.relatedBlogs || []),
        data.seatsLeft ? parseInt(data.seatsLeft) : null,
        data.isPopular || false,
        data.slug || this.generateSlug(data.title),
        data.status || 'active',
        (data.enquiryFormType === 'form2' ? 'form2' : 'form1'),
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
   * Sanitize itinerary to plain serializable objects (avoids JSON.stringify errors from React state/proxy).
   * Day is always stored as 1-based number (Day 1, Day 2, ...). Parses "Day 1" style from admin.
   */
  static sanitizeItinerary(itinerary) {
    if (!Array.isArray(itinerary)) return [];
    return itinerary.map((day, index) => {
      const bullets = Array.isArray(day.bullets)
        ? day.bullets.map((b) => (b != null ? String(b) : ''))
        : [];
      let dayNum = 0;
      if (typeof day.day === 'number' && day.day >= 1) {
        dayNum = day.day;
      } else if (day.day != null && day.day !== '') {
        const s = String(day.day);
        const parsed = parseInt(s, 10);
        if (!Number.isNaN(parsed) && parsed >= 1) dayNum = parsed;
        else {
          const match = s.match(/\d+/);
          if (match) dayNum = Math.max(1, parseInt(match[0], 10));
          else dayNum = index + 1;
        }
      }
      if (dayNum < 1) dayNum = index + 1;
      return {
        day: dayNum,
        title: day.title != null ? String(day.title) : '',
        activities: day.activities != null ? String(day.activities) : '',
        bullets,
      };
    });
  }

  /**
   * Update trip
   */
  static async update(id, data) {
    try {
      const updates = [];
      const values = [];

      // Sanitize itinerary so JSON.stringify never fails (plain objects only)
      if (data.itinerary !== undefined) {
        data = { ...data, itinerary: this.sanitizeItinerary(data.itinerary) };
      }

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
        heroImages: 'hero_images',
        heroImagesPublicIds: 'hero_images_public_ids',
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
        relatedBlogs: 'related_blogs',
        seatsLeft: 'seats_left',
        isPopular: 'is_popular',
        slug: 'slug',
        status: 'status',
        enquiryFormType: 'enquiry_form_type',
      };

      // JSON fields that need to be stringified
      const jsonFields = ['gallery', 'galleryPublicIds', 'heroImages', 'heroImagesPublicIds', 'whyVisit', 'itinerary', 'included', 'notIncluded', 'notes', 'faq', 'reviews', 'category', 'location', 'recommendedTrips', 'relatedBlogs'];

      // Explicitly handle recommendedTrips first - always update if present in data (even if empty array)
      let recommendedTripsAdded = false;
      if ('recommendedTrips' in data) {
        updates.push('recommended_trips = ?');
        const recTrips = Array.isArray(data.recommendedTrips) ? data.recommendedTrips : [];
        values.push(JSON.stringify(recTrips));
        recommendedTripsAdded = true;
      }

      // Explicitly handle relatedBlogs - always update if present in data (even if empty array)
      let relatedBlogsAdded = false;
      if ('relatedBlogs' in data) {
        updates.push('related_blogs = ?');
        const relBlogs = Array.isArray(data.relatedBlogs) ? data.relatedBlogs : [];
        values.push(JSON.stringify(relBlogs));
        relatedBlogsAdded = true;
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
      }

      for (const [key, dbColumn] of Object.entries(fieldMapping)) {
        // Skip recommendedTrips, relatedBlogs, and seatsLeft if already added above
        if ((key === 'recommendedTrips' && recommendedTripsAdded) || 
            (key === 'relatedBlogs' && relatedBlogsAdded) ||
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

      await pool.query(query, values);
      // Get the updated trip
      const [rows] = await pool.query('SELECT * FROM trips WHERE id = ?', [id]);
      if (!rows || rows.length === 0) {
        throw new Error('Trip not found after update');
      }
      const updatedTrip = this.mapRowToTrip(rows[0]);
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
        gallery: this.safeParseJson(row.gallery, []),
        galleryPublicIds: this.safeParseJson(row.gallery_public_ids, []),
        heroImages: this.safeParseJson(row.hero_images, []),
        heroImagesPublicIds: this.safeParseJson(row.hero_images_public_ids, []),
        subtitle: row.subtitle,
        intro: row.intro,
        whyVisit: this.safeParseJson(row.why_visit, []),
        itinerary: this.safeParseJson(row.itinerary, []),
        included: this.safeParseJson(row.included, []),
        notIncluded: this.safeParseJson(row.not_included, []),
        notes: this.safeParseJson(row.notes, []),
        faq: this.safeParseJson(row.faq, []),
        reviews: this.safeParseJson(row.reviews, []),
        category: this.safeParseJson(row.category, []),
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
        relatedBlogs: (() => {
          try {
            const relBlogs = row.related_blogs;
            
            // If already an array, return it
            if (Array.isArray(relBlogs)) {
              return relBlogs;
            }
            
            // If it's a string, try to parse it
            if (relBlogs && typeof relBlogs === 'string') {
              // Handle empty string or '[]'
              if (relBlogs.trim() === '' || relBlogs.trim() === '[]') {
                return [];
              }
              const parsed = JSON.parse(relBlogs);
              return Array.isArray(parsed) ? parsed : [];
            }
            
            // If null or undefined, return empty array
            if (!relBlogs) {
              return [];
            }
            
            // Fallback: try to parse as JSON (might be a JSON object already parsed by MySQL)
            try {
              const parsed = JSON.parse(relBlogs);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [];
            }
          } catch (e) {
            console.error('Error parsing related_blogs:', e, 'Value:', row.related_blogs, 'Type:', typeof row.related_blogs);
            return [];
          }
        })(),
        isPopular: Boolean(row.is_popular),
        slug: row.slug,
        status: row.status,
        enquiryFormType: row.enquiry_form_type === 'form2' ? 'form2' : 'form1',
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
