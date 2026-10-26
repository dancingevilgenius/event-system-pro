import { describe, expect, it } from 'vitest';
import {
  EARLY_BIRD_DATE_ORDER_ERROR,
  createInitialEarlyBirdWindows,
  earlyBirdDateOrderError,
  earlyBirdDatesCanBeFinalized,
  formatEarlyBirdDate,
  isEarlyBirdDateInPast,
  localCalendarDateIso,
  normalizeEarlyBirdDate,
  pricedEarlyBirdWindows,
  savedEarlyBirdName,
} from './eventEarlyBirdDates';

describe('createInitialEarlyBirdWindows', () => {
  it('starts the third row enabled and named Full Price', () => {
    const windows = createInitialEarlyBirdWindows();
    expect(windows.map((window) => window.name)).toEqual([
      'Early Bird 1',
      'Early Bird 2',
      'Full Price',
    ]);
    expect(windows.map((window) => window.enabled)).toEqual([false, false, true]);
    expect(savedEarlyBirdName('   ', 2)).toBe('Full Price');
  });
});

describe('earlyBirdDateOrderError', () => {
  it('requires an enabled row start date to be strictly earlier than its end date', () => {
    expect(earlyBirdDateOrderError(true, '2026-01-02', '2026-01-01')).toBe(
      EARLY_BIRD_DATE_ORDER_ERROR,
    );
    expect(earlyBirdDateOrderError(true, '2026-01-01', '2026-01-01')).toBe(
      EARLY_BIRD_DATE_ORDER_ERROR,
    );
    expect(earlyBirdDateOrderError(true, '2026-01-01', '2026-01-02')).toBeNull();
  });

  it('ignores disabled rows and rows that do not have both dates', () => {
    expect(earlyBirdDateOrderError(false, '2026-02-01', '2026-01-01')).toBeNull();
    expect(earlyBirdDateOrderError(true, '2026-01-01', null)).toBeNull();
    expect(earlyBirdDateOrderError(true, null, '2026-01-01')).toBeNull();
    expect(earlyBirdDateOrderError(true, null, null)).toBeNull();
  });

  it('rejects a calendar date that is not a real day', () => {
    expect(normalizeEarlyBirdDate('2026-02-31')).toBeNull();
    expect(earlyBirdDateOrderError(true, '2026-02-31', '2026-03-01')).toBeNull();
  });
});

describe('pricedEarlyBirdWindows', () => {
  const windows = [
    {
      id: 'a',
      name: 'First',
      enabled: true,
      startDate: '2026-07-11',
      endDate: '2026-08-01',
    },
    {
      id: 'b',
      name: 'Skipped',
      enabled: false,
      startDate: '2026-03-01',
      endDate: '2026-04-01',
    },
    {
      id: 'c',
      name: 'No dates',
      enabled: true,
      startDate: null,
      endDate: null,
    },
  ];

  it('formats a calendar date without a time', () => {
    expect(formatEarlyBirdDate('2026-07-11')).toBe('Jul 11, 2026');
    expect(formatEarlyBirdDate(null)).toBe('');
    expect(formatEarlyBirdDate('2026-02-31')).toBe('');
  });

  it('keeps enabled windows that have a date, in their original positions', () => {
    expect(pricedEarlyBirdWindows('create', windows)).toEqual([
      { ...windows[0], index: 0 },
    ]);
    expect(pricedEarlyBirdWindows('none', windows)).toEqual([]);
  });
});

describe('earlyBirdDatesCanBeFinalized', () => {
  it('allows finalize when no enabled row has an inverted window', () => {
    expect(
      earlyBirdDatesCanBeFinalized('create', [
        { enabled: false, startDate: '2026-05-01', endDate: '2026-04-01' },
        { enabled: true, startDate: '2026-01-01', endDate: '2026-02-01' },
        { enabled: true, startDate: null, endDate: '2026-03-01' },
      ]),
    ).toBe(true);
    expect(
      earlyBirdDatesCanBeFinalized('none', [
        { enabled: true, startDate: '2026-05-01', endDate: '2026-04-01' },
      ]),
    ).toBe(true);
  });

  it('treats a calendar date before today as past and allows today', () => {
    expect(isEarlyBirdDateInPast('2026-10-25', '2026-10-26')).toBe(true);
    expect(isEarlyBirdDateInPast('2026-10-26', '2026-10-26')).toBe(false);
    expect(isEarlyBirdDateInPast('2026-10-27', '2026-10-26')).toBe(false);
    expect(isEarlyBirdDateInPast(null, '2026-10-26')).toBe(false);
    expect(localCalendarDateIso(new Date(2026, 9, 26))).toBe('2026-10-26');
  });

  it('blocks finalize when an enabled row has start on or after end', () => {
    expect(
      earlyBirdDatesCanBeFinalized('create', [
        { enabled: true, startDate: '2026-01-01', endDate: '2026-02-01' },
        { enabled: true, startDate: '2026-04-01', endDate: '2026-04-01' },
      ]),
    ).toBe(false);
  });
});
