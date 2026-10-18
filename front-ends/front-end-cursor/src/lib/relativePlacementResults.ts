import { buildRelativePlacementRows, type RelativePlacementRow } from '../utils/relativePlacement';
import { userInitials } from '../utils/userInitials';

export type PlacementCouple = {
  bib: number;
  leaderBib: number | null;
  followerBib: number | null;
  leaderFirst: string;
  leaderLast: string;
  followerFirst: string;
  followerLast: string;
};

export type JudgeDirectoryEntry = {
  firstName: string;
  lastName: string;
  displayName: string;
  userId: number | null;
};

export type PlacementInput = {
  submissionKey: string;
  judgeIds: string[];
  bibs: number[];
  placementByBib: Map<number, number[]>;
};

export type SavedRelativePlacementJudge = {
  id: string;
  initials: string;
  /** Contest head judge. Shown last. Omitted from the math when the full panel is even. */
  headJudge: boolean;
};

export type SavedRelativePlacementRow = {
  bib: number;
  place: number;
  judgePlacements: number[];
  judgeScores: Array<number | null>;
  leaderBib: number | null;
  followerBib: number | null;
  leaderFirst: string;
  leaderLast: string;
  followerFirst: string;
  followerLast: string;
};

export type SavedRelativePlacement = {
  submissionKey: string;
  computedAt: string;
  eventName: string;
  skillLevel: string;
  division: string;
  /** Judge ids passed into the relative-placement algorithm, in assigned order. */
  scoringJudgeIds: string[];
  judges: SavedRelativePlacementJudge[];
  rows: SavedRelativePlacementRow[];
};

type ParsedMark = {
  bib: number;
  placement: number;
  score: number | null;
};

type ParsedBallot = {
  judgeId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  marks: ParsedMark[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function textField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }
  return '';
}

function positiveBib(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function finiteScore(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function positiveUserId(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function emptyDirectoryEntry(): JudgeDirectoryEntry {
  return { firstName: '', lastName: '', displayName: '', userId: null };
}

function parseBallot(value: unknown): ParsedBallot | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  const judgeId = textField(record, 'judge_id', 'judgeId');
  if (judgeId === '') {
    return null;
  }
  const marksByBib = new Map<number, ParsedMark>();
  const placements = Array.isArray(record.placements) ? record.placements : [];
  for (const entry of placements) {
    const row = asRecord(entry);
    if (!row) {
      continue;
    }
    const bib = positiveBib(row.competitor_id ?? row.competitorId);
    const placement = positiveBib(row.placement);
    if (bib === null || placement === null) {
      continue;
    }
    marksByBib.set(bib, { bib, placement, score: finiteScore(row.score) });
  }
  return {
    judgeId,
    firstName: textField(record, 'first_name', 'firstName'),
    lastName: textField(record, 'last_name', 'lastName'),
    displayName: textField(record, 'judge_name', 'display_name', 'displayName', 'name'),
    marks: [...marksByBib.values()],
  };
}

function indexBallots(ballots: readonly unknown[]): Map<string, ParsedBallot> {
  const byId = new Map<string, ParsedBallot>();
  for (const ballot of ballots) {
    const parsed = parseBallot(ballot);
    if (parsed) {
      byId.set(parsed.judgeId, parsed);
    }
  }
  return byId;
}

function ballotHasRankings(ballot: ParsedBallot | undefined): ballot is ParsedBallot {
  return ballot !== undefined && ballot.marks.some((mark) => mark.placement > 0);
}

/**
 * Ordinals for the relative-placement algorithm once every assigned judge has a ballot.
 * Returns null until submitted count equals the assigned count and that count is above zero.
 * Judge columns follow assigned order. Later ballots for the same judge replace earlier ones.
 */
export function placementInputFromJudgeBallots(
  assignedIds: readonly string[],
  ballots: readonly unknown[],
): PlacementInput | null {
  const assigned = assignedIds.map((id) => id.trim()).filter((id) => id !== '');
  if (assigned.length === 0) {
    return null;
  }
  const byId = indexBallots(ballots);
  if (!assigned.every((id) => ballotHasRankings(byId.get(id)))) {
    return null;
  }

  let bibs: number[] | null = null;
  for (const id of assigned) {
    const ranked = new Set(
      (byId.get(id)?.marks ?? []).filter((mark) => mark.placement > 0).map((mark) => mark.bib),
    );
    bibs = bibs === null ? [...ranked] : bibs.filter((bib) => ranked.has(bib));
  }
  if (!bibs || bibs.length === 0) {
    return null;
  }
  bibs.sort((left, right) => left - right);

  const placementByBib = new Map<number, number[]>();
  for (const bib of bibs) {
    placementByBib.set(
      bib,
      assigned.map((id) => byId.get(id)?.marks.find((mark) => mark.bib === bib)?.placement ?? 0),
    );
  }

  const submissionKey = assigned
    .map((id) => {
      const marks = [...(byId.get(id)?.marks ?? [])]
        .filter((mark) => mark.placement > 0)
        .sort((left, right) => left.bib - right.bib);
      return `${id}=${marks.map((mark) => `${mark.bib}:${mark.placement}`).join(',')}`;
    })
    .join('|');

  return { submissionKey, judgeIds: assigned, bibs, placementByBib };
}

function trimmedIds(ids: readonly string[]): string[] {
  return ids.map((id) => id.trim()).filter((id) => id !== '');
}

/**
 * Judges whose ordinals are passed to relative placement.
 * An even panel (head judge + regular judges) drops the head judge.
 * An odd panel keeps every judge, including the head judge.
 */
export function scoringJudgeIds(
  assignedIds: readonly string[],
  headJudgeId: string | null | undefined,
): string[] {
  const assigned = trimmedIds(assignedIds);
  const head = headJudgeId?.trim() ?? '';
  if (head === '' || assigned.length % 2 === 1 || !assigned.includes(head)) {
    return assigned;
  }
  return assigned.filter((id) => id !== head);
}

/** Regular judges in their existing order, then the head judge. */
export function judgeIdsForResultsColumns(
  assignedIds: readonly string[],
  headJudgeId: string | null | undefined,
): string[] {
  const assigned = trimmedIds(assignedIds);
  const head = headJudgeId?.trim() ?? '';
  if (head === '' || !assigned.includes(head)) {
    return assigned;
  }
  return [...assigned.filter((id) => id !== head), head];
}

function isHeadJudgeRole(value: unknown): boolean {
  return typeof value === 'string' && value.trim().toUpperCase().replace(/[\s-]+/g, '_') === 'HEAD_JUDGE';
}

function recordIsHeadJudge(record: Record<string, unknown>): boolean {
  if (record.head_judge === true || record.headJudge === true) {
    return true;
  }
  return [
    'primary_role_code',
    'primaryRoleCode',
    'secondary_role_code',
    'secondaryRoleCode',
    'role',
    'role_code',
    'roleCode',
  ].some((key) => isHeadJudgeRole(record[key]));
}

/**
 * Head judge for this contest: the staff assignment first, then a HEAD_JUDGE role
 * on a ballot or staff record whose id is on the panel.
 */
export function findHeadJudgeId(input: {
  assignedIds: readonly string[];
  records?: readonly unknown[];
  ballots?: readonly unknown[];
}): string | null {
  const assigned = new Set(trimmedIds(input.assignedIds));
  for (const value of input.records ?? []) {
    const record = asRecord(value);
    if (!record) {
      continue;
    }
    const assignedHead = textField(record, 'head_judge_staff_id', 'headJudgeStaffId');
    if (assignedHead !== '' && assigned.has(assignedHead)) {
      return assignedHead;
    }
  }
  for (const ballot of input.ballots ?? []) {
    const record = asRecord(ballot);
    if (!record || !recordIsHeadJudge(record)) {
      continue;
    }
    const id = textField(record, 'judge_id', 'judgeId');
    if (assigned.has(id)) {
      return id;
    }
  }
  for (const value of input.records ?? []) {
    const record = asRecord(value);
    if (!record || !recordIsHeadJudge(record)) {
      continue;
    }
    const id = textField(record, 'id', 'staff_id', 'staffId', 'judge_id', 'judgeId');
    if (assigned.has(id)) {
      return id;
    }
  }
  return null;
}

/** Storage key changes when the scoring set changes, so an even panel is recomputed. */
export function relativePlacementStorageKey(
  assignedIds: readonly string[],
  ballots: readonly unknown[],
  headJudgeId: string | null | undefined,
): string | null {
  const placementInput = placementInputFromJudgeBallots(assignedIds, ballots);
  if (!placementInput) {
    return null;
  }
  const scoring = scoringJudgeIds(placementInput.judgeIds, headJudgeId);
  return `${placementInput.submissionKey}|scoring:${scoring.join(',')}`;
}

function fallbackJudgeLabel(judgeId: string): string {
  const compact = judgeId.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  let base = compact.slice(0, 2);
  if (base.length < 2) {
    base = `${base}QQ`.slice(0, 2);
  }
  if (/^J\d+$/.test(base)) {
    base = `Q${base.slice(-1)}`;
  }
  return base;
}

function claimLabel(base: string, used: Set<string>): string {
  let label = base;
  let suffix = 2;
  while (used.has(label)) {
    label = `${base}${suffix}`;
    suffix += 1;
  }
  used.add(label);
  return label;
}

/** First and last initials, or a short unique label when the judge has no name. */
export function judgeColumnLabel(
  name: { firstName?: string | null; lastName?: string | null; displayName?: string | null },
  judgeId: string,
  used: Set<string>,
): string {
  const initials = userInitials(name);
  return claimLabel(initials || fallbackJudgeLabel(judgeId), used);
}

function directoryFromRecord(record: Record<string, unknown>): JudgeDirectoryEntry {
  return {
    firstName: textField(record, 'first_name', 'firstName'),
    lastName: textField(record, 'last_name', 'lastName'),
    displayName: textField(record, 'judge_name', 'display_name', 'displayName', 'name'),
    userId: positiveUserId(record.user_id ?? record.userId),
  };
}

function mergeDirectory(current: JudgeDirectoryEntry | undefined, next: JudgeDirectoryEntry): JudgeDirectoryEntry {
  if (!current) {
    return next;
  }
  const currentNamed = userInitials(current) !== '';
  const nextNamed = userInitials(next) !== '';
  if (nextNamed && !currentNamed) {
    return { ...next, userId: next.userId ?? current.userId };
  }
  if (currentNamed && !nextNamed) {
    return { ...current, userId: current.userId ?? next.userId };
  }
  return {
    firstName: current.firstName || next.firstName,
    lastName: current.lastName || next.lastName,
    displayName: current.displayName || next.displayName,
    userId: current.userId ?? next.userId,
  };
}

/** Index staff, panel, and user records by the ids a ballot may store. */
export function indexJudgeNames(entries: readonly unknown[]): Map<string, JudgeDirectoryEntry> {
  const directory = new Map<string, JudgeDirectoryEntry>();
  for (const entry of entries) {
    const record = asRecord(entry);
    if (!record) {
      continue;
    }
    const next = directoryFromRecord(record);
    const keys = [
      textField(record, 'id', 'staff_id', 'staffId', 'judge_id', 'judgeId'),
      textField(record, 'username'),
    ].filter((key) => key !== '');
    const userId = next.userId;
    if (userId !== null) {
      keys.push(String(userId));
    }
    for (const key of keys) {
      directory.set(key, mergeDirectory(directory.get(key), next));
      const lower = key.toLowerCase();
      if (lower !== key) {
        directory.set(lower, mergeDirectory(directory.get(lower), next));
      }
    }
  }
  return directory;
}

function lookupJudge(
  judgeId: string,
  directory: ReadonlyMap<string, JudgeDirectoryEntry>,
): JudgeDirectoryEntry {
  return directory.get(judgeId) ?? directory.get(judgeId.toLowerCase()) ?? emptyDirectoryEntry();
}

function nameForJudge(ballot: ParsedBallot, directory: ReadonlyMap<string, JudgeDirectoryEntry>) {
  const fromBallot = {
    firstName: ballot.firstName,
    lastName: ballot.lastName,
    displayName: ballot.displayName,
  };
  if (userInitials(fromBallot) !== '') {
    return fromBallot;
  }
  const fromDirectory = lookupJudge(ballot.judgeId, directory);
  if (userInitials(fromDirectory) !== '') {
    return fromDirectory;
  }
  return {
    firstName: fromBallot.firstName || fromDirectory.firstName,
    lastName: fromBallot.lastName || fromDirectory.lastName,
    displayName: fromBallot.displayName || fromDirectory.displayName,
  };
}

export function contestResultsLabel(parts: {
  eventName?: string | null;
  skillLevel?: string | null;
  division?: string | null;
}): string {
  const label = [parts.eventName, parts.skillLevel, parts.division]
    .map((part) => (part ?? '').trim())
    .filter((part) => part !== '')
    .join(' · ');
  return label === '' ? 'Contest' : label;
}

export function readSavedSubmissionKey(results: unknown): string {
  const record = asRecord(results);
  return parseSavedRelativePlacement(record?.relative_placement)?.submissionKey ?? '';
}

export function resolveRelativePlacement(input: {
  assignedIds: readonly string[];
  ballots: readonly unknown[];
  headJudgeId?: string | null;
  directory?: ReadonlyMap<string, JudgeDirectoryEntry>;
  couplesByBib?: ReadonlyMap<number, PlacementCouple>;
  eventName?: string;
  skillLevel?: string;
  division?: string;
  computedAt: string;
}): SavedRelativePlacement | null {
  const placementInput = placementInputFromJudgeBallots(input.assignedIds, input.ballots);
  if (!placementInput) {
    return null;
  }
  const headJudgeId = findHeadJudgeId({
    assignedIds: placementInput.judgeIds,
    records: input.headJudgeId ? [{ head_judge_staff_id: input.headJudgeId }] : [],
    ballots: input.ballots,
  }) ?? (input.headJudgeId?.trim() || null);
  const scoringIds = scoringJudgeIds(placementInput.judgeIds, headJudgeId);
  const displayIds = judgeIdsForResultsColumns(placementInput.judgeIds, headJudgeId);
  const ordinalByJudge = new Map<string, Map<number, number>>();
  const scoreByJudge = new Map<string, Map<number, number | null>>();
  const byId = indexBallots(input.ballots);
  for (const id of placementInput.judgeIds) {
    const marks = byId.get(id)?.marks ?? [];
    ordinalByJudge.set(id, new Map(marks.map((mark) => [mark.bib, mark.placement])));
    scoreByJudge.set(id, new Map(marks.map((mark) => [mark.bib, mark.score])));
  }
  const scoringByBib = new Map<number, number[]>();
  for (const bib of placementInput.bibs) {
    scoringByBib.set(
      bib,
      scoringIds.map((id) => ordinalByJudge.get(id)?.get(bib) ?? 0),
    );
  }
  const rowsFromAlgorithm: RelativePlacementRow[] = buildRelativePlacementRows(
    placementInput.bibs,
    scoringByBib,
  );
  const directory = input.directory ?? new Map<string, JudgeDirectoryEntry>();
  const used = new Set<string>();
  const judges = displayIds.map((id) => {
    const ballot = byId.get(id);
    const name = ballot ? nameForJudge(ballot, directory) : lookupJudge(id, directory);
    return {
      id,
      initials: judgeColumnLabel(name, id, used),
      headJudge: id === headJudgeId,
    };
  });
  const couples = input.couplesByBib ?? new Map<number, PlacementCouple>();
  const rows = rowsFromAlgorithm.map((row) => {
    const couple = couples.get(row.bib);
    return {
      bib: row.bib,
      place: row.place,
      judgePlacements: displayIds.map((id) => ordinalByJudge.get(id)?.get(row.bib) ?? 0),
      judgeScores: displayIds.map((id) => scoreByJudge.get(id)?.get(row.bib) ?? null),
      leaderBib: couple?.leaderBib ?? null,
      followerBib: couple?.followerBib ?? null,
      leaderFirst: couple?.leaderFirst ?? '',
      leaderLast: couple?.leaderLast ?? '',
      followerFirst: couple?.followerFirst ?? '',
      followerLast: couple?.followerLast ?? '',
    };
  });
  return {
    submissionKey: relativePlacementStorageKey(placementInput.judgeIds, input.ballots, headJudgeId) ?? '',
    computedAt: input.computedAt,
    eventName: (input.eventName ?? '').trim(),
    skillLevel: (input.skillLevel ?? '').trim(),
    division: (input.division ?? '').trim(),
    scoringJudgeIds: scoringIds,
    judges,
    rows,
  };
}

export function relativePlacementJson(saved: SavedRelativePlacement): Record<string, unknown> {
  return {
    submission_key: saved.submissionKey,
    computed_at: saved.computedAt,
    event_name: saved.eventName,
    skill_level: saved.skillLevel,
    division: saved.division,
    scoring_judge_ids: saved.scoringJudgeIds,
    judges: saved.judges.map((judge) => ({
      id: judge.id,
      initials: judge.initials,
      head_judge: judge.headJudge,
    })),
    rows: saved.rows.map((row) => ({
      bib: row.bib,
      place: row.place,
      judge_placements: row.judgePlacements,
      judge_scores: row.judgeScores,
      leader_bib: row.leaderBib,
      follower_bib: row.followerBib,
      leader_first: row.leaderFirst,
      leader_last: row.leaderLast,
      follower_first: row.followerFirst,
      follower_last: row.followerLast,
    })),
  };
}

function numberList(value: unknown): number[] | null {
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== 'number' || !Number.isFinite(entry))) {
    return null;
  }
  return value as number[];
}

function scoreList(value: unknown): Array<number | null> {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((entry) => (typeof entry === 'number' && Number.isFinite(entry) ? entry : null));
}

function nullableBib(value: unknown): number | null {
  return positiveBib(value);
}

export function parseSavedRelativePlacement(value: unknown): SavedRelativePlacement | null {
  const record = asRecord(value);
  if (!record || !Array.isArray(record.judges) || !Array.isArray(record.rows)) {
    return null;
  }
  const judges = record.judges.flatMap((entry) => {
    const row = asRecord(entry);
    if (!row) {
      return [];
    }
    const id = textField(row, 'id', 'judge_id', 'judgeId');
    const initials = textField(row, 'initials', 'label');
    return id === '' || initials === ''
      ? []
      : [{ id, initials, headJudge: row.head_judge === true || row.headJudge === true }];
  });
  if (judges.length === 0) {
    return null;
  }
  const rows = record.rows.flatMap((entry) => {
    const row = asRecord(entry);
    if (!row) {
      return [];
    }
    const bib = positiveBib(row.bib);
    const place = positiveBib(row.place);
    const judgePlacements = numberList(row.judge_placements ?? row.judgePlacements);
    if (bib === null || place === null || judgePlacements === null) {
      return [];
    }
    return [
      {
        bib,
        place,
        judgePlacements,
        judgeScores: scoreList(row.judge_scores ?? row.judgeScores),
        leaderBib: nullableBib(row.leader_bib ?? row.leaderBib),
        followerBib: nullableBib(row.follower_bib ?? row.followerBib),
        leaderFirst: textField(row, 'leader_first', 'leaderFirst'),
        leaderLast: textField(row, 'leader_last', 'leaderLast'),
        followerFirst: textField(row, 'follower_first', 'followerFirst'),
        followerLast: textField(row, 'follower_last', 'followerLast'),
      },
    ];
  });
  if (rows.length === 0) {
    return null;
  }
  return {
    submissionKey: textField(record, 'submission_key', 'submissionKey'),
    computedAt: textField(record, 'computed_at', 'computedAt'),
    eventName: textField(record, 'event_name', 'eventName'),
    skillLevel: textField(record, 'skill_level', 'skillLevel'),
    division: textField(record, 'division', 'divisionLabel'),
    scoringJudgeIds: stringList(record.scoring_judge_ids ?? record.scoringJudgeIds),
    judges,
    rows,
  };
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => (typeof entry === 'string' && entry.trim() !== '' ? [entry.trim()] : []));
}
