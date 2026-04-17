import { useEffect, useState } from 'react';
import { getGlobalLeaderboard, getWeeklyLeaderboard, getMonthlyLeaderboard } from '../../api/leaderboard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Calendar, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const TABS = [
  { key: 'global', label: 'Global', icon: Globe },
  { key: 'monthly', label: 'Ce mois', icon: Calendar },
  { key: 'weekly', label: 'Cette semaine', icon: TrendingUp },
];

const fetchers = {
  global: getGlobalLeaderboard,
  weekly: getWeeklyLeaderboard,
  monthly: getMonthlyLeaderboard,
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data } = await fetchers[tab]();
        setLeaderboard(data.data?.leaderboard || data.leaderboard || []);
      } catch { setLeaderboard([]); }
      finally { setLoading(false); }
    })();
  }, [tab]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Classement</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Comparez-vous aux meilleurs participants</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
              tab === t.key ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top Participants — {TABS.find(t => t.key === tab)?.label}</CardTitle>
          </div>
        </CardHeader>

        {loading ? (
          <Spinner className="py-12" />
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => {
              const isMe = entry.id === user?.id || entry.userId === user?.id;
              return (
                <div
                  key={entry.id || entry.userId || i}
                  className={clsx(
                    'flex items-center gap-4 rounded-xl px-4 py-3 transition-colors',
                    isMe ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                  )}
                >
                  <span className="w-8 text-center text-lg font-bold text-gray-400">
                    {i < 3 ? medals[i] : i + 1}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    <span className="text-sm font-semibold text-primary">
                      {(entry.name?.[0] || entry.email?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx('text-sm font-medium truncate', isMe ? 'text-primary' : 'text-gray-900 dark:text-white')}>
                      {entry.name || entry.email} {isMe && '(vous)'}
                    </p>
                    {entry.level && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">Niveau {entry.level}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">
                      {entry.xp ?? entry.totalPoints ?? entry.points ?? 0}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      {tab === 'global' ? 'XP' : 'pts'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Aucun classement disponible pour cette période</p>
        )}
      </Card>
    </div>
  );
}
