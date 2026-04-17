import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Accès Refusé</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
        <Link to="/login" className="mt-6 inline-block">
          <Button>Retour à la connexion</Button>
        </Link>
      </motion.div>
    </div>
  );
}
