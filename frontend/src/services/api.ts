import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if present in storage
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('portfolio_admin_token') ||
    sessionStorage.getItem('portfolio_admin_token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: extract cleaner error messages
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ success?: boolean; message?: string; errors?: any[] }>) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }

    // Auto-clear auth state on 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('portfolio_admin_auth');
        sessionStorage.removeItem('portfolio_admin_auth');
        localStorage.removeItem('portfolio_admin_token');
        sessionStorage.removeItem('portfolio_admin_token');
      }
    }

    return Promise.reject(new Error(message));
  }
);
