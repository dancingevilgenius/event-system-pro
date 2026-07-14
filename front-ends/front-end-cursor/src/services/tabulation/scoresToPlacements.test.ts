import { describe, expect, it } from 'vitest';
import { scoresToPlacements } from './scoresToPlacements';

describe('scoresToPlacements', () => {
  it('ranks higher scores to better placements', () => {
    const placements = scoresToPlacements([
      { competitorId: 101, score: 45.5 },
      { competitorId: 202, score: 99.99 },
      { competitorId: 303, score: 0.01 },
    ]);

    expect(placements).toEqual([
      { competitorId: 202, placement: 1, score: 99.99 },
      { competitorId: 101, placement: 2, score: 45.5 },
      { competitorId: 303, placement: 3, score: 0.01 },
    ]);
  });

  it('uses competition ranking for tied scores', () => {
    const placements = scoresToPlacements([
      { competitorId: 10, score: 80 },
      { competitorId: 20, score: 80 },
      { competitorId: 30, score: 70 },
    ]);

    expect(placements).toEqual([
      { competitorId: 10, placement: 1, score: 80 },
      { competitorId: 20, placement: 1, score: 80 },
      { competitorId: 30, placement: 3, score: 70 },
    ]);
  });
});
