import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Filter, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

import { getNotifications, markAsRead, markAllAsRead } from '../api/notifications';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';
import { relativeTime } from '../utils/formatters';

const NOTIF_META = {
  badge_earned:       { icon: '🏅', label: 'Badge' },
  level_up:           { icon: '⬆️', label: 'Niveau' },
  quiz_completed:     { icon: '✅', label: 'Quiz' },
  quiz_played:        { icon: '🎯', label: 'Quiz' },
  quiz_created:       { icon: '🆕', label: 'Quiz' },
  quiz_deleted:       { icon: '🗑️', label: 'Quiz' },
  order_confirmed:    { icon: '📦', label: 'Commande' },
  coupon_used:        { icon: '💎', label: 'Coupon' },
  reward_earned:      { icon: '🎁', label: 'Récompense' },
  account_blocked:    { icon: '🚫', label: 'Compte' },
  account_unblocked:  { icon: '✅', label: 'Compte' },
  system:             { icon: '📢', label: 'Système' },
};

const FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'unread', label: 'Non lues' },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ notifications: [], total: 0, totalPages: 0, unreadCount: 0 });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: resp } = await getNotifications({
        page,
        limit: 12,
        unreadOnly: filter === 'unread',
      });
      setData(resp?.data || { notifications: [], total: 0, totalPages: 0, unreadCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const onMarkAll = async () => {
    setMarking(true);
    try {
      await markAllAsRead();
      await load();
    } finally { setMarking(false); }
  };

  const onMarkOne = async (n) => {
    if (n.isRead) return;
    try {
      await markAsRead(n.id);
      setData((p) => ({
        ...p,
        notifications: p.notifications.map((x) =>
          x.id === n.id ? { ...x, isRead: true } : x,
        ),
        unreadCount: Math.max(0, (p.unreadCount || 0) - 1),
      }));
    } catch { /* */ }
  };

  const onOpen = async (n) => {
    await onMarkOne(n);
    if (n.link) navigate(n.link);
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={`${data.unreadCount || 0} non lues sur ${data.total} au total`}
        icon={Bell}
        actions={
          (data.unreadCount || 0) > 0 && (
            <Button onClick={onMarkAll} loading={marking} icon={CheckCheck} variant="outline">
              Tout marquer comme lu
            </Button>
          )
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => { setFilter(f.id); setPage(1); }}
            className={clsx(
              'rounded-xl px-3.5 py-1.5 text-sm font-medium transition-colors',
              filter === f.id
                ? 'bg-primary text-white'
                : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : data.notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Aucune notification"
          description={filter === 'unread' ? 'Vous êtes à jour !' : "Vos notifications apparaîtront ici."}
        />
      ) : (
        <Card className="!p-0 overflow-hidden">
          <AnimatePresence initial={false}>
            {data.notifications.map((n) => {
              const meta = NOTIF_META[n.type] || NOTIF_META.system;
              return (
                <motion.button
                  key={n.id}
                  type="button"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  onClick={() => onOpen(n)}
                  className={clsx(
                    'flex w-full items-start gap-4 border-b border-gray-100 dark:border-gray-700/50 px-5 py-4 text-left transition-colors last:border-0',
                    !n.isRead
                      ? 'bg-primary/5 dark:bg-primary/10 hover:bg-primary/10'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/30',
                  )}
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-lg">
                    <span>{meta.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={clsx(
                        'text-sm leading-snug truncate',
                        !n.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                      )}>
                        {n.title}
                      </p>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5">
                        {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
                      aria-label="Non lue"
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </Card>
      )}

      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
