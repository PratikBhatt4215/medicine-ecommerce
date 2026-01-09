import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (medicineId) => {
    const response = await api.post('/wishlist', { medicineId });
    return response.data;
  },

  removeFromWishlist: async (medicineId) => {
    await api.delete(`/wishlist/${medicineId}`);
  },
};
