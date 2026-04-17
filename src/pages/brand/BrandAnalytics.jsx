import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBrandAnalytics } from '../../api/brand';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatsCard from '../../components/StatsCard';
import Spinner from '../../components/ui/Spinner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { HiOutlineUsers, HiOutlineCollection, HiOutlineChartBar, HiOutlineEye } from 'react-icons/hi';

const COLORS = ['#6c3fc5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

export default function BrandAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBrandAnalytics(user.id);
        setData(res.data?.data?.analytics || res.data?.analytics || res.data);
      } catch {} finally { setLoading(false); }
    })();
  }, [user.id]);

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!data) return <p className="py-24 text-center text-gray-500">Aucune donnée</p>;

  const topQuizzes = data.topQuizzes || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytiques</h1>
        <p className="text-sm text-gray-500">Détails de performance de votre marque</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Quiz Masters" value={data.totalQuizmasters ?? 0} icon={HiOutlineUsers} color="primary" />
        <StatsCard title="Quiz" value={data.totalQuizzes ?? 0} icon={HiOutlineCollection} color="info" />
        <StatsCard title="Participations" value={data.totalAttempts ?? 0} icon={HiOutlineEye} color="success" />
        <StatsCard title="Score moyen" value={data.averageScorePercentage != null ? `${data.averageScorePercentage}%` : '—'} icon={HiOutlineChartBar} color="warning" />
      </div>

      {topQuizzes.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Top Quiz</CardTitle></CardHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topQuizzes} dataKey="attempts" nameKey="title" cx="50%" cy="50%" outerRadius={100} label>
                  {topQuizzes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
