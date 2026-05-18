import { lazy } from 'react';

// Public
export const Home = lazy(() => import('../pages/public/Home'));
export const About = lazy(() => import('../pages/public/About'));
export const Features = lazy(() => import('../pages/public/Features'));
export const Pricing = lazy(() => import('../pages/public/Pricing'));
export const Contact = lazy(() => import('../pages/public/Contact'));
export const FAQ = lazy(() => import('../pages/public/FAQ'));

// Auth
export const Login = lazy(() => import('../pages/auth/Login'));
export const Register = lazy(() => import('../pages/auth/Register'));

// Admin
export const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
export const ManageUsers = lazy(() => import('../pages/admin/ManageUsers'));
export const ManageBrands = lazy(() => import('../pages/admin/ManageBrands'));
export const ManageQuizmasters = lazy(() => import('../pages/admin/ManageQuizmasters'));

// Brand
export const BrandDashboard = lazy(() => import('../pages/brand/BrandDashboard'));
export const BrandQuizmasters = lazy(() => import('../pages/brand/BrandQuizmasters'));
export const BrandQuizzes = lazy(() => import('../pages/brand/BrandQuizzes'));
export const BrandAnalytics = lazy(() => import('../pages/brand/BrandAnalytics'));
export const BrandProducts = lazy(() => import('../pages/brand/BrandProducts'));
export const BrandParticipants = lazy(() => import('../pages/brand/BrandParticipants'));
export const BrandActivity = lazy(() => import('../pages/brand/BrandActivity'));

// Quizmaster
export const QuizmasterDashboard = lazy(() => import('../pages/quizmaster/QuizmasterDashboard'));
export const QuizList = lazy(() => import('../pages/quizmaster/QuizList'));
export const CreateQuiz = lazy(() => import('../pages/quizmaster/CreateQuiz'));
export const EditQuiz = lazy(() => import('../pages/quizmaster/EditQuiz'));
export const QuizAnalytics = lazy(() => import('../pages/quizmaster/QuizAnalytics'));

// Participant
export const ParticipantDashboard = lazy(() => import('../pages/participant/ParticipantDashboard'));
export const AvailableQuizzes = lazy(() => import('../pages/participant/AvailableQuizzes'));
export const TakeQuiz = lazy(() => import('../pages/participant/TakeQuiz'));
export const QuizResult = lazy(() => import('../pages/participant/QuizResult'));
export const AttemptHistory = lazy(() => import('../pages/participant/AttemptHistory'));
export const Wallet = lazy(() => import('../pages/participant/Wallet'));
export const Leaderboard = lazy(() => import('../pages/participant/Leaderboard'));
export const Store = lazy(() => import('../pages/participant/Store'));
export const Badges = lazy(() => import('../pages/participant/Badges'));
export const Orders = lazy(() => import('../pages/participant/Orders'));

// Shared + fallback
export const Profile = lazy(() => import('../pages/Profile'));
export const Notifications = lazy(() => import('../pages/Notifications'));
export const Unauthorized = lazy(() => import('../pages/Unauthorized'));
export const NotFound = lazy(() => import('../pages/NotFound'));
export const ServerError = lazy(() => import('../pages/ServerError'));
