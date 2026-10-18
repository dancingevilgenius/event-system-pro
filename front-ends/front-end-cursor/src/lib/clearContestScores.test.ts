import { describe, expect, it } from 'vitest';
import { withoutContestScores } from './clearContestScores';

describe('withoutContestScores', () => {
  it('removes judge ballots and relative placement and keeps the rest of the record', () => {
    const record = {
      stages: [{ name: 'finals' }],
      pairs: [{ leader_bib: 12, follower_bib: 18 }],
      head_judge_staff_id: 'head-staff',
      judge_submissions: [{ judge_id: 'j1', scores: [{ competitor_id: 12, score: 80 }] }],
      relative_placement: { scoring_judge_ids: ['j1'], rows: [] },
    };

    const cleared = withoutContestScores(record);

    expect(cleared).toEqual({
      stages: [{ name: 'finals' }],
      pairs: [{ leader_bib: 12, follower_bib: 18 }],
      head_judge_staff_id: 'head-staff',
    });
    expect(record.judge_submissions).toHaveLength(1);
    expect(record.relative_placement.scoring_judge_ids).toEqual(['j1']);
  });

  it('also drops camelCase copies of those keys', () => {
    expect(withoutContestScores({
      name: 'Jack and Jill',
      judgeSubmissions: [],
      relativePlacement: { rows: [] },
    })).toEqual({ name: 'Jack and Jill' });
  });

  it('returns an empty object when there is nothing stored', () => {
    expect(withoutContestScores(null)).toEqual({});
    expect(withoutContestScores(undefined)).toEqual({});
  });
});
