import axios from 'axios';

// Automatically uses the correct API URL based on environment
// Local: http://localhost:8080/api (from .env.local)
// Production: Railway backend URL (from .env.production or Railway env vars)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token and language to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('i18nextLng') || 'en';
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default api;
