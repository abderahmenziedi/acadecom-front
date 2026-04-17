import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../../api/quizmaster';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const { data } = await getQuizzes();
      setQuizzes(data.data?.quizzes || data.quizzes || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce quiz ?')) return;
    await deleteQuiz(id);
    toast.success('Quiz supprimé');
    fetchQuizzes();
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Titre' },
    {
      key: 'isActive', label: 'Statut',
      render: (r) => r.isActive ? <Badge variant="success">Actif</Badge> : <Badge variant="warning">Inactif</Badge>,
    },
    { key: 'questions', label: 'Questions', render: (r) => r.questions?.length ?? r._count?.questions ?? '—' },
    { key: 'createdAt', label: 'Créé le', render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Link to={`/quizmaster/quizzes/${r.id}`}>
            <Button size="sm" variant="outline">Gérer</Button>
          </Link>
          <Link to={`/quizmaster/quizzes/${r.id}/analytics`}>
            <Button size="sm" variant="ghost">Stats</Button>
          </Link>
          <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Supprimer</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes Quiz</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{quizzes.length} quiz</p>
        </div>
        <Link to="/quizmaster/create">
          <Button><Plus className="h-4 w-4" /> Créer un Quiz</Button>
        </Link>
      </div>
      <Table columns={columns} data={quizzes} loading={loading} emptyMessage="Aucun quiz créé" />
    </div>
  );
}
