import { describe, expect, it } from 'vitest';
import {
  canManageContestPairs,
  orderSavedContestPairs,
  savedPairsOpenFinals,
  randomizeContestPairs,
  readStoredContestPairs,
  storedContestPairs,
} from './judgingPairs';

const leaders = [
  { id: 'l2', bib: 2 },
  { id: 'l1', bib: 1 },
];

const followers = [
  { id: 'f1', bib: 10 },
  { id: 'f2', bib: 20 },
  { id: 'f3', bib: 30 },
];

describe('canManageContestPairs', () => {
  it('allows Admin and Head Judge, including display labels', () => {
    expect(canManageContestPairs(['ADMIN'])).toBe(true);
    expect(canManageContestPairs(['Admin'])).toBe(true);
    expect(canManageContestPairs(['HEAD_JUDGE'])).toBe(true);
    expect(canManageContestPairs(['Head Judge'])).toBe(true);
    expect(canManageContestPairs(['JUDGE', 'Head Judge'])).toBe(true);
  });

  it('hides pair actions from a scoring Judge and from anyone else', () => {
    expect(canManageContestPairs(['JUDGE'])).toBe(false);
    expect(canManageContestPairs(['Judge'])).toBe(false);
    expect(canManageContestPairs(['STAFF'])).toBe(false);
    expect(canManageContestPairs([])).toBe(false);
    expect(canManageContestPairs(null)).toBe(false);
    expect(canManageContestPairs(undefined)).toBe(false);
    expect(canManageContestPairs({
      appRoles: ['JUDGE'],
      primary_role_code: 'JUDGE',
      contestHeadJudge: false,
    })).toBe(false);
  });

  it('allows a head judge stored only as event staff primary_role_code HEAD_JUDGE', () => {
    expect(canManageContestPairs({
      appRoles: [],
      primary_role_code: 'HEAD_JUDGE',
      secondary_role_code: '',
    })).toBe(true);
    expect(canManageContestPairs({
      appRoles: [],
      primary_role_code: 'Head Judge',
    })).toBe(true);
    expect(canManageContestPairs({
      appRoles: [],
      primary_role_code: 'HEAD JUDGE',
    })).toBe(true);
    expect(canManageContestPairs({
      appRoles: [],
      contestHeadJudge: true,
    })).toBe(true);
  });
});

describe('randomizeContestPairs', () => {
  it('keeps leaders in bib order and pairs them with a shuffled follower', () => {
    let call = 0;
    const randomValues = [0, 0];
    const result = randomizeContestPairs(leaders, followers, () => randomValues[call++] ?? 0);

    expect(result.leaders.map((person) => person.id)).toEqual(['l1', 'l2']);
    expect(result.pairs).toEqual([
      { leaderId: 'l1', followerId: 'f2' },
      { leaderId: 'l2', followerId: 'f3' },
    ]);
    expect(result.followers.map((person) => person.id)).toEqual(['f2', 'f3', 'f1']);
  });

  it('pairs every dancer when the two lists are the same length', () => {
    const result = randomizeContestPairs(
      [{ id: 'l1', bib: 1 }],
      [{ id: 'f9', bib: 9 }],
      () => 0,
    );

    expect(result.pairs).toEqual([{ leaderId: 'l1', followerId: 'f9' }]);
    expect(result.followers.map((person) => person.id)).toEqual(['f9']);
  });

  it('returns no pairs when either list is empty', () => {
    const result = randomizeContestPairs(leaders, [], () => 0);
    expect(result.pairs).toEqual([]);
    expect(result.leaders.map((person) => person.id)).toEqual(['l1', 'l2']);
    expect(result.followers).toEqual([]);
  });
});

describe('storedContestPairs', () => {
  it('stores trimmed ids and drops blank pairs', () => {
    expect(
      storedContestPairs([
        { leaderId: ' l1 ', followerId: ' f1 ' },
        { leaderId: ' ', followerId: 'f2' },
      ]),
    ).toEqual([{ leader_id: 'l1', follower_id: 'f1' }]);
  });
});

describe('orderSavedContestPairs', () => {
  const rosterLeaders = [
    { id: 'l-high', bib: 30 },
    { id: 'l-low', bib: 4 },
    { id: 'l-none' },
    { id: 'l-extra', bib: 2 },
  ];
  const rosterFollowers = [
    { id: 'f-a', bib: 11 },
    { id: 'f-b', bib: 40 },
    { id: 'f-extra', bib: 8 },
    { id: 'f-later', bib: 3 },
  ];

  it('orders saved couples by leader bib and keeps each follower on that row', () => {
    const ordered = orderSavedContestPairs(rosterLeaders, rosterFollowers, [
      { leader_id: 'l-high', follower_id: 'f-a' },
      { leader_id: 'l-none', follower_id: 'f-b' },
      { leader_id: 'l-low', follower_id: 'f-later' },
    ]);

    expect(ordered?.leaders.map((person) => person.id)).toEqual(['l-low', 'l-high', 'l-none', 'l-extra']);
    expect(ordered?.followers.map((person) => person.id)).toEqual(['f-later', 'f-a', 'f-b', 'f-extra']);
  });

  it('returns null when no saved pair matches the roster', () => {
    expect(orderSavedContestPairs(rosterLeaders, rosterFollowers, [])).toBeNull();
    expect(
      orderSavedContestPairs(rosterLeaders, rosterFollowers, [
        { leader_id: 'missing', follower_id: 'f-a' },
      ]),
    ).toBeNull();
  });
});

describe('savedPairsOpenFinals', () => {
  it('sends Score to finals when saved couples exist', () => {
    expect(savedPairsOpenFinals([
      { leader_id: 'leader-aaa', follower_id: 'follower-ddd' },
      { leader_id: 'leader-bbb', follower_id: 'follower-ccc' },
    ])).toBe(true);
  });

  it('keeps Score on the pairs dialog when nothing is saved', () => {
    expect(savedPairsOpenFinals([])).toBe(false);
    expect(savedPairsOpenFinals(undefined)).toBe(false);
  });
});

describe('readStoredContestPairs', () => {
  it('reads a non-empty stored pairs list', () => {
    expect(
      readStoredContestPairs([
        { leader_id: ' l1 ', follower_id: ' f1 ' },
        { leader_id: 'l2', follower_id: 'f2' },
      ]),
    ).toEqual([
      { leader_id: 'l1', follower_id: 'f1' },
      { leader_id: 'l2', follower_id: 'f2' },
    ]);
  });

  it('reads camelCase ids from route state', () => {
    expect(readStoredContestPairs([{ leaderId: 'l1', followerId: 'f1' }])).toEqual([
      { leader_id: 'l1', follower_id: 'f1' },
    ]);
  });

  it('treats a missing, empty, or blank list as not paired', () => {
    expect(readStoredContestPairs(undefined)).toEqual([]);
    expect(readStoredContestPairs({ leader_id: 'l1', follower_id: 'f1' })).toEqual([]);
    expect(readStoredContestPairs([])).toEqual([]);
    expect(readStoredContestPairs([{ leader_id: ' ', follower_id: 'f1' }, null, 'pair'])).toEqual([]);
  });
});
