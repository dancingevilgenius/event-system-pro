export type NameDisplayLevel = 0 | 1 | 2 | 3;

/**
 * Progressive shortening levels for "Leader · Follower" display:
 * 0: both full first names
 * 1: leader initial + follower full
 * 2: leader full + follower initial
 * 3: both initials
 */
export function formatCoupleNames(
  leaderFirst: string,
  followerFirst: string,
  level: NameDisplayLevel,
): string {
  const leaderInitial = `${leaderFirst.charAt(0)}.`;
  const followerInitial = `${followerFirst.charAt(0)}.`;

  switch (level) {
    case 0:
      return `${leaderFirst} · ${followerFirst}`;
    case 1:
      return `${leaderInitial} · ${followerFirst}`;
    case 2:
      return `${leaderFirst} · ${followerInitial}`;
    case 3:
      return `${leaderInitial} · ${followerInitial}`;
  }
}

/**
 * Estimates the shortening level needed given available width and the space
 * already consumed by color swatches. Uses a rough character-width heuristic
 * (~7.5px/char at the summary row's font size) since real text measurement
 * requires a mounted canvas/DOM node.
 */
export function pickNameDisplayLevel(
  leaderFirst: string,
  followerFirst: string,
  availableWidthPx: number,
  swatchWidthPx: number,
): NameDisplayLevel {
  const usableWidth = availableWidthPx - swatchWidthPx;
  const CHAR_WIDTH = 7.5;
  const SEPARATOR_WIDTH = 3 * CHAR_WIDTH; // " · "

  for (const level of [0, 1, 2, 3] as NameDisplayLevel[]) {
    const text = formatCoupleNames(leaderFirst, followerFirst, level);
    const estimatedWidth = (text.length - 3) * CHAR_WIDTH + SEPARATOR_WIDTH;
    if (estimatedWidth <= usableWidth) {
      return level;
    }
  }
  return 3;
}
