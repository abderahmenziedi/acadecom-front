import api from './axios';

// Stats & dashboard
export const getBrandStats = () => api.get('/v1/brand/stats');

// QuizMaster control
export const listBrandQuizmasters = (params = {}) =>
  api.get('/v1/brand/quizmasters', { params });
export const blockQuizmaster = (id) => api.post(`/v1/brand/quizmasters/${id}/block`);
export const unblockQuizmaster = (id) => api.post(`/v1/brand/quizmasters/${id}/unblock`);
export const deleteQuizmaster = (id) => api.delete(`/v1/brand/quizmasters/${id}`);

// Quiz control
export const listBrandQuizzes = (params = {}) =>
  api.get('/v1/brand/quizzes', { params });
export const enableQuiz = (id) => api.post(`/v1/brand/quizzes/${id}/enable`);
export const disableQuiz = (id) => api.post(`/v1/brand/quizzes/${id}/disable`);
export const deleteBrandQuiz = (id) => api.delete(`/v1/brand/quizzes/${id}`);

// Participants
export const listBrandParticipants = (params = {}) =>
  api.get('/v1/brand/participants', { params });

// Activity log
export const getBrandActivity = (params = {}) =>
  api.get('/v1/brand/activity', { params });
