import { describe, expect, it } from 'vitest';
import {
  createEmptyContestStageBracketJson,
  parseContestStageBracketJson,
} from './contestStageBrackets';

describe('contestStageBrackets', () => {
  it('builds an empty size-8 single-elim skeleton', () => {
    const bracket = createEmptyContestStageBracketJson({
      contestId: 42,
      eventCode: 'TSL_FICTIONAL_FRACAS_2026_JUL',
      divisionKey: 'STD',
      divisionLabel: 'Standard',
      size: 8,
    });

    expect(bracket.stage).toBe('primary_elim');
    expect(bracket.overtime_label).toBe('Sudden Death');
    expect(bracket.size).toBe(8);
    expect(bracket.rounds).toHaveLength(3);
    expect(bracket.rounds[0].name).toBe('Quarterfinals');
    expect(bracket.rounds[0].matches).toHaveLength(4);
    expect(bracket.rounds[2].matches).toHaveLength(1);
    expect(bracket.champion).toBeNull();
  });

  it('round-trips through parseContestStageBracketJson', () => {
    const original = createEmptyContestStageBracketJson({
      contestId: 7,
      eventCode: 'X',
      divisionKey: 'MAS',
      divisionLabel: 'Masters',
      size: 4,
    });
    const parsed = parseContestStageBracketJson(original);
    expect(parsed.division_key).toBe('MAS');
    expect(parsed.rounds).toHaveLength(2);
    expect(parsed.rounds[0].matches[0].id).toBe('r0-m0');
  });
});
