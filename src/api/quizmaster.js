import api from './axios';

// Quiz CRUD
export const createQuiz = (data) => api.post('/v1/quizmaster/quizzes', data);
export const getQuizzes = () => api.get('/v1/quizmaster/quizzes');
export const getQuizById = (id) => api.get(`/v1/quizmaster/quizzes/${id}`);
export const updateQuiz = (id, data) => api.put(`/v1/quizmaster/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/v1/quizmaster/quizzes/${id}`);

// Questions
export const createQuestion = (quizId, data) =>
  api.post(`/v1/quizmaster/quizzes/${quizId}/questions`, data);
export const updateQuestion = (id, data) =>
  api.put(`/v1/quizmaster/questions/${id}`, data);
export const deleteQuestion = (id) =>
  api.delete(`/v1/quizmaster/questions/${id}`);

// Analytics
export const getQuizAnalytics = (quizId) =>
  api.get(`/v1/quizmaster/quizzes/${quizId}/analytics`);
export const getQMDashboard = () => api.get('/v1/quizmaster/dashboard');
