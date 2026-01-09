import api from './api';

export const medicineService = {
  getAllMedicines: async (page = 0, size = 12) => {
    const response = await api.get(`/medicines?page=${page}&size=${size}`);
    return response.data.data;
  },

  getMedicineById: async (id) => {
    const response = await api.get(`/medicines/${id}`);
    return response.data.data;
  },

  getMedicinesByCategory: async (categoryId) => {
    const response = await api.get(`/medicines/category/${categoryId}`);
    return response.data.data;
  },

  searchMedicines: async (keyword, page = 0, size = 12) => {
    const response = await api.get(`/medicines/search?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data.data;
  },

  createMedicine: async (medicine) => {
    const response = await api.post('/medicines', medicine);
    return response.data.data;
  },

  updateMedicine: async (id, medicine) => {
    const response = await api.put(`/medicines/${id}`, medicine);
    return response.data.data;
  },

  deleteMedicine: async (id) => {
    await api.delete(`/medicines/${id}`);
  },
};
