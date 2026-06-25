export type JudgingScoreDigits = [number, number, number, number];

export const DEFAULT_SCORE_DIGITS: JudgingScoreDigits = [0, 0, 0, 0];

export const SCORE_DIGIT_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type EntryScoreState = {
  digits: JudgingScoreDigits;
  touched: boolean;
};

export function emptyEntryScoreState(): EntryScoreState {
  return { digits: [...DEFAULT_SCORE_DIGITS], touched: false };
}

export function digitsToScore(digits: JudgingScoreDigits): number {
  const [tens, ones, tenth, hundredth] = digits;

  return Math.min(99.99, tens * 10 + ones + tenth * 0.1 + hundredth * 0.01);
}

export function formatScoreDisplay(digits: JudgingScoreDigits): string {
  const [tens, ones, tenth, hundredth] = digits;

  return `${tens}${ones}.${tenth}${hundredth}`;
}
