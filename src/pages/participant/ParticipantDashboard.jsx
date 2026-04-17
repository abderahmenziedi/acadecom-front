import { useEffect, useState } from 'react';
import { getStats } from '../../api/participant';
import { getRecommendations } from '../../api/participant';
import { getGamificationProfile } from '../../api/gamification';
import { Zap, LayoutGrid, TrendingUp, Sparkles, Gift, Trophy } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LEVEL_COLORS = {
  'Débutant': 'from-gray-400 to-gray-500',
  'Apprenti': 'from-green-400 to-green-600',
  'Intermédiaire': 'from-blue-400 to-blue-600',
  'Avancé': 'from-purple-400 to-purple-600',
  'Expert': 'from-yellow-400 to-yellow-600',
  'Maître': 'from-orange-400 to-orange-600',
  'Grand Maître': 'from-red-400 to-red-600',
  'Champion': 'from-pink-400 to-pink-600',
  'Légende': 'from-indigo-400 to-indigo-600',
  'Mythique': 'from-amber-400 via-red-500 to-purple-600',
};

const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500];

export default function ParticipantDashboard() {
  const [stats, setStats] = useState(null);
  const [gamif, setGamif] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, recsRes, gamifRes] = await Promise.all([
          getStats().catch(() => ({ data: {} })),
          getRecommendations().catch(() => ({ data: [] })),
          getGamificationProfile().catch(() => ({ data: {} })),
        ]);
        setStats(statsRes.data?.data?.stats || statsRes.data?.stats || {});
        setRecommended(recsRes.data?.data?.recommendations || recsRes.data?.recommendations || []);
        setGamif(gamifRes.data?.data?.profile || gamifRes.data?.profile || {});
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  const level = gamif?.level ?? 1;
  const xp = gamif?.xp ?? 0;
  const levelName = gamif?.levelName ?? 'Débutant';
  const xpPercent = gamif?.xpProgress ?? 0;
  const xpForNext = gamif?.xpForNextLevel ?? 0;
  const gradientClass = LEVEL_COLORS[levelName] || 'from-primary to-primary-dark';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon Espace Participant</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Bienvenue ! Découvrez vos statistiques et les quiz recommandés.</p>
      </div>

      {/* Level Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl bg-gradient-to-r ${gradientClass} p-6 text-white shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Niveau {level}</p>
            <h2 className="text-2xl font-bold">{levelName}</h2>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-2xl font-bold">{xp}</p>
              <p className="text-xs opacity-80">XP Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{gamif?.coupons ?? 0}</p>
              <p className="text-xs opacity-80">Coupons</p>
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs opacity-80">
            <span>{xp} XP</span>
            <span>{xpPercent}%</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-white/20">
            <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${xpPercent}%` }} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="XP Total" value={xp} icon={Zap} color="primary" delay={0} />
        <StatsCard title="Quiz complétés" value={stats.gamesPlayed ?? 0} icon={LayoutGrid} color="success" delay={0.1} />
        <StatsCard title="Score moyen" value={stats.averageScore != null ? `${stats.averageScore}%` : '—'} icon={TrendingUp} color="info" delay={0.2} />
        <StatsCard title="Badges obtenus" value={gamif?.badges?.length ?? 0} icon={Sparkles} color="warning" delay={0.3} />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Link to="/participant/badges" className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-primary/30 hover:shadow-md transition-all">
          <Sparkles className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Badges & XP</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Voir votre progression</p>
        </Link>
        <Link to="/participant/store" className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-secondary/30 hover:shadow-md transition-all">
          <Gift className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-secondary transition-colors">Boutique</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Échangez vos coupons</p>
        </Link>
        <Link to="/participant/leaderboard" className="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 hover:border-accent/30 hover:shadow-md transition-all">
          <Trophy className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-accent transition-colors">Classement</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Comparez-vous aux autres</p>
        </Link>
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
              <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors bg-white dark:bg-gray-800/50">
                <h4 className="font-medium text-gray-900 dark:text-white">{q.title}</h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{q.description || 'Aucune description'}</p>
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
          <p className="text-sm text-gray-400 dark:text-gray-500">Aucun quiz recommandé pour le moment.</p>
        )}
      </Card>
    </div>
  );
}
