import { describe, expect, it } from 'vitest';
import { buildJudgeSubmission } from './buildJudgeSubmission';
import { scoreToDigits } from '../../types/judgingScore';

describe('buildJudgeSubmission', () => {
  it('includes both raw scores and derived placements', () => {
    const submission = buildJudgeSubmission(
      {
        11: { digits: scoreToDigits(88.5), touched: true },
        22: { digits: scoreToDigits(99.99), touched: true },
        33: { digits: scoreToDigits(12.0), touched: true },
      },
      [11, 22, 33],
      'judge-7',
    );

    expect(submission.judgeId).toBe('judge-7');
    expect(submission.scores).toEqual([
      { competitorId: 11, score: 88.5 },
      { competitorId: 22, score: 99.99 },
      { competitorId: 33, score: 12 },
    ]);
    expect(submission.placements).toEqual([
      { competitorId: 22, placement: 1, score: 99.99 },
      { competitorId: 11, placement: 2, score: 88.5 },
      { competitorId: 33, placement: 3, score: 12 },
    ]);
  });
});
