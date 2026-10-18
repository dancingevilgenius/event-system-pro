import { describe, expect, it } from 'vitest';
import {
  assignedContestJudgeIds,
  buildJudgingFinalsEntries,
  canLeaveJudgingFinals,
  canOpenJudgeFinals,
  judgeHasSubmittedBallot,
  judgeSubmitSuccessNavigation,
  judgeSubmissionProgress,
  readJudgingFinalsContest,
  seesJudgeSubmissionBar,
} from './judgingFinalsEntries';

const people = [
  { id: 'l1', firstName: 'Ada', lastName: 'Lovelace', bib: 2 },
  { id: 'f1', firstName: 'Grace', lastName: 'Hopper', bib: 20 },
  { id: 'l2', firstName: 'Alan', lastName: 'Turing' },
  { id: 'f2', firstName: 'Katherine', lastName: 'Johnson', bib: 8 },
  { id: 'l3', firstName: 'Edsger', lastName: 'Dijkstra' },
  { id: 'f3', firstName: 'Margaret', lastName: 'Hamilton' },
];

describe('buildJudgingFinalsEntries', () => {
  it('joins saved couples to roster names and uses the leader bib', () => {
    const entries = buildJudgingFinalsEntries(
      [{ leader_id: 'l1', follower_id: 'f1' }],
      people,
    );

    expect(entries).toEqual([
      {
        number: 2,
        leaderBib: 2,
        followerBib: 20,
        leader: { first: 'Ada', last: 'Lovelace', sex: 'male' },
        follower: { first: 'Grace', last: 'Hopper', sex: 'female' },
      },
    ]);
  });

  it('uses the follower bib when the leader has none', () => {
    const entries = buildJudgingFinalsEntries(
      [{ leaderId: 'l2', followerId: 'f2' }],
      people,
    );

    expect(entries.map((entry) => entry.number)).toEqual([8]);
    expect(entries[0]?.leaderBib).toBeNull();
    expect(entries[0]?.followerBib).toBe(8);
    expect(entries[0]?.leader.last).toBe('Turing');
  });

  it('assigns a stable display bib that does not collide when a couple has no bib', () => {
    const entries = buildJudgingFinalsEntries(
      [
        { leader_id: 'l1', follower_id: 'f1' },
        { leader_id: 'l3', follower_id: 'f3' },
        { leader_id: 'missing', follower_id: 'f2' },
      ],
      people,
    );

    expect(entries.map((entry) => entry.number)).toEqual([2, 21, 8]);
    expect(entries.map((entry) => entry.followerBib)).toEqual([20, null, 8]);
    expect(entries.map((entry) => entry.leaderBib)).toEqual([2, null, null]);
    expect(entries[1]?.leader).toEqual({ first: 'Edsger', last: 'Dijkstra', sex: 'male' });
    expect(entries[1]?.follower).toEqual({ first: 'Margaret', last: 'Hamilton', sex: 'female' });
    expect(entries[2]?.leader).toEqual({ first: 'Unknown', last: 'competitor', sex: 'male' });
  });

  it('returns no entries when pairs are missing', () => {
    expect(buildJudgingFinalsEntries(undefined, people)).toEqual([]);
    expect(buildJudgingFinalsEntries([], people)).toEqual([]);
  });
});

describe('judgeSubmissionProgress', () => {
  it('starts at 0 and reaches 100 only when every assigned judge has submitted', () => {
    expect(judgeSubmissionProgress(['a', 'b', 'c', 'd', 'e', 'f', 'g'], []).label).toBe('0/7');
    expect(judgeSubmissionProgress(['a', 'b', 'c', 'd', 'e', 'f', 'g'], []).percent).toBe(0);
    expect(judgeSubmissionProgress(['a', 'b', 'c', 'd', 'e'], ['a', 'b', 'c', 'd'])).toMatchObject({
      label: '4/5',
      percent: 80,
      submitted: 4,
      assigned: 5,
    });
    expect(judgeSubmissionProgress(['a', 'b'], ['a', 'b']).percent).toBe(100);
    expect(judgeSubmissionProgress([], []).label).toBe('0/0');
    expect(judgeSubmissionProgress([], ['a']).percent).toBe(0);
  });

  it('counts each assigned judge once and ignores ballots from outside the panel', () => {
    expect(judgeSubmissionProgress(['a', 'a', 'b'], ['a', 'a', 'stranger']).label).toBe('1/2');
  });
});

describe('assignedContestJudgeIds', () => {
  it('lists the head judge and scoring judges without duplicates', () => {
    expect(
      assignedContestJudgeIds({
        records: [
          {
            head_judge_staff_id: 'head',
            scoring_judge_staff_ids: ['head', 'judge-2', 'judge-3'],
          },
        ],
        panelJudges: [{ judge_id: 'panel-1' }, { judge_id: 'judge-2' }],
      }),
    ).toEqual(['head', 'judge-2', 'judge-3', 'panel-1']);
  });

  it('uses judge roles from staff when the contest has no panel', () => {
    expect(
      assignedContestJudgeIds({
        staffJson: [
          { id: 'floor', primary_role_code: 'FLOOR_PARENT' },
          { id: 'head', primary_role_code: 'HEAD_JUDGE' },
          { id: 'scorer', secondary_role_code: 'JUDGE' },
        ],
      }),
    ).toEqual(['head', 'scorer']);
  });
});

describe('seesJudgeSubmissionBar', () => {
  it('shows the bar to admins and head judges only', () => {
    expect(seesJudgeSubmissionBar({ appRoles: ['ADMIN'], eventHeadJudge: false, contestHeadJudge: false })).toBe(true);
    expect(seesJudgeSubmissionBar({ appRoles: ['HEAD_JUDGE'], eventHeadJudge: false, contestHeadJudge: false })).toBe(true);
    expect(seesJudgeSubmissionBar({ appRoles: ['JUDGE'], eventHeadJudge: false, contestHeadJudge: true })).toBe(true);
    expect(seesJudgeSubmissionBar({ appRoles: ['JUDGE'], eventHeadJudge: true, contestHeadJudge: false })).toBe(true);
    expect(seesJudgeSubmissionBar({ appRoles: ['JUDGE'], eventHeadJudge: false, contestHeadJudge: false })).toBe(false);
  });
});

describe('canOpenJudgeFinals', () => {
  it('lets Judge and Head Judge app roles open finals', () => {
    expect(canOpenJudgeFinals({ appRoles: ['JUDGE'] })).toBe(true);
    expect(canOpenJudgeFinals({ appRoles: ['Judge'] })).toBe(true);
    expect(canOpenJudgeFinals({ appRoles: ['HEAD_JUDGE'] })).toBe(true);
    expect(canOpenJudgeFinals({ appRoles: ['Head Judge'] })).toBe(true);
    expect(canOpenJudgeFinals({ appRoles: ['ADMIN'] })).toBe(true);
  });

  it('lets a scoring judge whose Judge role is only on event staff open finals', () => {
    expect(canOpenJudgeFinals({
      appRoles: [],
      staffRoleCodes: ['JUDGE'],
    })).toBe(true);
    expect(canOpenJudgeFinals({
      appRoles: [],
      judgingHomeAllowed: true,
    })).toBe(true);
  });

  it('keeps finals closed for someone who is not a judge and cannot open Judging Home', () => {
    expect(canOpenJudgeFinals({ appRoles: [], judgingHomeAllowed: false })).toBe(false);
    expect(canOpenJudgeFinals({ appRoles: ['COMPETITOR'] })).toBe(false);
  });
});

describe('judgeHasSubmittedBallot', () => {
  const dylan = { userId: 1014, username: 'dbushe', staffIds: ['dylan-staff'] };
  const yvonne = { userId: 1013, username: 'yantonacci', staffIds: ['yvonne-staff'] };

  it('disables Score for the judge whose ballot is stored', () => {
    const submissions = [{ judge_id: 'dylan-staff', scores: [{ competitor_id: 1, score: 80 }] }];
    expect(judgeHasSubmittedBallot({ submissions: [submissions], ...dylan })).toBe(true);
    expect(judgeHasSubmittedBallot({
      submissions: [[{ judge_id: 'dbushe' }]],
      userId: dylan.userId,
      username: dylan.username,
      staffIds: [],
    })).toBe(true);
  });

  it('leaves Score enabled when the stored ballot belongs to someone else', () => {
    const submissions = [{ judge_id: 'dylan-staff', username: 'dbushe', user_id: 1014 }];
    expect(judgeHasSubmittedBallot({ submissions: [submissions], ...yvonne })).toBe(false);
    expect(judgeHasSubmittedBallot({
      submissions: [submissions],
      userId: 1004,
      username: 'dancingevilgenius',
      staffIds: ['carlos-staff'],
    })).toBe(false);
  });
});

describe('judgeSubmitSuccessNavigation', () => {
  it('sends Submit to Home with the existing success wording', () => {
    expect(judgeSubmitSuccessNavigation(4)).toEqual({
      path: '/home',
      flashSuccess: 'Scores submitted with 4 placements derived (1st = highest score).',
    });
  });
});

describe('canLeaveJudgingFinals', () => {
  it('stays closed while scores are incomplete or not submitted', () => {
    expect(canLeaveJudgingFinals({ loading: true, entryCount: 0, percentComplete: 0, submitted: false })).toBe(false);
    expect(canLeaveJudgingFinals({ loading: false, entryCount: 4, percentComplete: 50, submitted: false })).toBe(false);
    expect(canLeaveJudgingFinals({ loading: false, entryCount: 4, percentComplete: 100, submitted: false })).toBe(false);
  });

  it('opens after a complete submit, and when there is nothing to score', () => {
    expect(canLeaveJudgingFinals({ loading: false, entryCount: 4, percentComplete: 100, submitted: true })).toBe(true);
    expect(canLeaveJudgingFinals({ loading: false, entryCount: 0, percentComplete: 0, submitted: false })).toBe(true);
  });
});

describe('readJudgingFinalsContest', () => {
  it('uses pairs from route state', () => {
    const contest = readJudgingFinalsContest(
      {
        eventId: 134,
        contestItemId: 'item-1',
        eventName: 'All-Clone',
        skillLevel: 'All-American',
        contestType: 'Jack and Jill',
        pairs: [{ leader_id: 'l1', follower_id: 'f1' }],
      },
      new URLSearchParams(),
    );

    expect(contest.pairs).toEqual([{ leader_id: 'l1', follower_id: 'f1' }]);
    expect(contest.eventId).toBe(134);
    expect(contest.contestItemId).toBe('item-1');
  });

  it('reads contest ids from the query string when state is missing', () => {
    const contest = readJudgingFinalsContest(
      null,
      new URLSearchParams('contestId=88&eventId=134&contestItemId=item-1'),
    );

    expect(contest.pairs).toBeNull();
    expect(contest.contestId).toBe(88);
    expect(contest.eventId).toBe(134);
    expect(contest.contestItemId).toBe('item-1');
  });
});
