import { describe, expect, it } from 'vitest';
import {
  assignBibNumbers,
  formatCheckinName,
  pairCheckinCouples,
  randomWindowOffset,
  sampleItems,
  type CheckinPerson,
} from './checkinRoster';

function steppingRandom() {
  let cursor = 0;
  return () => {
    cursor += 0.17;
    return cursor % 1;
  };
}

const leader = (userId: number): CheckinPerson => ({
  userId,
  firstName: `Leader${userId}`,
  lastName: 'Test',
});

const follower = (userId: number): CheckinPerson => ({
  userId,
  firstName: `Follower${userId}`,
  lastName: 'Test',
});

describe('checkinRoster', () => {
  it('formats a first and last name', () => {
    expect(formatCheckinName({ firstName: 'Bruce', lastName: 'Wayne' })).toBe('Bruce Wayne');
    expect(formatCheckinName({ firstName: '  ', lastName: '' })).toBe('—');
  });

  it('samples without mutating the source list', () => {
    const items = [1, 2, 3, 4, 5];
    const sampled = sampleItems(items, 3, () => 0);

    expect(items).toEqual([1, 2, 3, 4, 5]);
    expect(sampled).toHaveLength(3);
    expect(sampled.every((value) => items.includes(value))).toBe(true);
    expect(new Set(sampled).size).toBe(3);
  });

  it('keeps a random window inside the available rows', () => {
    expect(randomWindowOffset(100, 80, () => 0)).toBe(0);
    expect(randomWindowOffset(100, 80, () => 0.999)).toBe(20);
    expect(randomWindowOffset(5, 80, () => 0.5)).toBe(0);
  });

  it('assigns unique bib numbers', () => {
    const bibs = assignBibNumbers(10, steppingRandom());

    expect(bibs).toHaveLength(10);
    expect(new Set(bibs).size).toBe(10);
    expect(bibs).toEqual([...bibs].sort((left, right) => Number(left) - Number(right)));
    for (const bib of bibs) {
      expect(bib).toMatch(/^\d{3}$/);
    }
  });

  it('pairs leaders and followers up to the shorter list', () => {
    const couples = pairCheckinCouples(
      [leader(1), leader(2)],
      [follower(3)],
      ['101', '102'],
    );

    expect(couples).toEqual([
      { bib: '101', leader: leader(1), follower: follower(3) },
    ]);
  });
});
