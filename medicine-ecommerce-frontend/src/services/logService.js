import axios from 'axios';

const API_URL = 'http://localhost:8080/api/logs';

export const logService = {
  getSystemLogs: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  logFrontendError: async (level, message) => {
    try {
      await axios.post(`${API_URL}/frontend`, {
        level,
        message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to ship logs to backend:', error);
    }
  }
};
