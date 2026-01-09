import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { data } = response.data;
    // Strict flow: Do NOT save token or user here.
    // Just return the success data so the UI knows to redirect.
    return data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { data } = response.data;
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data;
  },
};
