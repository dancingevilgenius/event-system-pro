import { describe, expect, it } from 'vitest';
import {
  accountsToCreate,
  assignTestCompetitorBibs,
  createTestCompetitorsConfirmText,
  deleteGeneratedCompetitorsConfirmText,
  generatedCompetitorLastNames,
  generatedCompetitorRoster,
  isGeneratedCompetitor,
  isGeneratedCompetitorId,
  rosterHasGeneratedCompetitors,
  testCompetitorCount,
} from './generatedCompetitors';

describe('testCompetitorCount', () => {
  it('accepts integers from 1 through 199', () => {
    expect(testCompetitorCount('1')).toBe(1);
    expect(testCompetitorCount('26')).toBe(26);
    expect(testCompetitorCount('199')).toBe(199);
  });

  it('rejects empty, zero, decimals, negatives, and 200 or more', () => {
    expect(testCompetitorCount('')).toBeNull();
    expect(testCompetitorCount('0')).toBeNull();
    expect(testCompetitorCount('00')).toBeNull();
    expect(testCompetitorCount('1.5')).toBeNull();
    expect(testCompetitorCount('-1')).toBeNull();
    expect(testCompetitorCount('200')).toBeNull();
    expect(testCompetitorCount('201')).toBeNull();
    expect(testCompetitorCount('abc')).toBeNull();
    expect(testCompetitorCount('12a')).toBeNull();
    expect(testCompetitorCount(' 12')).toBeNull();
  });
});

describe('generatedCompetitorLastNames', () => {
  it('repeats each letter three times from aaa through zzz', () => {
    const names = generatedCompetitorLastNames();
    expect(names).toHaveLength(26);
    expect(names[0]).toBe('aaa');
    expect(names[1]).toBe('bbb');
    expect(names[25]).toBe('zzz');
  });
});

describe('assignTestCompetitorBibs', () => {
  it('uses bibs 1-26 and 27-52 when none are taken', () => {
    const roster = assignTestCompetitorBibs(new Set());
    const leaders = roster.filter((person) => person.role === 'leader');
    const followers = roster.filter((person) => person.role === 'follower');

    expect(leaders.map((person) => person.bib)).toEqual(
      Array.from({ length: 26 }, (_, index) => index + 1),
    );
    expect(followers.map((person) => person.bib)).toEqual(
      Array.from({ length: 26 }, (_, index) => index + 27),
    );
    expect(new Set(roster.map((person) => person.bib)).size).toBe(52);
  });

  it('skips bibs already used and records each assignment before the next person', () => {
    const roster = assignTestCompetitorBibs(new Set([1, 2, 27]));
    const leaders = roster.filter((person) => person.role === 'leader');
    const followers = roster.filter((person) => person.role === 'follower');

    expect(leaders[0]).toMatchObject({ id: 'leader-aaa', bib: 3 });
    expect(leaders[1]).toMatchObject({ id: 'leader-bbb', bib: 4 });
    expect(followers[0].bib).toBeGreaterThan(27);
    expect(new Set(roster.map((person) => person.bib)).size).toBe(52);
    expect(roster.some((person) => person.bib === 1 || person.bib === 2 || person.bib === 27)).toBe(false);
  });

  it('creates the requested count of each role and keeps aaa–zzz first', () => {
    const roster = assignTestCompetitorBibs(new Set(), 3);
    const leaders = roster.filter((person) => person.role === 'leader');
    const followers = roster.filter((person) => person.role === 'follower');

    expect(leaders.map((person) => person.lastName)).toEqual(['aaa', 'bbb', 'ccc']);
    expect(followers.map((person) => person.bib)).toEqual([4, 5, 6]);
    expect(leaders).toHaveLength(3);
    expect(followers).toHaveLength(3);

    const extended = assignTestCompetitorBibs(new Set(), 27);
    expect(extended.filter((person) => person.role === 'leader')[26]).toMatchObject({
      id: 'leader-aaa1',
      lastName: 'aaa1',
      bib: 27,
    });
    expect(isGeneratedCompetitor({ firstName: 'Leader', lastName: 'aaa1' })).toBe(true);
  });
});

describe('generatedCompetitorRoster', () => {
  it('builds 26 leaders and 26 followers with stable ids', () => {
    const roster = generatedCompetitorRoster();
    const leaders = roster.filter((person) => person.role === 'leader');
    const followers = roster.filter((person) => person.role === 'follower');

    expect(leaders.map((person) => person.firstName)).toEqual(Array(26).fill('Leader'));
    expect(followers.map((person) => person.firstName)).toEqual(Array(26).fill('Follower'));
    expect(leaders.map((person) => person.lastName)).toEqual(generatedCompetitorLastNames());
    expect(leaders.map((person) => person.id)).toEqual(
      generatedCompetitorLastNames().map((lastName) => `leader-${lastName}`),
    );
    expect(followers.map((person) => person.id)).toEqual(
      generatedCompetitorLastNames().map((lastName) => `follower-${lastName}`),
    );
    expect(isGeneratedCompetitorId('leader-aaa')).toBe(true);
    expect(isGeneratedCompetitorId('follower-zzz')).toBe(true);
    expect(isGeneratedCompetitorId('someone-else')).toBe(false);
  });
});

describe('rosterHasGeneratedCompetitors', () => {
  it('is true when any generated id is on the roster', () => {
    expect(rosterHasGeneratedCompetitors([{ id: 'real-1' }, { id: 'follower-mmm' }])).toBe(true);
    expect(rosterHasGeneratedCompetitors([{ id: 'faaa', firstName: 'Follower', lastName: 'aaa' }])).toBe(true);
    expect(rosterHasGeneratedCompetitors([{ id: 'real-1', firstName: 'Ada', lastName: 'Lovelace' }])).toBe(false);
  });
});

describe('accountsToCreate', () => {
  it('skips people who already have an account and keeps missing names', () => {
    const roster = generatedCompetitorRoster();
    const pending = accountsToCreate(roster, {
      'leader-aaa': 'registered',
      'leader-bbb': 'partial',
      'follower-aaa': 'none',
    });

    expect(pending.map((person) => person.id)).not.toContain('leader-aaa');
    expect(pending.map((person) => person.id)).not.toContain('leader-bbb');
    expect(pending.map((person) => person.id)).toContain('follower-aaa');
    expect(pending).toHaveLength(50);
  });
});

describe('test competitor messages', () => {
  it('names the skill level and competition type without calling it generate', () => {
    const contest = {
      eventName: 'All-Clone Jack and Jill',
      skillLevelLabel: 'All-American',
      divisionLabel: 'Jack and Jill',
    };
    expect(createTestCompetitorsConfirmText({ skillLevelLabel: 'Novice', divisionLabel: 'Jack and Jill' }, 26)).toBe(
      'This will scratch the current competitors, then add 26 leaders and 26 followers to Novice Jack and Jill.',
    );
    expect(deleteGeneratedCompetitorsConfirmText(contest)).toBe(
      'This will scratch the generated test competitors on All-Clone Jack and Jill, All-American Jack and Jill. Other competitors will stay registered.',
    );
    expect(createTestCompetitorsConfirmText(contest, 4)).toBe(
      'This will scratch the current competitors, then add 4 leaders and 4 followers to All-Clone Jack and Jill, All-American Jack and Jill.',
    );
    expect(createTestCompetitorsConfirmText(contest, 26)).not.toContain('Generate Competitors');
    expect(deleteGeneratedCompetitorsConfirmText(contest)).not.toContain('Generate Competitors');
  });
});
