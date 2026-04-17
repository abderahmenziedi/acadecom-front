import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import {
  HiOutlineHome, HiOutlineUsers, HiOutlinePuzzle, HiOutlineChartBar,
  HiOutlineUser, HiOutlineCog, HiOutlineLogout, HiOutlineCollection,
  HiOutlineLightningBolt, HiOutlineStar, HiOutlineBriefcase,
  HiOutlineClipboardList, HiOutlineTrendingUp, HiOutlineAcademicCap,
  HiOutlineCash,
} from 'react-icons/hi';

const menusByRole = {
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Tableau de bord', icon: HiOutlineHome, end: true },
    { to: '/admin/users', label: 'Utilisateurs', icon: HiOutlineUsers },
    { to: '/admin/brands', label: 'Marques', icon: HiOutlineBriefcase },
    { to: '/admin/quizmasters', label: 'Quiz Masters', icon: HiOutlineAcademicCap },
  ],
  [ROLES.BRAND]: [
    { to: '/brand', label: 'Tableau de bord', icon: HiOutlineHome, end: true },
    { to: '/brand/profile', label: 'Mon Profil', icon: HiOutlineUser },
    { to: '/brand/quizmasters', label: 'Mes Quiz Masters', icon: HiOutlineUsers },
    { to: '/brand/quizzes', label: 'Mes Quiz', icon: HiOutlineCollection },
    { to: '/brand/analytics', label: 'Analytiques', icon: HiOutlineChartBar },
  ],
  [ROLES.QUIZMASTER]: [
    { to: '/quizmaster', label: 'Tableau de bord', icon: HiOutlineHome, end: true },
    { to: '/quizmaster/quizzes', label: 'Mes Quiz', icon: HiOutlineCollection },
    { to: '/quizmaster/create', label: 'Créer un Quiz', icon: HiOutlinePuzzle },
  ],
  [ROLES.PARTICIPANT]: [
    { to: '/participant', label: 'Tableau de bord', icon: HiOutlineHome, end: true },
    { to: '/participant/quizzes', label: 'Quiz Disponibles', icon: HiOutlineLightningBolt },
    { to: '/participant/attempts', label: 'Historique', icon: HiOutlineClipboardList },
    { to: '/participant/wallet', label: 'Portefeuille', icon: HiOutlineCash },
    { to: '/participant/leaderboard', label: 'Classement', icon: HiOutlineTrendingUp },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const menus = menusByRole[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-white transition-transform
          lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light text-white font-bold text-lg">
            A
          </div>
          <span className="text-lg font-bold tracking-tight">AcadeCom</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {menus.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    ${isActive ? 'bg-sidebar-hover text-white' : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'}`
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-3 py-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300
              hover:bg-red-600/20 hover:text-red-300 transition-colors"
          >
            <HiOutlineLogout className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
