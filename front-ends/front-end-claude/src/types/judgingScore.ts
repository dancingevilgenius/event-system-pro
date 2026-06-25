import { SCORE_MAX, SCORE_MIN } from '../constants/layout';

/**
 * A raw score is represented internally as a number 0–99.99, but entered via
 * 4 independent digit dropdowns: [tens, ones, tenths, hundredths].
 * Display format is always XX.XX, e.g. 87.43, 00.00.
 */
export type ScoreDigits = [number, number, number, number];

export interface RawScoreState {
  /** Whether any digit has ever been changed from its initial state. */
  touched: boolean;
  /** Current numeric value, always within [SCORE_MIN, SCORE_MAX]. */
  value: number;
}

/** Converts a numeric score (0–99.99) into its 4 display digits. */
export function scoreToDigits(value: number): ScoreDigits {
  const clamped = Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
  // Round to avoid floating point drift (e.g. 87.430000000001).
  const cents = Math.round(clamped * 100);
  const tens = Math.floor(cents / 1000);
  const ones = Math.floor((cents % 1000) / 100);
  const tenths = Math.floor((cents % 100) / 10);
  const hundredths = cents % 10;
  return [tens, ones, tenths, hundredths];
}

/** Converts 4 display digits back into a numeric score. */
export function digitsToScore(digits: ScoreDigits): number {
  const [tens, ones, tenths, hundredths] = digits;
  const cents = tens * 1000 + ones * 100 + tenths * 10 + hundredths;
  return roundToCents(cents / 100);
}

/** Rounds a cents-based integer division back to a clean 2-decimal number. */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Formats a numeric score as XX.XX for display. */
export function formatScore(value: number): string {
  const clamped = Math.min(SCORE_MAX, Math.max(SCORE_MIN, value));
  return clamped.toFixed(2).padStart(5, '0');
}

/** A couple counts as "scored" only if touched AND value is strictly > 0. */
export function isScored(state: RawScoreState): boolean {
  return state.touched && state.value > 0;
}

/** Unscored Only treats a couple as unscored if never touched, or touched but still <= 0. */
export function isUnscored(state: RawScoreState): boolean {
  return !state.touched || state.value <= 0;
}

/** Clamps a raw numeric adjustment (e.g. +0.1/-0.1) within the legal score range. */
export function clampScore(value: number): number {
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, roundToCents(value)));
}
