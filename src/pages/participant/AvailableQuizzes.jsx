import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableQuizzes } from '../../api/participant';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { HiOutlineSearch, HiOutlineClock } from 'react-icons/hi';

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
        <h1 className="text-2xl font-bold text-gray-900">Quiz Disponibles</h1>
        <p className="text-sm text-gray-500">{quizzes.length} quiz à découvrir</p>
      </div>

      <div className="relative max-w-md">
        <HiOutlineSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un quiz…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => (
            <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900">{q.title}</h3>
                <Badge variant="success">Actif</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2">{q.description || 'Aucune description'}</p>
              {q.quizmaster && (
                <p className="mt-1 text-xs text-primary font-medium">Par {q.quizmaster.name || q.quizmaster.email}</p>
              )}
              <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                <span>{q.questions?.length ?? q._count?.questions ?? '?'} questions</span>
                {q.timeLimit && (
                  <span className="flex items-center gap-1"><HiOutlineClock className="h-3 w-3" />{q.timeLimit}s</span>
                )}
                <span>{q.pointsPerQuestion ?? 1} pts/q</span>
              </div>
              <Link to={`/participant/quizzes/${q.id}/play`} className="mt-4 block">
                <Button size="sm" className="w-full">Commencer</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-gray-400">Aucun quiz disponible pour le moment.</p>
      )}
    </div>
  );
}
