import api from './axios';

export const getProfile = () => api.get('/v1/brand/me');
export const updateProfile = (data) => api.put('/v1/brand/me', data);
export const getMyQuizmasters = () => api.get('/v1/brand/quizmasters');
export const getMyQuizzes = () => api.get('/v1/brand/quizzes');
export const getDashboard = () => api.get('/v1/brand/dashboard');
export const getBrandAnalytics = (id) => api.get(`/v1/brand/${id}/analytics`);
