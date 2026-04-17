import { useEffect, useState } from 'react';
import { getDashboard } from '../../api/brand';
import { Users, LayoutGrid, BarChart3, Eye } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BrandDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboard();
        setData(res.data?.data?.dashboard || res.data?.dashboard || res.data);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!data) return <p className="text-center text-gray-500 py-24">Aucune donnée disponible</p>;

  const stats = data.summary || data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Marque</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Analytiques et performance de votre marque</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Quiz Masters" value={stats.totalQuizmasters ?? 0} icon={Users} color="primary" delay={0} />
        <StatsCard title="Quiz créés" value={stats.totalQuizzes ?? 0} icon={LayoutGrid} color="info" delay={0.1} />
        <StatsCard title="Participations" value={stats.totalAttempts ?? 0} icon={Eye} color="success" delay={0.2} />
        <StatsCard title="Score moyen" value={stats.averageScorePercentage != null ? `${stats.averageScorePercentage}%` : '—'} icon={BarChart3} color="warning" delay={0.3} />
      </div>

      {data.recentQuizzes && data.recentQuizzes.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Performance des Quiz</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.recentQuizzes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attempts" fill="#6c3fc5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
