import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableQuizzes } from '../../api/participant';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Search, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AvailableQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAvailableQuizzes();
        setQuizzes(data.data?.quizzes || data.quizzes || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner className="py-24" size="lg" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Disponibles</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{quizzes.length} quiz à découvrir</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un quiz…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 pl-10 pr-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">{q.title}</h3>
                <Badge variant="success">Actif</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{q.description || 'Aucune description'}</p>
              {q.quizmaster && (
                <p className="mt-1 text-xs text-primary font-medium">Par {q.quizmaster.name || q.quizmaster.email}</p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span>{q.questions?.length ?? q._count?.questions ?? '?'} questions</span>
                {q.timeLimit && (
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{q.timeLimit}s</span>
                )}
                <span>{q.pointsPerQuestion ?? 1} pts/q</span>
              </div>
              <Link to={`/participant/quizzes/${q.id}/play`} className="mt-4 block">
                <Button size="sm" className="w-full">Commencer</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-400 dark:text-gray-500">Aucun quiz disponible pour le moment.</p>
      )}
    </div>
  );
}
