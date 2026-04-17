import api from './axios';

// Profile
export const getProfile = () => api.get('/v1/participant/me');
export const updateProfile = (data) => api.put('/v1/participant/me', data);
export const getStats = () => api.get('/v1/participant/stats');

// Quizzes
export const getAvailableQuizzes = () => api.get('/v1/participant/quizzes/available');
export const startAttempt = (quizId) => api.post(`/v1/participant/quizzes/${quizId}/start`);

// Attempts
export const answerQuestion = (attemptId, data) =>
  api.post(`/v1/participant/attempts/${attemptId}/answer`, data);
export const finishAttempt = (attemptId) =>
  api.post(`/v1/participant/attempts/${attemptId}/finish`);
export const submitAndFinish = (attemptId, data) =>
  api.post(`/v1/participant/attempts/${attemptId}/submit`, data);
export const getAttemptResult = (attemptId) =>
  api.get(`/v1/participant/attempts/${attemptId}/result`);
export const getAttempts = () => api.get('/v1/participant/attempts');
export const getAttemptDetail = (id) => api.get(`/v1/participant/attempts/${id}`);

// Wallet & Points
export const getWallet = () => api.get('/v1/participant/wallet');
export const getPointsHistory = () => api.get('/v1/participant/points-history');

// Recommendations
export const getRecommendations = () => api.get('/v1/participant/recommendations');
