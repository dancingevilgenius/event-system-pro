import { eventIsCancelled } from './eventCancelled';
import { judgeHasSubmittedBallot } from './judgingFinalsEntries';

/** Events whose start is within 6 hours before or after now. */
export const JUDGING_WINDOW_MS = 6 * 60 * 60 * 1000;

/** App-role code or display label (`JUDGE` / `Judge`). Head Judge stays its own code. */
function isJudgeAppRole(role: string): boolean {
  return role.trim().toUpperCase().replace(/[\s-]+/g, '_') === 'JUDGE';
}

/** Separate from Judge: `HEAD_JUDGE` / `Head Judge`. */
function isHeadJudgeAppRole(role: string): boolean {
  return role.trim().toUpperCase().replace(/[\s-]+/g, '_') === 'HEAD_JUDGE';
}

/**
 * Home shows Judging when the signed-in user has the Judge or Head Judge app role.
 * A contest inside the 6-hour window is not required for that button. Staff who are
 * assigned to a contest in the window still see the button without those app roles.
 * Judging Home's contest list stays limited to that window.
 */
export function showsJudgingHomeButton(input: {
  appRoles?: readonly string[] | null;
  contestsInWindow?: number;
}): boolean {
  const roles = input.appRoles ?? [];
  if (roles.some((role) => isJudgeAppRole(role) || isHeadJudgeAppRole(role))) {
    return true;
  }

  return (input.contestsInWindow ?? 0) > 0;
}

const JUDGE_ROLE_CODES = new Set(['JUDGE', 'HEAD_JUDGE']);
const EVENT_LEAD_ROLE_CODES = new Set(['EVENT_DIRECTOR', 'EVENT_MANAGER']);
const ROSTER_KEYS = [
  'registrants',
  'registrations',
  'competitors',
  'competitors_json',
  'entries',
  'contest_entries',
  'roster',
];
const DANCE_ROLE_KEYS = [
  'role',
  'dance_role',
  'contest_role',
  'competitor_role',
  'primary_role',
  'primary-role',
];

export type JudgingUserIdentity = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  /** Signed-in app roles. Event-staff roles are read from the event, not this list. */
  appRoles?: readonly string[];
};

export type RegisteredDancerCounts = {
  leaderCount: number;
  followerCount: number;
};

export type RosterRoleCounts = RegisteredDancerCounts & {
  leadersCheckedIn: number;
  followersCheckedIn: number;
};

export type CheckinIconTone = 'none' | 'partial' | 'complete';

export type JudgingHomeContest = {
  id: string;
  eventId: number;
  eventName: string;
  skillLevelLabel: string;
  divisionLabel: string;
  contestId: number | null;
  contestItemId: string;
  skillLevelKey: string;
  divisionKey: string;
  leaderCount: number;
  followerCount: number;
  leadersCheckedIn: number;
  followersCheckedIn: number;
  /** Missing `Locked` is locked. Only boolean false is unlocked. */
  locked: boolean;
  /** Head Judge or Admin may change `Locked` on this contest. */
  canToggleLock: boolean;
  /** This signed-in judge already stored a ballot for the contest. */
  viewerSubmitted?: boolean;
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
  competitorsJson?: unknown;
  resultsJson?: unknown;
};

type BuiltContest = JudgingHomeContest & {
  skillLevelKey: string;
  divisionKey: string;
  hasRosterArrays: boolean;
};

type EventAttachment = {
  staffIds: string[];
  eventJudge: boolean;
  eventHeadJudge: boolean;
  eventLead: boolean;
  attached: boolean;
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

function appRoleSet(user: JudgingUserIdentity): Set<string> {
  return new Set((user.appRoles ?? []).map((role) => role.trim().toUpperCase()).filter((role) => role !== ''));
}

function hasAppRole(user: JudgingUserIdentity, role: string): boolean {
  return appRoleSet(user).has(role);
}

function roleCodes(person: Record<string, unknown>): string[] {
  return [text(person, 'primary_role_code', 'primaryRoleCode'), text(person, 'secondary_role_code', 'secondaryRoleCode')]
    .map((role) => role.toUpperCase())
    .filter((role) => role !== '');
}

function hasRoleCode(person: Record<string, unknown>, roles: ReadonlySet<string>): boolean {
  return roleCodes(person).some((role) => roles.has(role));
}

function hasJudgeRole(person: Record<string, unknown>): boolean {
  return hasRoleCode(person, JUDGE_ROLE_CODES);
}

function zeroCounts(): RosterRoleCounts {
  return { leaderCount: 0, followerCount: 0, leadersCheckedIn: 0, followersCheckedIn: 0 };
}

function addCounts(left: RosterRoleCounts, right: RosterRoleCounts): RosterRoleCounts {
  return {
    leaderCount: left.leaderCount + right.leaderCount,
    followerCount: left.followerCount + right.followerCount,
    leadersCheckedIn: left.leadersCheckedIn + right.leadersCheckedIn,
    followersCheckedIn: left.followersCheckedIn + right.followersCheckedIn,
  };
}

function personCheckedIn(record: Record<string, unknown> | null): boolean {
  return record?.checked_in === true || record?.checkedIn === true;
}

function checkedInList(list: unknown[]): number {
  return list.reduce<number>((total, entry) => total + (personCheckedIn(asRecord(entry)) ? 1 : 0), 0);
}

function danceRole(record: Record<string, unknown>): 'leader' | 'follower' | null {
  for (const key of DANCE_ROLE_KEYS) {
    const value = record[key];
    if (typeof value !== 'string') {
      continue;
    }
    const role = value.trim().toLowerCase();
    if (role === 'leader' || role === 'lead') {
      return 'leader';
    }
    if (role === 'follower' || role === 'follow') {
      return 'follower';
    }
  }
  return null;
}

function countRosterNode(value: unknown): RosterRoleCounts {
  const record = asRecord(value);
  if (!record) {
    return zeroCounts();
  }

  const leaderRecord = asRecord(record.leader);
  const followerRecord = asRecord(record.follower);
  if (leaderRecord || followerRecord) {
    return {
      leaderCount: leaderRecord ? 1 : 0,
      followerCount: followerRecord ? 1 : 0,
      leadersCheckedIn: personCheckedIn(leaderRecord) ? 1 : 0,
      followersCheckedIn: personCheckedIn(followerRecord) ? 1 : 0,
    };
  }

  if (Array.isArray(record.leaders) || Array.isArray(record.followers)) {
    const leaders = Array.isArray(record.leaders) ? record.leaders : [];
    const followers = Array.isArray(record.followers) ? record.followers : [];
    return {
      leaderCount: leaders.length,
      followerCount: followers.length,
      leadersCheckedIn: checkedInList(leaders),
      followersCheckedIn: checkedInList(followers),
    };
  }

  const role = danceRole(record);
  if (role === 'leader') {
    return {
      leaderCount: 1,
      followerCount: 0,
      leadersCheckedIn: personCheckedIn(record) ? 1 : 0,
      followersCheckedIn: 0,
    };
  }
  if (role === 'follower') {
    return {
      leaderCount: 0,
      followerCount: 1,
      leadersCheckedIn: 0,
      followersCheckedIn: personCheckedIn(record) ? 1 : 0,
    };
  }

  return ROSTER_KEYS.reduce(
    (totals, key) =>
      record[key] === undefined ? totals : addCounts(totals, registeredDancerCounts(record[key])),
    zeroCounts(),
  );
}

/** Leader and follower totals stored on a contest item or public.contest competitors. */
export function registeredDancerCounts(value: unknown): RosterRoleCounts {
  const parsed = parseJsonValue(value);
  if (Array.isArray(parsed)) {
    return parsed.reduce(
      (totals, entry) => addCounts(totals, countRosterNode(entry)),
      zeroCounts(),
    );
  }

  return countRosterNode(parsed);
}

export function formatRegisteredCounts(leaderCount: number, followerCount: number): string {
  return `L:${leaderCount} F:${followerCount}`;
}

/** Gray until someone is checked in, yellow after the first, green when every competitor is checked in. */
export function checkinIconTone(contest: {
  leaderCount: number;
  followerCount: number;
  leadersCheckedIn: number;
  followersCheckedIn: number;
}): CheckinIconTone {
  const registered = contest.leaderCount + contest.followerCount;
  const checkedIn = contest.leadersCheckedIn + contest.followersCheckedIn;
  if (registered > 0 && checkedIn >= registered) {
    return 'complete';
  }
  if (checkedIn > 0) {
    return 'partial';
  }
  return 'none';
}

/** Missing `Locked` stays locked. Only a boolean false unlocks scoring. */
export function contestLockedFlag(value: unknown): boolean {
  const record = asRecord(parseJsonValue(value));
  return record?.Locked !== false;
}

function hasRosterArrays(record: Record<string, unknown>): boolean {
  return Array.isArray(record.leaders) || Array.isArray(record.followers);
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

function userOnEvent(moreJson: unknown, user: JudgingUserIdentity): EventAttachment {
  const matches = staffPeople(moreJson).filter((person) => staffPersonMatchesUser(person, user));
  return {
    staffIds: matches.flatMap((person) => {
      const id = text(person, 'id');
      return id === '' ? [] : [id];
    }),
    eventJudge: matches.some((person) => hasJudgeRole(person)),
    eventHeadJudge: matches.some((person) => hasRoleCode(person, new Set(['HEAD_JUDGE']))),
    eventLead: matches.some((person) => hasRoleCode(person, EVENT_LEAD_ROLE_CODES)),
    attached: matches.length > 0,
  };
}

function viewerSubmittedScores(
  user: JudgingUserIdentity,
  staffIds: readonly string[],
  submissions: readonly unknown[],
): boolean {
  return judgeHasSubmittedBallot({
    submissions,
    userId: user.userId,
    username: user.username,
    staffIds,
  });
}

function seesEveryContest(user: JudgingUserIdentity, attachment: EventAttachment): boolean {
  if (hasAppRole(user, 'ADMIN')) {
    return true;
  }
  if (attachment.eventLead) {
    return true;
  }
  if (
    attachment.attached
    && (hasAppRole(user, 'EVENT_DIRECTOR') || hasAppRole(user, 'EVENT_MANAGER'))
  ) {
    return true;
  }
  return attachment.eventJudge;
}

function isContestHeadJudge(record: Record<string, unknown>, staffIds: string[]): boolean {
  const headId = text(record, 'head_judge_staff_id', 'headJudgeStaffId');
  return headId !== '' && staffIds.includes(headId);
}

function staffJsonIsHeadJudge(staffJson: unknown, user: JudgingUserIdentity): boolean {
  const parsed = parseJsonValue(staffJson);
  if (!Array.isArray(parsed)) {
    return false;
  }

  return parsed.some((entry) => {
    const record = asRecord(entry);
    if (!record || !staffPersonMatchesUser(record, user)) {
      return false;
    }

    if (roleCodes(record).includes('HEAD_JUDGE')) {
      return true;
    }

    return text(record, 'role', 'role_code', 'roleCode').toUpperCase() === 'HEAD_JUDGE';
  });
}

function canToggleContestLock(
  user: JudgingUserIdentity,
  attachment: EventAttachment,
  record: Record<string, unknown>,
  staffJson: unknown,
): boolean {
  if (hasAppRole(user, 'ADMIN') || hasAppRole(user, 'HEAD_JUDGE')) {
    return true;
  }
  if (attachment.eventHeadJudge || isContestHeadJudge(record, attachment.staffIds)) {
    return true;
  }
  return staffJsonIsHeadJudge(staffJson, user);
}

function tableRosterCounts(contest: JudgingHomeContestRow): RosterRoleCounts {
  const more = asRecord(parseJsonValue(contest.moreJson));
  if (more && hasRosterArrays(more)) {
    return registeredDancerCounts(more);
  }

  const competitors = registeredDancerCounts(contest.competitorsJson);
  if (competitors.leaderCount + competitors.followerCount > 0) {
    return competitors;
  }

  return registeredDancerCounts(contest.moreJson);
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
 * Contests in the 6-hour window this user may open from Judging Home.
 * Judges see contests they are attached to (scoring or head judge assignment, or a
 * JUDGE / HEAD_JUDGE staff role). Admins see every contest in the window. Event
 * Directors and Event Managers see contests on events where they hold that staff
 * role, or where an app role of that kind is paired with any staff attachment.
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
    (event) =>
      Number.isInteger(event.eventId)
      && eventInJudgingWindow(event.startDate, now)
      && !eventIsCancelled(event.moreJson),
  );

  for (const event of events) {
    const attachment = userOnEvent(event.moreJson, input.user);
    const includeAll = seesEveryContest(input.user, attachment);
    const eventName = event.name.trim();

    for (const item of contestItems(event.moreJson)) {
      const assigned = assignedStaffIds(item);
      if (!includeAll && !intersects(attachment.staffIds, assigned)) {
        continue;
      }

      const skillLevelLabel = text(item, 'skill_level_label', 'skillLevelLabel');
      const divisionLabel = text(item, 'division_label', 'divisionLabel');
      const contestItemId = text(item, 'id');
      if (skillLevelLabel === '' && divisionLabel === '' && contestItemId === '') {
        continue;
      }

      const counts = registeredDancerCounts(item);
      rows.push({
        id: `event-${event.eventId}-json-${contestItemId || rows.length}`,
        eventId: event.eventId,
        eventName,
        skillLevelLabel,
        divisionLabel,
        contestId: null,
        contestItemId,
        leaderCount: counts.leaderCount,
        followerCount: counts.followerCount,
        leadersCheckedIn: counts.leadersCheckedIn,
        followersCheckedIn: counts.followersCheckedIn,
        locked: contestLockedFlag(item),
        canToggleLock: canToggleContestLock(input.user, attachment, item, null),
        viewerSubmitted: viewerSubmittedScores(input.user, attachment.staffIds, [item.judge_submissions]),
        skillLevelKey: text(item, 'skill_level_key', 'skillLevelKey'),
        divisionKey: text(item, 'division_key', 'divisionKey'),
        hasRosterArrays: hasRosterArrays(item),
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
        includeAll
        || intersects(attachment.staffIds, assigned)
        || staffJsonAttachesUser(contest.staffJson, input.user);
      if (!attached) {
        continue;
      }

      const twin = findTwin(rows, event.eventId, more);
      if (twin) {
        if (twin.contestId === null) {
          twin.contestId = contest.contestId;
        }
        if (!twin.hasRosterArrays) {
          const tableCounts = tableRosterCounts(contest);
          if (tableCounts.leaderCount + tableCounts.followerCount > twin.leaderCount + twin.followerCount) {
            twin.leaderCount = tableCounts.leaderCount;
            twin.followerCount = tableCounts.followerCount;
            twin.leadersCheckedIn = tableCounts.leadersCheckedIn;
            twin.followersCheckedIn = tableCounts.followersCheckedIn;
          }
        }
        if (!twin.canToggleLock) {
          twin.canToggleLock = canToggleContestLock(input.user, attachment, more, contest.staffJson);
        }
        if (!twin.viewerSubmitted) {
          const results = asRecord(parseJsonValue(contest.resultsJson));
          twin.viewerSubmitted = viewerSubmittedScores(input.user, attachment.staffIds, [
            more.judge_submissions,
            results?.judge_submissions,
          ]);
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

      const counts = tableRosterCounts(contest);
      const results = asRecord(parseJsonValue(contest.resultsJson));
      rows.push({
        id: `event-${event.eventId}-contest-${contest.contestId}`,
        eventId: event.eventId,
        eventName,
        skillLevelLabel,
        divisionLabel,
        contestId: contest.contestId,
        contestItemId: text(more, 'id', 'contest_item_id', 'contestItemId'),
        leaderCount: counts.leaderCount,
        followerCount: counts.followerCount,
        leadersCheckedIn: counts.leadersCheckedIn,
        followersCheckedIn: counts.followersCheckedIn,
        locked: contestLockedFlag(more),
        canToggleLock: canToggleContestLock(input.user, attachment, more, contest.staffJson),
        viewerSubmitted: viewerSubmittedScores(input.user, attachment.staffIds, [
          more.judge_submissions,
          results?.judge_submissions,
        ]),
        skillLevelKey: text(more, 'skill_level_key', 'skillLevelKey'),
        divisionKey: text(more, 'division_key', 'divisionKey'),
        hasRosterArrays: hasRosterArrays(more) || hasRosterArrays(asRecord(parseJsonValue(contest.competitorsJson)) ?? {}),
      });
    }
  }

  return rows.map(({ hasRosterArrays: _hasRosterArrays, ...contest }) => contest);
}
