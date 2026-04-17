import { useEffect, useState } from 'react';
import { getStats, getProfile } from '../../api/participant';
import { getRecommendations } from '../../api/participant';
import { HiOutlineStar, HiOutlineCollection, HiOutlineTrendingUp, HiOutlineCash } from 'react-icons/hi';
import StatsCard from '../../components/StatsCard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export default function ParticipantDashboard() {
  const [stats, setStats] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, recsRes] = await Promise.all([
          getStats().catch(() => ({ data: {} })),
          getRecommendations().catch(() => ({ data: [] })),
        ]);
        setStats(statsRes.data?.data?.stats || statsRes.data?.stats || {});
        setRecommended(recsRes.data?.data?.recommendations || recsRes.data?.recommendations || []);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Espace Participant</h1>
        <p className="text-sm text-gray-500">Bienvenue ! Découvrez vos statistiques et les quiz recommandés.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Points totaux" value={stats.totalPoints ?? 0} icon={HiOutlineStar} color="primary" />
        <StatsCard title="Quiz complétés" value={stats.gamesPlayed ?? 0} icon={HiOutlineCollection} color="success" />
        <StatsCard title="Score moyen" value={stats.averageScore != null ? `${stats.averageScore}%` : '—'} icon={HiOutlineTrendingUp} color="info" />
        <StatsCard title="Meilleur score" value={stats.bestScore ?? '—'} icon={HiOutlineCash} color="warning" />
      </div>

      {/* Recommended quizzes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quiz Recommandés</CardTitle>
            <Link to="/participant/quizzes"><Button size="sm" variant="outline">Voir tout</Button></Link>
          </div>
        </CardHeader>
        {recommended.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.slice(0, 6).map((q) => (
              <div key={q.id} className="rounded-lg border border-gray-200 p-4 hover:border-primary/50 transition-colors">
                <h4 className="font-medium text-gray-900">{q.title}</h4>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">{q.description || 'Aucune description'}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{q.questions?.length ?? q._count?.questions ?? '?'} questions</span>
                  <Link to={`/participant/quizzes/${q.id}/play`}>
                    <Button size="sm">Jouer</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucun quiz recommandé pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
