import { useEffect, useState } from 'react';
import { fetchRegistrationHomeAccess } from '../api/postgrest';

export function useRegistrationHomeAccess(enabled: boolean): {
  allowed: boolean;
  loading: boolean;
} {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchRegistrationHomeAccess()
      .then((nextAllowed) => {
        if (!cancelled) {
          setAllowed(nextAllowed);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAllowed(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { allowed, loading };
}
