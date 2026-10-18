import { digitsToScore, scoreToDigits } from '../types/judgingScore';

/** Inclusive raw-score window used by the finals "Assign Random Scores" action. */
const MIN_SCORE = 30;
const MAX_SCORE = 99.9;

function cents(score: number): number {
  return Math.round(score * 100);
}

/**
 * One distinct raw score per couple, inside the finals score range.
 * Values round-trip through the judging digit input so they stay valid scores.
 */
export function distinctFinalsRawScores(
  coupleCount: number,
  random: () => number = Math.random,
): number[] {
  if (!Number.isInteger(coupleCount) || coupleCount < 0) {
    throw new Error('Couple count must be a whole number.');
  }
  const minCents = cents(MIN_SCORE);
  const maxCents = cents(MAX_SCORE);
  const span = maxCents - minCents + 1;
  if (coupleCount > span) {
    throw new Error('Not enough distinct scores for every couple.');
  }

  const used = new Set<number>();
  const scores: number[] = [];
  let guard = 0;
  while (scores.length < coupleCount && guard < coupleCount * 30) {
    guard += 1;
    const picked = minCents + Math.floor(random() * span);
    if (used.has(picked)) {
      continue;
    }
    used.add(picked);
    scores.push(digitsToScore(scoreToDigits(picked / 100)));
  }
  for (let picked = minCents; picked <= maxCents && scores.length < coupleCount; picked += 1) {
    if (used.has(picked)) {
      continue;
    }
    used.add(picked);
    scores.push(digitsToScore(scoreToDigits(picked / 100)));
  }
  return scores;
}
