import type { LegionMember } from '../data/legionNames';
import { readStoredContestPairs, type StoredContestPair } from './judgingPairs';
import { parseRoles } from './session';

export type JudgingFinalsRosterPerson = {
  id: string;
  firstName: string;
  lastName: string;
  bib?: unknown;
};

/** One scored couple. `number` is the bib the judging list sorts and scores by. */
export type JudgingFinalsEntry = {
  number: number;
  /** Roster bib for the leader. Null when that dancer has no bib. */
  leaderBib: number | null;
  /** Roster bib for the follower. Null when that dancer has no bib. */
  followerBib: number | null;
  leader: LegionMember;
  follower: LegionMember;
};

export type JudgingFinalsContestRef = {
  eventId: number | null;
  contestId: number | null;
  contestItemId: string;
  eventName: string;
  skillLevel: string;
  contestType: string;
  /** Null when navigation state did not include pairs, so they should be loaded. */
  pairs: StoredContestPair[] | null;
};

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function positiveId(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function record(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

const FINALS_APP_ROLES = new Set(['ADMIN', 'STAFF', 'JUDGE', 'HEAD_JUDGE']);

/**
 * Who may open /judge-finals.
 * App roles Admin, Staff, Judge, and Head Judge are enough.
 * A scoring judge whose only Judge role is event staff can open finals when they can already open Judging Home.
 */
export function canOpenJudgeFinals(input: {
  appRoles?: readonly string[] | null;
  staffRoleCodes?: readonly string[] | null;
  judgingHomeAllowed?: boolean;
}): boolean {
  const roles = [
    ...parseRoles(input.appRoles ?? []),
    ...parseRoles(input.staffRoleCodes ?? []),
  ];
  if (roles.some((role) => FINALS_APP_ROLES.has(role))) {
    return true;
  }
  return input.judgingHomeAllowed === true;
}

export const JUDGE_SUBMIT_HOME_PATH = '/home';

/** Success copy shown on Home after Submit saves a ballot. */
export function judgeSubmitSuccessMessage(placementCount: number): string {
  const count = Number.isFinite(placementCount) && placementCount > 0 ? Math.floor(placementCount) : 0;
  return `Scores submitted with ${count} placements derived (1st = highest score).`;
}

/** Where Submit goes after a successful save, and the flash Home should show. */
export function judgeSubmitSuccessNavigation(placementCount: number): {
  path: typeof JUDGE_SUBMIT_HOME_PATH;
  flashSuccess: string;
} {
  return {
    path: JUDGE_SUBMIT_HOME_PATH,
    flashSuccess: judgeSubmitSuccessMessage(placementCount),
  };
}

/** Contest identity from route state, with the query string used when a refresh drops state. */
export function readJudgingFinalsContest(
  state: unknown,
  search: URLSearchParams,
): JudgingFinalsContestRef {
  const routeState = record(state);
  const eventId = positiveId(routeState?.eventId) ?? positiveId(search.get('eventId'));
  const contestId = positiveId(routeState?.contestId) ?? positiveId(search.get('contestId'));
  const contestItemId = textValue(routeState?.contestItemId) || textValue(search.get('contestItemId'));

  return {
    eventId,
    contestId,
    contestItemId,
    eventName: textValue(routeState?.eventName),
    skillLevel: textValue(routeState?.skillLevel),
    contestType: textValue(routeState?.contestType),
    pairs: routeState && 'pairs' in routeState ? readStoredContestPairs(routeState.pairs) : null,
  };
}

/** Back stays off until every couple has a score and those scores have been submitted. An empty list is not a trap. */
export function canLeaveJudgingFinals(input: {
  loading: boolean;
  entryCount: number;
  percentComplete: number;
  submitted: boolean;
}): boolean {
  if (input.loading) {
    return false;
  }
  if (input.entryCount === 0) {
    return true;
  }
  return input.percentComplete >= 100 && input.submitted;
}

export function judgingFinalsTitle(contest: JudgingFinalsContestRef): string {
  const title = [contest.eventName, contest.skillLevel, contest.contestType]
    .filter((part) => part !== '')
    .join(' · ');
  return title === '' ? 'Finals' : title;
}

export type JudgeSubmissionProgress = {
  submitted: number;
  assigned: number;
  /** 0 when nobody is assigned. 100 only when every assigned judge has submitted. */
  percent: number;
  label: string;
};

export function seesJudgeSubmissionBar(input: {
  appRoles?: readonly string[];
  eventHeadJudge: boolean;
  contestHeadJudge: boolean;
}): boolean {
  const roles = new Set((input.appRoles ?? []).map((role) => role.trim().toUpperCase()).filter((role) => role !== ''));
  return roles.has('ADMIN') || roles.has('HEAD_JUDGE') || input.eventHeadJudge || input.contestHeadJudge;
}

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

function idList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    if (typeof entry === 'string' && entry.trim() !== '') {
      return [entry.trim()];
    }
    if (typeof entry === 'number' && Number.isFinite(entry)) {
      return [String(entry)];
    }
    const row = asRecord(entry);
    if (!row) {
      return [];
    }
    const id = textField(row, 'judge_id', 'judgeId', 'staff_id', 'staffId', 'id');
    return id === '' ? [] : [id];
  });
}

function pushUnique(ids: string[], id: string) {
  if (id !== '' && !ids.includes(id)) {
    ids.push(id);
  }
}

/** Head judge plus scoring judges, then any judging-panel ids not already listed. */
export function assignedContestJudgeIds(input: {
  records?: readonly unknown[];
  panelJudges?: unknown;
  staffJson?: unknown;
}): string[] {
  const ids: string[] = [];
  for (const value of input.records ?? []) {
    const row = asRecord(value);
    if (!row) {
      continue;
    }
    pushUnique(ids, textField(row, 'head_judge_staff_id', 'headJudgeStaffId'));
    for (const id of idList(row.scoring_judge_staff_ids ?? row.scoringJudgeStaffIds)) {
      pushUnique(ids, id);
    }
  }
  for (const id of idList(input.panelJudges)) {
    pushUnique(ids, id);
  }
  if (ids.length > 0 || !Array.isArray(input.staffJson)) {
    return ids;
  }

  const roleIds: string[] = [];
  let sawRole = false;
  for (const entry of input.staffJson) {
    const row = asRecord(entry);
    if (!row) {
      if (typeof entry === 'string') {
        pushUnique(ids, entry.trim());
      }
      continue;
    }
    const roles = ['primary_role_code', 'secondary_role_code', 'role', 'role_code']
      .map((key) => textField(row, key).toUpperCase())
      .filter((role) => role !== '');
    if (roles.length > 0) {
      sawRole = true;
    }
    if (!roles.includes('JUDGE') && !roles.includes('HEAD_JUDGE')) {
      continue;
    }
    pushUnique(roleIds, textField(row, 'id', 'staff_id', 'staffId', 'judge_id', 'judgeId'));
  }
  return sawRole ? roleIds : ids;
}

/**
 * True when one of the stored ballots belongs to this judge.
 * Ballots record `judge_id` as the event staff id, or the username when no staff id matches.
 * `user_id` / `username` on the ballot count too.
 */
export function judgeHasSubmittedBallot(input: {
  submissions: readonly unknown[];
  userId?: number | null;
  username?: string | null;
  staffIds?: readonly string[] | null;
}): boolean {
  const staffIds = new Set(
    (input.staffIds ?? []).map((id) => id.trim()).filter((id) => id !== ''),
  );
  const username = (input.username ?? '').trim().toLowerCase();
  const userId = input.userId != null && Number.isFinite(input.userId) ? String(input.userId) : '';
  const ballots = input.submissions.flatMap((value) => (Array.isArray(value) ? value : []));

  return ballots.some((entry) => {
    const row = asRecord(entry);
    if (!row) {
      return false;
    }
    const judgeId = textField(row, 'judge_id', 'judgeId', 'staff_id', 'staffId');
    const ballotUsername = textField(row, 'username');
    const ballotUserId = textField(row, 'user_id', 'userId');
    if (judgeId !== '') {
      if (staffIds.has(judgeId)) {
        return true;
      }
      if (username !== '' && judgeId.toLowerCase() === username) {
        return true;
      }
      if (userId !== '' && judgeId === userId) {
        return true;
      }
    }
    if (ballotUsername !== '' && username !== '' && ballotUsername.toLowerCase() === username) {
      return true;
    }
    return ballotUserId !== '' && userId !== '' && ballotUserId === userId;
  });
}

export function readStoredJudgeIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((entry) => {
    const row = asRecord(entry);
    if (!row) {
      return [];
    }
    const id = textField(row, 'judge_id', 'judgeId');
    return id === '' ? [] : [id];
  });
}

/** Counts assigned judges who have a stored ballot. Other ids are ignored. */
export function judgeSubmissionProgress(
  assignedIds: readonly string[],
  submittedIds: readonly string[],
): JudgeSubmissionProgress {
  const assigned = assignedContestJudgeIds({ records: [], panelJudges: assignedIds });
  const assignedSet = new Set(assigned);
  const submitted = new Set<string>();
  for (const id of submittedIds) {
    const trimmed = id.trim();
    if (assignedSet.has(trimmed)) {
      submitted.add(trimmed);
    }
  }
  const assignedCount = assigned.length;
  const submittedCount = submitted.size;
  const percent = assignedCount === 0 ? 0 : (submittedCount / assignedCount) * 100;
  return {
    submitted: submittedCount,
    assigned: assignedCount,
    percent,
    label: `${submittedCount}/${assignedCount}`,
  };
}

function positiveBib(bib: unknown): number | null {
  return typeof bib === 'number' && Number.isInteger(bib) && bib > 0 ? bib : null;
}

function personName(person: JudgingFinalsRosterPerson | undefined): { first: string; last: string } {
  const first = person?.firstName.trim() ?? '';
  const last = person?.lastName.trim() ?? '';
  if (first === '' && last === '') {
    return { first: 'Unknown', last: 'competitor' };
  }
  return { first, last };
}

/**
 * Display bib for one couple.
 * Uses the leader bib, then the follower bib, when that positive integer is still free.
 * When a couple has no free bib, assigns the next integer above every bib on these couples
 * and every number already assigned. Stored pair order makes the result stable.
 */
function displayBib(preferred: Array<number | null>, used: Set<number>, highestKnownBib: number): number {
  for (const bib of preferred) {
    if (bib !== null && !used.has(bib)) {
      used.add(bib);
      return bib;
    }
  }

  let next = Math.max(highestKnownBib + 1, used.size === 0 ? 1 : Math.max(...used) + 1);
  while (used.has(next)) {
    next += 1;
  }
  used.add(next);
  return next;
}

export function buildJudgingFinalsEntries(
  pairs: unknown,
  people: readonly JudgingFinalsRosterPerson[],
): JudgingFinalsEntry[] {
  const stored = readStoredContestPairs(pairs);
  const byId = new Map(people.map((person) => [person.id, person]));
  const resolved = stored.map((pair) => {
    const leader = byId.get(pair.leader_id);
    const follower = byId.get(pair.follower_id);
    return {
      leader,
      follower,
      leaderBib: positiveBib(leader?.bib),
      followerBib: positiveBib(follower?.bib),
    };
  });
  const knownBibs = resolved.flatMap((pair) => [pair.leaderBib, pair.followerBib]).filter((bib) => bib !== null);
  const highestKnownBib = knownBibs.length === 0 ? 0 : Math.max(...knownBibs);
  const used = new Set<number>();

  return resolved.map((pair) => {
    const leaderName = personName(pair.leader);
    const followerName = personName(pair.follower);
    return {
      number: displayBib([pair.leaderBib, pair.followerBib], used, highestKnownBib),
      leaderBib: pair.leaderBib,
      followerBib: pair.followerBib,
      leader: { ...leaderName, sex: 'male' },
      follower: { ...followerName, sex: 'female' },
    };
  });
}
