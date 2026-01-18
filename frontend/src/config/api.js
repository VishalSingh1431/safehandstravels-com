import { API_BASE_URL } from './constants';

// API Configuration

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // If there's a help message, include it in the error
      const errorMessage = data.help 
        ? `${data.error}\n\n${data.help}`
        : data.error || 'Request failed';
      const error = new Error(errorMessage);
      error.help = data.help;
      error.code = data.code;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    // If it's a network error, provide helpful message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      const networkError = new Error('Cannot connect to server. Make sure the backend server is running on port 5001.');
      networkError.help = 'Start the backend server with: cd backend && npm run dev';
      throw networkError;
    }
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  sendOTP: async (email) => {
    return apiCall('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyOTP: async (email, otp, isSignup) => {
    return apiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, isSignup }),
    });
  },

  googleAuth: async (tokenId) => {
    return apiCall('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ tokenId }),
    });
  },

  verifyToken: async () => {
    return apiCall('/auth/verify', {
      method: 'GET',
    });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    });
  },

  updateProfile: async (profileData) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Admin/Main Admin endpoints
  getAllUsers: async (search = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiCall(`/auth/users?${params.toString()}`, {
      method: 'GET',
    });
  },

  promoteUser: async (userId) => {
    return apiCall(`/auth/users/${userId}/promote`, {
      method: 'PUT',
    });
  },

  demoteUser: async (userId) => {
    return apiCall(`/auth/users/${userId}/demote`, {
      method: 'PUT',
    });
  },
};

// Trips API functions
export const tripsAPI = {
  getAllTrips: async (location = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiCall(`/trips?${params.toString()}`, {
      method: 'GET',
    });
  },

  getTripById: async (id) => {
    return apiCall(`/trips/${id}`, {
      method: 'GET',
    });
  },

  getTripBySlug: async (slug) => {
    return apiCall(`/trips/slug/${slug}`, {
      method: 'GET',
    });
  },

  // Admin endpoints
  getAllTripsAdmin: async (status = '', location = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (location) params.append('location', location);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiCall(`/trips/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  createTrip: async (tripData) => {
    return apiCall('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  updateTrip: async (id, tripData) => {
    return apiCall(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  },

  deleteTrip: async (id) => {
    return apiCall(`/trips/${id}`, {
      method: 'DELETE',
    });
  },
};

// Upload API functions
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to upload image';
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login again.');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload/video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.details 
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to upload video';
        throw new Error(errorMessage);
      }
      return data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  deleteFile: async (publicId, resourceType = 'image') => {
    return apiCall(`/upload/${publicId}?resourceType=${resourceType}`, {
      method: 'DELETE',
    });
  },
};

// Certificates API functions
export const certificatesAPI = {
  getAllCertificates: async () => {
    return apiCall('/certificates', {
      method: 'GET',
    });
  },

  getAllCertificatesAdmin: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiCall(`/certificates/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getCertificateById: async (id) => {
    return apiCall(`/certificates/${id}`, {
      method: 'GET',
    });
  },

  createCertificate: async (certificateData) => {
    return apiCall('/certificates', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    });
  },

  updateCertificate: async (id, certificateData) => {
    return apiCall(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(certificateData),
    });
  },

  deleteCertificate: async (id) => {
    return apiCall(`/certificates/${id}`, {
      method: 'DELETE',
    });
  },
};

// Destinations API functions
export const destinationsAPI = {
  getAllDestinations: async () => {
    return apiCall('/destinations', {
      method: 'GET',
    });
  },

  getAllDestinationsAdmin: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiCall(`/destinations/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getDestinationById: async (id) => {
    return apiCall(`/destinations/${id}`, {
      method: 'GET',
    });
  },

  createDestination: async (destinationData) => {
    return apiCall('/destinations', {
      method: 'POST',
      body: JSON.stringify(destinationData),
    });
  },

  updateDestination: async (id, destinationData) => {
    return apiCall(`/destinations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(destinationData),
    });
  },

  deleteDestination: async (id) => {
    return apiCall(`/destinations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Reviews API functions
export const reviewsAPI = {
  getAllReviews: async () => {
    return apiCall('/reviews', {
      method: 'GET',
    });
  },

  getAllReviewsAdmin: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiCall(`/reviews/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getReviewById: async (id) => {
    return apiCall(`/reviews/${id}`, {
      method: 'GET',
    });
  },

  createReview: async (reviewData) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  updateReview: async (id, reviewData) => {
    return apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  deleteReview: async (id) => {
    return apiCall(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Written Reviews API functions
export const writtenReviewsAPI = {
  getAllWrittenReviews: async () => {
    return apiCall('/written-reviews', {
      method: 'GET',
    });
  },

  getAllWrittenReviewsAdmin: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiCall(`/written-reviews/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getWrittenReviewById: async (id) => {
    return apiCall(`/written-reviews/${id}`, {
      method: 'GET',
    });
  },

  createWrittenReview: async (writtenReviewData) => {
    return apiCall('/written-reviews', {
      method: 'POST',
      body: JSON.stringify(writtenReviewData),
    });
  },

  updateWrittenReview: async (id, writtenReviewData) => {
    return apiCall(`/written-reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(writtenReviewData),
    });
  },

  deleteWrittenReview: async (id) => {
    return apiCall(`/written-reviews/${id}`, {
      method: 'DELETE',
    });
  },
};

// Enquiries API functions
export const enquiriesAPI = {
  createEnquiry: async (enquiryData) => {
    return apiCall('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
  },
  getAllEnquiries: async () => {
    return apiCall('/enquiries', {
      method: 'GET',
      requiresAuth: true,
    });
  },
  getEnquiryById: async (id) => {
    return apiCall(`/enquiries/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },
  updateEnquiryStatus: async (id, status) => {
    return apiCall(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      requiresAuth: true,
    });
  },
};

// Drivers API functions
export const driversAPI = {
  getAllDrivers: async () => {
    return apiCall('/drivers', {
      method: 'GET',
    });
  },

  getAllDriversAdmin: async (status = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    return apiCall(`/drivers/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getDriverById: async (id) => {
    return apiCall(`/drivers/${id}`, {
      method: 'GET',
    });
  },

  createDriver: async (driverData) => {
    return apiCall('/drivers', {
      method: 'POST',
      body: JSON.stringify(driverData),
    });
  },

  updateDriver: async (id, driverData) => {
    return apiCall(`/drivers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(driverData),
    });
  },

  deleteDriver: async (id) => {
    return apiCall(`/drivers/${id}`, {
      method: 'DELETE',
    });
  },
};

// Car Booking Settings API functions
export const carBookingSettingsAPI = {
  getSettings: async () => {
    return apiCall('/car-booking-settings', {
      method: 'GET',
    });
  },

  getSettingsAdmin: async () => {
    return apiCall('/car-booking-settings/admin', {
      method: 'GET',
    });
  },

  updateSettings: async (settings) => {
    return apiCall('/car-booking-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// Product Page Settings API functions
export const productPageSettingsAPI = {
  getSettings: async () => {
    return apiCall('/product-page-settings', {
      method: 'GET',
    });
  },
};

// Location Filters API functions
export const locationFiltersAPI = {
  getLocationFilters: async () => {
    return apiCall('/location-filters', {
      method: 'GET',
    });
  },

  getLocationFiltersAdmin: async () => {
    return apiCall('/location-filters/admin', {
      method: 'GET',
    });
  },

  updateLocationFilters: async (filters) => {
    return apiCall('/location-filters/admin', {
      method: 'PUT',
      body: JSON.stringify({ filters }),
    });
  },
};

// Vibe Videos API functions
export const vibeVideosAPI = {
  getVibeVideos: async () => {
    return apiCall('/vibe-videos', {
      method: 'GET',
    });
  },

  getVibeVideosAdmin: async () => {
    return apiCall('/vibe-videos/admin', {
      method: 'GET',
    });
  },

  updateVibeVideos: async (videos) => {
    return apiCall('/vibe-videos/admin', {
      method: 'PUT',
      body: JSON.stringify({ videos }),
    });
  },
};

// FAQs API functions
export const faqsAPI = {
  getAllFAQs: async () => {
    return apiCall('/faqs', {
      method: 'GET',
    });
  },

  getAllFAQsAdmin: async () => {
    return apiCall('/faqs/admin', {
      method: 'GET',
    });
  },

  getFAQById: async (id) => {
    return apiCall(`/faqs/${id}`, {
      method: 'GET',
    });
  },

  createFAQ: async (faq) => {
    return apiCall('/faqs', {
      method: 'POST',
      body: JSON.stringify(faq),
    });
  },

  updateFAQ: async (id, faq) => {
    return apiCall(`/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faq),
    });
  },

  deleteFAQ: async (id) => {
    return apiCall(`/faqs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Banners API functions
export const bannersAPI = {
  getAllBanners: async () => {
    return apiCall('/banners', {
      method: 'GET',
    });
  },

  getAllBannersAdmin: async () => {
    return apiCall('/banners/admin', {
      method: 'GET',
    });
  },

  getBannerById: async (id) => {
    return apiCall(`/banners/${id}`, {
      method: 'GET',
    });
  },

  createBanner: async (banner) => {
    return apiCall('/banners', {
      method: 'POST',
      body: JSON.stringify(banner),
    });
  },

  updateBanner: async (id, banner) => {
    return apiCall(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(banner),
    });
  },

  deleteBanner: async (id) => {
    return apiCall(`/banners/${id}`, {
      method: 'DELETE',
    });
  },
};

// Branding Partners API functions
export const brandingPartnersAPI = {
  getAllPartners: async () => {
    return apiCall('/branding-partners', {
      method: 'GET',
    });
  },

  getAllPartnersAdmin: async () => {
    return apiCall('/branding-partners/admin', {
      method: 'GET',
    });
  },

  getPartnerById: async (id) => {
    return apiCall(`/branding-partners/${id}`, {
      method: 'GET',
    });
  },

  createPartner: async (partner) => {
    return apiCall('/branding-partners', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  },

  updatePartner: async (id, partner) => {
    return apiCall(`/branding-partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner),
    });
  },

  deletePartner: async (id) => {
    return apiCall(`/branding-partners/${id}`, {
      method: 'DELETE',
    });
  },
};

// Hotel Partners API functions
export const hotelPartnersAPI = {
  getAllPartners: async () => {
    return apiCall('/hotel-partners', {
      method: 'GET',
    });
  },

  getAllPartnersAdmin: async () => {
    return apiCall('/hotel-partners/admin', {
      method: 'GET',
    });
  },

  getPartnerById: async (id) => {
    return apiCall(`/hotel-partners/${id}`, {
      method: 'GET',
    });
  },

  createPartner: async (partner) => {
    return apiCall('/hotel-partners', {
      method: 'POST',
      body: JSON.stringify(partner),
    });
  },

  updatePartner: async (id, partner) => {
    return apiCall(`/hotel-partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(partner),
    });
  },

  deletePartner: async (id) => {
    return apiCall(`/hotel-partners/${id}`, {
      method: 'DELETE',
    });
  },
};

// Blogs API functions
export const blogsAPI = {
  getAllBlogs: async (category = '', featured = '', search = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', featured);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiCall(`/blogs?${params.toString()}`, {
      method: 'GET',
    });
  },

  getAllBlogsAdmin: async (status = '', category = '', featured = '', search = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    if (featured) params.append('featured', featured);
    if (search) params.append('search', search);
    params.append('limit', limit);
    params.append('offset', offset);
    return apiCall(`/blogs/admin?${params.toString()}`, {
      method: 'GET',
    });
  },

  getBlogById: async (id) => {
    return apiCall(`/blogs/${id}`, {
      method: 'GET',
    });
  },

  getBlogBySlug: async (slug) => {
    return apiCall(`/blogs/slug/${slug}`, {
      method: 'GET',
    });
  },

  createBlog: async (blogData) => {
    return apiCall('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  updateBlog: async (id, blogData) => {
    return apiCall(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  deleteBlog: async (id) => {
    return apiCall(`/blogs/${id}`, {
      method: 'DELETE',
    });
  },
};

export default API_BASE_URL;
