import type { JudgeSubmission } from './types';

const STORAGE_KEY = 'event-system-pro:judge-submissions';

export function saveJudgeSubmission(submission: JudgeSubmission): void {
  const existing = loadJudgeSubmissions();
  const withoutCurrentJudge = existing.filter(
    (entry) => String(entry.judgeId) !== String(submission.judgeId),
  );

  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...withoutCurrentJudge, submission]),
  );
}

export function loadJudgeSubmissions(): JudgeSubmission[] {
  const raw = sessionStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as JudgeSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
