import { parseRoles } from './session';
import { compareRosterByBib } from '../utils/rosterBibOrder';

const PAIR_MANAGER_ROLES = new Set(['ADMIN', 'HEAD_JUDGE']);

const STAFF_ROLE_KEYS = [
  'primary_role_code',
  'primaryRoleCode',
  'secondary_role_code',
  'secondaryRoleCode',
  'role_code',
  'roleCode',
  'role',
] as const;

const ROLE_LIST_KEYS = ['appRoles', 'roles', 'staffRoleCodes', 'staffRoles'] as const;

function listedRoleCodes(value: unknown): string[] {
  if (typeof value === 'string') {
    return parseRoles([value]);
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => listedRoleCodes(entry));
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  const record = value as Record<string, unknown>;
  return [
    ...STAFF_ROLE_KEYS.flatMap((key) => listedRoleCodes(record[key])),
    ...ROLE_LIST_KEYS.flatMap((key) => (key in record ? listedRoleCodes(record[key]) : [])),
  ];
}

/**
 * Head Judge and Admin may randomize and save contest pairs.
 * App roles come from the session (`ADMIN`, `HEAD_JUDGE`, or labels `Admin` / `Head Judge`).
 * A head judge assigned only on the event is `primary_role_code: 'HEAD_JUDGE'` with an empty
 * login role list, or `contestHeadJudge` when `head_judge_staff_id` points at them.
 */
export function canManageContestPairs(roles: unknown): boolean {
  if (listedRoleCodes(roles).some((role) => PAIR_MANAGER_ROLES.has(role))) {
    return true;
  }

  if (!roles || typeof roles !== 'object' || Array.isArray(roles)) {
    return false;
  }

  const record = roles as Record<string, unknown>;
  return record.contestHeadJudge === true || record.eventHeadJudge === true;
}

export type ContestPairPerson = {
  id: string;
  bib?: unknown;
};

export type ContestPair = {
  leaderId: string;
  followerId: string;
};

export type StoredContestPair = {
  leader_id: string;
  follower_id: string;
};

export type RandomizedContestPairs<T extends ContestPairPerson> = {
  leaders: T[];
  followers: T[];
  pairs: ContestPair[];
};

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }
  return next;
}

/** Leaders stay in bib order. Followers are shuffled into those rows, with extras in bib order. */
export function randomizeContestPairs<T extends ContestPairPerson>(
  leaders: readonly T[],
  followers: readonly T[],
  random: () => number = Math.random,
): RandomizedContestPairs<T> {
  const orderedLeaders = [...leaders].sort(compareRosterByBib);
  const shuffledFollowers = shuffle(followers, random);
  const pairCount = Math.min(orderedLeaders.length, shuffledFollowers.length);
  const pairedFollowers = shuffledFollowers.slice(0, pairCount);
  const extraFollowers = shuffledFollowers.slice(pairCount).sort(compareRosterByBib);

  return {
    leaders: orderedLeaders,
    followers: [...pairedFollowers, ...extraFollowers],
    pairs: orderedLeaders.slice(0, pairCount).map((leader, index) => ({
      leaderId: leader.id,
      followerId: pairedFollowers[index].id,
    })),
  };
}

export function storedContestPairs(pairs: readonly ContestPair[]): StoredContestPair[] {
  return pairs.flatMap((pair) => {
    const leaderId = pair.leaderId.trim();
    const followerId = pair.followerId.trim();
    if (leaderId === '' || followerId === '') {
      return [];
    }
    return [{ leader_id: leaderId, follower_id: followerId }];
  });
}

function pairId(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

/**
 * Saved couples in leader-bib order, then unpaired people bib-sorted in each column.
 * Returns null when nothing in `stored` matches both a leader and a follower.
 */
export function orderSavedContestPairs<T extends ContestPairPerson>(
  leaders: readonly T[],
  followers: readonly T[],
  stored: readonly StoredContestPair[],
): { leaders: T[]; followers: T[] } | null {
  if (stored.length === 0) {
    return null;
  }

  const leadersById = new Map(leaders.map((person) => [person.id, person]));
  const followersById = new Map(followers.map((person) => [person.id, person]));
  const usedLeaders = new Set<string>();
  const usedFollowers = new Set<string>();
  const paired = stored.flatMap((pair) => {
    if (usedLeaders.has(pair.leader_id) || usedFollowers.has(pair.follower_id)) {
      return [];
    }
    const leader = leadersById.get(pair.leader_id);
    const follower = followersById.get(pair.follower_id);
    if (!leader || !follower) {
      return [];
    }
    usedLeaders.add(pair.leader_id);
    usedFollowers.add(pair.follower_id);
    return [{ leader, follower }];
  });

  if (paired.length === 0) {
    return null;
  }

  paired.sort((left, right) => compareRosterByBib(left.leader, right.leader));
  const unpairedLeaders = leaders.filter((person) => !usedLeaders.has(person.id)).sort(compareRosterByBib);
  const unpairedFollowers = followers
    .filter((person) => !usedFollowers.has(person.id))
    .sort(compareRosterByBib);

  return {
    leaders: [...paired.map((pair) => pair.leader), ...unpairedLeaders],
    followers: [...paired.map((pair) => pair.follower), ...unpairedFollowers],
  };
}

/** Score opens finals when Save Pairs left a non-empty `{leader_id, follower_id}` list. */
export function savedPairsOpenFinals(pairs: unknown): boolean {
  return readStoredContestPairs(pairs).length > 0;
}

/** Reads `more_json.pairs`. Accepts `leader_id` or `leaderId`. A contest is paired only when this list is non-empty. */
export function readStoredContestPairs(value: unknown): StoredContestPair[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return [];
    }
    const record = entry as Record<string, unknown>;
    const leaderId = pairId(record, 'leader_id', 'leaderId');
    const followerId = pairId(record, 'follower_id', 'followerId');
    if (leaderId === '' || followerId === '') {
      return [];
    }
    return [{ leader_id: leaderId, follower_id: followerId }];
  });
}
