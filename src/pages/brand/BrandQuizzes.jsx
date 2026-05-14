import { useEffect, useState, useCallback } from 'react';
import { Search, Power, PowerOff, Trash2, Puzzle, BarChart3, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

import {
  listBrandQuizzes,
  enableQuiz,
  disableQuiz,
  deleteBrandQuiz,
} from '../../api/brandControl';
import { assetUrl } from '../../api/axios';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import ConfirmModal from '../../components/ui/ConfirmModal';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { formatDate } from '../../utils/formatters';

const STATUS_FILTERS = [
  { id: 'all', label: 'Tous', value: undefined },
  { id: 'active', label: 'Actifs', value: 'true' },
  { id: 'inactive', label: 'Inactifs', value: 'false' },
];

export default function BrandQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingAction, setPendingAction] = useState(null);
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      const status = STATUS_FILTERS.find((s) => s.id === statusFilter)?.value;
      if (status !== undefined) params.isActive = status;
      const { data } = await listBrandQuizzes(params);
      setQuizzes(data?.data?.quizzes || []);
      setTotalPages(data?.data?.totalPages || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const executeAction = async () => {
    if (!pendingAction) return;
    setWorking(true);
    try {
      const { type, quiz } = pendingAction;
      if (type === 'enable') {
        await enableQuiz(quiz.id);
        toast.success('Quiz activé');
      } else if (type === 'disable') {
        await disableQuiz(quiz.id);
        toast.success('Quiz désactivé');
      } else if (type === 'delete') {
        await deleteBrandQuiz(quiz.id);
        toast.success('Quiz supprimé');
      }
      setPendingAction(null);
      load();
    } catch { /* */ } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Quiz de votre marque"
        subtitle="Activez, désactivez ou supprimez les quiz créés par vos quizmasters"
        icon={Puzzle}
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input
          icon={Search}
          placeholder="Rechercher par titre…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm flex-1"
        />
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-gray-400" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => { setStatusFilter(f.id); setPage(1); }}
              className={clsx(
                'rounded-xl px-3 py-1.5 text-sm font-medium transition-colors',
                statusFilter === f.id
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState
          icon={Puzzle}
          title="Aucun quiz"
          description="Les quiz créés par vos quizmasters apparaîtront ici."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quizzes.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="flex flex-col h-full !p-0 overflow-hidden card-hover">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/10">
                  {q.imageUrl ? (
                    <img
                      src={assetUrl(q.imageUrl)}
                      alt={q.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <Puzzle className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <Badge variant={q.isActive ? 'success' : 'neutral'} dot>
                      {q.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                    {q.difficulty && (
                      <Badge variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}>
                        {q.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {q.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.25rem]">
                    {q.description || '—'}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <Avatar src={q.quizmaster?.avatar} name={q.quizmaster?.name || q.quizmaster?.email} size="xs" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {q.quizmaster?.name || q.quizmaster?.email}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <Mini label="Questions" value={q._count?.questions ?? 0} />
                    <Mini label="Joué" value={q._count?.attempts ?? 0} />
                    <Mini label="Créé" value={formatDate(q.createdAt).split(' ')[0]} small />
                  </div>
                </div>

                <div className="flex gap-1 border-t border-gray-100 dark:border-gray-700 p-2">
                  {q.isActive ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={PowerOff}
                      className="flex-1"
                      onClick={() => setPendingAction({ type: 'disable', quiz: q })}
                    >
                      Désactiver
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={Power}
                      className="flex-1 text-green-600 hover:text-green-700"
                      onClick={() => setPendingAction({ type: 'enable', quiz: q })}
                    >
                      Activer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => setPendingAction({ type: 'delete', quiz: q })}
                    className="text-red-500 hover:text-red-600"
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        open={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={executeAction}
        title={
          pendingAction?.type === 'delete'
            ? 'Supprimer ce quiz ?'
            : pendingAction?.type === 'disable'
              ? 'Désactiver ce quiz ?'
              : 'Activer ce quiz ?'
        }
        message={
          pendingAction?.type === 'delete'
            ? `Toutes les questions, tentatives et résultats du quiz « ${pendingAction?.quiz?.title} » seront supprimés.`
            : pendingAction?.type === 'disable'
              ? `« ${pendingAction?.quiz?.title} » ne sera plus visible par les participants.`
              : `« ${pendingAction?.quiz?.title} » sera disponible pour les participants.`
        }
        confirmLabel={
          pendingAction?.type === 'delete' ? 'Supprimer'
            : pendingAction?.type === 'disable' ? 'Désactiver'
              : 'Activer'
        }
        variant={pendingAction?.type === 'enable' ? 'warning' : 'danger'}
        requireType={pendingAction?.type === 'delete'}
        loading={working}
      />
    </div>
  );
}

function Mini({ label, value, small }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900/30 p-1.5">
      <p className="text-[10px] text-gray-500 dark:text-gray-400">{label}</p>
      <p className={clsx('font-semibold text-gray-800 dark:text-gray-200', small ? 'text-xs' : 'text-sm')}>
        {value}
      </p>
    </div>
  );
}
