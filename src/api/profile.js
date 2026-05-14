import api from './axios';

export const getProfile = () => api.get('/v1/profile/me');
export const updateProfile = (data) => api.put('/v1/profile/me', data);
export const updateAvatar = (url) => api.put('/v1/profile/avatar', { url });
export const deleteAvatar = () => api.delete('/v1/profile/avatar');
export const changePassword = (payload) => api.put('/v1/profile/password', payload);
