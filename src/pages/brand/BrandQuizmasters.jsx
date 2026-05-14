import { useEffect, useState, useCallback } from 'react';
import { Search, Ban, ShieldCheck, Trash2, Users, Mail, Phone, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import {
  listBrandQuizmasters,
  blockQuizmaster,
  unblockQuizmaster,
  deleteQuizmaster,
} from '../../api/brandControl';
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

export default function BrandQuizmasters() {
  const [qms, setQms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [pendingAction, setPendingAction] = useState(null); // { type, qm }
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listBrandQuizmasters({ page, limit: 12, search: search || undefined });
      setQms(data?.data?.quizmasters || []);
      setTotalPages(data?.data?.totalPages || 0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const executeAction = async () => {
    if (!pendingAction) return;
    setWorking(true);
    try {
      const { type, qm } = pendingAction;
      if (type === 'block') {
        await blockQuizmaster(qm.id);
        toast.success(`${qm.name || qm.email} bloqué`);
      } else if (type === 'unblock') {
        await unblockQuizmaster(qm.id);
        toast.success(`${qm.name || qm.email} débloqué`);
      } else if (type === 'delete') {
        await deleteQuizmaster(qm.id);
        toast.success(`${qm.name || qm.email} supprimé`);
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
        title="Mes Quiz Masters"
        subtitle="Gérez les quizmasters de votre marque (bloquer, débloquer, supprimer)"
        icon={Users}
      />

      <div className="mb-4 max-w-md">
        <Input
          icon={Search}
          placeholder="Rechercher par nom ou email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : qms.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'Aucun résultat' : 'Aucun quizmaster'}
          description={search ? 'Essayez un autre mot-clé.' : "Les quizmasters affiliés à votre marque apparaîtront ici."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qms.map((qm, i) => (
            <motion.div
              key={qm.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="flex flex-col h-full card-hover">
                <div className="flex items-start gap-3">
                  <Avatar src={qm.avatar} name={qm.name || qm.email} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {qm.name || '—'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {qm.email}
                    </p>
                    {qm.phone && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {qm.phone}
                      </p>
                    )}
                  </div>
                  <Badge variant={qm.isBlocked ? 'danger' : 'success'} dot>
                    {qm.isBlocked ? 'Bloqué' : 'Actif'}
                  </Badge>
                </div>

                {qm.bio && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {qm.bio}
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-900/30 p-2">
                    <p className="text-xs text-gray-500">Quiz</p>
                    <p className="text-base font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                      <BookOpen className="h-3.5 w-3.5 text-primary" /> {qm._count?.quizzes || 0}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-900/30 p-2">
                    <p className="text-xs text-gray-500">Inscrit</p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {formatDate(qm.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                  {qm.isBlocked ? (
                    <Button
                      size="sm"
                      variant="success"
                      icon={ShieldCheck}
                      onClick={() => setPendingAction({ type: 'unblock', qm })}
                      className="flex-1"
                    >
                      Débloquer
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Ban}
                      onClick={() => setPendingAction({ type: 'block', qm })}
                      className="flex-1"
                    >
                      Bloquer
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Trash2}
                    onClick={() => setPendingAction({ type: 'delete', qm })}
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
            ? 'Supprimer ce quizmaster ?'
            : pendingAction?.type === 'block'
              ? 'Bloquer ce quizmaster ?'
              : 'Débloquer ce quizmaster ?'
        }
        message={
          pendingAction?.type === 'delete'
            ? `Toutes les données et quizzes de « ${pendingAction?.qm?.name || pendingAction?.qm?.email} » seront supprimés définitivement.`
            : pendingAction?.type === 'block'
              ? `« ${pendingAction?.qm?.name || pendingAction?.qm?.email} » ne pourra plus se connecter et tous ses quiz seront désactivés.`
              : `« ${pendingAction?.qm?.name || pendingAction?.qm?.email} » pourra de nouveau se connecter.`
        }
        confirmLabel={
          pendingAction?.type === 'delete' ? 'Supprimer'
            : pendingAction?.type === 'block' ? 'Bloquer'
              : 'Débloquer'
        }
        variant={pendingAction?.type === 'unblock' ? 'warning' : 'danger'}
        requireType={pendingAction?.type === 'delete'}
        loading={working}
      />
    </div>
  );
}
