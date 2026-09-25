import { describe, expect, it } from 'vitest';
import { buildScheduleFromPreset, parseSchedulePreset } from './schedulePresets';

const noon = { hour12: 12, minute: 0, period: 'AM' as const };

describe('buildScheduleFromPreset', () => {
  it('uses interval schedules for sub-hour frequencies', () => {
    expect(buildScheduleFromPreset('once_every_30_seconds', noon)).toEqual({
      kind: 'interval',
      intervalSeconds: 30,
    });
    expect(buildScheduleFromPreset('once_a_minute', noon)).toEqual({
      kind: 'interval',
      intervalSeconds: 60,
    });
    expect(buildScheduleFromPreset('once_every_10_minutes', noon)).toEqual({
      kind: 'interval',
      intervalSeconds: 600,
    });
    expect(buildScheduleFromPreset('once_every_30_minutes', noon)).toEqual({
      kind: 'interval',
      intervalSeconds: 1800,
    });
  });
});

describe('parseSchedulePreset', () => {
  it('recognizes interval-based once-a-minute schedules', () => {
    expect(
      parseSchedulePreset({ scheduleCron: null, intervalSeconds: 60 }).frequency,
    ).toBe('once_a_minute');
  });

  it('still recognizes legacy once-a-minute cron', () => {
    expect(
      parseSchedulePreset({ scheduleCron: '* * * * *', intervalSeconds: null }).frequency,
    ).toBe('once_a_minute');
  });
});
