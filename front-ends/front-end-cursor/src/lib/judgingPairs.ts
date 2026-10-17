import { compareRosterByBib } from '../utils/rosterBibOrder';

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
