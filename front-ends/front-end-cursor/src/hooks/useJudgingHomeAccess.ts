import { useEffect, useState } from 'react';
import { fetchJudgingHomeContests } from '../api/postgrest';

export function useJudgingHomeAccess(enabled: boolean): {
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

    void fetchJudgingHomeContests()
      .then((contests) => {
        if (!cancelled) {
          setAllowed(contests.length > 0);
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
