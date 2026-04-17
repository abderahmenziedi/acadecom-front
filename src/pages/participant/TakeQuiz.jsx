import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startAttempt, submitAndFinish } from '../../api/participant';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Start attempt - returns quiz info + questions with options
        const res = await startAttempt(quizId);
        const data = res.data.data || res.data;
        setAttempt(data.attempt);
        setQuiz(data.quiz);
        setQuestions(data.questions || []);
        if (data.quiz?.timeLimit) setTimer(data.quiz.timeLimit);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Erreur au démarrage du quiz');
        navigate('/participant/quizzes');
      } finally { setLoading(false); }
    })();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (timer === null || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); handleSubmit(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer !== null]);

  const q = questions[current];

  const selectAnswer = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          optionId: Number(optionId),
        })),
      };
      const res = await submitAndFinish(attempt.id, payload);
      toast.success('Quiz terminé !');
      navigate(`/participant/attempts/${attempt.id}/result`, { state: { result: res.data } });
    } catch {} finally { setSubmitting(false); }
  };

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!quiz || !questions.length) return <p className="py-24 text-center text-gray-500 dark:text-gray-400">Aucune question</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Question {current + 1} / {questions.length}</p>
        </div>
        {timer !== null && (
          <div className={clsx(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold',
            timer <= 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse' : 'bg-red-50 dark:bg-red-900/20 text-red-600',
          )}>
            <Clock className="h-4 w-4" />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary-light"
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
        >
          <p className="text-lg font-medium text-gray-900 dark:text-white">{q.text}</p>

          <div className="mt-6 space-y-3">
            {q.options?.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectAnswer(q.id, opt.id)}
                className={clsx(
                  'w-full rounded-xl border p-4 text-left text-sm transition-all',
                  answers[q.id] === opt.id
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary ring-2 ring-primary/30 font-medium'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                )}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)} icon={ChevronLeft}>
          Précédent
        </Button>
        <span className="text-sm text-gray-400 dark:text-gray-500">
          {Object.keys(answers).length} / {questions.length} répondu(s)
        </span>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent(current + 1)} iconRight={ChevronRight}>Suivant</Button>
        ) : (
          <Button variant="success" loading={submitting} onClick={handleSubmit} icon={Send}>
            Terminer le Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
