import { describe, expect, it } from 'vitest';
import { mergeActivityExpiresAt } from './session';

describe('mergeActivityExpiresAt', () => {
  it('keeps the client deadline when the server clock is older', () => {
    expect(mergeActivityExpiresAt(1_000_000, 500_000)).toBe(1_000_000);
  });

  it('adopts the server deadline when it extends the client timer', () => {
    expect(mergeActivityExpiresAt(500_000, 1_000_000)).toBe(1_000_000);
  });

  it('initializes from the server when the client has no deadline', () => {
    expect(mergeActivityExpiresAt(null, 1_000_000)).toBe(1_000_000);
  });

  it('keeps the client deadline when the server has none', () => {
    expect(mergeActivityExpiresAt(1_000_000, null)).toBe(1_000_000);
  });

  it('returns null when neither side has a deadline', () => {
    expect(mergeActivityExpiresAt(null, null)).toBeNull();
  });
});
