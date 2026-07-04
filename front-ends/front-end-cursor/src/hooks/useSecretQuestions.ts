import { useEffect, useState } from 'react';
import { fetchSecretQuestions, type SecretQuestion } from '../api/postgrest';

type UseSecretQuestionsResult = {
  questions: SecretQuestion[];
  loading: boolean;
  error: string | null;
};

export function useSecretQuestions(enabled = true): UseSecretQuestionsResult {
  const [questions, setQuestions] = useState<SecretQuestion[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetchSecretQuestions()
      .then((items) => {
        if (!cancelled) {
          setQuestions(items);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load secret questions.',
          );
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

  return { questions, loading, error };
}
