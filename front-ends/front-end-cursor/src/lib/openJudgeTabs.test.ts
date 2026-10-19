import { describe, expect, it } from 'vitest';
import {
  filterEventGroupOptions,
  openJudgeContestChoices,
  sessionFromJudgeHandoff,
} from './openJudgeTabs';

describe('openJudgeContestChoices', () => {
  it('lists event contests and the judges assigned to each one', () => {
    const choices = openJudgeContestChoices({
      moreJson: {
        contests: {
          has_contests: true,
          items: [
            {
              id: 'open',
              division_label: 'Novice',
              skill_level_label: 'Swing',
              head_judge_staff_id: 'head',
              scoring_judge_staff_ids: ['a', '', 'b'],
            },
            {
              id: 'empty',
              division_label: 'Advanced',
              skill_level_label: 'Swing',
              head_judge_staff_id: '',
              scoring_judge_staff_ids: ['', ''],
            },
          ],
        },
      },
    });

    expect(choices).toEqual([
      { key: 'open', label: 'Novice · Swing', judgeStaffIds: ['head', 'a', 'b'] },
      { key: 'empty', label: 'Advanced · Swing', judgeStaffIds: [] },
    ]);
  });

  it('adds contest-table rows and panel judges when they are a different contest', () => {
    const choices = openJudgeContestChoices({
      moreJson: {
        contests: {
          items: [{ id: 'json-1', division_label: 'Novice', skill_level_label: 'Swing' }],
        },
      },
      tableContests: [
        { contestId: 9, moreJson: { id: 'json-1', name: 'Novice' }, staffJson: null },
        {
          contestId: 10,
          moreJson: { name: 'Masters' },
          staffJson: [{ id: 'pool-judge', primary_role_code: 'JUDGE' }],
        },
      ],
      panels: [{ contestId: 10, judgesJson: [{ judge_id: 'panel-judge' }] }],
    });

    expect(choices.map((choice) => choice.key)).toEqual(['json-1', 'table:10']);
    expect(choices[1]?.judgeStaffIds).toEqual(['pool-judge', 'panel-judge']);
    expect(choices[1]?.label).toBe('Masters');
  });
});

describe('filterEventGroupOptions', () => {
  const groups = [
    { fullName: 'River City Swing', eventGroupCode: 'RCS' },
    { fullName: 'Robot Riot', eventGroupCode: 'RR' },
  ];

  it('keeps groups whose name or code contains the filter', () => {
    expect(filterEventGroupOptions(groups, ' riot ').map((group) => group.eventGroupCode)).toEqual(['RR']);
    expect(filterEventGroupOptions(groups, 'rcs').map((group) => group.eventGroupCode)).toEqual(['RCS']);
    expect(filterEventGroupOptions(groups, '   ')).toEqual(groups);
  });
});

describe('sessionFromJudgeHandoff', () => {
  it('reads a judge session and drops a payload that is not a session', () => {
    expect(sessionFromJudgeHandoff(JSON.stringify({
      user_id: 4,
      username: 'judge',
      email: 'judge@example.com',
      roles: ['Judge'],
      token: 'jwt',
    }))).toEqual({
      user_id: 4,
      username: 'judge',
      email: 'judge@example.com',
      roles: ['JUDGE'],
      token: 'jwt',
    });
    expect(sessionFromJudgeHandoff('{"username":"judge"}')).toBeNull();
    expect(sessionFromJudgeHandoff('not-json')).toBeNull();
  });
});
