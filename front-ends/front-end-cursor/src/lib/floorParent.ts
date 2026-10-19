import { eventIsCancelled } from './eventCancelled';

export const FLOOR_PARENT_TITLES = ['Floor Parent', 'Floor Mom', 'Floor Dad'] as const;

export type FloorParentTitle = (typeof FLOOR_PARENT_TITLES)[number];

export const DEFAULT_FLOOR_PARENT_TITLE: FloorParentTitle = 'Floor Parent';

export const FLOOR_PARENT_TITLE_KEY = 'floor_parent_title';

/** Contests whose event starts from now through the next 6 hours. */
export const FLOOR_PARENT_WINDOW_MS = 6 * 60 * 60 * 1000;

export type FloorParentContest = {
  id: string;
  eventId: number;
  eventName: string;
  skillLevelLabel: string;
  divisionLabel: string;
  contestId: number | null;
  contestItemId: string;
  skillLevelKey: string;
  divisionKey: string;
  startsAt: string;
};

export type FloorParentEvent = {
  eventId: number;
  name: string;
  startDate: string | null;
  moreJson: unknown;
};

export type FloorParentContestRow = {
  contestId: number;
  eventId: number;
  eventTypeCode: string | null;
  moreJson: unknown;
};

export function floorParentTitleFromAdditionalInfo(value: unknown): FloorParentTitle {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_FLOOR_PARENT_TITLE;
  }

  const title = (value as Record<string, unknown>)[FLOOR_PARENT_TITLE_KEY];
  if (typeof title !== 'string') {
    return DEFAULT_FLOOR_PARENT_TITLE;
  }

  const match = FLOOR_PARENT_TITLES.find((option) => option === title.trim());
  return match ?? DEFAULT_FLOOR_PARENT_TITLE;
}

export function eventStartsWithinNextWindow(
  startIso: string | null | undefined,
  now: Date = new Date(),
  windowMs: number = FLOOR_PARENT_WINDOW_MS,
): boolean {
  if (!startIso) {
    return false;
  }

  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) {
    return false;
  }

  const nowMs = now.getTime();
  const startMs = start.getTime();
  return startMs >= nowMs && startMs <= nowMs + windowMs;
}

export function floorParentContestLabel(contest: Pick<FloorParentContest, 'eventName' | 'skillLevelLabel' | 'divisionLabel'>): string {
  return [contest.eventName, contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
}

export function floorParentCheckinPath(contest: FloorParentContest): string {
  const params = new URLSearchParams();
  params.set('eventId', String(contest.eventId));
  if (contest.contestId !== null) {
    params.set('contestId', String(contest.contestId));
  }
  if (contest.contestItemId.trim() !== '') {
    params.set('itemId', contest.contestItemId.trim());
  }
  params.set('eventName', contest.eventName);
  params.set('skill', contest.skillLevelLabel);
  params.set('division', contest.divisionLabel);
  return `/floor-parent-checkin-single?${params.toString()}`;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  if (trimmed === '') {
    return null;
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function text(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

function contestItems(moreJson: unknown): Record<string, unknown>[] {
  const more = asRecord(parseJsonValue(moreJson));
  const contests = asRecord(more?.contests);
  const items = contests?.items;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.flatMap((entry) => {
    const record = asRecord(entry);
    return record ? [record] : [];
  });
}

function labelsMatch(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase() && left.trim() !== '';
}

type BuiltContest = FloorParentContest & {
  startsAtMs: number;
};

function findTwin(
  rows: BuiltContest[],
  eventId: number,
  more: Record<string, unknown>,
): BuiltContest | undefined {
  const itemId = text(more, 'id', 'contest_item_id', 'contestItemId');
  if (itemId !== '') {
    const byId = rows.find((row) => row.eventId === eventId && row.contestItemId === itemId);
    if (byId) {
      return byId;
    }
  }

  const skillKey = text(more, 'skill_level_key', 'skillLevelKey');
  const divisionKey = text(more, 'division_key', 'divisionKey');
  if (skillKey !== '' && divisionKey !== '') {
    const byKey = rows.filter(
      (row) =>
        row.eventId === eventId
        && row.skillLevelKey === skillKey
        && row.divisionKey === divisionKey,
    );
    if (byKey.length === 1) {
      return byKey[0];
    }
  }

  const skillLabel = text(more, 'skill_level_label', 'skillLevelLabel');
  const divisionLabel = text(more, 'division_label', 'divisionLabel', 'name');
  const byLabel = rows.filter(
    (row) =>
      row.eventId === eventId
      && labelsMatch(row.skillLevelLabel, skillLabel)
      && labelsMatch(row.divisionLabel, divisionLabel),
  );
  return byLabel.length === 1 ? byLabel[0] : undefined;
}

/**
 * Contests on events that start from now through the next 6 hours.
 * JSON contest items and contest-table rows for the same division are one button.
 * Order is event start, then contest name.
 */
export function selectFloorParentContests(input: {
  events: FloorParentEvent[];
  contests: FloorParentContestRow[];
  now?: Date;
}): FloorParentContest[] {
  const now = input.now ?? new Date();
  const rows: BuiltContest[] = [];
  const events = input.events.filter(
    (event) =>
      Number.isInteger(event.eventId)
      && eventStartsWithinNextWindow(event.startDate, now)
      && !eventIsCancelled(event.moreJson),
  );

  for (const event of events) {
    const startsAt = event.startDate ?? '';
    const startsAtMs = new Date(startsAt).getTime();
    const eventName = event.name.trim();

    for (const item of contestItems(event.moreJson)) {
      const skillLevelLabel = text(item, 'skill_level_label', 'skillLevelLabel');
      const divisionLabel = text(item, 'division_label', 'divisionLabel');
      const contestItemId = text(item, 'id');
      if (skillLevelLabel === '' && divisionLabel === '' && contestItemId === '') {
        continue;
      }

      rows.push({
        id: `event-${event.eventId}-json-${contestItemId || rows.length}`,
        eventId: event.eventId,
        eventName,
        skillLevelLabel,
        divisionLabel,
        contestId: null,
        contestItemId,
        skillLevelKey: text(item, 'skill_level_key', 'skillLevelKey'),
        divisionKey: text(item, 'division_key', 'divisionKey'),
        startsAt,
        startsAtMs,
      });
    }

    for (const contest of input.contests) {
      if (contest.eventId !== event.eventId) {
        continue;
      }

      const more = asRecord(parseJsonValue(contest.moreJson)) ?? {};
      const twin = findTwin(rows, event.eventId, more);
      if (twin) {
        if (twin.contestId === null) {
          twin.contestId = contest.contestId;
        }
        continue;
      }

      const skillLevelLabel = text(more, 'skill_level_label', 'skillLevelLabel');
      const divisionLabel =
        text(more, 'division_label', 'divisionLabel', 'name')
        || contest.eventTypeCode?.trim()
        || '';
      if (skillLevelLabel === '' && divisionLabel === '') {
        continue;
      }

      rows.push({
        id: `event-${event.eventId}-contest-${contest.contestId}`,
        eventId: event.eventId,
        eventName,
        skillLevelLabel,
        divisionLabel,
        contestId: contest.contestId,
        contestItemId: text(more, 'id', 'contest_item_id', 'contestItemId'),
        skillLevelKey: text(more, 'skill_level_key', 'skillLevelKey'),
        divisionKey: text(more, 'division_key', 'divisionKey'),
        startsAt,
        startsAtMs,
      });
    }
  }

  rows.sort((left, right) => {
    if (left.startsAtMs !== right.startsAtMs) {
      return left.startsAtMs - right.startsAtMs;
    }
    const byName = floorParentContestLabel(left).localeCompare(floorParentContestLabel(right));
    if (byName !== 0) {
      return byName;
    }
    return left.eventId - right.eventId;
  });

  return rows.map(({ startsAtMs: _startsAtMs, ...contest }) => contest);
}
