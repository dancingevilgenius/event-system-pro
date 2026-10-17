import { describe, expect, it } from 'vitest';
import {
  INACTIVITY_LOGOUT_DISABLED_CENTRAL_DATE,
  isInactivityLogoutDisabled,
  isInactivityLogoutPausedForDate,
  parseRoles,
} from './session';

describe('parseRoles', () => {
  it('maps Judge to JUDGE and keeps Head Judge as its own role', () => {
    expect(parseRoles(['Judge'])).toEqual(['JUDGE']);
    expect(parseRoles(['JUDGE'])).toEqual(['JUDGE']);
    expect(parseRoles(['Head Judge'])).toEqual(['HEAD_JUDGE']);
    expect(parseRoles(['HEAD_JUDGE'])).toEqual(['HEAD_JUDGE']);
    expect(parseRoles(['Judge', 'Head Judge', 'JUDGE'])).toEqual(['JUDGE', 'HEAD_JUDGE']);
  });
});

describe('isInactivityLogoutPausedForDate', () => {
  it('pauses only on the 2026-10-17 Central calendar day', () => {
    expect(INACTIVITY_LOGOUT_DISABLED_CENTRAL_DATE).toBe('2026-10-17');
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-17T05:00:00.000Z'))).toBe(true);
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-17T18:21:00.000Z'))).toBe(true);
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-18T04:59:59.000Z'))).toBe(true);
  });

  it('resumes on the following Central calendar day', () => {
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-17T04:59:59.000Z'))).toBe(false);
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-18T05:00:00.000Z'))).toBe(false);
    expect(isInactivityLogoutPausedForDate(new Date('2026-10-18T18:00:00.000Z'))).toBe(false);
  });
});

describe('isInactivityLogoutDisabled', () => {
  it('turns the idle-logout path off for the pause day without a browser host', () => {
    expect(isInactivityLogoutDisabled(new Date('2026-10-17T18:21:00.000Z'))).toBe(true);
  });

  it('leaves the idle-logout path on for other days when there is no browser host', () => {
    expect(isInactivityLogoutDisabled(new Date('2026-10-16T18:00:00.000Z'))).toBe(false);
    expect(isInactivityLogoutDisabled(new Date('2026-10-18T18:00:00.000Z'))).toBe(false);
  });
});
