import api from './axios';

// Products (public-ish, requires auth)
export const getProducts = (params) => api.get('/v1/store/products', { params });
export const getProduct = (id) => api.get(`/v1/store/products/${id}`);
export const getCategories = () => api.get('/v1/store/products/categories');

// Orders (participant)
export const createOrder = (data) => api.post('/v1/store/orders', data);
export const getOrders = () => api.get('/v1/store/orders');
export const getOrderDetail = (id) => api.get(`/v1/store/orders/${id}`);

// Brand products management
export const getBrandProducts = () => api.get('/v1/store/brand/products');
export const createProduct = (data) => api.post('/v1/store/brand/products', data);
export const updateProduct = (id, data) => api.put(`/v1/store/brand/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/v1/store/brand/products/${id}`);
