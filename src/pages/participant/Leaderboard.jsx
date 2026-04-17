import { useEffect, useState } from 'react';
import { getGlobalLeaderboard } from '../../api/leaderboard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineTrendingUp } from 'react-icons/hi';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getGlobalLeaderboard();
        setLeaderboard(data.data?.leaderboard || data.leaderboard || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Classement Global</h1>
        <p className="text-sm text-gray-500">Les meilleurs participants de la plateforme</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HiOutlineTrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Top Participants</CardTitle>
          </div>
        </CardHeader>

        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, i) => {
              const isMe = entry.id === user?.id || entry.userId === user?.id;
              return (
                <div
                  key={entry.id || i}
                  className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors
                    ${isMe ? 'bg-primary/5 border border-primary/20' : 'hover:bg-gray-50'}`}
                >
                  <span className="w-8 text-center text-lg font-bold text-gray-400">
                    {i < 3 ? medals[i] : i + 1}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm font-semibold text-gray-600">
                      {(entry.name?.[0] || entry.email?.[0] || '?').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isMe ? 'text-primary' : 'text-gray-900'}`}>
                      {entry.name || entry.email} {isMe && '(vous)'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary">{entry.totalPoints ?? entry.points ?? 0} pts</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Aucun classement disponible</p>
        )}
      </Card>
    </div>
  );
}
