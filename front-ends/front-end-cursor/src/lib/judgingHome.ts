/** Events whose start is within 6 hours before or after now. */
export const JUDGING_WINDOW_MS = 6 * 60 * 60 * 1000;

const JUDGE_ROLE_CODES = new Set(['JUDGE', 'HEAD_JUDGE']);

export type JudgingUserIdentity = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type JudgingHomeContest = {
  id: string;
  eventId: number;
  eventName: string;
  skillLevelLabel: string;
  divisionLabel: string;
  contestId: number | null;
  contestItemId: string;
};

export type JudgingHomeEvent = {
  eventId: number;
  name: string;
  startDate: string | null;
  moreJson: unknown;
};

export type JudgingHomeContestRow = {
  contestId: number;
  eventId: number;
  eventTypeCode: string | null;
  moreJson: unknown;
  staffJson: unknown;
};

type BuiltContest = JudgingHomeContest & {
  skillLevelKey: string;
  divisionKey: string;
};

export function eventInJudgingWindow(
  startIso: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!startIso) {
    return false;
  }

  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) {
    return false;
  }

  const nowMs = now.getTime();
  return start.getTime() >= nowMs - JUDGING_WINDOW_MS && start.getTime() <= nowMs + JUDGING_WINDOW_MS;
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
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
  }

  return '';
}

function staffPeople(moreJson: unknown): Record<string, unknown>[] {
  const staff = asRecord(asRecord(moreJson)?.staff);
  const people = staff?.people;
  if (!Array.isArray(people)) {
    return [];
  }

  return people.flatMap((entry) => {
    const person = asRecord(entry);
    return person ? [person] : [];
  });
}

function contestItems(moreJson: unknown): Record<string, unknown>[] {
  const contests = asRecord(asRecord(moreJson)?.contests);
  if (!contests || contests.has_contests === false || contests.hasContests === false) {
    return [];
  }

  const items = contests.items;
  if (!Array.isArray(items)) {
    return [];
  }

  return items.flatMap((entry) => {
    const item = asRecord(entry);
    return item ? [item] : [];
  });
}

export function staffPersonMatchesUser(
  person: Record<string, unknown>,
  user: JudgingUserIdentity,
): boolean {
  const storedUserId = text(person, 'user_id', 'userId');
  if (storedUserId !== '') {
    return storedUserId === String(user.userId);
  }

  const username = text(person, 'username');
  if (username !== '' && username.toLowerCase() === user.username.trim().toLowerCase()) {
    return true;
  }

  const firstName = user.firstName.trim();
  const lastName = user.lastName.trim();
  if (firstName === '' || lastName === '') {
    return false;
  }

  return (
    text(person, 'first_name', 'firstName').toLowerCase() === firstName.toLowerCase()
    && text(person, 'last_name', 'lastName').toLowerCase() === lastName.toLowerCase()
  );
}

function hasJudgeRole(person: Record<string, unknown>): boolean {
  const primary = text(person, 'primary_role_code', 'primaryRoleCode').toUpperCase();
  const secondary = text(person, 'secondary_role_code', 'secondaryRoleCode').toUpperCase();
  return JUDGE_ROLE_CODES.has(primary) || JUDGE_ROLE_CODES.has(secondary);
}

function stringIds(value: unknown): string[] {
  const parsed = parseJsonValue(value);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.flatMap((entry) => {
    if (typeof entry === 'string' && entry.trim() !== '') {
      return [entry.trim()];
    }

    const record = asRecord(entry);
    if (!record) {
      return [];
    }

    const id = text(record, 'staff_id', 'staffId', 'id');
    return id === '' ? [] : [id];
  });
}

function assignedStaffIds(record: Record<string, unknown>): string[] {
  const head = text(record, 'head_judge_staff_id', 'headJudgeStaffId');
  const scoring = stringIds(record.scoring_judge_staff_ids ?? record.scoringJudgeStaffIds);
  return head === '' ? scoring : [head, ...scoring];
}

function staffJsonAttachesUser(staffJson: unknown, user: JudgingUserIdentity): boolean {
  const parsed = parseJsonValue(staffJson);
  if (!Array.isArray(parsed)) {
    return false;
  }

  return parsed.some((entry) => {
    const record = asRecord(entry);
    if (!record || !staffPersonMatchesUser(record, user)) {
      return false;
    }

    if (hasJudgeRole(record)) {
      return true;
    }

    const role = text(record, 'role', 'role_code', 'roleCode').toUpperCase();
    return JUDGE_ROLE_CODES.has(role);
  });
}

function userOnEvent(
  moreJson: unknown,
  user: JudgingUserIdentity,
): { staffIds: string[]; eventJudge: boolean } {
  const matches = staffPeople(moreJson).filter((person) => staffPersonMatchesUser(person, user));
  return {
    staffIds: matches.flatMap((person) => {
      const id = text(person, 'id');
      return id === '' ? [] : [id];
    }),
    eventJudge: matches.some((person) => hasJudgeRole(person)),
  };
}

function intersects(left: string[], right: string[]): boolean {
  if (left.length === 0 || right.length === 0) {
    return false;
  }

  const ids = new Set(left);
  return right.some((id) => ids.has(id));
}

function labelsMatch(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase() && left.trim() !== '';
}

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
 * Contests in the 6-hour window that this user judges.
 * Attachment is a scoring-judge or head-judge assignment, or a JUDGE / HEAD_JUDGE
 * staff role on the event. An app role alone does not add contests.
 */
export function selectJudgingHomeContests(input: {
  events: JudgingHomeEvent[];
  contests: JudgingHomeContestRow[];
  user: JudgingUserIdentity;
  now?: Date;
}): JudgingHomeContest[] {
  const now = input.now ?? new Date();
  const rows: BuiltContest[] = [];
  const events = input.events.filter(
    (event) => Number.isInteger(event.eventId) && eventInJudgingWindow(event.startDate, now),
  );

  for (const event of events) {
    const { staffIds, eventJudge } = userOnEvent(event.moreJson, input.user);
    const eventName = event.name.trim();

    for (const item of contestItems(event.moreJson)) {
      const assigned = assignedStaffIds(item);
      if (!eventJudge && !intersects(staffIds, assigned)) {
        continue;
      }

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
      });
    }

    for (const contest of input.contests) {
      if (contest.eventId !== event.eventId) {
        continue;
      }

      const more = asRecord(parseJsonValue(contest.moreJson)) ?? {};
      const assigned = [
        ...assignedStaffIds(more),
        ...stringIds(contest.staffJson),
      ];
      const attached =
        eventJudge
        || intersects(staffIds, assigned)
        || staffJsonAttachesUser(contest.staffJson, input.user);
      if (!attached) {
        continue;
      }

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
      });
    }
  }

  return rows.map(({ skillLevelKey: _skillLevelKey, divisionKey: _divisionKey, ...contest }) => contest);
}
