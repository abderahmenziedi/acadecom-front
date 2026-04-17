import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAttemptResult } from '../../api/participant';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Check, X, ArrowLeft, History } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuizResult() {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (result) return;
    (async () => {
      try {
        const { data } = await getAttemptResult(attemptId);
        setResult(data);
      } catch {} finally { setLoading(false); }
    })();
  }, [attemptId, result]);

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!result) return <p className="py-24 text-center text-gray-500 dark:text-gray-400">Résultat introuvable</p>;

  const data = result.result || result;
  const score = data.score ?? 0;
  const maxScore = data.maxScore ?? 1;
  const pct = Math.round((score / maxScore) * 100);
  const passed = pct >= 50;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
          {passed ? <Check className="h-10 w-10 text-green-600" /> : <X className="h-10 w-10 text-red-600" />}
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{passed ? 'Bravo !' : 'Dommage…'}</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Vous avez obtenu <strong className="text-gray-900 dark:text-white">{score}/{maxScore}</strong> ({pct}%)
        </p>
        {data.pointsEarned != null && (
          <p className="mt-1 text-sm text-primary font-medium">+{data.pointsEarned} points gagnés</p>
        )}
      </motion.div>

      {data.answers && data.answers.length > 0 && (
        <Card>
          <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Détail des réponses</h3>
          <div className="space-y-3">
            {data.answers.map((a, i) => (
              <div key={i} className={`rounded-xl border p-3.5 ${a.isCorrect ? 'border-green-200 dark:border-green-800/50 bg-green-50 dark:bg-green-900/20' : 'border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{a.question?.text || `Question ${i + 1}`}</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Votre réponse : {a.option?.text || '—'} {a.isCorrect ? '✓' : '✗'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-center gap-3">
        <Button variant="secondary" onClick={() => navigate('/participant/quizzes')} icon={ArrowLeft}>Retour aux quiz</Button>
        <Button onClick={() => navigate('/participant/attempts')} icon={History}>Voir l'historique</Button>
      </div>
    </div>
  );
}
