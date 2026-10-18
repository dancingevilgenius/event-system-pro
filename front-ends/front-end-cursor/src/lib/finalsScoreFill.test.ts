import { describe, expect, it } from 'vitest';
import { scoresAreEqual } from '../types/judgingScore';
import { distinctFinalsRawScores } from './finalsScoreFill';

describe('distinctFinalsRawScores', () => {
  it('gives every couple a different score inside the finals range', () => {
    const scores = distinctFinalsRawScores(8);
    expect(scores).toHaveLength(8);
    expect(scores.every((score) => score >= 30 && score <= 99.9)).toBe(true);
    for (let index = 0; index < scores.length; index += 1) {
      for (let other = index + 1; other < scores.length; other += 1) {
        expect(scoresAreEqual(scores[index], scores[other])).toBe(false);
      }
    }
  });

  it('stays distinct when the random source repeats a value', () => {
    const scores = distinctFinalsRawScores(4, () => 0.25);
    expect(new Set(scores.map((score) => Math.round(score * 100))).size).toBe(4);
  });
});