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
            earlyBirdCosts: {},
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
            name: '  Early Bird 1  ',
            enabled: true,
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
      discounts: {
        discounts: [
          {
            id: '55555555-5555-4555-8555-555555555555',
            name: 'Student',
            valueKind: 'percent',
            value: '15',
            description: 'With student ID',
          },
        ],
      },
      intensives: {
        hasIntensives: true,
        intensives: [
          {
            id: '77777777-7777-4777-8777-777777777777',
            name: 'Musicality',
            instructors: 'Ada Lovelace',
            cost: '120.50',
            dateTime: '2026-09-25T18:00',
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
      discounts: Array<Record<string, unknown>>;
      intensives: { hasIntensives: boolean; intensives: Array<Record<string, unknown>> };
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
      name: 'Early Bird 1',
      enabled: true,
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    });
    expect(parsed.discounts[0]).toEqual({
      name: 'Student',
      valueKind: 'percent',
      value: '15',
      description: 'With student ID',
    });
    expect(parsed.intensives).toEqual({
      hasIntensives: true,
      intensives: [
        {
          name: 'Musicality',
          instructors: 'Ada Lovelace',
          cost: '120',
          dateTime: '2026-09-25T18:00',
        },
      ],
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
        discounts: { discounts: applied.discounts },
        intensives: applied.intensives,
      },
    })) as { contests: { contests: Array<{ headJudgeIndex: number | null }> } };

    expect(again.contests.contests[0]?.headJudgeIndex).toBe(0);
    expect(applied.staff.members[0]?.id).not.toBe('33333333-3333-4333-8333-333333333333');
    expect(applied.earlyBird.windows[0]).toMatchObject({
      name: 'Early Bird 1',
      enabled: true,
      startDate: '2026-01-01',
      endDate: '2026-02-01',
    });
  });

  it('keeps whole-dollar early bird pass costs aligned to window order', () => {
    const source = sourceWithIdentity();
    const pass = source.snapshots.passes?.passes[0];
    const windowId = source.snapshots.earlyBird?.windows[0]?.id;
    if (!pass || !windowId) {
      throw new Error('fixture is missing a pass or early bird window');
    }
    pass.cost = '40.75';
    pass.earlyBirdCosts = { [windowId]: '25.50' };

    const exported = JSON.parse(formatEventFormExport(source)) as {
      passes: { passes: Array<{ cost: string; earlyBirdCosts?: string[] }> };
    };
    expect(exported.passes.passes[0]?.cost).toBe('40');
    expect(exported.passes.passes[0]?.earlyBirdCosts).toEqual(['25']);

    const parsed = parseEventFormImport(JSON.stringify(exported));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }
    const importedWindowId = parsed.document.earlyBird.windows[0]?.id;
    expect(parsed.document.passes.passes[0]?.cost).toBe('40');
    expect(parsed.document.passes.passes[0]?.earlyBirdCosts[importedWindowId ?? '']).toBe('25');
  });

  it('keeps an unchecked early bird row and fills a missing name from the row index', () => {
    const source = sourceWithIdentity();
    source.snapshots.earlyBird = {
      mode: 'create',
      windows: [
        {
          id: '22222222-2222-4222-8222-222222222222',
          name: '   ',
          enabled: false,
          startDate: '2026-03-01',
          endDate: '2026-04-01',
        },
        {
          id: '66666666-6666-4666-8666-666666666666',
          name: 'Opening week',
          enabled: true,
          startDate: null,
          endDate: null,
        },
      ],
    };

    const exported = formatEventFormExport(source);
    const legacy = JSON.parse(exported) as {
      earlyBirdDates: { windows: Array<Record<string, unknown>> };
    };
    expect(legacy.earlyBirdDates.windows[0]).toEqual({
      name: 'Early Bird 1',
      enabled: false,
      startDate: '2026-03-01',
      endDate: '2026-04-01',
    });
    expect(legacy.earlyBirdDates.windows[1]).toEqual({
      name: 'Opening week',
      enabled: true,
      startDate: null,
      endDate: null,
    });

    legacy.earlyBirdDates.windows[1].startDate = '2026-05-01';
    delete legacy.earlyBirdDates.windows[1].name;
    delete legacy.earlyBirdDates.windows[1].enabled;
    const parsed = parseEventFormImport(JSON.stringify(legacy));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) {
      return;
    }

    expect(parsed.document.earlyBird.windows[0]).toMatchObject({
      name: 'Early Bird 1',
      enabled: false,
      startDate: '2026-03-01',
      endDate: '2026-04-01',
    });
    expect(parsed.document.earlyBird.windows[1]).toMatchObject({
      name: 'Early Bird 2',
      enabled: true,
      startDate: '2026-05-01',
      endDate: null,
    });
  });
});
