import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page introuvable</h1>
        <p className="mt-2 text-gray-500">La page que vous recherchez n'existe pas.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button>Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
}
