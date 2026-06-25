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

export function scoreToDigits(value: number): JudgingScoreDigits {
  const rounded = Math.round(Math.min(99.99, Math.max(0, value)) * 100) / 100;
  const tens = Math.floor(rounded / 10);
  const ones = Math.floor(rounded) % 10;
  const tenth = Math.floor(rounded * 10) % 10;
  const hundredth = Math.round(rounded * 100) % 10;

  return [tens, ones, tenth, hundredth];
}

export function randomScoreDigitsBetween(
  min: number,
  max: number,
): JudgingScoreDigits {
  const minCents = Math.round(min * 100);
  const maxCents = Math.round(max * 100);
  const cents = minCents + Math.floor(Math.random() * (maxCents - minCents + 1));

  return scoreToDigits(cents / 100);
}
