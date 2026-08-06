import { describe, expect, it } from 'vitest';
import { exampleTslStagePools } from '../data/exampleTslStagePools';
import {
  createEmptyContestStagePoolsJson,
  parseContestStagePoolsJson,
} from './contestStagePools';

describe('parseContestStagePoolsJson', () => {
  it('returns defaults for empty input', () => {
    const parsed = parseContestStagePoolsJson(null);
    expect(parsed.stage).toBe('pools');
    expect(parsed.score_a_label).toBe('Red');
    expect(parsed.score_b_label).toBe('Blue');
    expect(parsed.mat_label).toBe('Mat');
    expect(parsed.overtime_label).toBe('Sudden Death');
    expect(parsed.pools).toEqual([]);
  });

  it('round-trips the TSL example document', () => {
    const parsed = parseContestStagePoolsJson(exampleTslStagePools);
    expect(parsed.stage).toBe('pools');
    expect(parsed.overtime_label).toBe('Sudden Death');
    expect(parsed.pools).toHaveLength(1);

    const pool = parsed.pools[0];
    expect(pool.pool_id).toBe('A');
    expect(pool.fighters).toHaveLength(4);
    expect(pool.bouts).toHaveLength(6);
    expect(pool.standings).toHaveLength(4);

    const otBout = pool.bouts.find((bout) => bout.bout_id === 'A-02');
    expect(otBout?.overtime).toBe(true);
    expect(otBout?.score_a).toBe(10);
    expect(otBout?.score_b).toBe(9);
    expect(otBout?.fighter_a.yellow_card).toBe(true);
    expect(otBout?.fighter_a.user_id).toBe(10003);

    expect(pool.standings[0].rank).toBe(1);
    expect(pool.standings[0].username).toBe('j.park');
    expect(pool.standings[3].withdrawal).toBe(true);
  });

  it('supports Black/White and Ring labels', () => {
    const parsed = parseContestStagePoolsJson({
      ...createEmptyContestStagePoolsJson(),
      score_a_label: 'Black',
      score_b_label: 'White',
      mat_label: 'Ring',
    });

    expect(parsed.score_a_label).toBe('Black');
    expect(parsed.score_b_label).toBe('White');
    expect(parsed.mat_label).toBe('Ring');
  });
});
