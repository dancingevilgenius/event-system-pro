import { describe, expect, it } from 'vitest';
import { buildRelativePlacementRows } from '../utils/relativePlacement';
import {
  findHeadJudgeId,
  judgeColumnLabel,
  judgeIdsForResultsColumns,
  placementInputFromJudgeBallots,
  resolveRelativePlacement,
  scoringJudgeIds,
} from './relativePlacementResults';

function ballot(
  judgeId: string,
  placements: Array<[number, number]>,
  name?: { first_name?: string; last_name?: string },
) {
  return {
    judge_id: judgeId,
    ...name,
    placements: placements.map(([competitorId, placement]) => ({
      competitor_id: competitorId,
      placement,
      score: 100 - placement,
    })),
  };
}

describe('judgeColumnLabel', () => {
  it('uses the first and last initials of the judge name', () => {
    const used = new Set<string>();
    expect(judgeColumnLabel({ firstName: 'Carlos', lastName: 'Garcia' }, 'staff-1', used)).toBe('CG');
    expect(
      judgeColumnLabel({ firstName: 'Elizabeth', lastName: 'Gutzwiler-Daigle' }, 'staff-2', used),
    ).toBe('EG');
    expect(judgeColumnLabel({ displayName: 'Ada Lovelace' }, 'staff-3', used)).toBe('AL');
  });

  it('keeps colliding initials unique and never falls back to J1', () => {
    const used = new Set<string>();
    expect(judgeColumnLabel({ firstName: 'Carlos', lastName: 'Garcia' }, 'staff-1', used)).toBe('CG');
    expect(judgeColumnLabel({ firstName: 'Cara', lastName: 'Gomez' }, 'staff-2', used)).toBe('CG2');
    expect(judgeColumnLabel({}, 'J1', used)).not.toMatch(/^J\d+$/);
    expect(judgeColumnLabel({}, 'panel-9', used)).toBe('PA');
    expect(judgeColumnLabel({}, 'panel-8', used)).toBe('PA2');
    expect(judgeColumnLabel({}, '', used)).not.toMatch(/^J\d+$/);
  });
});

describe('placementInputFromJudgeBallots', () => {
  it('builds ordinals only after every assigned judge has submitted', () => {
    const assigned = ['ann', 'ben', 'cy', 'dee', 'eli'];
    const partial = assigned.slice(0, 4).map((id, index) =>
      ballot(id, [
        [4, index === 0 ? 1 : 2],
        [9, index === 0 ? 2 : 1],
      ]),
    );
    expect(placementInputFromJudgeBallots(assigned, partial)).toBeNull();
    expect(placementInputFromJudgeBallots([], [ballot('ann', [[4, 1]])])).toBeNull();

    const ballots = [
      ballot('ann', [[4, 1], [9, 2]]),
      ballot('ben', [[4, 1], [9, 2]]),
      ballot('cy', [[4, 1], [9, 2]]),
      ballot('dee', [[4, 2], [9, 1]]),
      ballot('eli', [[4, 2], [9, 1]]),
      ballot('guest', [[4, 5], [9, 5]]),
    ];
    const input = placementInputFromJudgeBallots(assigned, ballots);
    expect(input).not.toBeNull();
    expect(input?.judgeIds).toEqual(assigned);
    expect(input?.placementByBib.get(4)).toEqual([1, 1, 1, 2, 2]);
    expect(input?.placementByBib.get(9)).toEqual([2, 2, 2, 1, 1]);
    expect(input?.placementByBib.get(4)).toHaveLength(5);
  });

  it('runs relative placement from those ordinals and uses judge initials', () => {
    const saved = resolveRelativePlacement({
      assignedIds: ['cg', 'eg', 'missing'],
      ballots: [
        ballot('cg', [[11, 1], [22, 2]], { first_name: 'Carlos', last_name: 'Garcia' }),
        ballot('eg', [[11, 1], [22, 2]]),
        ballot('missing', [[11, 2], [22, 1]]),
      ],
      directory: new Map([
        ['eg', { firstName: 'Elizabeth', lastName: 'Gutzwiler-Daigle', displayName: '', userId: null }],
      ]),
      couplesByBib: new Map([
        [
          11,
          {
            bib: 11,
            leaderBib: 11,
            followerBib: 40,
            leaderFirst: 'Ada',
            leaderLast: 'Lovelace',
            followerFirst: 'Grace',
            followerLast: 'Hopper',
          },
        ],
      ]),
      eventName: 'All American',
      skillLevel: 'Advanced',
      division: 'Jack and Jill',
      computedAt: 'Oct 17, 2026, 6:00:00 PM CDT',
    });

    expect(saved?.judges.map((judge) => judge.initials)).toEqual(['CG', 'EG', 'MI']);
    expect(saved?.rows.map((row) => [row.bib, row.place])).toEqual([
      [11, 1],
      [22, 2],
    ]);
    expect(saved?.rows[0]).toMatchObject({
      leaderFirst: 'Ada',
      leaderLast: 'Lovelace',
      followerFirst: 'Grace',
      followerLast: 'Hopper',
      leaderBib: 11,
      followerBib: 40,
      judgePlacements: [1, 1, 2],
    });
    expect(saved?.eventName).toBe('All American');
    expect(saved?.division).toBe('Jack and Jill');
  });
});

describe('even and odd judge panels', () => {
  const regulars = ['j1', 'j2', 'j3', 'j4', 'j5'];
  const head = 'head-staff';

  it('finds the head judge from the contest assignment or HEAD_JUDGE role', () => {
    expect(findHeadJudgeId({
      assignedIds: [...regulars, head],
      records: [{ head_judge_staff_id: head, username: 'yantonacci' }],
    })).toBe(head);
    expect(findHeadJudgeId({
      assignedIds: [...regulars, head],
      records: [{ id: head, primary_role_code: 'HEAD_JUDGE', username: 'yantonacci' }],
    })).toBe(head);
    expect(findHeadJudgeId({
      assignedIds: [...regulars, head],
      ballots: [{ judge_id: head, role: 'HEAD_JUDGE', placements: [] }],
    })).toBe(head);
    expect(findHeadJudgeId({
      assignedIds: regulars,
      records: [{ username: 'yantonacci', primary_role_code: 'JUDGE' }],
    })).toBeNull();
  });

  it('drops the head judge from an even panel and still shows that column last', () => {
    const assigned = [head, ...regulars];
    expect(scoringJudgeIds(assigned, head)).toEqual(regulars);
    expect(judgeIdsForResultsColumns(assigned, head)).toEqual([...regulars, head]);

    const ballots = [
      ballot(head, [[10, 2], [20, 1]], { first_name: 'Yvonne', last_name: 'Antonacci' }),
      ballot('j1', [[10, 1], [20, 2]]),
      ballot('j2', [[10, 1], [20, 2]]),
      ballot('j3', [[10, 1], [20, 2]]),
      ballot('j4', [[10, 2], [20, 1]]),
      ballot('j5', [[10, 2], [20, 1]]),
    ];
    const saved = resolveRelativePlacement({
      assignedIds: assigned,
      headJudgeId: head,
      ballots,
      computedAt: 'Oct 17, 2026, 7:00:00 PM CDT',
    });
    const scoringOnly = buildRelativePlacementRows(
      [10, 20],
      new Map([
        [10, [1, 1, 1, 2, 2]],
        [20, [2, 2, 2, 1, 1]],
      ]),
    );

    expect(saved?.scoringJudgeIds).toEqual(regulars);
    expect(saved?.scoringJudgeIds).not.toContain(head);
    expect(saved?.judges.map((judge) => judge.id)).toEqual([...regulars, head]);
    expect(saved?.judges.at(-1)).toMatchObject({ id: head, initials: 'YA', headJudge: true });
    expect(saved?.rows.map((row) => [row.bib, row.place])).toEqual(
      scoringOnly.map((row) => [row.bib, row.place]),
    );
    expect(saved?.rows.find((row) => row.bib === 10)?.judgePlacements.at(-1)).toBe(2);
  });

  it('keeps the head judge in an odd panel and still shows that column last', () => {
    const panel = [head, 'j1', 'j2', 'j3', 'j4'];
    expect(scoringJudgeIds(panel, head)).toEqual(panel);
    expect(judgeIdsForResultsColumns(panel, head)).toEqual(['j1', 'j2', 'j3', 'j4', head]);

    const saved = resolveRelativePlacement({
      assignedIds: panel,
      headJudgeId: head,
      ballots: [
        ballot(head, [[10, 1], [20, 2]]),
        ballot('j1', [[10, 2], [20, 1]]),
        ballot('j2', [[10, 2], [20, 1]]),
        ballot('j3', [[10, 2], [20, 1]]),
        ballot('j4', [[10, 1], [20, 2]]),
      ],
      computedAt: 'Oct 17, 2026, 7:00:00 PM CDT',
    });
    const withHead = buildRelativePlacementRows(
      [10, 20],
      new Map([
        [10, [1, 2, 2, 2, 1]],
        [20, [2, 1, 1, 1, 2]],
      ]),
    );

    expect(saved?.scoringJudgeIds).toEqual(panel);
    expect(saved?.judges.map((judge) => judge.id)).toEqual(['j1', 'j2', 'j3', 'j4', head]);
    expect(saved?.judges.at(-1)?.headJudge).toBe(true);
    expect(saved?.rows.map((row) => [row.bib, row.place])).toEqual(
      withHead.map((row) => [row.bib, row.place]),
    );
  });
});
