import api from './api';

export const orderService = {
  getUserOrders: async () => {
    const response = await api.get('/orders');
    return response.data.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data;
  },

  createOrder: async (shippingAddress, paymentId) => {
    const payload = { shippingAddress };
    if (paymentId) {
       payload.paymentId = paymentId;
    }
    const response = await api.post('/orders', payload);
    return response.data.data;
  },

  getAllOrders: async () => {
    const response = await api.get('/orders/all');
    return response.data.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data.data;
  },
};
