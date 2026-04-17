import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageBrands from '../pages/admin/ManageBrands';
import ManageQuizmasters from '../pages/admin/ManageQuizmasters';

// Brand pages
import BrandDashboard from '../pages/brand/BrandDashboard';
import BrandProfile from '../pages/brand/BrandProfile';
import BrandQuizmasters from '../pages/brand/BrandQuizmasters';
import BrandQuizzes from '../pages/brand/BrandQuizzes';
import BrandAnalytics from '../pages/brand/BrandAnalytics';

// Quizmaster pages
import QuizmasterDashboard from '../pages/quizmaster/QuizmasterDashboard';
import QuizList from '../pages/quizmaster/QuizList';
import CreateQuiz from '../pages/quizmaster/CreateQuiz';
import EditQuiz from '../pages/quizmaster/EditQuiz';
import QuizAnalytics from '../pages/quizmaster/QuizAnalytics';

// Participant pages
import ParticipantDashboard from '../pages/participant/ParticipantDashboard';
import AvailableQuizzes from '../pages/participant/AvailableQuizzes';
import TakeQuiz from '../pages/participant/TakeQuiz';
import QuizResult from '../pages/participant/QuizResult';
import AttemptHistory from '../pages/participant/AttemptHistory';
import Wallet from '../pages/participant/Wallet';
import Leaderboard from '../pages/participant/Leaderboard';

// Public
import Home from '../pages/public/Home';

// Other
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

const router = createBrowserRouter([
  // Public — Home
  { path: '/', element: <Home /> },

  // Public — Auth
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // Admin
  {
    element: (
      <ProtectedRoute roles={['admin']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/users', element: <ManageUsers /> },
      { path: '/admin/brands', element: <ManageBrands /> },
      { path: '/admin/quizmasters', element: <ManageQuizmasters /> },
    ],
  },

  // Brand
  {
    element: (
      <ProtectedRoute roles={['brand']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/brand', element: <BrandDashboard /> },
      { path: '/brand/profile', element: <BrandProfile /> },
      { path: '/brand/quizmasters', element: <BrandQuizmasters /> },
      { path: '/brand/quizzes', element: <BrandQuizzes /> },
      { path: '/brand/analytics', element: <BrandAnalytics /> },
    ],
  },

  // Quizmaster
  {
    element: (
      <ProtectedRoute roles={['quizmaster']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/quizmaster', element: <QuizmasterDashboard /> },
      { path: '/quizmaster/quizzes', element: <QuizList /> },
      { path: '/quizmaster/create', element: <CreateQuiz /> },
      { path: '/quizmaster/quizzes/:id', element: <EditQuiz /> },
      { path: '/quizmaster/quizzes/:id/analytics', element: <QuizAnalytics /> },
    ],
  },

  // Participant
  {
    element: (
      <ProtectedRoute roles={['participant']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/participant', element: <ParticipantDashboard /> },
      { path: '/participant/quizzes', element: <AvailableQuizzes /> },
      { path: '/participant/quizzes/:quizId/play', element: <TakeQuiz /> },
      { path: '/participant/attempts/:attemptId/result', element: <QuizResult /> },
      { path: '/participant/attempts', element: <AttemptHistory /> },
      { path: '/participant/wallet', element: <Wallet /> },
      { path: '/participant/leaderboard', element: <Leaderboard /> },
    ],
  },

  // Fallback
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]);

export default router;
