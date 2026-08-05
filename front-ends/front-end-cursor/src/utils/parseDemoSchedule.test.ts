import { describe, expect, it } from 'vitest';
import { TSL_EXAMPLE_SCHEDULE } from '../data/tslExampleSchedule';
import { parseDemoSchedule } from './parseDemoSchedule';

describe('parseDemoSchedule', () => {
  it('parses the TSL X Minneapolis example schedule', () => {
    const events = parseDemoSchedule(TSL_EXAMPLE_SCHEDULE);

    expect(events.length).toBeGreaterThan(30);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Charter Rep Dinner / Reception',
          start: '2026-07-29T20:00:00',
          end: '2026-07-29T22:00:00',
          resource: 'hampton-inn',
        }),
        expect.objectContaining({
          title: 'Standard Day One — Groups A, B, C',
          start: '2026-07-30T15:00:00',
          end: '2026-07-30T16:00:00',
          resource: 'ymca-gaviidae',
        }),
        expect.objectContaining({
          title: "Women's Division Tournament",
          start: '2026-07-31T09:00:00',
          end: '2026-07-31T10:30:00',
        }),
        expect.objectContaining({
          title: 'TSL Saber Prom',
          start: '2026-08-01T20:00:00',
          resource: 'state-theatre',
        }),
        expect.objectContaining({
          title: 'Patch-A-Palooza & Saber Games',
          start: '2026-08-02T14:00:00',
          end: '2026-08-02T18:00:00',
        }),
      ]),
    );
  });

  it('skips blank lines, comments, and malformed rows', () => {
    const events = parseDemoSchedule(`
# comment
2026-07-30 | 6:00 PM - 7:00 PM | Gym Class | ymca-gaviidae | Note

not-a-row
2026-07-31 | weird | Bad
`);

    expect(events).toEqual([
      {
        id: '1',
        title: 'Gym Class',
        start: '2026-07-30T18:00:00',
        end: '2026-07-30T19:00:00',
        resource: 'ymca-gaviidae',
        description: 'Note',
      },
    ]);
  });
});
