import api from './axios';

export const login = (data) => api.post('/v1/auth/login', data);
export const register = (data) => api.post('/v1/auth/register', data);
export const logout = () => api.post('/v1/auth/logout');
