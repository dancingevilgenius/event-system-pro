import { describe, expect, it } from 'vitest';
import { isTslContestEvent } from './tslContests';

describe('isTslContestEvent', () => {
  it('detects TSL_ event group codes', () => {
    expect(isTslContestEvent('TSL_FICTIONAL_FRACAS', null)).toBe(true);
    expect(isTslContestEvent('TSL_ARMAGEDDON', 'OTHER')).toBe(true);
  });

  it('detects saber event types', () => {
    expect(isTslContestEvent('PORTLAND_PLASMA_PRIX', 'SWORD_LIGHT_SABER')).toBe(true);
  });

  it('rejects swing and unrelated events', () => {
    expect(isTslContestEvent('SWING_STATE_CLASSIC', 'COUPLES_SWING')).toBe(false);
    expect(isTslContestEvent('ROBOT_RIOT', 'ROBOTICS_GENERAL')).toBe(false);
  });
});
