import { useEffect, useState } from 'react';
import { getQMDashboard } from '../../api/quizmaster';
import { LayoutGrid, Users, BarChart3, Zap } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function QuizmasterDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getQMDashboard();
        setData(res.data?.data?.dashboard || res.data?.dashboard || res.data);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!data) return <p className="py-24 text-center text-gray-500">Aucune donnée</p>;

  const stats = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Quiz Master</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gérez vos quiz et suivez les performances</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Quiz" value={stats.totalQuizzes ?? 0} icon={LayoutGrid} color="primary" delay={0} />
        <StatsCard title="Questions" value={stats.totalQuestions ?? 0} icon={Zap} color="info" delay={0.1} />
        <StatsCard title="Participations" value={stats.totalAttempts ?? 0} icon={Users} color="success" delay={0.2} />
        <StatsCard title="Score moyen" value={stats.globalAveragePercentage != null ? `${stats.globalAveragePercentage}%` : '—'} icon={BarChart3} color="warning" delay={0.3} />
      </div>

      {stats.topQuizzes && stats.topQuizzes.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Top Quiz</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.topQuizzes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attempts" stroke="#6c3fc5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
