import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data;
  },

  addToCart: async (medicineId, quantity) => {
    const response = await api.post('/cart', { medicineId, quantity });
    return response.data.data;
  },

  updateCartItem: async (id, quantity) => {
    const response = await api.put(`/cart/${id}`, { quantity: parseInt(quantity) });
    return response.data.data;
  },

  removeFromCart: async (id) => {
    await api.delete(`/cart/${id}`);
  },

  clearCart: async () => {
    await api.delete('/cart/clear');
  },
};
