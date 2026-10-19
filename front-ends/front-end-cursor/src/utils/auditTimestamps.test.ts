import { describe, expect, it } from 'vitest';
import { formatAuditJsonForDisplay, formatReadableDateTime, hideDisplayedSeconds } from './auditTimestamps';

describe('hideDisplayedSeconds', () => {
  it('removes seconds from a readable clock', () => {
    expect(hideDisplayedSeconds('Jul 11, 2026, 5:42:28 AM CDT')).toBe('Jul 11, 2026, 5:42 AM CDT');
    expect(hideDisplayedSeconds('Jul 11, 2026, 5:42 AM CDT')).toBe('Jul 11, 2026, 5:42 AM CDT');
  });
});

describe('formatReadableDateTime', () => {
  it('does not include seconds', () => {
    const formatted = formatReadableDateTime(new Date('2026-07-11T10:42:28.000Z'));
    expect(formatted).not.toMatch(/:\d{2}:\d{2}/);
    expect(formatted).toMatch(/\d{1,2}:\d{2} [AP]M/);
  });

  it('strips seconds when the stored text cannot be parsed', () => {
    expect(formatReadableDateTime('not-a-date 5:42:28 AM')).toBe('not-a-date 5:42 AM');
  });
});

describe('formatAuditJsonForDisplay', () => {
  it('hides seconds already stored on a readable timestamp', () => {
    const text = formatAuditJsonForDisplay({
      last_login_at: 'Jul 11, 2026, 5:42:28 AM CDT',
    });
    expect(text).toContain('5:42 AM');
    expect(text).not.toContain('5:42:28');
  });
});
