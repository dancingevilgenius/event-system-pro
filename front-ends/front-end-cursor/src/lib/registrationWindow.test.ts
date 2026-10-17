import { describe, expect, it } from 'vitest';
import { eventInRegistrationWindow } from './registrationWindow';

describe('eventInRegistrationWindow', () => {
  const allAmericanStart = '2026-10-17T19:00:00-05:00';

  it('includes a start later today, such as All-American Jack and Jill', () => {
    const now = new Date('2026-10-17T14:21:00-05:00');
    expect(eventInRegistrationWindow(allAmericanStart, null, now)).toBe(true);
  });

  it('includes a single-day event after it has started and before Chicago midnight', () => {
    const now = new Date('2026-10-17T21:30:00-05:00');
    expect(eventInRegistrationWindow(allAmericanStart, null, now)).toBe(true);
  });

  it('excludes a single-day event at the next Chicago midnight', () => {
    const now = new Date('2026-10-18T00:00:00-05:00');
    expect(eventInRegistrationWindow(allAmericanStart, null, now)).toBe(false);
  });

  it('includes a start exactly 24 hours ahead and excludes one minute later', () => {
    const now = new Date('2026-10-17T14:00:00-05:00');
    expect(eventInRegistrationWindow('2026-10-18T14:00:00-05:00', null, now)).toBe(true);
    expect(eventInRegistrationWindow('2026-10-18T14:01:00-05:00', null, now)).toBe(false);
  });

  it('keeps an event with an end date current through that end', () => {
    const now = new Date('2026-10-17T14:00:00-05:00');
    expect(
      eventInRegistrationWindow(
        '2026-10-16T19:00:00-05:00',
        '2026-10-18T22:00:00-05:00',
        now,
      ),
    ).toBe(true);
    expect(
      eventInRegistrationWindow(
        '2026-10-15T19:00:00-05:00',
        '2026-10-16T22:00:00-05:00',
        now,
      ),
    ).toBe(false);
  });

  it('uses Chicago midnight in standard time as well', () => {
    const start = '2026-01-15T19:00:00-06:00';
    expect(eventInRegistrationWindow(start, null, new Date('2026-01-15T23:30:00-06:00'))).toBe(true);
    expect(eventInRegistrationWindow(start, null, new Date('2026-01-16T00:00:00-06:00'))).toBe(false);
  });

  it('excludes a missing start', () => {
    expect(eventInRegistrationWindow(null, null, new Date('2026-10-17T14:00:00-05:00'))).toBe(false);
  });
});
