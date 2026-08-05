import { describe, expect, it } from 'vitest';
import { parseDemoSchedule } from './parseDemoSchedule';
import { TSL_EVENT_TIMEZONE, toEventCalendarEvents } from './toEventCalendarEvents';

describe('toEventCalendarEvents', () => {
  it('adds timezone, division colors, and read-only flags', () => {
    const parsed = parseDemoSchedule(`
2026-07-30 | 2:00 PM - 2:30 PM | Opening Ceremonies | ymca-gaviidae |
2026-07-30 | 3:00 PM - 4:00 PM | Standard Day One — Groups A, B, C | ymca-gaviidae | Rotational
2026-07-31 | 2:00 PM - 3:00 PM | Exotic Weapons — Groups A, B, C | ymca-gaviidae |
2026-07-31 | 9:00 AM - 10:30 AM | Women's Division Tournament | ymca-gaviidae |
`);

    const events = toEventCalendarEvents(parsed);

    expect(events).toEqual([
      expect.objectContaining({
        title: 'Opening Ceremonies',
        timezone: TSL_EVENT_TIMEZONE,
        color: 'grey',
        readOnly: true,
        resource: 'ymca-gaviidae',
      }),
      expect.objectContaining({
        title: 'Standard Day One — Groups A, B, C',
        color: 'teal',
        timezone: TSL_EVENT_TIMEZONE,
      }),
      expect.objectContaining({
        title: 'Exotic Weapons — Groups A, B, C',
        color: 'orange',
      }),
      expect.objectContaining({
        title: "Women's Division Tournament",
        color: 'pink',
      }),
    ]);

    expect(events[1]).not.toHaveProperty('readOnly');
  });
});
