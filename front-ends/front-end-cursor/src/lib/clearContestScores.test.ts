import { describe, expect, it } from 'vitest';
import { buildJudgingFinalsEntries } from './judgingFinalsEntries';
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

  it('keeps pairs and competitor names, and those couples are not unknown competitors', () => {
    const record = {
      pairs: [{ leader_id: 'l1', follower_id: 'f1' }],
      leaders: [{ id: 'l1', first_name: 'Ada', last_name: 'Lovelace', bib: 2 }],
      followers: [{ id: 'f1', first_name: 'Grace', last_name: 'Hopper', bib: 20 }],
      competitors_json: [{ id: 'l1', first_name: 'Ada', last_name: 'Lovelace' }],
      judge_submissions: [{ judge_id: 'j1', scores: [{ competitor_id: 2, score: 88 }] }],
      judgeSubmissions: [{ judge_id: 'head', scores: [{ competitor_id: 2, score: 70 }] }],
      relative_placement: { rows: [{ bib: 2, place: 1 }] },
      relativePlacement: { rows: [] },
    };

    const cleared = withoutContestScores(record);

    expect(cleared.pairs).toEqual(record.pairs);
    expect(cleared.leaders).toEqual(record.leaders);
    expect(cleared.followers).toEqual(record.followers);
    expect(cleared.competitors_json).toEqual(record.competitors_json);
    expect(cleared.judge_submissions).toBeUndefined();
    expect(cleared.judgeSubmissions).toBeUndefined();
    expect(cleared.relative_placement).toBeUndefined();
    expect(cleared.relativePlacement).toBeUndefined();

    const entries = buildJudgingFinalsEntries(cleared.pairs, [
      { id: 'l1', firstName: 'Ada', lastName: 'Lovelace', bib: 2, role: 'leader' },
      { id: 'f1', firstName: 'Grace', lastName: 'Hopper', bib: 20, role: 'follower' },
    ]);
    expect(entries.map((entry) => `${entry.leader.first} ${entry.leader.last}`)).toEqual(['Ada Lovelace']);
    expect(entries.map((entry) => `${entry.follower.first} ${entry.follower.last}`)).toEqual(['Grace Hopper']);
    expect(JSON.stringify(entries).toLowerCase()).not.toContain('unknown competitor');
  });
});
