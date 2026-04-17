import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizAnalytics } from '../../api/quizmaster';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import StatsCard from '../../components/StatsCard';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import { HiOutlineUsers, HiOutlineChartBar, HiOutlineClock, HiOutlineStar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function QuizAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getQuizAnalytics(id);
        setData(res.data?.data?.analytics || res.data?.analytics || res.data);
      } catch {} finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!data) return <p className="py-24 text-center text-gray-500">Aucune donnée</p>;

  const stats = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytiques du Quiz</h1>
          <p className="text-sm text-gray-500">{stats.quiz?.title || `Quiz #${id}`}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/quizmaster/quizzes')}>← Retour</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Participations" value={stats.totalAttempts ?? 0} icon={HiOutlineUsers} color="primary" />
        <StatsCard title="Score moyen" value={stats.averagePercentage != null ? `${stats.averagePercentage}%` : '—'} icon={HiOutlineChartBar} color="success" />
        <StatsCard title="Plus haut" value={stats.highestScore ?? '—'} icon={HiOutlineStar} color="info" />
        <StatsCard title="Plus bas" value={stats.lowestScore ?? '—'} icon={HiOutlineClock} color="warning" />
      </div>

      {stats.questionStats && stats.questionStats.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Taux de réussite par question</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.questionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="text" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="successRate" fill="#6c3fc5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
