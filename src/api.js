import axios from 'axios';

const api = axios.create({
  baseURL: 'https://solaris-backend-production-b44b.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
});

// 🔥 Debug all API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ Contact Form
export const submitContactForm = async (formData) => {
  try {
    const response = await api.post('/contact', formData);
    return response.data;
  } catch (error) {
    console.log("🔥 Contact Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Other APIs
export const getAllPricing = async () =>
  (await api.get('/pricing')).data;

export const getAllTeam = async () =>
  (await api.get('/team')).data;

export const getAllFAQs = async () =>
  (await api.get('/faq')).data;

export const getAllServices = async () =>
  (await api.get('/services')).data;

export default api;