import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-8xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Page introuvable</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">La page que vous recherchez n'existe pas.</p>
        <Link to="/" className="mt-6 inline-block">
          <Button icon={Home}>Retour à l'accueil</Button>
        </Link>
      </motion.div>
    </div>
  );
}
