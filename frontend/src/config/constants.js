// Public configuration - Google Client ID
export const GOOGLE_CLIENT_ID = '615226246647-8eeg93jcdfivjqdh4rv5so4traivbv25.apps.googleusercontent.com';

// API Base URL - comment/uncomment for local vs production
// API Base URL - automatically detects production vs development
export const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Production: use relative path (same domain)
  : 'http://localhost:5000/api';  // Development: use localhost

// export const API_BASE_URL = 'https://safehandstravels.com/api';  // Production

