import type { SecretQuestion } from '../api/postgrest';

export function pickRandomQuestionIds(
  questions: SecretQuestion[],
  count: number,
): number[] {
  const pool = [...questions];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).map((question) => question.secret_question_id);
}

export function questionTextForId(
  questions: SecretQuestion[],
  questionId: number | '',
): string {
  if (questionId === '') {
    return '';
  }

  return (
    questions.find((question) => question.secret_question_id === questionId)?.question ??
    'Unknown question'
  );
}
