/**
 * useAsync.js - Hook réutilisable pour gérer les appels async (loading, error, data)
 * Simplifie les pages et réduit la duplication
 * 
 * Usage:
 * const { data, loading, error } = useAsync(
 *   () => adminService.getUsers({ limit: 1000 }),
 *   []
 * );
 */
import { useEffect, useState } from 'react';

export default function useAsync(fn, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    (async () => {
      try {
        const result = await fn();
        setData(result);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Erreur inconnue');
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, dependencies);

  return { data, loading, error };
}
