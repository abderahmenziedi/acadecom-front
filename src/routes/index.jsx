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
import BrandQuizmasters from '../pages/brand/BrandQuizmasters';
import BrandQuizzes from '../pages/brand/BrandQuizzes';
import BrandAnalytics from '../pages/brand/BrandAnalytics';
import BrandProducts from '../pages/brand/BrandProducts';
import BrandParticipants from '../pages/brand/BrandParticipants';
import BrandActivity from '../pages/brand/BrandActivity';

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
import Store from '../pages/participant/Store';
import Badges from '../pages/participant/Badges';
import Orders from '../pages/participant/Orders';

// Shared pages
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';

// Public
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Features from '../pages/public/Features';
import Pricing from '../pages/public/Pricing';
import Contact from '../pages/public/Contact';
import FAQ from '../pages/public/FAQ';

// Other
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

const sharedPages = [
  { path: 'profile', element: <Profile /> },
  { path: 'notifications', element: <Notifications /> },
];

const router = createBrowserRouter([
  // ─── Public ─────────────────────────────────────────────────
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/features', element: <Features /> },
  { path: '/pricing', element: <Pricing /> },
  { path: '/contact', element: <Contact /> },
  { path: '/faq', element: <FAQ /> },

  // ─── Auth ───────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // ─── Admin ──────────────────────────────────────────────────
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
      ...sharedPages.map((p) => ({ path: `/admin/${p.path}`, element: p.element })),
    ],
  },

  // ─── Brand ──────────────────────────────────────────────────
  {
    element: (
      <ProtectedRoute roles={['brand']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/brand', element: <BrandDashboard /> },
      { path: '/brand/quizmasters', element: <BrandQuizmasters /> },
      { path: '/brand/quizzes', element: <BrandQuizzes /> },
      { path: '/brand/analytics', element: <BrandAnalytics /> },
      { path: '/brand/products', element: <BrandProducts /> },
      { path: '/brand/participants', element: <BrandParticipants /> },
      { path: '/brand/activity', element: <BrandActivity /> },
      ...sharedPages.map((p) => ({ path: `/brand/${p.path}`, element: p.element })),
    ],
  },

  // ─── Quizmaster ─────────────────────────────────────────────
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
      ...sharedPages.map((p) => ({ path: `/quizmaster/${p.path}`, element: p.element })),
    ],
  },

  // ─── Participant ────────────────────────────────────────────
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
      { path: '/participant/store', element: <Store /> },
      { path: '/participant/badges', element: <Badges /> },
      { path: '/participant/orders', element: <Orders /> },
      ...sharedPages.map((p) => ({ path: `/participant/${p.path}`, element: p.element })),
    ],
  },

  // ─── Fallback ───────────────────────────────────────────────
  { path: '/unauthorized', element: <Unauthorized /> },
  { path: '*', element: <NotFound /> },
]);

export default router;
