import api from './api';

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (category) => {
    const response = await api.post('/categories', category);
    return response.data.data;
  },

  updateCategory: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data.data;
  },

  deleteCategory: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};
