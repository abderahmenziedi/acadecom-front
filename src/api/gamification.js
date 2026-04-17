import api from './axios';

export const getGamificationProfile = () => api.get('/v1/gamification/profile');
export const getAllBadges = () => api.get('/v1/gamification/badges');
