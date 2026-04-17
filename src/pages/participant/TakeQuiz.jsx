import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startAttempt, submitAndFinish } from '../../api/participant';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { HiOutlineClock } from 'react-icons/hi';

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
  if (!quiz || !questions.length) return <p className="py-24 text-center text-gray-500">Aucune question</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Question {current + 1} / {questions.length}</p>
        </div>
        {timer !== null && (
          <div className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600">
            <HiOutlineClock className="h-4 w-4" />
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-medium text-gray-900">{q.text}</p>

        <div className="mt-6 space-y-3">
          {q.options?.map((opt) => (
            <button
              key={opt.id}
              onClick={() => selectAnswer(q.id, opt.id)}
              className={`w-full rounded-lg border p-4 text-left text-sm transition-all
                ${answers[q.id] === opt.id
                  ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/30'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)}>
          ← Précédent
        </Button>
        <span className="text-sm text-gray-400">
          {Object.keys(answers).length} / {questions.length} répondu(s)
        </span>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent(current + 1)}>Suivant →</Button>
        ) : (
          <Button variant="success" loading={submitting} onClick={handleSubmit}>
            Terminer le Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
