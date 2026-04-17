import api from './axios';

export const getGlobalLeaderboard = () => api.get('/v1/leaderboard/global');
export const getQuizLeaderboard = (quizId) => api.get(`/v1/leaderboard/quiz/${quizId}`);
export const getWeeklyLeaderboard = () => api.get('/v1/leaderboard/weekly');
export const getMonthlyLeaderboard = () => api.get('/v1/leaderboard/monthly');
