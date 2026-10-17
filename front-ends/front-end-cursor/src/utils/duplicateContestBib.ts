export type ContestSkillDivision = {
  skillLevelLabel: string;
  divisionLabel: string;
};

export type ContestBibPerson = {
  id?: string;
  bib?: unknown;
  firstName?: string;
  lastName?: string;
};

export type AlreadyRegisteredConflict = {
  name: string;
  bib: number | null;
  contestLabel: string;
};

export type ContestBibConflict = {
  bib: number;
  owners: readonly string[];
  contestLabel: string;
};

/** Skill level and competition type, without the event name. */
export function contestSkillDivisionLabel(contest: ContestSkillDivision): string {
  return [contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' ');
}

/** 007 and 7 are the same bib. Missing or non-integer values do not match. */
export function bibNumbersMatch(stored: unknown, bib: number): boolean {
  if (!Number.isInteger(bib) || bib <= 0) {
    return false;
  }
  if (typeof stored === 'number') {
    return Number.isInteger(stored) && stored === bib;
  }
  if (typeof stored === 'string') {
    const trimmed = stored.trim();
    if (!/^\d{1,3}$/.test(trimmed)) {
      return false;
    }
    return Number(trimmed) === bib;
  }
  return false;
}

export function rosterHasBib(people: readonly { bib?: unknown }[], bib: number): boolean {
  return people.some((person) => bibNumbersMatch(person.bib, bib));
}

export function bibOwnerNames(people: readonly ContestBibPerson[], bib: number): string[] {
  const names: string[] = [];
  for (const person of people) {
    if (!bibNumbersMatch(person.bib, bib)) {
      continue;
    }
    const name = [person.firstName, person.lastName]
      .map((part) => (part ?? '').trim())
      .filter((part) => part !== '')
      .join(' ');
    if (name !== '' && !names.includes(name)) {
      names.push(name);
    }
  }
  return names;
}

function ownerPhrase(owners: readonly string[]): string {
  const names = owners.map((name) => name.trim()).filter((name) => name !== '');
  if (names.length === 0) {
    return 'another competitor';
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export function sameRosterPerson(personId: string, rosterId: string | undefined): boolean {
  const left = personId.trim();
  const right = (rosterId ?? '').trim();
  return left !== '' && left === right;
}

export function rosterPersonById<T extends { id?: string }>(
  people: readonly T[],
  personId: string,
): T | undefined {
  return people.find((person) => sameRosterPerson(personId, person.id));
}

export function alreadyRegisteredContestMessage(
  conflicts: readonly AlreadyRegisteredConflict[],
): string {
  const sentences: string[] = [];
  for (const conflict of conflicts) {
    const name = conflict.name.trim();
    const contestLabel = conflict.contestLabel.trim();
    if (name === '' || contestLabel === '') {
      continue;
    }
    const bib =
      typeof conflict.bib === 'number' && Number.isInteger(conflict.bib) && conflict.bib > 0
        ? ` with Bib # ${conflict.bib}`
        : '';
    const sentence = `${name} is already registered${bib} for ${contestLabel}.`;
    if (!sentences.includes(sentence)) {
      sentences.push(sentence);
    }
  }
  return sentences.join(' ');
}

export function duplicateContestBibMessage(conflicts: readonly ContestBibConflict[]): string {
  const sentences: string[] = [];
  for (const conflict of conflicts) {
    const contestLabel = conflict.contestLabel.trim();
    if (contestLabel === '') {
      continue;
    }
    const sentence = `Bib ${conflict.bib} is already assigned to ${ownerPhrase(conflict.owners)} for ${contestLabel}.`;
    if (!sentences.includes(sentence)) {
      sentences.push(sentence);
    }
  }
  return sentences.join(' ');
}
