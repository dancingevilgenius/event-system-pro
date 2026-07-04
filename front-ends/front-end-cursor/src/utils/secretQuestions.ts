import type { SecretQuestion, StaticListEntry } from '../api/postgrest';

export function secretQuestionsFromStaticListEntries(
  entries: StaticListEntry[],
): SecretQuestion[] {
  return [...entries]
    .sort((a, b) => Number.parseInt(a.key, 10) - Number.parseInt(b.key, 10))
    .map((entry) => ({
      secret_question_id: Number.parseInt(entry.key, 10),
      question: entry.label,
      created_date: '',
    }));
}

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
