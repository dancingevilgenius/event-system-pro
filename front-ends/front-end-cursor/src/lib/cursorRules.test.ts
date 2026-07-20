import { describe, expect, it } from 'vitest';
import { loadCursorRules } from './cursorRules';

describe('loadCursorRules', () => {
  it('loads bundled Cursor rules with titles', () => {
    const rules = loadCursorRules();

    expect(rules.length).toBeGreaterThanOrEqual(5);
    expect(rules.some((rule) => rule.id === 'demo-attendee-id-reservation')).toBe(true);
    expect(rules.some((rule) => rule.title.includes('Demo attendee ID reservation'))).toBe(true);
  });
});
