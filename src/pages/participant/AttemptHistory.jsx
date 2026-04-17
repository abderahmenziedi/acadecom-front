import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAttempts } from '../../api/participant';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDateTime, formatDuration } from '../../utils/formatters';

export default function AttemptHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAttempts();
        setAttempts(data.data?.attempts || data.attempts || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const columns = [
    { key: 'quiz', label: 'Quiz', render: (r) => <span className="text-gray-900 dark:text-white font-medium">{r.quiz?.title || `Quiz #${r.quizId}`}</span> },
    { key: 'score', label: 'Score', render: (r) => `${r.score}/${r.maxScore}` },
    {
      key: 'pct', label: '%',
      render: (r) => {
        const pct = r.maxScore ? Math.round((r.score / r.maxScore) * 100) : 0;
        return <Badge variant={pct >= 50 ? 'success' : 'danger'}>{pct}%</Badge>;
      },
    },
    { key: 'duration', label: 'Durée', render: (r) => formatDuration(r.duration) },
    {
      key: 'status', label: 'Statut',
      render: (r) => r.completedAt ? <Badge variant="success">Terminé</Badge> : <Badge variant="warning">En cours</Badge>,
    },
    { key: 'createdAt', label: 'Date', render: (r) => formatDateTime(r.createdAt) },
    {
      key: 'actions', label: '',
      render: (r) => r.completedAt && (
        <Link to={`/participant/attempts/${r.id}/result`}>
          <Button size="sm" variant="outline">Résultat</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historique des tentatives</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{attempts.length} tentatives</p>
      </div>
      <Table columns={columns} data={attempts} loading={loading} emptyMessage="Aucune tentative" />
    </div>
  );
}
