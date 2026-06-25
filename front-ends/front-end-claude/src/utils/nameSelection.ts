import { ALL_CHARACTERS, Character, EXCLUDED_WORDS, Sex } from '../data/legionNames';
import { BIB_MAX, BIB_MIN, COUPLE_COUNT } from '../constants/layout';

export interface Couple {
  bib: number;
  leader: Character;
  follower: Character;
}

/**
 * Returns true if the name passes the exclusion-word filter: neither the
 * first nor last name may contain any EXCLUDED_WORDS as a WHOLE WORD
 * (case-insensitive, word-boundary based — substrings like "Landry" or
 * "Manhunter" are fine).
 */
export function isNameAllowed(character: Character): boolean {
  const words = `${character.firstName} ${character.lastName}`
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter(Boolean);
  return !EXCLUDED_WORDS.some((banned) => words.includes(banned));
}

/** Picks a random integer in [min, max] inclusive. */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Picks a random element from an array. */
function randomFrom<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

/**
 * Generates N unique, ascending, sorted bib numbers in [BIB_MIN, BIB_MAX].
 */
function generateBibNumbers(count: number): number[] {
  const bibs = new Set<number>();
  while (bibs.size < count) {
    bibs.add(randomInt(BIB_MIN, BIB_MAX));
  }
  return Array.from(bibs).sort((a, b) => a - b);
}

/**
 * Picks one character for a role from the still-available pool.
 * 90% of the time prefers `preferredSex`; falls back to "anyone available"
 * if the preferred-sex sub-pool is empty, or 10% of the time by design.
 */
function pickCharacter(available: Character[], preferredSex: Sex): Character {
  const preferredPool = available.filter((c) => c.sex === preferredSex);
  const usePreferred = preferredPool.length > 0 && Math.random() < 0.9;
  const pool = usePreferred ? preferredPool : available;
  return randomFrom(pool);
}

/**
 * Generates the full set of COUPLE_COUNT couples for one page load:
 * - Unique ascending bib numbers
 * - Leader: male 90% of the time, Follower: female 90% of the time
 * - Every character used at most once across the whole dataset (either role)
 * - Only allowed (non-excluded) names are eligible
 */
export function generateCouples(): Couple[] {
  const eligible = ALL_CHARACTERS.filter(isNameAllowed);
  let available = [...eligible];
  const bibs = generateBibNumbers(COUPLE_COUNT);

  const couples: Couple[] = bibs.map((bib) => {
    const leader = pickCharacter(available, 'male');
    available = available.filter((c) => c !== leader);

    const follower = pickCharacter(available, 'female');
    available = available.filter((c) => c !== follower);

    return { bib, leader, follower };
  });

  return couples;
}
