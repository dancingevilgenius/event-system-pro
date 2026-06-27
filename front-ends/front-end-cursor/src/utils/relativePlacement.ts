/**
 * Relative Placement (Skating System) for a single dance final.
 * Judges rank all couples; majority rules determine each final place.
 */

function skatingMajority(judgeCount: number): number {
  return Math.floor(judgeCount / 2) + 1;
}

function placementsUpTo(placements: readonly number[], level: number): number[] {
  return placements.filter((placement) => placement <= level);
}

function compareHeadToHead(a: readonly number[], b: readonly number[]): number {
  let score = 0;

  for (let index = 0; index < a.length; index += 1) {
    if (a[index] < b[index]) {
      score += 1;
    } else if (b[index] < a[index]) {
      score -= 1;
    }
  }

  if (score > 0) {
    return -1;
  }

  if (score < 0) {
    return 1;
  }

  return 0;
}

type CandidateStats = {
  bib: number;
  count: number;
  sum: number;
  placements: number[];
};

function compareTiedCandidates(a: CandidateStats, b: CandidateStats, majority: number): number {
  if (b.count !== a.count) {
    return b.count - a.count;
  }

  if (a.sum !== b.sum) {
    return a.sum - b.sum;
  }

  const maxLevel = Math.max(a.placements.length, b.placements.length);

  for (let level = 1; level <= maxLevel; level += 1) {
    const aMarks = placementsUpTo(a.placements, level);
    const bMarks = placementsUpTo(b.placements, level);

    if (aMarks.length < majority && bMarks.length < majority) {
      continue;
    }

    if (aMarks.length >= majority && bMarks.length >= majority) {
      if (bMarks.length !== aMarks.length) {
        return bMarks.length - aMarks.length;
      }

      const aSum = aMarks.reduce((total, mark) => total + mark, 0);
      const bSum = bMarks.reduce((total, mark) => total + mark, 0);

      if (aSum !== bSum) {
        return aSum - bSum;
      }
    }
  }

  return compareHeadToHead(a.placements, b.placements);
}

function pickSkatingWinner(
  candidates: readonly number[],
  placementByBib: ReadonlyMap<number, readonly number[]>,
  positionUnderReview: number,
  majority: number,
): number {
  const maxPlace = candidates.length;

  for (let level = positionUnderReview; level <= maxPlace; level += 1) {
    const eligible = candidates
      .map((bib) => {
        const placements = [...(placementByBib.get(bib) ?? [])];
        const marks = placementsUpTo(placements, level);

        return {
          bib,
          count: marks.length,
          sum: marks.reduce((total, mark) => total + mark, 0),
          placements,
        };
      })
      .filter((candidate) => candidate.count >= majority);

    if (eligible.length === 0) {
      continue;
    }

    eligible.sort((left, right) => compareTiedCandidates(left, right, majority));
    return eligible[0].bib;
  }

  const fallback = [...candidates].sort((leftBib, rightBib) => {
    const left = placementByBib.get(leftBib) ?? [];
    const right = placementByBib.get(rightBib) ?? [];
    return compareHeadToHead(left, right);
  });

  return fallback[0];
}

export function computeRelativePlacementOrder(
  bibs: readonly number[],
  placementByBib: ReadonlyMap<number, readonly number[]>,
): number[] {
  if (bibs.length === 0) {
    return [];
  }

  const judgeCount = placementByBib.get(bibs[0])?.length ?? 0;
  const majority = skatingMajority(judgeCount);
  const remaining = new Set(bibs);
  const order: number[] = [];

  while (remaining.size > 0) {
    const positionUnderReview = order.length + 1;
    const winner = pickSkatingWinner(
      [...remaining],
      placementByBib,
      positionUnderReview,
      majority,
    );

    order.push(winner);
    remaining.delete(winner);
  }

  return order;
}

export type RelativePlacementRow = {
  bib: number;
  place: number;
  judgePlacements: number[];
};

export function buildRelativePlacementRows(
  bibs: readonly number[],
  placementByBib: ReadonlyMap<number, readonly number[]>,
): RelativePlacementRow[] {
  const order = computeRelativePlacementOrder(bibs, placementByBib);

  return order.map((bib, index) => ({
    bib,
    place: index + 1,
    judgePlacements: [...(placementByBib.get(bib) ?? [])],
  }));
}
