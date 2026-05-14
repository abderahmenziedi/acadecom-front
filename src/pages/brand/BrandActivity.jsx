import { useEffect, useState, useCallback } from 'react';
import { History, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { getBrandActivity } from '../../api/brandControl';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { relativeTime } from '../../utils/formatters';

const ACTION_META = {
  brand_block_quizmaster:    { label: 'Bloqué un quizmaster', tone: 'warning' },
  brand_unblock_quizmaster:  { label: 'Débloqué un quizmaster', tone: 'success' },
  brand_delete_quizmaster:   { label: 'Supprimé un quizmaster', tone: 'danger' },
  brand_disable_quiz:        { label: 'Désactivé un quiz', tone: 'warning' },
  brand_enable_quiz:         { label: 'Activé un quiz', tone: 'success' },
  brand_delete_quiz:         { label: 'Supprimé un quiz', tone: 'danger' },
  brand_update_profile:      { label: 'Mis à jour le profil', tone: 'info' },
  quizmaster_create_quiz:    { label: 'Quiz créé', tone: 'success' },
  quizmaster_update_quiz:    { label: 'Quiz modifié', tone: 'info' },
  quizmaster_delete_quiz:    { label: 'Quiz supprimé', tone: 'warning' },
  participant_take_quiz:     { label: 'Quiz joué', tone: 'info' },
  participant_order:         { label: 'Commande passée', tone: 'primary' },
  user_login:                { label: 'Connexion', tone: 'neutral' },
  user_register:             { label: 'Inscription', tone: 'neutral' },
  admin_action:              { label: 'Action admin', tone: 'neutral' },
};

const FILTERS = [
  { id: '', label: 'Toutes' },
  { id: 'quizmaster_create_quiz', label: 'Création' },
  { id: 'quizmaster_delete_quiz', label: 'Suppression QM' },
  { id: 'participant_take_quiz', label: 'Participations' },
  { id: 'participant_order', label: 'Commandes' },
  { id: 'brand_block_quizmaster', label: 'Blocages' },
];

export default function BrandActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter) params.action = filter;
      const { data } = await getBrandActivity(params);
      setLogs(data?.data?.logs || []);
      setTotalPages(data?.data?.totalPages || 0);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader
        title="Journal d'activité"
        subtitle="Audit complet des actions effectuées sur les ressources de votre marque"
        icon={History}
      />

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <Filter className="h-4 w-4 text-gray-400 mr-1" />
        {FILTERS.map((f) => (
          <button
            key={f.id || 'all'}
            onClick={() => { setFilter(f.id); setPage(1); }}
            className={clsx(
              'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
              filter === f.id
                ? 'bg-primary text-white'
                : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="!p-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 border-b last:border-0 border-gray-100 dark:border-gray-700/50 px-4 py-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </Card>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={History}
          title="Aucune activité"
          description="Les actions sur votre espace seront listées ici."
        />
      ) : (
        <Card className="!p-0 overflow-hidden">
          {logs.map((log, i) => {
            const meta = ACTION_META[log.action] || { label: log.action, tone: 'neutral' };
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3 border-b last:border-0 border-gray-100 dark:border-gray-700/50 px-4 py-3.5"
              >
                <Avatar src={log.actor?.avatar} name={log.actor?.name || log.actor?.email} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={meta.tone}>{meta.label}</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      par <span className="font-medium">{log.actor?.name || log.actor?.email || '—'}</span>
                    </span>
                  </div>
                  {log.metadata && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {formatMeta(log.metadata)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {relativeTime(log.createdAt)}
                </span>
              </motion.div>
            );
          })}
        </Card>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function formatMeta(metadata) {
  if (!metadata) return '';
  const parts = [];
  if (metadata.title) parts.push(`Titre : ${metadata.title}`);
  if (metadata.email) parts.push(`Email : ${metadata.email}`);
  if (metadata.name) parts.push(`Nom : ${metadata.name}`);
  if (metadata.score !== undefined) parts.push(`Score : ${metadata.score}/${metadata.maxScore || '?'}`);
  if (metadata.totalPrice) parts.push(`${metadata.totalPrice} coupons`);
  return parts.join(' · ');
}
