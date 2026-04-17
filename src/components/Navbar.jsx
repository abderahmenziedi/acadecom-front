import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getRoleLabel } from '../utils/roles';
import { Menu, Bell, Check, Sun, Moon, Search } from 'lucide-react';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notifications';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      getUnreadCount()
        .then(res => setUnread(res.data?.data?.count ?? res.data?.count ?? 0))
        .catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openNotifications = async () => {
    setShowDropdown(prev => !prev);
    if (!showDropdown) {
      setLoadingNotifs(true);
      try {
        const { data } = await getNotifications();
        setNotifications(data.data?.notifications || data.notifications || []);
      } catch { }
      finally { setLoadingNotifs(false); }
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
    } catch { }
  };

  const NOTIF_ICONS = {
    badge_earned: '🏅', level_up: '⬆️', quiz_completed: '✅',
    order_confirmed: '📦', reward_earned: '🎁', system: '📢',
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200/60 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar (visual placeholder) */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex-1 md:flex-none" />

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
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
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={openNotifications}
            className="relative rounded-xl p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow-sm"
              >
                {unread > 9 ? '9+' : unread}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white dark:bg-gray-800 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 px-4 py-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  {unread > 0 && (
                    <button onClick={handleMarkAllRead} className="text-xs font-medium text-primary hover:underline">
                      Tout marquer lu
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="py-8 flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-primary" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.slice(0, 20).map(n => (
                      <div
                        key={n.id}
                        className={clsx(
                          'flex items-start gap-3 px-4 py-3 border-b border-gray-50 dark:border-gray-700/50 transition-colors',
                          !n.read ? 'bg-primary/5 dark:bg-primary/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
                        )}
                      >
                        <span className="mt-0.5 text-lg">{NOTIF_ICONS[n.type] || '📢'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={clsx('text-sm', !n.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400')}>
                            {n.message}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {new Date(n.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="mt-1 rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="py-10 text-center text-sm text-gray-400 dark:text-gray-500">Aucune notification</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 ml-1 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm shadow-primary/20">
            <span className="text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(user?.role)}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
