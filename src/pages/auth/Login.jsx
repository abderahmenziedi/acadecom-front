import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboardPath } from '../../utils/roles';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      navigate(getRoleDashboardPath(user.role), { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur de connexion';
      setError('root', { message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bon retour !</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Connectez-vous pour accéder à votre espace.</p>
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

        <Input
          label="Email"
          type="email"
          placeholder="votre@email.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" loading={loading} variant="gradient" className="w-full" size="lg" iconRight={ArrowRight}>
          Se connecter
        </Button>
      </form>

      <div className="mt-8 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-950 px-3 text-gray-400">ou</span>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-semibold text-primary hover:text-primary-dark transition-colors">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
