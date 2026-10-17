import { contestSkillDivisionLabel } from './duplicateContestBib';

/** Stored on the contest item. Cleared when the generated test competitors are deleted. */
export const COMPETITORS_GENERATED_FLAG = 'competitors_generated';

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

/** aaa, bbb, … zzz. */
export function generatedCompetitorLastNames(): string[] {
  return Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index).repeat(3));
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
 * 26 leaders then 26 followers.
 * Leaders prefer bibs 1–26 and followers 27–52. A number already in `used` is skipped.
 * Each assigned bib is recorded before the next person is chosen.
 */
export function assignTestCompetitorBibs(usedBibs: ReadonlySet<number>): GeneratedCompetitor[] {
  const used = new Set(usedBibs);
  const lastNames = generatedCompetitorLastNames();
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
    bib: takeUnusedBib(used, index + 27),
  }));
  for (const person of [...leaders, ...followers]) {
    generatedIds.add(person.id);
  }
  return [...leaders, ...followers];
}

/** Default bibs 1–26 and 27–52. Ids stay stable across contests. */
export function generatedCompetitorRoster(): GeneratedCompetitor[] {
  return assignTestCompetitorBibs(new Set());
}

export function isGeneratedCompetitorId(id: string): boolean {
  if (generatedIds.size === 0) {
    generatedCompetitorRoster();
  }
  return generatedIds.has(id);
}

const generatedLastNames = new Set(generatedCompetitorLastNames());

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

export function createTestCompetitorsConfirmText(contest: {
  eventName?: string;
  skillLevelLabel: string;
  divisionLabel: string;
}): string {
  return `This will scratch the current competitors, then add 26 leaders and 26 followers to ${contestActionTarget(contest)}.`;
}

export function deleteGeneratedCompetitorsConfirmText(contest: {
  eventName?: string;
  skillLevelLabel: string;
  divisionLabel: string;
}): string {
  return `This will scratch the generated test competitors on ${contestActionTarget(contest)}. Other competitors will stay registered.`;
}
