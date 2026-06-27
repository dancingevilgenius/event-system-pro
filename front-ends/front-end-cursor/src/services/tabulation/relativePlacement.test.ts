import { describe, expect, it } from 'vitest';
import { tabulateRelativePlacement } from './relativePlacement';

describe('tabulateRelativePlacement', () => {
  it('awards placements using the majority rule', () => {
    const result = tabulateRelativePlacement([
      {
        judgeId: 1,
        placements: [
          { competitorId: 'A', placement: 1, score: 0 },
          { competitorId: 'B', placement: 2, score: 0 },
          { competitorId: 'C', placement: 3, score: 0 },
          { competitorId: 'D', placement: 4, score: 0 },
        ],
      },
      {
        judgeId: 2,
        placements: [
          { competitorId: 'A', placement: 2, score: 0 },
          { competitorId: 'B', placement: 1, score: 0 },
          { competitorId: 'C', placement: 3, score: 0 },
          { competitorId: 'D', placement: 4, score: 0 },
        ],
      },
      {
        judgeId: 3,
        placements: [
          { competitorId: 'A', placement: 1, score: 0 },
          { competitorId: 'B', placement: 3, score: 0 },
          { competitorId: 'C', placement: 2, score: 0 },
          { competitorId: 'D', placement: 4, score: 0 },
        ],
      },
      {
        judgeId: 4,
        placements: [
          { competitorId: 'A', placement: 1, score: 0 },
          { competitorId: 'B', placement: 2, score: 0 },
          { competitorId: 'C', placement: 4, score: 0 },
          { competitorId: 'D', placement: 3, score: 0 },
        ],
      },
      {
        judgeId: 5,
        placements: [
          { competitorId: 'A', placement: 3, score: 0 },
          { competitorId: 'B', placement: 1, score: 0 },
          { competitorId: 'C', placement: 2, score: 0 },
          { competitorId: 'D', placement: 4, score: 0 },
        ],
      },
    ]);

    expect(result.standings.map((standing) => [standing.competitorId, standing.finalPlacement])).toEqual([
      ['A', 1],
      ['B', 2],
      ['C', 3],
      ['D', 4],
    ]);
  });
});
