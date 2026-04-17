import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary">403</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Accès Refusé</h1>
        <p className="mt-2 text-gray-500">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <Link to="/login" className="mt-6 inline-block">
          <Button>Retour à la connexion</Button>
        </Link>
      </div>
    </div>
  );
}
