import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import { createQuiz } from '../../api/quizmaster';
import Card, { CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ImageUpload from '../../components/ui/ImageUpload';
import PageHeader from '../../components/ui/PageHeader';

const schema = z.object({
  title: z.string().min(3, 'Minimum 3 caractères'),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  imageUrl: z.string().optional(),
  timeLimit: z.coerce.number().int().positive().optional().or(z.literal('')),
  pointsPerQuestion: z.coerce.number().int().positive().default(1),
  passingScore: z.coerce.number().int().min(0).max(100).default(50),
  xpReward: z.coerce.number().int().min(0).default(10),
  couponReward: z.coerce.number().int().min(0).default(0),
  shuffleQuestions: z.boolean().default(false),
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      pointsPerQuestion: 1,
      passingScore: 50,
      xpReward: 10,
      couponReward: 0,
      difficulty: 'medium',
      shuffleQuestions: false,
      imageUrl: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (!payload.timeLimit) delete payload.timeLimit;
      else payload.timeLimit = Number(payload.timeLimit);
      if (!payload.imageUrl) delete payload.imageUrl;
      if (!payload.category) delete payload.category;
      if (!payload.description) delete payload.description;

      const res = await createQuiz(payload);
      toast.success('Quiz créé !');
      const quizId =
        res?.data?.data?.quiz?.id ??
        res?.data?.quiz?.id ??
        res?.data?.id;
      navigate(quizId ? `/quizmaster/quizzes/${quizId}` : '/quizmaster/quizzes');
    } catch { /* */ } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Créer un quiz"
        subtitle="Définissez les paramètres de votre quiz puis ajoutez les questions"
        icon={Zap}
        actions={
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={() => navigate('/quizmaster/quizzes')}
          >
            Retour
          </Button>
        }
      />

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Titre du quiz"
                placeholder="Ex: Découverte de notre marque"
                error={errors.title?.message}
                className="sm:col-span-2"
                {...register('title')}
              />
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="input"
                  placeholder="Décrivez votre quiz en quelques mots…"
                  {...register('description')}
                />
              </div>
              <Input
                label="Catégorie"
                placeholder="Marketing, Tech…"
                error={errors.category?.message}
                {...register('category')}
              />
              <Select
                label="Difficulté"
                {...register('difficulty')}
                error={errors.difficulty?.message}
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </Select>
            </div>
          </div>

          <div>
            <CardHeader>
              <CardTitle>Image de couverture</CardTitle>
            </CardHeader>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value}
                  onChange={(url) => field.onChange(url || '')}
                  category="quiz"
                  aspect="aspect-[16/9]"
                  hint="Image affichée dans les listes et résultats"
                />
              )}
            />
          </div>

          <div>
            <CardHeader>
              <CardTitle>Règles du quiz</CardTitle>
            </CardHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Temps limite (sec.)"
                type="number"
                placeholder="Laisser vide = illimité"
                error={errors.timeLimit?.message}
                {...register('timeLimit')}
              />
              <Input
                label="Points par question"
                type="number"
                error={errors.pointsPerQuestion?.message}
                {...register('pointsPerQuestion')}
              />
              <Input
                label="Score de réussite (%)"
                type="number"
                min="0"
                max="100"
                error={errors.passingScore?.message}
                {...register('passingScore')}
              />
              <Input
                label="XP gagnée (réussite)"
                type="number"
                error={errors.xpReward?.message}
                {...register('xpReward')}
              />
              <Input
                label="Coupons gagnés (réussite)"
                type="number"
                error={errors.couponReward?.message}
                {...register('couponReward')}
                className="sm:col-span-2"
              />
            </div>
            <label className="mt-4 inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                {...register('shuffleQuestions')}
                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
              />
              Mélanger l'ordre des questions
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-5">
            <Button type="button" variant="ghost" onClick={() => navigate('/quizmaster/quizzes')}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Créer le quiz
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
