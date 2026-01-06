import pool from '../config/database.js';

/**
 * ProductPageSettings Model - PostgreSQL operations
 */
class ProductPageSettings {
  /**
   * Get settings (returns default if not found)
   */
  static async get() {
    try {
      const query = 'SELECT * FROM product_page_settings WHERE id = 1';
      const result = await pool.query(query);
      
      if (result.rows.length > 0) {
        return this.mapRowToSettings(result.rows[0]);
      }
      
      // Return default settings
      return this.getDefaultSettings();
    } catch (error) {
      console.error('ProductPageSettings.get error:', error);
      throw error;
    }
  }

  /**
   * Update or create settings
   */
  static async update(settings) {
    try {
      const query = `
        INSERT INTO product_page_settings (id, settings_data)
        VALUES (1, $1::jsonb)
        ON CONFLICT (id) 
        DO UPDATE SET settings_data = $1::jsonb, updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;

      const result = await pool.query(query, [JSON.stringify(settings)]);
      return this.mapRowToSettings(result.rows[0]);
    } catch (error) {
      console.error('ProductPageSettings.update error:', error);
      throw error;
    }
  }

  /**
   * Get default settings
   */
  static getDefaultSettings() {
    return {
      tabs: [
        { id: 'itinerary', label: 'Itinerary', enabled: true, order: 1 },
        { id: 'inclusion', label: 'Inclusion/Exclusion', enabled: true, order: 2 },
        { id: 'notes', label: 'Notes', enabled: true, order: 3 },
        { id: 'costing', label: 'Date & Costing', enabled: true, order: 4 },
      ],
      sections: [
        { id: 'hero', label: 'Hero Section (Video/Image)', enabled: true, order: 1 },
        { id: 'intro', label: 'Introduction', enabled: true, order: 2 },
        { id: 'whyVisit', label: 'Why Visit Section', enabled: true, order: 3 },
        { id: 'gallery', label: 'Gallery & Reviews', enabled: true, order: 4 },
        { id: 'faq', label: 'FAQ Section', enabled: true, order: 5 },
        { id: 'cta', label: 'Call to Action Card', enabled: true, order: 6 },
      ],
      bookingCard: {
        enabled: true,
        showPrice: true,
        showDates: true,
        showTravelers: true,
        showEnquiryButton: true,
        showWhatsApp: true,
        whatsappNumber: '+918448801998',
        minTravelers: 1,
        maxTravelers: 20,
        defaultDates: [
          'Dec 13, 2025',
          'Jan 10, 2026',
          'Feb 14, 2026'
        ]
      },
      displaySettings: {
        defaultTab: 'Itinerary',
        autoExpandItinerary: false,
        galleryColumns: 4,
        maxReviewsDisplay: 10,
        showOldPrice: true,
        showDiscountBadge: true,
      },
      cta: {
        enabled: true,
        heading: 'Ready to Embark on This Adventure?',
        description: 'Book your spot now and create memories that last a lifetime!',
        buttonText: 'Book Now',
      },
      defaultTemplates: {
        intro: 'offers an incredible backpacking experience with stunning natural beauty, rich culture, and unique adventures. This carefully curated trip takes you through the best that this destination has to offer, ensuring an unforgettable journey filled with memories.',
        whyVisit: [
          'Scenic landscapes and natural beauty',
          'Rich cultural heritage and local traditions',
          'Unique experiences and offbeat locations',
          'Friendly locals and warm hospitality',
          'Delicious local cuisine',
          'Adventure activities and outdoor experiences',
          'Photography opportunities',
          'Peaceful and rejuvenating environment'
        ],
        included: [
          'Accommodation (twin sharing)',
          'All meals as per itinerary',
          'Transportation during the trip',
          'Experienced local guide',
          'Entry fees to monuments and attractions',
          'Basic first aid support',
          'Trip leader assistance'
        ],
        notIncluded: [
          'Transportation to/from destination',
          'Personal expenses and shopping',
          'Extra meals and beverages',
          'Optional activities',
          'Travel insurance',
          'Tips and gratuities',
          'GST and taxes'
        ],
        notes: [
          'Arrival: Please reach the starting point as per the itinerary',
          'Departure: Plan your departure after the trip concludes',
          'Weather: Check weather conditions and pack accordingly',
          'Fitness: Moderate fitness level recommended',
          'Accommodation: Basic to mid-range facilities',
          'Safety: Follow guide instructions at all times',
          'Local conditions: Itinerary may change due to weather or local restrictions'
        ]
      }
    };
  }

  /**
   * Map database row to settings object
   */
  static mapRowToSettings(row) {
    if (!row) return this.getDefaultSettings();

    const settings = row.settings_data;
    if (typeof settings === 'string') {
      return JSON.parse(settings);
    }
    return settings || this.getDefaultSettings();
  }
}

export default ProductPageSettings;

