import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, Check, ArrowLeft, Settings, ImagePlus, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  getQuizById,
  updateQuiz,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../../api/quizmaster';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ImageUpload from '../../components/ui/ImageUpload';
import Spinner from '../../components/ui/Spinner';
import PageHeader from '../../components/ui/PageHeader';
import EmptyState from '../../components/ui/EmptyState';

const defaultForm = {
  title: '',
  description: '',
  category: '',
  difficulty: 'medium',
  imageUrl: '',
  timeLimit: '',
  pointsPerQuestion: 1,
  passingScore: 50,
  xpReward: 10,
  couponReward: 0,
  shuffleQuestions: false,
  isActive: false,
};

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const [qModal, setQModal] = useState({ open: false, question: null });
  const [qForm, setQForm] = useState({
    text: '',
    points: 1,
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
  });
  const [deletePending, setDeletePending] = useState(null);
  const [working, setWorking] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await getQuizById(id);
      const q = data?.data?.quiz || data?.quiz || data;
      setQuiz(q);
      setForm({
        title: q.title || '',
        description: q.description || '',
        category: q.category || '',
        difficulty: q.difficulty || 'medium',
        imageUrl: q.imageUrl || '',
        timeLimit: q.timeLimit ?? '',
        pointsPerQuestion: q.pointsPerQuestion || 1,
        passingScore: q.passingScore ?? 50,
        xpReward: q.xpReward ?? 10,
        couponReward: q.couponReward ?? 0,
        shuffleQuestions: !!q.shuffleQuestions,
        isActive: !!q.isActive,
      });
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuiz(); /* eslint-disable-next-line */ }, [id]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        timeLimit: form.timeLimit ? Number(form.timeLimit) : null,
        pointsPerQuestion: Number(form.pointsPerQuestion) || 1,
        passingScore: Number(form.passingScore) || 0,
        xpReward: Number(form.xpReward) || 0,
        couponReward: Number(form.couponReward) || 0,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '' || payload[k] === undefined) delete payload[k];
      });
      await updateQuiz(id, payload);
      toast.success('Quiz mis à jour');
    } catch { /* */ } finally {
      setSaving(false);
    }
  };

  const openAddQuestion = () => {
    setQForm({ text: '', points: 1, options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ] });
    setQModal({ open: true, question: null });
  };

  const openEditQuestion = (q) => {
    setQForm({
      text: q.text,
      points: q.points || 1,
      options: q.options?.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) ||
        [{ text: '', isCorrect: false }],
    });
    setQModal({ open: true, question: q });
  };

  const addOption = () => setQForm({
    ...qForm,
    options: [...qForm.options, { text: '', isCorrect: false }],
  });
  const removeOption = (i) => setQForm({
    ...qForm,
    options: qForm.options.filter((_, idx) => idx !== i),
  });
  const updateOption = (i, field, value) => {
    const opts = [...qForm.options];
    opts[i] = { ...opts[i], [field]: value };
    setQForm({ ...qForm, options: opts });
  };

  const handleSaveQuestion = async () => {
    try {
      if (qModal.question) {
        await updateQuestion(qModal.question.id, qForm);
        toast.success('Question mise à jour');
      } else {
        await createQuestion(id, qForm);
        toast.success('Question ajoutée');
      }
      setQModal({ open: false, question: null });
      fetchQuiz();
    } catch { /* */ }
  };

  const handleDeleteQuestion = async () => {
    if (!deletePending) return;
    setWorking(true);
    try {
      await deleteQuestion(deletePending.id);
      toast.success('Question supprimée');
      setDeletePending(null);
      fetchQuiz();
    } catch { /* */ } finally {
      setWorking(false);
    }
  };

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!quiz) return <p className="py-24 text-center text-gray-500">Quiz introuvable</p>;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Gérer le quiz"
        subtitle={quiz.title}
        icon={Settings}
        actions={
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/quizmaster/quizzes')}
          >
            Retour aux quizzes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations principales</CardTitle>
          </CardHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Titre"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              className="sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={3}
                className="input"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>
            <Input
              label="Catégorie"
              placeholder="Marketing, Tech…"
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
            />
            <Select
              label="Difficulté"
              value={form.difficulty}
              onChange={(e) => setField('difficulty', e.target.value)}
            >
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </Select>
          </div>

          <div className="my-6 h-px bg-gray-100 dark:bg-gray-700" />

          <CardHeader>
            <CardTitle>Règles & récompenses</CardTitle>
          </CardHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Temps limite (sec.)"
              type="number"
              placeholder="Laisser vide = illimité"
              value={form.timeLimit}
              onChange={(e) => setField('timeLimit', e.target.value)}
            />
            <Input
              label="Points par question"
              type="number"
              value={form.pointsPerQuestion}
              onChange={(e) => setField('pointsPerQuestion', e.target.value)}
            />
            <Input
              label="Score de réussite (%)"
              type="number"
              min="0"
              max="100"
              value={form.passingScore}
              onChange={(e) => setField('passingScore', e.target.value)}
            />
            <Input
              label="XP gagnée (réussite)"
              type="number"
              value={form.xpReward}
              onChange={(e) => setField('xpReward', e.target.value)}
            />
            <Input
              label="Coupons gagnés (réussite)"
              type="number"
              value={form.couponReward}
              onChange={(e) => setField('couponReward', e.target.value)}
              className="sm:col-span-2"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.shuffleQuestions}
                onChange={(e) => setField('shuffleQuestions', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
              />
              Mélanger les questions
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setField('isActive', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
              />
              Quiz actif (visible des participants)
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-5">
            <Button variant="ghost" onClick={() => navigate('/quizmaster/quizzes')}>
              Annuler
            </Button>
            <Button loading={saving} onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <ImagePlus className="inline h-4 w-4 mr-2 -mt-1" />
              Image de couverture
            </CardTitle>
          </CardHeader>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setField('imageUrl', url || '')}
            category="quiz"
            aspect="aspect-[16/9]"
            hint="Affichée dans les listes et résultats"
          />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <BookOpen className="inline h-4 w-4 mr-2 -mt-1" />
              Questions ({quiz.questions?.length || 0})
            </CardTitle>
            <Button size="sm" icon={Plus} onClick={openAddQuestion}>
              Ajouter
            </Button>
          </div>
        </CardHeader>

        {quiz.questions?.length > 0 ? (
          <div className="space-y-3">
            {quiz.questions.map((q, i) => (
              <div
                key={q.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/50 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {i + 1}. {q.text}
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      · {q.points} pts
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {q.options?.map((o) => (
                      <span
                        key={o.id}
                        className={`rounded-full px-2.5 py-0.5 text-xs ${
                          o.isCorrect
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {o.isCorrect && <Check className="mr-1 inline h-3 w-3" />}
                        {o.text}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditQuestion(q)}
                    className="rounded p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeletePending(q)}
                    className="rounded p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="Aucune question"
            description="Ajoutez votre première question pour activer ce quiz."
            action={
              <Button icon={Plus} onClick={openAddQuestion}>
                Ajouter une question
              </Button>
            }
          />
        )}
      </Card>

      <Modal
        open={qModal.open}
        onClose={() => setQModal({ open: false, question: null })}
        title={qModal.question ? 'Modifier la question' : 'Nouvelle question'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Énoncé de la question
            </label>
            <textarea
              rows={2}
              value={qForm.text}
              onChange={(e) => setQForm({ ...qForm, text: e.target.value })}
              className="input"
            />
          </div>
          <Input
            label="Points"
            type="number"
            min="1"
            value={qForm.points}
            onChange={(e) => setQForm({ ...qForm, points: Number(e.target.value) })}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Options · Cochez les bonnes réponses
            </label>
            <div className="space-y-2">
              {qForm.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => updateOption(i, 'isCorrect', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
                    title="Bonne réponse"
                  />
                  <input
                    value={opt.text}
                    onChange={(e) => updateOption(i, 'text', e.target.value)}
                    className="input flex-1"
                    placeholder={`Option ${i + 1}`}
                  />
                  {qForm.options.length > 2 && (
                    <button
                      onClick={() => removeOption(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button size="sm" variant="ghost" icon={Plus} className="mt-3" onClick={addOption}>
              Ajouter une option
            </Button>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
            <Button variant="ghost" onClick={() => setQModal({ open: false, question: null })}>
              Annuler
            </Button>
            <Button onClick={handleSaveQuestion}>
              {qModal.question ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletePending}
        onClose={() => setDeletePending(null)}
        onConfirm={handleDeleteQuestion}
        title="Supprimer cette question ?"
        message={deletePending?.text}
        loading={working}
      />
    </div>
  );
}
