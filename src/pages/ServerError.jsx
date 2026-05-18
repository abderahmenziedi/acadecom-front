import { AlertOctagon } from 'lucide-react';
import ErrorPage from '../components/ErrorPage';

export default function ServerError() {
  return (
    <ErrorPage
      code="500"
      icon={AlertOctagon}
      title="Une erreur est survenue"
      description="Notre serveur a rencontré un problème inattendu. Réessayez dans quelques instants — l’équipe a été notifiée."
      tone="warning"
    />
  );
}
