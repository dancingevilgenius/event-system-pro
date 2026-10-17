import { useEffect, useState } from 'react';
import { fetchJudgingHomeContests } from '../api/postgrest';
import { useAuth } from './useAuth';
import { showsJudgingHomeButton } from '../lib/judgingHome';

export function useJudgingHomeAccess(enabled: boolean): {
  allowed: boolean;
  loading: boolean;
} {
  const { session } = useAuth();
  const allowedByRole = showsJudgingHomeButton({ appRoles: session?.roles });
  const [allowedByContests, setAllowedByContests] = useState(false);
  const [loading, setLoading] = useState(enabled && !allowedByRole);

  useEffect(() => {
    if (!enabled || allowedByRole) {
      setAllowedByContests(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchJudgingHomeContests()
      .then((contests) => {
        if (!cancelled) {
          setAllowedByContests(showsJudgingHomeButton({ contestsInWindow: contests.length }));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAllowedByContests(false);
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
  }, [allowedByRole, enabled]);

  return { allowed: enabled && (allowedByRole || allowedByContests), loading };
}
