import type {
  EventContestDraft,
  EventContestsState,
  EventRoleAssignment,
  EventStaffMember,
  EventStaffState,
  ScoringJudgeCount,
} from '../api/postgrest';
import {
  earlyBirdEnabledFromStored,
  savedEarlyBirdName,
  type EarlyBirdWindow,
} from './eventEarlyBirdDates';
import type { EventDatesFormState, ScheduleTimeBlockDay } from './eventDates';
import type { EventLocationJson, EventVenueContactJson } from './eventLocation';
import type { EventDiscountFormState } from './eventDiscounts';
import type { EventPassFormState } from './eventPasses';

type SectionStatus = 'not_started' | 'in_progress' | 'finalized';

/** Database identity columns and client-generated row ids are not part of an event export. */
const GENERATED_ID_KEYS = new Set([
  'id',
  'user_id',
  'userId',
  'event_id',
  'eventId',
  'attendee_id',
  'attendeeId',
  'staffId',
  'staff_id',
  'headJudgeStaffId',
  'head_judge_staff_id',
  'scoringJudgeStaffIds',
  'scoring_judge_staff_ids',
]);

export type EventFormPassSnapshot = {
  hasPasses: boolean;
  passes: EventPassFormState[];
};

export type EventFormDiscountSnapshot = {
  discounts: EventDiscountFormState[];
};

export type EventFormEarlyBirdSnapshot = {
  mode: 'none' | 'create';
  windows: EarlyBirdWindow[];
};

export type EventFormStaffSnapshot = {
  hasStaff: boolean;
  members: EventStaffMember[];
  registrationById: Record<string, { status: string; username: string | null }>;
};

export type EventFormContestsSnapshot = {
  hasContests: boolean;
  contests: EventContestDraft[];
};

export type EventFormExportSnapshots = {
  passes?: EventFormPassSnapshot;
  discounts?: EventFormDiscountSnapshot;
  roles?: EventRoleAssignment[];
  earlyBird?: EventFormEarlyBirdSnapshot;
  location?: EventLocationJson;
  contactVenue?: EventVenueContactJson;
  contests?: EventFormContestsSnapshot;
  staff?: EventFormStaffSnapshot;
};

export type ImportantContactExport = {
  name: string;
  email: string;
  phone: string;
};

export const DEFAULT_IMPORTANT_CONTACT: ImportantContactExport = {
  name: 'Carlos Garcia',
  email: 'swingcarlos@alum.mit.edu',
  phone: '6302201111',
};

export type EventFormExportSource = {
  eventName: string;
  eventGroupCode: string;
  dates: EventDatesFormState;
  sectionStatuses: Record<string, SectionStatus>;
  sectionOrder: string[];
  scheduleDays: ScheduleTimeBlockDay[];
  importantContact: ImportantContactExport;
  snapshots: EventFormExportSnapshots;
};

function staffIndex(members: EventStaffMember[], staffId: string): number | null {
  if (staffId.trim() === '') {
    return null;
  }

  const index = members.findIndex((member) => member.id === staffId);
  return index >= 0 ? index : null;
}

function omitGeneratedIdentityFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => omitGeneratedIdentityFields(entry));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const next: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (GENERATED_ID_KEYS.has(key)) {
      continue;
    }
    next[key] = omitGeneratedIdentityFields(entry);
  }
  return next;
}

function exportStaff(staff: EventFormStaffSnapshot | undefined) {
  if (!staff) {
    return null;
  }

  return {
    hasStaff: staff.hasStaff,
    members: staff.members.map((member) => {
      const match = staff.registrationById[member.id];
      return {
        firstName: member.firstName,
        lastName: member.lastName,
        primaryRoleCode: member.primaryRoleCode,
        secondaryRoleCode: member.secondaryRoleCode,
        registration: match
          ? {
              status: match.status,
              username: match.username,
            }
          : null,
      };
    }),
  };
}

function exportContests(
  contests: EventFormContestsSnapshot | undefined,
  members: EventStaffMember[],
) {
  if (!contests) {
    return null;
  }

  return {
    hasContests: contests.hasContests,
    contests: contests.contests.map((contest) => ({
      divisionKey: contest.divisionKey,
      divisionLabel: contest.divisionLabel,
      skillLevelKey: contest.skillLevelKey,
      skillLevelLabel: contest.skillLevelLabel,
      headJudgeIndex: staffIndex(members, contest.headJudgeStaffId),
      scoringJudgeCount: contest.scoringJudgeCount,
      scoringJudgeIndexes: contest.scoringJudgeStaffIds.map((staffId) => staffIndex(members, staffId)),
    })),
  };
}

/** Name written into an export so a later import opens as a clone. */
export function exportedEventName(eventName: string): string {
  const name = eventName.trim();
  return name === '' ? 'Clone -' : `Clone - ${name}`;
}

/** Pretty JSON for the create-event form, without generated identity values. */
export function formatEventFormExport(source: EventFormExportSource): string {
  const members = source.snapshots.staff?.members ?? [];
  const payload = omitGeneratedIdentityFields({
    eventName: exportedEventName(source.eventName),
    eventGroupCode: source.eventGroupCode,
    dates: source.dates,
    sectionStatuses: source.sectionStatuses,
    sectionOrder: source.sectionOrder.filter((sectionId) => sectionId !== 'export_import'),
    passes: source.snapshots.passes
      ? {
          hasPasses: source.snapshots.passes.hasPasses,
          passes: source.snapshots.passes.passes.map((pass) => ({
            name: pass.name,
            cost: pass.cost,
            description: pass.description,
          })),
        }
      : null,
    roles: source.snapshots.roles ?? null,
    earlyBirdDates: source.snapshots.earlyBird
      ? {
          mode: source.snapshots.earlyBird.mode,
          windows: source.snapshots.earlyBird.windows.map((window, index) => ({
            name: savedEarlyBirdName(window.name, index),
            enabled: window.enabled,
            startDate: window.startDate,
            endDate: window.endDate,
          })),
        }
      : null,
    location: source.snapshots.location ?? null,
    contactVenue: source.snapshots.contactVenue ?? null,
    importantContacts: [source.importantContact],
    contests: exportContests(source.snapshots.contests, members),
    schedule: {
      status: source.sectionStatuses.schedule ?? 'not_started',
      days: source.scheduleDays.map((day) => ({ title: day.title })),
    },
    staff: exportStaff(source.snapshots.staff),
    discounts: source.snapshots.discounts
      ? source.snapshots.discounts.discounts.map((discount) => ({
          name: discount.name,
          valueKind: discount.valueKind,
          value: discount.value,
          description: discount.description,
        }))
      : null,
    volunteers: null,
  });

  return JSON.stringify(payload, null, 2);
}

export type ParsedEventFormImport = {
  eventName: string;
  dates: EventDatesFormState;
  sectionStatuses: Record<string, SectionStatus>;
  sectionOrder: string[];
  passes: EventFormPassSnapshot;
  roles: EventRoleAssignment[];
  earlyBird: EventFormEarlyBirdSnapshot;
  location: EventLocationJson;
  contactVenue: EventVenueContactJson;
  staff: {
    hasStaff: boolean;
    members: Array<Omit<EventStaffMember, 'id'>>;
  };
  contests: {
    hasContests: boolean;
    contests: Array<{
      divisionKey: string;
      divisionLabel: string;
      skillLevelKey: string;
      skillLevelLabel: string;
      headJudgeIndex: number | null;
      scoringJudgeCount: ScoringJudgeCount | null;
      scoringJudgeIndexes: Array<number | null>;
    }>;
  };
  discounts: EventDiscountFormState[];
};

export type AppliedEventImport = {
  token: number;
  eventName: string;
  dates: EventDatesFormState;
  sectionStatuses: Record<string, SectionStatus>;
  sectionOrder: string[];
  passes: EventFormPassSnapshot;
  roles: EventRoleAssignment[];
  earlyBird: EventFormEarlyBirdSnapshot;
  location: EventLocationJson;
  contactVenue: EventVenueContactJson;
  staff: EventStaffState;
  contests: EventContestsState;
  discounts: EventDiscountFormState[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asSectionStatus(value: unknown): SectionStatus | null {
  return value === 'not_started' || value === 'in_progress' || value === 'finalized' ? value : null;
}

function asDateMode(value: unknown): EventDatesFormState['mode'] {
  return value === 'multi_day' ? 'multi_day' : 'single_day';
}

function asEarlyBirdMode(value: unknown): EventFormEarlyBirdSnapshot['mode'] {
  return value === 'create' ? 'create' : 'none';
}

function asJudgeCount(value: unknown): ScoringJudgeCount | null {
  return value === 3 || value === 5 || value === 7 ? value : null;
}

function asIndex(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : null;
}

function asDiscountValueKind(value: unknown): EventDiscountFormState['valueKind'] {
  return value === 'amount' ? 'amount' : 'percent';
}

function parseDiscounts(value: unknown): EventDiscountFormState[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    const row = asRecord(entry);
    return {
      id: crypto.randomUUID(),
      name: asString(row?.name),
      valueKind: asDiscountValueKind(row?.valueKind),
      value: asString(row?.value),
      description: asString(row?.description),
    };
  });
}

export function parseEventFormImport(
  raw: string,
): { ok: true; document: ParsedEventFormImport } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, error: 'Event JSON is not valid JSON.' };
  }

  const root = asRecord(parsed);
  if (!root) {
    return { ok: false, error: 'Event JSON must be an object.' };
  }

  const dates = asRecord(root.dates);
  const passes = asRecord(root.passes);
  const earlyBird = asRecord(root.earlyBirdDates);
  const location = asRecord(root.location);
  const contact = asRecord(root.contactVenue);
  const staff = asRecord(root.staff);
  const contests = asRecord(root.contests);
  const statuses = asRecord(root.sectionStatuses);

  if (!dates || !passes || !earlyBird || !location || !contact || !staff || !contests) {
    return { ok: false, error: 'Event JSON is missing form sections.' };
  }

  const sectionStatuses: Record<string, SectionStatus> = {};
  if (statuses) {
    for (const [key, value] of Object.entries(statuses)) {
      const status = asSectionStatus(value);
      if (status) {
        sectionStatuses[key] = status;
      }
    }
  }

  const passRows = Array.isArray(passes.passes) ? passes.passes : [];
  const roleRows = Array.isArray(root.roles) ? root.roles : [];
  const windowRows = Array.isArray(earlyBird.windows) ? earlyBird.windows : [];
  const staffRows = Array.isArray(staff.members) ? staff.members : [];
  const contestRows = Array.isArray(contests.contests) ? contests.contests : [];

  return {
    ok: true,
    document: {
      eventName: asString(root.eventName),
      dates: {
        mode: asDateMode(dates.mode),
        startDateTime: asString(dates.startDateTime),
        endDateTime: asString(dates.endDateTime),
      },
      sectionStatuses,
      sectionOrder: Array.isArray(root.sectionOrder)
        ? root.sectionOrder.filter((entry): entry is string => typeof entry === 'string')
        : [],
      passes: {
        hasPasses: asBoolean(passes.hasPasses),
        passes: passRows.map((entry) => {
          const row = asRecord(entry);
          return {
            id: crypto.randomUUID(),
            name: asString(row?.name),
            cost: asString(row?.cost),
            description: asString(row?.description),
          };
        }),
      },
      roles: roleRows.flatMap((entry) => {
        const row = asRecord(entry);
        const roleCode = asString(row?.roleCode).trim();
        if (!row || roleCode === '') {
          return [];
        }
        return [
          {
            roleCode,
            used: asBoolean(row.used),
            label: asString(row.label),
            count: typeof row.count === 'number' ? row.count : null,
          },
        ];
      }),
      earlyBird: {
        mode: asEarlyBirdMode(earlyBird.mode),
        windows: windowRows.map((entry, index) => {
          const row = asRecord(entry);
          const startDate = asNullableString(row?.startDate);
          const endDate = asNullableString(row?.endDate);
          return {
            id: crypto.randomUUID(),
            name: savedEarlyBirdName(asString(row?.name), index),
            enabled: earlyBirdEnabledFromStored(row?.enabled, startDate, endDate),
            startDate,
            endDate,
          };
        }),
      },
      location: {
        venue: asString(location.venue),
        street: asString(location.street),
        city: asString(location.city),
        state: asString(location.state),
        country: asString(location.country),
        map_url: asString(location.map_url),
      },
      contactVenue: {
        website: asString(contact.website),
        phone: asString(contact.phone),
        social_media_1: asString(contact.social_media_1),
        social_media_2: asString(contact.social_media_2),
        social_media_3: asString(contact.social_media_3),
      },
      staff: {
        hasStaff: asBoolean(staff.hasStaff),
        members: staffRows.map((entry) => {
          const row = asRecord(entry);
          return {
            firstName: asString(row?.firstName),
            lastName: asString(row?.lastName),
            primaryRoleCode: asString(row?.primaryRoleCode),
            secondaryRoleCode: asString(row?.secondaryRoleCode),
          };
        }),
      },
      contests: {
        hasContests: asBoolean(contests.hasContests),
        contests: contestRows.map((entry) => {
          const row = asRecord(entry);
          const indexes = Array.isArray(row?.scoringJudgeIndexes) ? row.scoringJudgeIndexes : [];
          return {
            divisionKey: asString(row?.divisionKey),
            divisionLabel: asString(row?.divisionLabel),
            skillLevelKey: asString(row?.skillLevelKey),
            skillLevelLabel: asString(row?.skillLevelLabel),
            headJudgeIndex: asIndex(row?.headJudgeIndex),
            scoringJudgeCount: asJudgeCount(row?.scoringJudgeCount),
            scoringJudgeIndexes: indexes.map((index) => asIndex(index)),
          };
        }),
      },
      discounts: parseDiscounts(root.discounts),
    },
  };
}

/** Assign new row ids and point contest judges at the imported staff order. */
export function materializeEventFormImport(
  document: ParsedEventFormImport,
  token: number,
): AppliedEventImport {
  const members: EventStaffMember[] = document.staff.members.map((member) => ({
    id: crypto.randomUUID(),
    ...member,
  }));

  const staffIdAt = (index: number | null) =>
    index !== null && members[index] ? members[index].id : '';

  return {
    token,
    eventName: document.eventName,
    dates: document.dates,
    sectionStatuses: document.sectionStatuses,
    sectionOrder: document.sectionOrder,
    passes: document.passes,
    roles: document.roles,
    earlyBird: document.earlyBird,
    location: document.location,
    contactVenue: document.contactVenue,
    staff: {
      hasStaff: document.staff.hasStaff,
      members,
    },
    contests: {
      hasContests: document.contests.hasContests,
      contests: document.contests.contests.map((contest) => ({
        id: crypto.randomUUID(),
        divisionKey: contest.divisionKey,
        divisionLabel: contest.divisionLabel,
        skillLevelKey: contest.skillLevelKey,
        skillLevelLabel: contest.skillLevelLabel,
        headJudgeStaffId: staffIdAt(contest.headJudgeIndex),
        scoringJudgeCount: contest.scoringJudgeCount,
        scoringJudgeStaffIds: contest.scoringJudgeIndexes.map((index) => staffIdAt(index)),
      })),
    },
    discounts: document.discounts,
  };
}
