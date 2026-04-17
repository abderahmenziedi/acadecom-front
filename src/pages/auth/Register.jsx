import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../api/axios';
import { useEffect } from 'react';

const roleOptions = [
  { value: 'participant', label: 'Participant', desc: 'Participez à des quiz et gagnez des points' },
  { value: 'brand', label: 'Marque', desc: 'Gérez vos quiz masters et suivez les analytiques' },
  { value: 'quizmaster', label: 'Quiz Master', desc: 'Créez et gérez des quiz interactifs' },
];

const roleColors = {
  participant: 'border-emerald-300 bg-emerald-50 text-emerald-700 ring-emerald-500/30',
  brand: 'border-blue-300 bg-blue-50 text-blue-700 ring-blue-500/30',
  quizmaster: 'border-purple-300 bg-purple-50 text-purple-700 ring-purple-500/30',
};

const schema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
  role: z.enum(['participant', 'brand', 'quizmaster']),
  brandId: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
}).refine((d) => d.role !== 'quizmaster' || (d.brandId && d.brandId !== ''), {
  message: 'Veuillez sélectionner une marque',
  path: ['brandId'],
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);

  const { register, handleSubmit, watch, formState: { errors }, setError, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'participant', brandId: '' },
  });

  const selectedRole = watch('role');

  // Fetch brands when quizmaster role is selected (public endpoint)
  useEffect(() => {
    if (selectedRole === 'quizmaster') {
      api.get('/v1/auth/brands')
        .then(({ data }) => setBrands(data.data?.brands || []))
        .catch(() => setBrands([]));
    }
  }, [selectedRole]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { name: data.name, email: data.email, password: data.password, role: data.role };
      if (data.role === 'quizmaster' && data.brandId) {
        payload.brandId = Number(data.brandId);
      }
      await registerUser(payload);
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur d'inscription";
      setError('root', { message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">A</div>
          <span className="text-xl font-bold text-gray-900">AcadeCom</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Inscription</h2>
        <p className="mt-2 text-sm text-gray-500">Créez votre compte pour accéder à la plateforme.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-danger">{errors.root.message}</div>
        )}

        {/* Role selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Choisissez votre rôle</label>
          <div className="grid grid-cols-2 gap-2">
            {roleOptions.map((r) => (
              <label
                key={r.value}
                className={`relative flex cursor-pointer flex-col rounded-lg border p-3 transition-all
                  ${selectedRole === r.value
                    ? `${roleColors[r.value]} ring-2`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <input
                  type="radio"
                  value={r.value}
                  {...register('role')}
                  className="sr-only"
                />
                <span className="text-sm font-semibold">{r.label}</span>
                <span className={`mt-0.5 text-xs ${selectedRole === r.value ? 'opacity-80' : 'text-gray-500'}`}>{r.desc}</span>
              </label>
            ))}
          </div>
          {errors.role && <p className="mt-1 text-xs text-danger">{errors.role.message}</p>}
        </div>

        {/* Brand selector for quizmaster */}
        {selectedRole === 'quizmaster' && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Marque associée</label>
            <select
              {...register('brandId')}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                ${errors.brandId ? 'border-danger' : 'border-gray-300'}`}
            >
              <option value="">— Sélectionnez une marque —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name || b.email}</option>
              ))}
            </select>
            {errors.brandId && <p className="mt-1 text-xs text-danger">{errors.brandId.message}</p>}
          </div>
        )}

        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" loading={loading} className="w-full">
          S'inscrire
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
