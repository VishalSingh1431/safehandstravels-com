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
      const networkError = new Error('Cannot connect to server. Make sure the backend server is running on port 5000.');
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
};

export default API_BASE_URL;
