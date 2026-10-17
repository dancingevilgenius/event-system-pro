import { describe, expect, it } from 'vitest';
import {
  formatEventFormExport,
  materializeEventFormImport,
  parseEventFormImport,
  type EventFormExportSource,
} from './eventFormExport';

function sourceWithIdentity(): EventFormExportSource {
  return {
    eventName: 'River City Swing',
    eventGroupCode: 'RCS',
    dates: {
      mode: 'single_day',
      startDateTime: '2026-09-25T18:00',
      endDateTime: '',
    },
    sectionStatuses: {
      event_name: 'finalized',
      schedule: 'not_started',
    },
    sectionOrder: ['event_name', 'dates'],
    scheduleDays: [{ id: 'day-1', title: 'Day 1' }],
    importantContact: {
      name: 'Carlos Garcia',
      email: 'swingcarlos@alum.mit.edu',
      phone: '6302201111',
    },
    snapshots: {
      passes: {
        hasPasses: true,
        passes: [
          {
            id: '11111111-1111-4111-8111-111111111111',
            name: 'Basic Pass',
            cost: '40',
            description: 'Weekend',
          },
        ],
      },
      roles: [
        { roleCode: 'JUDGE', used: true, label: 'Judge', count: 3 },
      ],
      earlyBird: {
        mode: 'create',
        windows: [
          {
            id: '22222222-2222-4222-8222-222222222222',
            startDate: '2026-01-01',
            endDate: '2026-02-01',
          },
        ],
      },
      location: {
        venue: 'Hall',
        street: '1 Main',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        map_url: '',
      },
      contactVenue: {
        website: 'https://example.com',
        phone: '5125550100',
        social_media_1: '',
        social_media_2: '',
        social_media_3: '',
      },
      staff: {
        hasStaff: true,
        members: [
          {
            id: '33333333-3333-4333-8333-333333333333',
            firstName: 'Ada',
            lastName: 'Lovelace',
            primaryRoleCode: 'JUDGE',
            secondaryRoleCode: '',
          },
        ],
        registrationById: {
          '33333333-3333-4333-8333-333333333333': {
            status: 'registered',
            username: 'ada',
            user_id: 42,
          } as { status: string; username: string | null; user_id?: number },
        },
      },
      contests: {
        hasContests: true,
        contests: [
          {
            id: '44444444-4444-4444-8444-444444444444',
            divisionKey: 'open',
            divisionLabel: 'Open',
            skillLevelKey: 'novice',
            skillLevelLabel: 'Novice',
            headJudgeStaffId: '33333333-3333-4333-8333-333333333333',
            scoringJudgeCount: 3,
            scoringJudgeStaffIds: ['33333333-3333-4333-8333-333333333333', '', ''],
          },
        ],
      },
    },
  };
}

describe('formatEventFormExport', () => {
  it('exports form data and leaves out generated ids', () => {
    const parsed = JSON.parse(formatEventFormExport(sourceWithIdentity())) as {
      eventName: string;
      passes: { passes: Array<Record<string, unknown>> };
      staff: { members: Array<Record<string, unknown>> };
      contests: { contests: Array<Record<string, unknown>> };
      schedule: { days: Array<Record<string, unknown>> };
      earlyBirdDates: { windows: Array<Record<string, unknown>> };
    };

    expect(parsed.eventName).toBe('Clone - River City Swing');
    expect(parsed.passes.passes[0]).toEqual({
      name: 'Basic Pass',
      cost: '40',
      description: 'Weekend',
    });
    expect(parsed.staff.members[0]).toEqual({
      firstName: 'Ada',
      lastName: 'Lovelace',
      primaryRoleCode: 'JUDGE',
      secondaryRoleCode: '',
      registration: { status: 'registered', username: 'ada' },
    });
    expect(parsed.contests.contests[0]?.headJudgeIndex).toBe(0);
    expect(parsed.contests.contests[0]?.scoringJudgeIndexes).toEqual([0, null, null]);
    expect(parsed.schedule.days[0]).toEqual({ title: 'Day 1' });
    expect(parsed.earlyBirdDates.windows[0]).toEqual({
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    });
    expect(JSON.stringify(parsed)).not.toContain('user_id');
    expect(JSON.stringify(parsed)).not.toContain('33333333-3333-4333-8333-333333333333');
    expect(JSON.stringify(parsed)).not.toContain('"id"');
  });

  it('imports an export onto new row ids and keeps judge positions', () => {
    const exported = formatEventFormExport(sourceWithIdentity());
    const parsed = parseEventFormImport(exported);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    const applied = materializeEventFormImport(parsed.document, 1);
    const again = JSON.parse(formatEventFormExport({
      ...sourceWithIdentity(),
      snapshots: {
        passes: applied.passes,
        roles: applied.roles,
        earlyBird: applied.earlyBird,
        location: applied.location,
        contactVenue: applied.contactVenue,
        staff: {
          ...applied.staff,
          registrationById: {
            [applied.staff.members[0].id]: { status: 'registered', username: 'ada' },
          },
        },
        contests: applied.contests,
      },
    })) as { contests: { contests: Array<{ headJudgeIndex: number | null }> } };

    expect(again.contests.contests[0]?.headJudgeIndex).toBe(0);
    expect(applied.staff.members[0]?.id).not.toBe('33333333-3333-4333-8333-333333333333');
  });
});
