import axios from 'axios';

const api = axios.create({
  baseURL: 'https://solaris-backend-production-b44b.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const submitContactForm = async (formData) => {
  const response = await api.post('/contact', formData);
  return response.data;
};

export const getAllPricing   = async () => (await api.get('/pricing')).data;
export const getAllTeam      = async () => (await api.get('/team')).data;
export const getAllFAQs      = async () => (await api.get('/faq')).data;
export const getAllServices  = async () => (await api.get('/services')).data;

export default api;