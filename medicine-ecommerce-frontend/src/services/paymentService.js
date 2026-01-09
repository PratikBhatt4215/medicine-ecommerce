import api from './api';

export const paymentService = {
  createPaymentIntent: async (amount, currency = 'inr') => {
    const response = await api.post('/payment/create-payment-intent', { amount, currency });
    return response.data;
  }
};
