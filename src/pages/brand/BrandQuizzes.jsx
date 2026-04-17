import { useEffect, useState } from 'react';
import { getMyQuizzes } from '../../api/brand';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { formatDate } from '../../utils/formatters';

export default function BrandQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyQuizzes();
        setQuizzes(data.data?.quizzes || data.quizzes || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const columns = [
    { key: 'title', label: 'Titre' },
    {
      key: 'quizmaster',
      label: 'Quiz Master',
      render: (row) => row.quizmaster?.name || row.quizmaster?.email || '—',
    },
    {
      key: 'questions',
      label: 'Questions',
      render: (row) => row._count?.questions ?? 0,
    },
    {
      key: 'attempts',
      label: 'Participations',
      render: (row) => row._count?.attempts ?? 0,
    },
    {
      key: 'isActive',
      label: 'Statut',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'warning'}>
          {row.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Créé le',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz de ma Marque</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Consultez les quiz créés par vos Quiz Masters ({quizzes.length} quiz)
        </p>
      </div>

      <Table columns={columns} data={quizzes} loading={loading} emptyMessage="Aucun quiz pour le moment" />
    </div>
  );
}
