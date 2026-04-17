import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createQuiz } from '../../api/quizmaster';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  description: z.string().optional(),
  timeLimit: z.coerce.number().int().positive().optional().or(z.literal('')),
  pointsPerQuestion: z.coerce.number().int().positive().default(1),
  shuffleQuestions: z.boolean().default(false),
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { pointsPerQuestion: 1, shuffleQuestions: false },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (!payload.timeLimit) delete payload.timeLimit;
      else payload.timeLimit = Number(payload.timeLimit);
      const res = await createQuiz(payload);
      toast.success('Quiz créé !');
      const quizId = res.data?.quiz?.id || res.data?.id;
      navigate(quizId ? `/quizmaster/quizzes/${quizId}` : '/quizmaster/quizzes');
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un Quiz</h1>
        <p className="text-sm text-gray-500">Définissez les paramètres de votre quiz</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="Titre du quiz" error={errors.title?.message} {...register('title')} />

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Temps limite (secondes)"
              type="number"
              error={errors.timeLimit?.message}
              {...register('timeLimit')}
              placeholder="Laisser vide = illimité"
            />
            <Input
              label="Points par question"
              type="number"
              error={errors.pointsPerQuestion?.message}
              {...register('pointsPerQuestion')}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('shuffleQuestions')} className="rounded border-gray-300 text-primary focus:ring-primary" />
            Mélanger les questions
          </label>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/quizmaster/quizzes')}>Annuler</Button>
            <Button type="submit" loading={loading}>Créer le Quiz</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
