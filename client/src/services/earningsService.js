import api from './api';

export const getPlatformEarnings = async () => {
  const response = await api.get('/payments/earnings');
  return response.data;
};

export const requestPayout = async (amount, stripeAccountId) => {
  const response = await api.post('/payments/payout', {
    amount,
    stripe_account_id: stripeAccountId
  });
  return response.data;
};