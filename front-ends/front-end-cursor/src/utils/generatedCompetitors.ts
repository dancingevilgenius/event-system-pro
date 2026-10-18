import { contestSkillDivisionLabel } from './duplicateContestBib';

/** Stored on the contest item. Cleared when the generated test competitors are deleted. */
export const COMPETITORS_GENERATED_FLAG = 'competitors_generated';

/** Each role can be created from this many people through this many. */
export const MIN_TEST_COMPETITOR_COUNT = 1;
export const MAX_TEST_COMPETITOR_COUNT = 199;

/**
 * Whole number of leaders and of followers to create.
 * Returns null for empty text, zero, decimals, negatives, and 200 or more.
 */
export function testCompetitorCount(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null;
  }
  const count = Number(value);
  if (
    !Number.isInteger(count) ||
    count < MIN_TEST_COMPETITOR_COUNT ||
    count > MAX_TEST_COMPETITOR_COUNT
  ) {
    return null;
  }
  return count;
}

export type GeneratedCompetitorRole = 'leader' | 'follower';

export type GeneratedCompetitor = {
  id: string;
  role: GeneratedCompetitorRole;
  firstName: string;
  lastName: string;
  bib: number;
};

export type AccountMatchStatus = 'registered' | 'partial' | 'none';

const generatedIds = new Set<string>();

/** aaa, bbb, … zzz, then aaa1, bbb1, … so a count above 26 stays unique. */
function generatedLastNameAt(index: number): string {
  const letter = String.fromCharCode(97 + (index % 26));
  const cycle = Math.floor(index / 26);
  return cycle === 0 ? letter.repeat(3) : `${letter.repeat(3)}${cycle}`;
}

/** First `count` generated last names. Defaults to the original aaa–zzz list. */
export function generatedCompetitorLastNames(count = 26): string[] {
  return Array.from({ length: count }, (_, index) => generatedLastNameAt(index));
}

function takeUnusedBib(used: Set<number>, preferred: number): number {
  let bib = preferred;
  while (used.has(bib)) {
    bib += 1;
  }
  used.add(bib);
  return bib;
}

/**
 * `count` leaders then `count` followers (default 26).
 * Leaders prefer bibs 1–count and followers the next count numbers.
 * A number already in `used` is skipped. Each assigned bib is recorded before the next person is chosen.
 */
export function assignTestCompetitorBibs(
  usedBibs: ReadonlySet<number>,
  count = 26,
): GeneratedCompetitor[] {
  const size = testCompetitorCount(String(count));
  if (size === null) {
    throw new Error('Enter a whole number from 1 to 199.');
  }
  const used = new Set(usedBibs);
  const lastNames = generatedCompetitorLastNames(size);
  const leaders: GeneratedCompetitor[] = lastNames.map((lastName, index) => ({
    id: `leader-${lastName}`,
    role: 'leader',
    firstName: 'Leader',
    lastName,
    bib: takeUnusedBib(used, index + 1),
  }));
  const followers: GeneratedCompetitor[] = lastNames.map((lastName, index) => ({
    id: `follower-${lastName}`,
    role: 'follower',
    firstName: 'Follower',
    lastName,
    bib: takeUnusedBib(used, size + index + 1),
  }));
  for (const person of [...leaders, ...followers]) {
    generatedIds.add(person.id);
  }
  return [...leaders, ...followers];
}

/** Default bibs 1–count and the following count numbers. Ids stay stable across contests. */
export function generatedCompetitorRoster(count = 26): GeneratedCompetitor[] {
  return assignTestCompetitorBibs(new Set(), count);
}

let generatedById: Map<string, GeneratedCompetitor> | null = null;

/**
 * People named by stored pair ids, using the smallest generated roster that contains every id.
 * A four-person set keeps Leader aaa at bib 1 and Follower ddd at bib 8.
 * Ids that are not generated competitors are omitted.
 */
const generatedPairId = /^(leader|follower)-[a-z]{3}\d*$/;

export function generatedCompetitorsForPairIds(ids: readonly string[]): GeneratedCompetitor[] {
  const wanted = [
    ...new Set(
      ids
        .map((id) => id.trim())
        .filter((id) => generatedPairId.test(id)),
    ),
  ];
  if (wanted.length === 0) {
    return [];
  }
  for (let count = 1; count <= MAX_TEST_COMPETITOR_COUNT; count += 1) {
    const roster = assignTestCompetitorBibs(new Set(), count);
    const byId = new Map(roster.map((person) => [person.id, person]));
    if (!wanted.every((id) => byId.has(id))) {
      continue;
    }
    return wanted.flatMap((id) => {
      const person = byId.get(id);
      return person ? [person] : [];
    });
  }
  return wanted.flatMap((id) => {
    const person = generatedCompetitorById(id);
    return person ? [person] : [];
  });
}

/** Leader aaa / Follower ddd and the rest of the generated roster, looked up by stored id. */
export function generatedCompetitorById(id: string): GeneratedCompetitor | null {
  const key = id.trim();
  if (key === '') {
    return null;
  }
  if (generatedById === null) {
    generatedById = new Map(
      generatedCompetitorRoster(MAX_TEST_COMPETITOR_COUNT).map((person) => [person.id, person]),
    );
  }
  return generatedById.get(key) ?? null;
}

export function isGeneratedCompetitorId(id: string): boolean {
  if (generatedIds.size === 0) {
    generatedCompetitorRoster();
  }
  return generatedIds.has(id);
}

const generatedLastNames = new Set(generatedCompetitorLastNames(MAX_TEST_COMPETITOR_COUNT));

export function isGeneratedCompetitor(person: {
  id?: string;
  firstName?: string;
  lastName?: string;
}): boolean {
  if (typeof person.id === 'string' && isGeneratedCompetitorId(person.id)) {
    return true;
  }
  const first = (person.firstName ?? '').trim();
  const last = (person.lastName ?? '').trim().toLowerCase();
  if (first !== 'Leader' && first !== 'Follower') {
    return false;
  }
  return generatedLastNames.has(last);
}

export function rosterHasGeneratedCompetitors(
  people: readonly { id?: string; firstName?: string; lastName?: string }[],
): boolean {
  return people.some((person) => isGeneratedCompetitor(person));
}

/** Positive integer bibs already stored on the contest. */
export function usedContestBibNumbers(people: readonly { bib?: unknown }[]): Set<number> {
  const used = new Set<number>();
  for (const person of people) {
    if (typeof person.bib === 'number' && Number.isInteger(person.bib) && person.bib > 0) {
      used.add(person.bib);
    }
  }
  return used;
}

/** An existing account (full or Quick Register) is reused. Missing names are created once. */
export function accountsToCreate<T extends { id: string }>(
  roster: readonly T[],
  statusById: Readonly<Record<string, AccountMatchStatus | undefined>>,
): T[] {
  return roster.filter((person) => {
    const status = statusById[person.id];
    return status !== 'registered' && status !== 'partial';
  });
}

function contestActionTarget(contest: {
  eventName?: string;
  skillLevelLabel: string;
  divisionLabel: string;
}): string {
  const skill = contestSkillDivisionLabel(contest);
  const eventName = (contest.eventName ?? '').trim();
  if (eventName !== '' && skill !== '' && eventName !== skill) {
    return `${eventName}, ${skill}`;
  }
  if (skill !== '') {
    return skill;
  }
  if (eventName !== '') {
    return eventName;
  }
  return 'this contest';
}

export function createTestCompetitorsConfirmText(
  contest: {
    eventName?: string;
    skillLevelLabel: string;
    divisionLabel: string;
  },
  count: number,
): string {
  return `This will scratch the current competitors, then add ${count} leaders and ${count} followers to ${contestActionTarget(contest)}.`;
}

export function deleteGeneratedCompetitorsConfirmText(contest: {
  eventName?: string;
  skillLevelLabel: string;
  divisionLabel: string;
}): string {
  return `This will scratch the generated test competitors on ${contestActionTarget(contest)}. Other competitors will stay registered.`;
}
