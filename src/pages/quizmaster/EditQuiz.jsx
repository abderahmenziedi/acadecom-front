import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, updateQuiz, createQuestion, updateQuestion, deleteQuestion } from '../../api/quizmaster';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, Check } from 'lucide-react';

export default function EditQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', timeLimit: '', pointsPerQuestion: 1, isActive: false });
  const [qModal, setQModal] = useState({ open: false, question: null });
  const [qForm, setQForm] = useState({ text: '', points: 1, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] });

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const { data } = await getQuizById(id);
      const q = data.data?.quiz || data.quiz || data;
      setQuiz(q);
      setForm({
        title: q.title, description: q.description || '', timeLimit: q.timeLimit || '',
        pointsPerQuestion: q.pointsPerQuestion || 1, isActive: q.isActive,
      });
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchQuiz(); }, [id]);

  const handleUpdateQuiz = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      payload.timeLimit = payload.timeLimit ? Number(payload.timeLimit) : null;
      await updateQuiz(id, payload);
      toast.success('Quiz mis à jour');
    } catch {} finally { setSaving(false); }
  };

  const openAddQuestion = () => {
    setQForm({ text: '', points: 1, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] });
    setQModal({ open: true, question: null });
  };

  const openEditQuestion = (q) => {
    setQForm({
      text: q.text, points: q.points || 1,
      options: q.options?.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) || [{ text: '', isCorrect: false }],
    });
    setQModal({ open: true, question: q });
  };

  const addOption = () => setQForm({ ...qForm, options: [...qForm.options, { text: '', isCorrect: false }] });
  const removeOption = (i) => setQForm({ ...qForm, options: qForm.options.filter((_, idx) => idx !== i) });
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
    } catch {}
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm('Supprimer cette question ?')) return;
    await deleteQuestion(qId);
    toast.success('Question supprimée');
    fetchQuiz();
  };

  if (loading) return <Spinner className="py-24" size="lg" />;
  if (!quiz) return <p className="py-24 text-center text-gray-500">Quiz introuvable</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gérer le Quiz</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{quiz.title}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/quizmaster/quizzes')}>← Retour</Button>
      </div>

      {/* Quiz settings */}
      <Card>
        <CardHeader><CardTitle>Paramètres du Quiz</CardTitle></CardHeader>
        <div className="space-y-4">
          <Input label="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Temps limite (sec)" type="number" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: e.target.value })} />
            <Input label="Points/question" type="number" value={form.pointsPerQuestion} onChange={(e) => setForm({ ...form, pointsPerQuestion: Number(e.target.value) })} />
            <label className="flex items-center gap-2 text-sm pt-6">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary" />
              Actif
            </label>
          </div>
          <div className="flex justify-end">
            <Button loading={saving} onClick={handleUpdateQuiz}>Enregistrer</Button>
          </div>
        </div>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({quiz.questions?.length || 0})</CardTitle>
            <Button size="sm" onClick={openAddQuestion}><Plus className="h-4 w-4" /> Ajouter</Button>
          </div>
        </CardHeader>
        {quiz.questions?.length > 0 ? (
          <div className="space-y-3">
            {quiz.questions.map((q, i) => (
              <div key={q.id} className="flex items-start justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{i + 1}. {q.text}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {q.options?.map((o) => (
                      <span key={o.id} className={`rounded-full px-2.5 py-0.5 text-xs ${o.isCorrect ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                        {o.isCorrect && <Check className="mr-1 inline h-3 w-3" />}{o.text}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditQuestion(q)} className="rounded p-1 text-gray-400 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDeleteQuestion(q.id)} className="rounded p-1 text-gray-400 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucune question. Cliquez sur « Ajouter » pour commencer.</p>
        )}
      </Card>

      {/* Question Modal */}
      <Modal open={qModal.open} onClose={() => setQModal({ open: false, question: null })} title={qModal.question ? 'Modifier la Question' : 'Nouvelle Question'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
            <textarea rows={2} value={qForm.text} onChange={(e) => setQForm({ ...qForm, text: e.target.value })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <Input label="Points" type="number" value={qForm.points} onChange={(e) => setQForm({ ...qForm, points: Number(e.target.value) })} />

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
            <div className="space-y-2">
              {qForm.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="checkbox" checked={opt.isCorrect} onChange={(e) => updateOption(i, 'isCorrect', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary" title="Bonne réponse" />
                  <input value={opt.text} onChange={(e) => updateOption(i, 'text', e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder={`Option ${i + 1}`} />
                  {qForm.options.length > 2 && (
                    <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              ))}
            </div>
            <Button size="sm" variant="ghost" className="mt-2" onClick={addOption}><Plus className="h-3 w-3" /> Option</Button>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setQModal({ open: false, question: null })}>Annuler</Button>
            <Button onClick={handleSaveQuestion}>{qModal.question ? 'Enregistrer' : 'Ajouter'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
