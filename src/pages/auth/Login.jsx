import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleDashboardPath, getRoleLabel } from '../../utils/roles';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

const roleHints = {
  admin: { color: 'text-red-600', bg: 'bg-red-50', label: 'Administrateur' },
  brand: { color: 'text-blue-600', bg: 'bg-blue-50', label: 'Marque' },
  quizmaster: { color: 'text-purple-600', bg: 'bg-purple-50', label: 'Quiz Master' },
  participant: { color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Participant' },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loggedRole, setLoggedRole] = useState(null);

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      setLoggedRole(user.role);
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
        <div className="lg:hidden mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">A</div>
          <span className="text-xl font-bold text-gray-900">AcadeCom</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
        <p className="mt-2 text-sm text-gray-500">Connectez-vous pour accéder à votre espace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-danger">{errors.root.message}</div>
        )}

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

        <Button type="submit" loading={loading} className="w-full">
          Se connecter
        </Button>
      </form>

      {/* Quick role links */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">Accès rapide par rôle</p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(roleHints).map(([role, info]) => (
            <Link
              key={role}
              to={`/login`}
              className={`rounded-lg ${info.bg} px-3 py-2 text-center text-xs font-medium ${info.color} hover:opacity-80 transition-opacity`}
            >
              {info.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
