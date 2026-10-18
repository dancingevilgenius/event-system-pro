const SCORE_KEYS = [
  'judge_submissions',
  'judgeSubmissions',
  'relative_placement',
  'relativePlacement',
] as const;

const ROSTER_KEYS = ['pairs', 'leaders', 'followers', 'competitors_json'] as const;

/** Refuses a clear that would drop couples or competitor name records. */
export function assertClearedScoresKeepRoster(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): void {
  for (const key of ROSTER_KEYS) {
    if (before[key] !== undefined && after[key] === undefined) {
      throw new Error('Refusing to clear scores because contest couples or names would be removed.');
    }
  }
}

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
