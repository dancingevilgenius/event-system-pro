import { describe, expect, it } from 'vitest';
import { randomizeContestPairs, readStoredContestPairs, storedContestPairs } from './judgingPairs';

const leaders = [
  { id: 'l2', bib: 2 },
  { id: 'l1', bib: 1 },
];

const followers = [
  { id: 'f1', bib: 10 },
  { id: 'f2', bib: 20 },
  { id: 'f3', bib: 30 },
];

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
