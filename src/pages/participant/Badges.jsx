import { useEffect, useState } from 'react';
import { getAllBadges, getGamificationProfile } from '../../api/gamification';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { Star, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

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

const BADGE_ICONS = {
  quizzes_completed: '🎯',
  perfect_score: '💎',
  orders_completed: '🛍️',
  level_reached: '⭐',
  speed_completion: '⚡',
  total_points: '🏆',
  win_streak: '🔥',
};

export default function Badges() {
  const [badges, setBadges] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [badgeRes, profRes] = await Promise.all([
          getAllBadges(),
          getGamificationProfile(),
        ]);
        setBadges(badgeRes.data?.data?.badges || badgeRes.data?.badges || []);
        setProfile(profRes.data?.data?.profile || profRes.data?.profile || {});
      } catch { }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  const currentLevel = profile?.level ?? 1;
  const currentXp = profile?.xp ?? 0;
  const levelName = profile?.levelName ?? 'Débutant';
  const xpPercent = profile?.xpProgress ?? 0;
  const xpForNext = profile?.xpForNextLevel ?? 0;
  const gradientClass = LEVEL_COLORS[levelName] || 'from-primary to-primary-dark';

  const earnedIds = new Set((profile?.badges || []).map(b => b.badgeId || b.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progression & Badges</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Suivez votre progression et débloquez des badges</p>
      </div>

      <Card className="overflow-hidden">
        <div className={`-m-6 mb-0 bg-gradient-to-r ${gradientClass} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Niveau {currentLevel}</p>
              <h2 className="text-3xl font-bold">{levelName}</h2>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{currentXp}</p>
              <p className="text-sm opacity-80">XP Total</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm opacity-80">
              <span>{currentXp} XP</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-white/20">
              <div className="h-3 rounded-full bg-white transition-all duration-500" style={{ width: `${xpPercent}%` }} />
            </div>
            {xpForNext > 0 && (
              <p className="mt-1 text-xs opacity-60">Encore {xpForNext - currentXp} XP pour le prochain niveau</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <Star className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{profile?.coupons ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Coupons</p>
          </div>
          <div>
            <Sparkles className="mx-auto h-5 w-5 text-success" />
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{earnedIds.size}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Badges obtenus</p>
          </div>
          <div>
            <TrendingUp className="mx-auto h-5 w-5 text-secondary" />
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{badges.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Badges total</p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tous les Badges ({earnedIds.size}/{badges.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {badges.map((badge, i) => {
            const earned = earnedIds.has(badge.id);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={clsx(
                  'relative rounded-2xl border-2 p-5 text-center transition-all',
                  earned
                    ? 'border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-sm'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60',
                )}
              >
                {earned && (
                  <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-white text-xs">
                    ✓
                  </div>
                )}
                <div className="text-4xl">{BADGE_ICONS[badge.condition] || '🏅'}</div>
                <h3 className={clsx('mt-3 font-semibold', earned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400')}>
                  {badge.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500 line-clamp-2">{badge.description}</p>
                {badge.xpReward > 0 && (
                  <p className="mt-2 text-xs font-medium text-primary">
                    <Zap className="inline h-3 w-3" /> +{badge.xpReward} XP
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
