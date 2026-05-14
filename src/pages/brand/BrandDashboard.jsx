import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, LayoutGrid, Eye, BarChart3, ArrowUpRight, Puzzle, Sparkles,
  CheckCircle, History,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import { getDashboard } from '../../api/brand';
import { getBrandActivity } from '../../api/brandControl';
import StatsCard from '../../components/StatsCard';
import PageHeader from '../../components/ui/PageHeader';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import { SkeletonCard } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { relativeTime } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const ACTION_LABELS = {
  quizmaster_create_quiz: 'Quiz créé',
  quizmaster_delete_quiz: 'Quiz supprimé',
  participant_take_quiz: 'Quiz joué',
  participant_order: 'Commande',
  brand_block_quizmaster: 'QM bloqué',
  brand_unblock_quizmaster: 'QM débloqué',
  brand_disable_quiz: 'Quiz désactivé',
  brand_enable_quiz: 'Quiz activé',
};

export default function BrandDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dashboard, act] = await Promise.all([
          getDashboard(),
          getBrandActivity({ limit: 5 }),
        ]);
        setData(dashboard?.data?.data?.dashboard || null);
        setActivity(act?.data?.data?.logs || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!data) {
    return <EmptyState icon={BarChart3} title="Aucune donnée disponible" description="Activez vos quiz pour commencer à voir des résultats." />;
  }

  const stats = data.summary || {};

  return (
    <div>
      <PageHeader
        title={`Bienvenue${user?.name ? `, ${user.name}` : ''}`}
        subtitle="Analytiques et performances de votre marque en un coup d'œil"
        icon={Sparkles}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard title="Quiz Masters" value={stats.totalQuizmasters ?? 0} icon={Users} color="primary" delay={0} />
        <StatsCard title="Quiz créés" value={stats.totalQuizzes ?? 0} icon={LayoutGrid} color="info" delay={0.1} />
        <StatsCard title="Participations" value={stats.totalAttempts ?? 0} icon={Eye} color="success" delay={0.2} />
        <StatsCard
          title="Score moyen"
          value={stats.averageScorePercentage != null ? `${stats.averageScorePercentage}%` : '—'}
          icon={BarChart3}
          color="warning"
          delay={0.3}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Performance des quiz</CardTitle>
              <Link
                to="/brand/quizzes"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Voir tous <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>

          {data.recentQuizzes && data.recentQuizzes.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.recentQuizzes}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="title" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="attempts" fill="#6366f1" radius={[8, 8, 0, 0]} name="Participations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={Puzzle}
              title="Aucun quiz à afficher"
              description="Activez vos premiers quiz pour voir leurs performances."
              className="border-0 bg-transparent"
            />
          )}
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>Activité récente</CardTitle>
              <Link
                to="/brand/activity"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Tout l'historique <History className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>

          {activity.length === 0 ? (
            <EmptyState
              icon={History}
              title="Pas encore d'activité"
              description="Les actions sur votre espace apparaîtront ici."
              className="border-0 bg-transparent !py-6"
            />
          ) : (
            <ul className="space-y-3">
              {activity.map((log) => (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <Avatar src={log.actor?.avatar} name={log.actor?.name || log.actor?.email} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {log.actor?.name || log.actor?.email}
                      </span>{' '}
                      — {ACTION_LABELS[log.action] || log.action}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      {relativeTime(log.createdAt)}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {data.recentQuizzes && data.recentQuizzes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quiz récents</CardTitle>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentQuizzes.slice(0, 6).map((q) => (
              <Link
                key={q.id}
                to="/brand/quizzes"
                className="block rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 hover:border-primary card-hover"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{q.title}</p>
                  <Badge variant={q.isActive ? 'success' : 'neutral'} dot>
                    {q.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {q.quizmaster?.name || '—'} · {q.questions} questions · {q.attempts} participations
                </p>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
