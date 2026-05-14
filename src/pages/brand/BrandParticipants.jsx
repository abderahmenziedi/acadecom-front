import { useEffect, useState, useCallback } from 'react';
import { GraduationCap, Award, Target, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

import { listBrandParticipants } from '../../api/brandControl';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { relativeTime } from '../../utils/formatters';

export default function BrandParticipants() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await listBrandParticipants({ page, limit: 12 });
      setParticipants(data?.data?.participants || []);
      setTotalPages(data?.data?.totalPages || 0);
      setTotal(data?.data?.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <PageHeader
        title="Participants"
        subtitle={`${total} participants ont joué à vos quiz`}
        icon={GraduationCap}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : participants.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Aucun participant"
          description="Les participants ayant joué à vos quiz apparaîtront ici."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {participants.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="card-hover">
                <div className="flex items-start gap-3">
                  <Avatar src={p.avatar} name={p.name || p.email} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {p.name || '—'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {p.email}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="primary">Niveau {p.level || 1}</Badge>
                      <Badge variant="info">{p.xp || 0} XP</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat icon={Target} label="Quiz joués" value={p.attempts || 0} />
                  <Stat icon={Trophy} label="Meilleur" value={p.bestScore || 0} />
                  <Stat icon={Award} label="Points" value={p.totalPoints || 0} />
                </div>
                {p.lastAttemptAt && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    Dernière activité {relativeTime(p.lastAttemptAt)}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-900/30 p-2">
      <Icon className="h-3.5 w-3.5 mx-auto text-primary mb-0.5" />
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
