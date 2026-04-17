import api from './axios';

export const getNotifications = () => api.get('/v1/notifications');
export const getUnreadCount = () => api.get('/v1/notifications/unread-count');
export const markAsRead = (id) => api.patch(`/v1/notifications/${id}/read`);
export const markAllAsRead = () => api.patch('/v1/notifications/read-all');
