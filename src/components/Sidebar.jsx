import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/roles';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Users, Briefcase, GraduationCap, User, BarChart3,
  Puzzle, Zap, ClipboardList, Sparkles, ShoppingCart, Package, Wallet,
  Trophy, LogOut, ChevronsLeft, ChevronsRight, Tag,
} from 'lucide-react';

const menusByRole = {
  [ROLES.ADMIN]: [
    { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    { to: '/admin/brands', label: 'Marques', icon: Briefcase },
    { to: '/admin/quizmasters', label: 'Quiz Masters', icon: GraduationCap },
  ],
  [ROLES.BRAND]: [
    { to: '/brand', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/brand/profile', label: 'Mon Profil', icon: User },
    { to: '/brand/quizmasters', label: 'Mes Quiz Masters', icon: Users },
    { to: '/brand/quizzes', label: 'Mes Quiz', icon: Puzzle },
    { to: '/brand/products', label: 'Mes Produits', icon: Tag },
    { to: '/brand/analytics', label: 'Analytiques', icon: BarChart3 },
  ],
  [ROLES.QUIZMASTER]: [
    { to: '/quizmaster', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/quizmaster/quizzes', label: 'Mes Quiz', icon: Puzzle },
    { to: '/quizmaster/create', label: 'Créer un Quiz', icon: Zap },
  ],
  [ROLES.PARTICIPANT]: [
    { to: '/participant', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
    { to: '/participant/quizzes', label: 'Quiz', icon: Zap },
    { to: '/participant/attempts', label: 'Historique', icon: ClipboardList },
    { to: '/participant/badges', label: 'Badges & XP', icon: Sparkles },
    { to: '/participant/store', label: 'Boutique', icon: ShoppingCart },
    { to: '/participant/orders', label: 'Commandes', icon: Package },
    { to: '/participant/wallet', label: 'Portefeuille', icon: Wallet },
    { to: '/participant/leaderboard', label: 'Classement', icon: Trophy },
  ],
};

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const menus = menusByRole[user?.role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300',
          'border-r border-white/[0.06]',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          open ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-4 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white font-bold text-sm shadow-lg shadow-primary/20">
            A
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-white">AcadeCom</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menus.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-white/10 text-white shadow-sm shadow-white/5'
                    : 'text-gray-400 hover:bg-white/[0.06] hover:text-white',
                )
              }
            >
              <item.icon className={clsx('h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110')} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.06] px-3 py-3 space-y-1">
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            {collapsed ? <ChevronsRight className="h-5 w-5 mx-auto" /> : (
              <>
                <ChevronsLeft className="h-5 w-5 shrink-0" />
                <span>Réduire</span>
              </>
            )}
          </button>

          <button
            onClick={logout}
            className={clsx(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
              'text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all',
              collapsed && 'justify-center px-0',
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
