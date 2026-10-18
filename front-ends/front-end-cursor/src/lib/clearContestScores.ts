const SCORE_KEYS = [
  'judge_submissions',
  'judgeSubmissions',
  'relative_placement',
  'relativePlacement',
] as const;

/** Copies a results or contest-item record without judge ballots or a saved placement. */
export function withoutContestScores(
  record: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...(record ?? {}) };
  for (const key of SCORE_KEYS) {
    delete next[key];
  }
  return next;
}
