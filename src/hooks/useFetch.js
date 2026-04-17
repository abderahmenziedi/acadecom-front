import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useFetch(apiFn, { immediate = true, params = null } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (overrideParams) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFn(overrideParams ?? params);
        setData(res.data);
        return res.data;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFn, params]
  );

  useEffect(() => {
    if (immediate) execute();
  }, []);

  return { data, loading, error, execute, setData };
}

export function useSubmit(apiFn, { successMessage } = {}) {
  const [loading, setLoading] = useState(false);

  const execute = async (...args) => {
    setLoading(true);
    try {
      const res = await apiFn(...args);
      if (successMessage) toast.success(successMessage);
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
}
