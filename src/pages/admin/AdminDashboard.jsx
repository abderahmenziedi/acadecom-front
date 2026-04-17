import { useEffect, useState } from 'react';
import { Users, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { getUsers } from '../../api/admin';
import StatsCard from '../../components/StatsCard';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUsers({ limit: 1000 });
        const users = data.data?.users || data.users || [];
        const counts = {
          total: users.length,
          participants: users.filter((u) => u.role === 'participant').length,
          brands: users.filter((u) => u.role === 'brand').length,
          quizmasters: users.filter((u) => u.role === 'quizmaster').length,
          blocked: users.filter((u) => u.isBlocked).length,
        };
        setStats(counts);
      } catch {
        setStats({ total: 0, participants: 0, brands: 0, quizmasters: 0, blocked: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Admin</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Utilisateurs" value={stats.total} icon={Users} color="primary" delay={0} />
        <StatsCard title="Participants" value={stats.participants} icon={Users} color="success" delay={0.1} />
        <StatsCard title="Marques" value={stats.brands} icon={Briefcase} color="info" delay={0.2} />
        <StatsCard title="Quiz Masters" value={stats.quizmasters} icon={GraduationCap} color="warning" delay={0.3} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comptes bloqués</CardTitle>
        </CardHeader>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.blocked}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">comptes actuellement bloqués</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
