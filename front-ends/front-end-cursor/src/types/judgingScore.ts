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

export function adjustScoreValue(value: number, delta: number): number {
  return Math.round(Math.min(99.99, Math.max(0, value + delta)) * 100) / 100;
}

export function scoresAreEqual(a: number, b: number): boolean {
  return Math.round(a * 100) === Math.round(b * 100);
}

export function findBibWithScore(
  scoreByBib: Record<number, EntryScoreState>,
  score: number,
  excludeBib: number,
): number | null {
  for (const [bibStr, state] of Object.entries(scoreByBib)) {
    const bib = Number(bibStr);

    if (bib === excludeBib || !state?.touched) {
      continue;
    }

    if (scoresAreEqual(digitsToScore(state.digits), score)) {
      return bib;
    }
  }

  return null;
}

export function findFirstDuplicateBib(
  bibNumber: number,
  scoreByBib: Record<number, EntryScoreState>,
): number | null {
  const score = scoreByBib[bibNumber];

  if (!score?.touched) {
    return null;
  }

  const value = digitsToScore(score.digits);

  if (value <= 0) {
    return null;
  }

  return findBibWithScore(scoreByBib, value, bibNumber);
}

export function setBibScore(
  scoreByBib: Record<number, EntryScoreState>,
  bib: number,
  value: number,
): Record<number, EntryScoreState> {
  return {
    ...scoreByBib,
    [bib]: { digits: scoreToDigits(value), touched: true },
  };
}

export function resolveDuplicatePreferCurrentHigher(
  scoreByBib: Record<number, EntryScoreState>,
  currentBib: number,
  otherBib: number,
): Record<number, EntryScoreState> {
  const currentValue = digitsToScore(
    scoreByBib[currentBib]?.digits ?? DEFAULT_SCORE_DIGITS,
  );
  const proposedCurrent = adjustScoreValue(currentValue, 0.1);

  if (findBibWithScore(scoreByBib, proposedCurrent, currentBib) !== null) {
    const otherValue = digitsToScore(scoreByBib[otherBib]?.digits ?? DEFAULT_SCORE_DIGITS);

    return setBibScore(scoreByBib, otherBib, adjustScoreValue(otherValue, -0.1));
  }

  return setBibScore(scoreByBib, currentBib, proposedCurrent);
}

export function resolveDuplicatePreferOtherHigher(
  scoreByBib: Record<number, EntryScoreState>,
  currentBib: number,
  otherBib: number,
): Record<number, EntryScoreState> {
  const otherValue = digitsToScore(scoreByBib[otherBib]?.digits ?? DEFAULT_SCORE_DIGITS);
  const proposedOther = adjustScoreValue(otherValue, 0.1);

  if (findBibWithScore(scoreByBib, proposedOther, otherBib) !== null) {
    const currentValue = digitsToScore(
      scoreByBib[currentBib]?.digits ?? DEFAULT_SCORE_DIGITS,
    );

    return setBibScore(scoreByBib, currentBib, adjustScoreValue(currentValue, -0.1));
  }

  return setBibScore(scoreByBib, otherBib, proposedOther);
}
