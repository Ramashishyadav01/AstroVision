import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = rawBase
  ? (rawBase.endsWith('/api') ? rawBase : `${rawBase.replace(/\/$/, '')}/api`)
  : '/api';

// Helper: get auth headers
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const authAPI = {
  register: (data) =>
    axios.post(`${API_BASE}/auth/register`, data),

  login: (data) =>
    axios.post(`${API_BASE}/auth/login`, data),

  getProfile: () =>
    axios.get(`${API_BASE}/auth/profile`, {
      headers: getAuthHeader(),
    }),

  forgotPassword: (email) =>
    axios.post(`${API_BASE}/auth/forgot-password`, { email }),

  verifyResetToken: (token) =>
    axios.get(`${API_BASE}/auth/reset-password/${token}/verify`),

  resetPassword: (token, password, confirmPassword) =>
    axios.post(`${API_BASE}/auth/reset-password/${token}`, { password, confirmPassword }),
};

// Reports API
export const reportsAPI = {
  generate: (data) =>
    axios.post(`${API_BASE}/reports/generate`, data, {
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
    }),

  getAll: () =>
    axios.get(`${API_BASE}/reports`, {
      headers: getAuthHeader(),
    }),

  getOne: (id) =>
    axios.get(`${API_BASE}/reports/${id}`, {
      headers: getAuthHeader(),
    }),

  delete: (id) =>
    axios.delete(`${API_BASE}/reports/${id}`, {
      headers: getAuthHeader(),
    }),
};
