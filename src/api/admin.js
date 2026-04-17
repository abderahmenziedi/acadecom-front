import api from './axios';

export const getUsers = (params) => api.get('/admin/users', { params });
export const blockUser = (id) => api.patch(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.patch(`/admin/users/${id}/unblock`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const exportUsersCsv = () => api.get('/admin/users/export/csv', { responseType: 'blob' });

// Brand management
export const createBrand = (data) => api.post('/v1/admin/brands', data);
export const getBrands = (params) => api.get('/v1/admin/brands', { params });
export const getBrandById = (id) => api.get(`/v1/admin/brands/${id}`);
export const updateBrand = (id, data) => api.put(`/v1/admin/brands/${id}`, data);
export const deleteBrand = (id) => api.delete(`/v1/admin/brands/${id}`);

// Quizmaster management
export const createQuizmaster = (data) => api.post('/v1/admin/quizmasters', data);
export const getQuizmasters = (params) => api.get('/v1/admin/quizmasters', { params });
export const getQuizmasterById = (id) => api.get(`/v1/admin/quizmasters/${id}`);
export const updateQuizmaster = (id, data) => api.put(`/v1/admin/quizmasters/${id}`, data);
export const deleteQuizmaster = (id) => api.delete(`/v1/admin/quizmasters/${id}`);
