import { memberKey, pickRandomLegionMember, type LegionMember } from './legionNames';
import {
  digitsToScore,
  randomScoreDigitsBetween,
  scoresAreEqual,
} from '../types/judgingScore';

export const MOCK_CONTEST_ENTRY_COUNT = 20;
export const MOCK_JUDGE_COUNT = 7;

export const MOCK_JUDGE_LABELS = Array.from(
  { length: MOCK_JUDGE_COUNT },
  (_, index) => `J${index + 1}`,
);

export type MockContestEntry = {
  number: number;
  leader: LegionMember;
  follower: LegionMember;
};

export function createMockContestEntries(): MockContestEntry[] {
  const numbers = new Set<number>();

  while (numbers.size < MOCK_CONTEST_ENTRY_COUNT) {
    numbers.add(Math.floor(Math.random() * 999) + 1);
  }

  const usedMemberKeys = new Set<string>();

  return [...numbers]
    .sort((a, b) => a - b)
    .map((number) => {
      const leader = pickRandomLegionMember({ preferSex: 'male', usedKeys: usedMemberKeys });
      usedMemberKeys.add(memberKey(leader));

      const follower = pickRandomLegionMember({
        preferSex: 'female',
        usedKeys: usedMemberKeys,
      });
      usedMemberKeys.add(memberKey(follower));

      return { number, leader, follower };
    });
}

/** Same range as Judging page "Assign Random Scores" (30.0–99.9). */
export function assignRandomJudgeScores(
  entries: readonly MockContestEntry[],
): Record<number, number> {
  const scores: Record<number, number> = {};

  for (const entry of entries) {
    scores[entry.number] = digitsToScore(randomScoreDigitsBetween(30.0, 99.9));
  }

  return scores;
}

export function computeJudgePlacements(
  scores: Record<number, number>,
): Record<number, number> {
  const bibs = Object.keys(scores).map(Number);
  const sorted = [...bibs].sort((a, b) => scores[b] - scores[a]);
  const placements: Record<number, number> = {};

  for (let index = 0; index < sorted.length; ) {
    let end = index;

    while (
      end < sorted.length &&
      scoresAreEqual(scores[sorted[end]], scores[sorted[index]])
    ) {
      end += 1;
    }

    const placement = index + 1;

    for (let cursor = index; cursor < end; cursor += 1) {
      placements[sorted[cursor]] = placement;
    }

    index = end;
  }

  return placements;
}

export type MockContestJudgeSheet = {
  label: string;
  scores: Record<number, number>;
  placements: Record<number, number>;
};

export function buildMockJudgeSheets(
  entries: readonly MockContestEntry[],
): MockContestJudgeSheet[] {
  return MOCK_JUDGE_LABELS.map((label) => {
    const scores = assignRandomJudgeScores(entries);
    return {
      label,
      scores,
      placements: computeJudgePlacements(scores),
    };
  });
}
