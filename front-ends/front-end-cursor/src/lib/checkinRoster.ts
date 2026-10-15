import {
  EMPTY_ADVANCED_USER_FILTERS,
  fetchUsersPage,
  type UserFilters,
  type UserSort,
} from '../api/postgrest';

/** First-pass roster size for both check-in tables. */
export const CHECKIN_ROW_COUNT = 10;

/** How many matching test users to draw from before picking the roster. */
const CHECKIN_SAMPLE_WINDOW = 80;

export type CheckinRole = 'leader' | 'follower';

export type CheckinPerson = {
  userId: number;
  firstName: string;
  lastName: string;
};

export type CheckinCouple = {
  bib: string;
  leader: CheckinPerson;
  follower: CheckinPerson;
};

const ROLE_FILTERS = {
  firstName: '',
  lastName: '',
  city: '',
  state: '',
} as const;

const NAME_SORT: UserSort = { column: 'lastName', direction: 'asc' };

export function formatCheckinName(person: Pick<CheckinPerson, 'firstName' | 'lastName'>): string {
  const name = [person.firstName.trim(), person.lastName.trim()].filter(Boolean).join(' ');
  return name || '—';
}

/** Fisher-Yates sample. Does not mutate `items`. */
export function sampleItems<T>(items: readonly T[], count: number, random: () => number = Math.random): T[] {
  const copy = [...items];
  const take = Math.max(0, Math.min(count, copy.length));

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[swapIndex];
    copy[swapIndex] = current;
  }

  return copy.slice(0, take);
}

/** Inclusive start offset for a window of `windowSize` inside `total` rows. */
export function randomWindowOffset(
  total: number,
  windowSize: number,
  random: () => number = Math.random,
): number {
  const safeTotal = Math.max(0, total);
  const window = Math.min(Math.max(0, windowSize), safeTotal);
  const maxOffset = Math.max(0, safeTotal - window);
  return Math.floor(random() * (maxOffset + 1));
}

/** Unique 3-digit bib numbers, returned as strings. */
export function assignBibNumbers(count: number, random: () => number = Math.random): string[] {
  const used = new Set<number>();
  const bibs: string[] = [];
  let guard = 0;

  while (bibs.length < count && guard < count * 40) {
    guard += 1;
    const bib = 100 + Math.floor(random() * 900);
    if (used.has(bib)) {
      continue;
    }
    used.add(bib);
    bibs.push(String(bib));
  }

  return bibs.sort((left, right) => Number(left) - Number(right));
}

export function pairCheckinCouples(
  leaders: readonly CheckinPerson[],
  followers: readonly CheckinPerson[],
  bibs: readonly string[],
): CheckinCouple[] {
  const count = Math.min(leaders.length, followers.length, bibs.length);
  return Array.from({ length: count }, (_, index) => ({
    bib: bibs[index],
    leader: leaders[index],
    follower: followers[index],
  }));
}

/**
 * Random test users whose `additional_info_json.primary-role` is leader or follower.
 * The users table stores that flag on `additional_info_json`, not `more_json`.
 */
export async function fetchRandomCheckinPeople(
  role: CheckinRole,
  count = CHECKIN_ROW_COUNT,
): Promise<CheckinPerson[]> {
  const filters: UserFilters = { ...ROLE_FILTERS, primaryRole: role };
  const options = {
    advancedFilters: { ...EMPTY_ADVANCED_USER_FILTERS, isDemo: true as const },
  };

  const probe = await fetchUsersPage(0, 1, filters, NAME_SORT, options);
  if (probe.total === 0) {
    return [];
  }

  const windowSize = Math.min(CHECKIN_SAMPLE_WINDOW, probe.total);
  const offset = randomWindowOffset(probe.total, windowSize);
  const page = await fetchUsersPage(offset, windowSize, filters, NAME_SORT, options);

  return sampleItems(
    page.users.map((user) => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
    count,
  );
}
