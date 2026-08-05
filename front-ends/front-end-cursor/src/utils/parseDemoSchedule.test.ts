import { describe, expect, it } from 'vitest';
import { MUI_SCHEDULER_EXAMPLE_SCHEDULE } from '../data/muiSchedulerExampleSchedule';
import { parseDemoSchedule } from './parseDemoSchedule';

describe('parseDemoSchedule', () => {
  it('parses timed and all-day rows from the MUI example schedule', () => {
    const events = parseDemoSchedule(MUI_SCHEDULER_EXAMPLE_SCHEDULE);

    expect(events.length).toBeGreaterThan(30);
    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Morning Run',
          start: '2025-06-29T07:00:00',
          end: '2025-06-29T07:45:00',
        }),
        expect.objectContaining({
          title: "Alice's Birthday",
          allDay: true,
          start: '2025-07-03T00:00:00',
        }),
        expect.objectContaining({
          title: '4th of July BBQ',
          start: '2025-07-04T12:00:00',
          end: '2025-07-04T17:00:00',
        }),
        expect.objectContaining({
          title: 'Packing for Vacation',
          start: '2025-08-02T14:00:00',
          end: '2025-08-02T16:00:00',
        }),
      ]),
    );
  });

  it('skips blank lines, comments, and malformed rows', () => {
    const events = parseDemoSchedule(`
# comment
2025-07-01 | 6:00 PM - 7:00 PM | Gym Class

not-a-row
2025-07-02 | weird | Bad
`);

    expect(events).toEqual([
      {
        id: '1',
        title: 'Gym Class',
        start: '2025-07-01T18:00:00',
        end: '2025-07-01T19:00:00',
      },
    ]);
  });
});
