import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../api/axios';
import { User, Mail, Lock, ArrowRight, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const roleOptions = [
  { value: 'participant', label: 'Participant', desc: 'Quiz et points', icon: Zap, color: 'emerald' },
  { value: 'brand', label: 'Marque', desc: 'Gérez vos quiz', icon: Briefcase, color: 'blue' },
  { value: 'quizmaster', label: 'Quiz Master', desc: 'Créez des quiz', icon: GraduationCap, color: 'purple' },
];

const roleStyles = {
  participant: { active: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/30', text: 'text-emerald-700 dark:text-emerald-400' },
  brand: { active: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/30', text: 'text-blue-700 dark:text-blue-400' },
  quizmaster: { active: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500/30', text: 'text-purple-700 dark:text-purple-400' },
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

  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'participant', brandId: '' },
  });

  const selectedRole = watch('role');

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
      if (data.role === 'quizmaster' && data.brandId) payload.brandId = Number(data.brandId);
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Créer un compte</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Rejoignez AcadeCom en quelques secondes.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-3.5 text-sm text-danger"
          >
            {errors.root.message}
          </motion.div>
        )}

        {/* Role selection */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Choisissez votre rôle</label>
          <div className="grid grid-cols-3 gap-2">
            {roleOptions.map((r) => {
              const isActive = selectedRole === r.value;
              const style = roleStyles[r.value];
              return (
                <label
                  key={r.value}
                  className={clsx(
                    'relative flex cursor-pointer flex-col items-center rounded-xl border p-3 transition-all',
                    isActive
                      ? style.active
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
                  )}
                >
                  <input type="radio" value={r.value} {...register('role')} className="sr-only" />
                  <r.icon className={clsx('h-5 w-5 mb-1', isActive ? style.text : 'text-gray-400 dark:text-gray-500')} />
                  <span className={clsx('text-xs font-semibold', isActive ? style.text : 'text-gray-700 dark:text-gray-300')}>{r.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {selectedRole === 'quizmaster' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Marque associée</label>
            <select
              {...register('brandId')}
              className={clsx(
                'w-full rounded-xl border bg-white dark:bg-gray-800 dark:text-gray-100 px-3.5 py-2.5 text-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                errors.brandId ? 'border-danger' : 'border-gray-300 dark:border-gray-600',
              )}
            >
              <option value="">— Sélectionnez une marque —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            {errors.brandId && <p className="mt-1.5 text-xs text-danger">{errors.brandId.message}</p>}
          </motion.div>
        )}

        <Input label="Nom complet" placeholder="Jean Dupont" icon={User} error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="votre@email.com" icon={Mail} error={errors.email?.message} {...register('email')} />
        <Input label="Mot de passe" type="password" placeholder="••••••••" icon={Lock} error={errors.password?.message} {...register('password')} />
        <Input label="Confirmer" type="password" placeholder="••••••••" icon={Lock} error={errors.confirmPassword?.message} {...register('confirmPassword')} />

        <Button type="submit" loading={loading} variant="gradient" className="w-full" size="lg" iconRight={ArrowRight}>
          Créer mon compte
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Déjà un compte ?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">Se connecter</Link>
      </p>
    </div>
  );
}
