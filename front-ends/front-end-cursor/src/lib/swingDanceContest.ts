import type { StaticListEntry } from '../api/postgrest';

export type SwingDanceContestFormState = {
  id: string;
  danceKey: string;
  levelKey: string;
  title: string;
  titleManuallyEdited: boolean;
};

export type SwingDanceContestJson = {
  danceKey: string;
  danceLabel: string;
  levelKey: string;
  levelLabel: string;
  title: string;
};

export function createEmptySwingDanceContest(): SwingDanceContestFormState {
  return {
    id: crypto.randomUUID(),
    danceKey: '',
    levelKey: '',
    title: '',
    titleManuallyEdited: false,
  };
}

export function buildSwingContestPairKey(danceKey: string, levelKey: string): string {
  return `${danceKey}::${levelKey}`;
}

export function isSwingContestPairComplete(danceKey: string, levelKey: string): boolean {
  return danceKey !== '' && levelKey !== '';
}

export function buildDefaultSwingContestTitle(
  danceLabel: string,
  levelLabel: string,
): string {
  if (!danceLabel && !levelLabel) {
    return '';
  }

  if (!levelLabel) {
    return danceLabel;
  }

  if (!danceLabel) {
    return levelLabel;
  }

  return `${levelLabel} ${danceLabel}`;
}

function findStaticListLabel(entries: StaticListEntry[], key: string): string {
  return entries.find((entry) => entry.key === key)?.label ?? '';
}

export function swingDanceContestToJson(
  state: SwingDanceContestFormState,
  danceOptions: StaticListEntry[],
  levelOptions: StaticListEntry[],
): SwingDanceContestJson | null {
  if (!isSwingContestPairComplete(state.danceKey, state.levelKey)) {
    return null;
  }

  const danceLabel = findStaticListLabel(danceOptions, state.danceKey);
  const levelLabel = findStaticListLabel(levelOptions, state.levelKey);

  if (!danceLabel || !levelLabel) {
    return null;
  }

  return {
    danceKey: state.danceKey,
    danceLabel,
    levelKey: state.levelKey,
    levelLabel,
    title: state.title.trim(),
  };
}

export function swingDanceContestSetToJson(
  contests: SwingDanceContestFormState[],
  danceOptions: StaticListEntry[],
  levelOptions: StaticListEntry[],
): SwingDanceContestJson[] {
  return contests
    .map((contest) => swingDanceContestToJson(contest, danceOptions, levelOptions))
    .filter((contest): contest is SwingDanceContestJson => contest !== null);
}

function groupContestsByPair(
  contests: SwingDanceContestFormState[],
): Map<string, SwingDanceContestFormState[]> {
  const groups = new Map<string, SwingDanceContestFormState[]>();

  for (const contest of contests) {
    if (!isSwingContestPairComplete(contest.danceKey, contest.levelKey)) {
      continue;
    }

    const pairKey = buildSwingContestPairKey(contest.danceKey, contest.levelKey);
    const group = groups.get(pairKey) ?? [];
    group.push(contest);
    groups.set(pairKey, group);
  }

  return groups;
}

export function getDuplicatePairContestIds(
  contests: SwingDanceContestFormState[],
): Set<string> {
  const duplicateIds = new Set<string>();

  for (const group of groupContestsByPair(contests).values()) {
    if (group.length < 2) {
      continue;
    }

    for (const contest of group) {
      duplicateIds.add(contest.id);
    }
  }

  return duplicateIds;
}

function normalizeTitle(title: string): string {
  return title.trim().toLocaleLowerCase();
}

export function hasSaveBlockingDuplicatePairs(
  contests: SwingDanceContestFormState[],
): boolean {
  for (const group of groupContestsByPair(contests).values()) {
    if (group.length < 2) {
      continue;
    }

    const titles = group.map((contest) => normalizeTitle(contest.title));
    const uniqueTitles = new Set(titles);

    if (uniqueTitles.size !== titles.length) {
      return true;
    }
  }

  return false;
}

export function getSaveBlockingContestIds(
  contests: SwingDanceContestFormState[],
): Set<string> {
  const blockingIds = new Set<string>();

  for (const group of groupContestsByPair(contests).values()) {
    if (group.length < 2) {
      continue;
    }

    const titles = group.map((contest) => normalizeTitle(contest.title));
    const uniqueTitles = new Set(titles);

    if (uniqueTitles.size !== titles.length) {
      for (const contest of group) {
        blockingIds.add(contest.id);
      }
    }
  }

  return blockingIds;
}

export function countOtherContestsWithPair(
  contests: SwingDanceContestFormState[],
  contestId: string,
  danceKey: string,
  levelKey: string,
): number {
  if (!isSwingContestPairComplete(danceKey, levelKey)) {
    return 0;
  }

  const pairKey = buildSwingContestPairKey(danceKey, levelKey);

  return contests.filter(
    (contest) =>
      contest.id !== contestId &&
      isSwingContestPairComplete(contest.danceKey, contest.levelKey) &&
      buildSwingContestPairKey(contest.danceKey, contest.levelKey) === pairKey,
  ).length;
}
