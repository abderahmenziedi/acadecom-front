import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRoleLabel, getRoleDashboardPath } from '../utils/roles';
import { Menu, Bell, Check, Sun, Moon, ChevronDown, User, LogOut, Settings, CheckCheck } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../api/notifications';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './ui/Avatar';
import { relativeTime } from '../utils/formatters';

/** Maps NotificationType -> emoji */
const NOTIF_ICONS = {
  badge_earned: '🏅',
  level_up: '⬆️',
  quiz_completed: '✅',
  quiz_played: '🎯',
  quiz_created: '🆕',
  quiz_deleted: '🗑️',
  order_confirmed: '📦',
  coupon_used: '💎',
  reward_earned: '🎁',
  account_blocked: '🚫',
  account_unblocked: '✅',
  system: '📢',
};

const POLL_INTERVAL_MS = 30_000;

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await getUnreadCount();
      setUnread(res.data?.data?.count ?? 0);
    } catch { /* silent */ }
  }, []);

  // Poll unread count every 30s.
  useEffect(() => {
    if (!user) return;
    fetchUnread();
    const timer = setInterval(fetchUnread, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [user, fetchUnread]);

  // Click-outside handler
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openNotifications = async () => {
    const willOpen = !showNotifs;
    setShowNotifs(willOpen);
    if (willOpen) {
      setLoadingNotifs(true);
      try {
        const { data } = await getNotifications({ limit: 10 });
        setNotifications(data?.data?.notifications || []);
      } catch { /* silent */ }
      finally { setLoadingNotifs(false); }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      setUnread((p) => Math.max(0, p - 1));
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch { /* silent */ }
  };

  const openNotificationTarget = async (n) => {
    setShowNotifs(false);
    if (!n.isRead) await handleMarkRead(n.id);
    if (n.link) navigate(n.link);
  };

  const profilePath = `${getRoleDashboardPath(user?.role)}/profile`;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.div>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={openNotifications}
            className="relative rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white shadow-sm"
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[22rem] rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {unread > 0 ? `${unread} non lues` : 'À jour'}
                    </p>
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      Tout marquer
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="py-8 flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-primary" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => openNotificationTarget(n)}
                        className={clsx(
                          'flex w-full items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 transition-colors text-left',
                          !n.isRead
                            ? 'bg-primary/5 dark:bg-primary/10 hover:bg-primary/10'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
                        )}
                      >
                        <span className="mt-0.5 text-lg shrink-0">{NOTIF_ICONS[n.type] || '📢'}</span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={clsx(
                              'text-sm leading-snug truncate',
                              !n.isRead
                                ? 'font-semibold text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-gray-300',
                            )}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                            {relativeTime(n.createdAt)}
                          </p>
                        </div>
                        {!n.isRead && (
                          <span
                            role="presentation"
                            className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary"
                          />
                        )}
                      </button>
                    ))
                  ) : (
                    <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">
                      Aucune notification
                    </p>
                  )}
                </div>
                <Link
                  to={`${getRoleDashboardPath(user?.role)}/notifications`}
                  onClick={() => setShowNotifs(false)}
                  className="block border-t border-gray-100 dark:border-gray-700 px-4 py-2.5 text-center text-xs font-medium text-primary hover:bg-primary/5"
                >
                  Voir toutes les notifications →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUser((p) => !p)}
            className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Avatar src={user?.avatar} name={user?.name || user?.email} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight max-w-[10rem] truncate">
                {user?.name || user?.email}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {getRoleLabel(user?.role)}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
                <div className="py-1">
                  <DropdownItem
                    icon={User}
                    label="Mon profil"
                    onClick={() => { setShowUser(false); navigate(profilePath); }}
                  />
                  <DropdownItem
                    icon={Settings}
                    label="Paramètres"
                    onClick={() => { setShowUser(false); navigate(`${profilePath}?tab=security`); }}
                  />
                  <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  <DropdownItem
                    icon={LogOut}
                    label="Déconnexion"
                    onClick={() => { setShowUser(false); logout(); }}
                    danger
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40',
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
