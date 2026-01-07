import express from 'express';

const router = express.Router();

// Get product page settings (public) - returns default settings
router.get('/', async (req, res) => {
  try {
    // Return default settings structure
    const defaultSettings = {
      tabs: [
        { id: 'itinerary', label: 'Itinerary', enabled: true, order: 1 },
        { id: 'inclusion', label: 'Inclusion/Exclusion', enabled: true, order: 2 },
        { id: 'notes', label: 'Notes', enabled: true, order: 3 },
        { id: 'costing', label: 'Date & Costing', enabled: true, order: 4 },
      ],
      sections: [
        { id: 'hero', enabled: true },
        { id: 'intro', enabled: true },
        { id: 'whyVisit', enabled: true },
        { id: 'gallery', enabled: true },
        { id: 'reviews', enabled: true },
        { id: 'faq', enabled: true },
      ],
      bookingCard: {
        enabled: true,
        showPrice: true,
        showDates: true,
        showTravelers: true,
        showEnquiryButton: true,
        showWhatsApp: true,
        minTravelers: 1,
        maxTravelers: 20,
        whatsappNumber: '+918448801998',
        defaultDates: [],
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
      },
      defaultTemplates: {},
    };
    
    res.json({ settings: defaultSettings });
  } catch (error) {
    console.error('Error fetching product page settings:', error);
    res.status(500).json({ error: 'Failed to fetch product page settings' });
  }
});

export default router;

