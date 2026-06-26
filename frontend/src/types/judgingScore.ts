export interface RawScoreDigits {
  // Score XX.XX -> digits[0]=tens, [1]=ones, [2]=tenths, [3]=hundredths
  digits: [number, number, number, number];
  touched: boolean;
}

export function emptyRawScore(): RawScoreDigits {
  return { digits: [0, 0, 0, 0], touched: false };
}

export function scoreFromDigits(d: [number, number, number, number]): number {
  return d[0] * 10 + d[1] + d[2] / 10 + d[3] / 100;
}

export function digitsFromScore(score: number): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(99.99, score));
  const cents = Math.round(clamped * 100);
  const tens = Math.floor(cents / 1000);
  const ones = Math.floor((cents % 1000) / 100);
  const tenths = Math.floor((cents % 100) / 10);
  const hundredths = cents % 10;
  return [tens, ones, tenths, hundredths];
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}

export function isScored(rs: RawScoreDigits): boolean {
  return scoreFromDigits(rs.digits) > 0;
}

export type Role = "leader" | "follower";

export interface CompetitorColors {
  top?: string;
  bottom?: string;
}

export interface Couple {
  bib: number;
  leaderFirst: string;
  leaderLast: string;
  followerFirst: string;
  followerLast: string;
  raw: RawScoreDigits;
  leaderColors: CompetitorColors;
  followerColors: CompetitorColors;
}
