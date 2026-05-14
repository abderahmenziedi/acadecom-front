import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.errors?.[0]?.message ||
      'Une erreur est survenue';

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        toast.error('Session expirée, veuillez vous reconnecter');
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      toast.error(message);
    } else if (error.response?.status !== 422 && !error.config?.silent) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

/**
 * Base URL for static assets served by the backend (uploads).
 * `VITE_API_URL` typically ends with `/api`; strip that suffix.
 */
export const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/**
 * Resolve a possibly-relative `/uploads/...` path to a fully-qualified URL.
 * Returns absolute URLs unchanged.
 */
export function assetUrl(path) {
  if (!path) return null;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default api;
