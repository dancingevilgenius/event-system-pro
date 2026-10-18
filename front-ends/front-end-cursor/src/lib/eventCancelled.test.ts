import { describe, expect, it } from 'vitest';
import { eventIsCancelled } from './eventCancelled';

describe('eventIsCancelled', () => {
  it('is true only for a boolean true flag', () => {
    expect(eventIsCancelled({ cancelled: true })).toBe(true);
  });

  it('treats a missing flag as not cancelled', () => {
    expect(eventIsCancelled({})).toBe(false);
    expect(eventIsCancelled(null)).toBe(false);
    expect(eventIsCancelled(undefined)).toBe(false);
  });

  it('treats false and non-booleans as not cancelled', () => {
    expect(eventIsCancelled({ cancelled: false })).toBe(false);
    expect(eventIsCancelled({ cancelled: 'true' })).toBe(false);
    expect(eventIsCancelled([])).toBe(false);
  });
});
