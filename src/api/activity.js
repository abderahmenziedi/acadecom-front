import api from './axios';

export const getMyActivity = (params = {}) => api.get('/v1/activity/me', { params });
