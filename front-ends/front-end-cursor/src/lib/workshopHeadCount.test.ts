import { describe, expect, it } from 'vitest';
import {
  ALL_WORKSHOP_DAYS,
  HEAD_COUNT_MAX,
  MOCK_WORKSHOPS,
  filterWorkshops,
  sanitizeHeadCountInput,
  workshopDayOptions,
} from './workshopHeadCount';

describe('workshop head count filters', () => {
  it('lists each workshop day once, in schedule order', () => {
    expect(workshopDayOptions(MOCK_WORKSHOPS)).toEqual([
      'Friday October 30, 2026',
      'Saturday October 31, 2026',
      'Sunday November 1, 2026',
    ]);
  });

  it('matches an instructor name inside a shared listing', () => {
    const matches = filterWorkshops(MOCK_WORKSHOPS, ' priya ', ALL_WORKSHOP_DAYS);
    expect(matches.map((row) => row.id)).toEqual(['musicality-lab']);
  });

  it('keeps workshops on the selected day', () => {
    const matches = filterWorkshops(
      MOCK_WORKSHOPS,
      '',
      'Saturday October 31, 2026',
    );
    expect(matches.map((row) => row.workshop)).toEqual([
      'Musicality Lab',
      'Connection and Frame',
    ]);
  });

  it('applies instructor and day filters together', () => {
    const matches = filterWorkshops(
      MOCK_WORKSHOPS,
      'maria',
      'Friday October 30, 2026',
    );
    expect(matches.map((row) => row.id)).toEqual(['wcs-foundations']);
  });
});

describe('sanitizeHeadCountInput', () => {
  it('keeps blank and whole numbers from 1 through 300', () => {
    expect(sanitizeHeadCountInput('')).toBe('');
    expect(sanitizeHeadCountInput('1')).toBe('1');
    expect(sanitizeHeadCountInput('300')).toBe('300');
    expect(sanitizeHeadCountInput('007')).toBe('7');
  });

  it('drops zero, negatives, and non-digits, and clamps above the max', () => {
    expect(sanitizeHeadCountInput('0')).toBe('');
    expect(sanitizeHeadCountInput('-4')).toBe('');
    expect(sanitizeHeadCountInput('12.5')).toBe('');
    expect(sanitizeHeadCountInput('301')).toBe(String(HEAD_COUNT_MAX));
  });
});
