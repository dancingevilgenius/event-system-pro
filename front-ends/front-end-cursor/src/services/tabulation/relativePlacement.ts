import type {
  CompetitorId,
  CompetitorPlacement,
  JudgeBallot,
  TabulationResult,
  TabulationStanding,
} from './types';

function majorityThreshold(judgeCount: number): number {
  return Math.floor(judgeCount / 2) + 1;
}

function placementMap(placements: CompetitorPlacement[]): Map<CompetitorId, number> {
  return new Map(placements.map((entry) => [entry.competitorId, entry.placement]));
}

function countAtOrBetter(
  ballots: JudgeBallot[],
  competitorId: CompetitorId,
  level: number,
): number {
  let count = 0;

  for (const ballot of ballots) {
    const placement = placementMap(ballot.placements).get(competitorId);

    if (placement !== undefined && placement <= level) {
      count += 1;
    }
  }

  return count;
}

function placementTotal(ballots: JudgeBallot[], competitorId: CompetitorId): number {
  return ballots.reduce((total, ballot) => {
    const placement = placementMap(ballot.placements).get(competitorId) ?? 0;
    return total + placement;
  }, 0);
}

function judgePlacementsFor(
  ballots: JudgeBallot[],
  competitorId: CompetitorId,
): Record<string, number> {
  const result: Record<string, number> = {};

  for (const ballot of ballots) {
    const placement = placementMap(ballot.placements).get(competitorId);

    if (placement !== undefined) {
      result[String(ballot.judgeId)] = placement;
    }
  }

  return result;
}

function pickWinner(
  ballots: JudgeBallot[],
  remaining: CompetitorId[],
): CompetitorId {
  const majority = majorityThreshold(ballots.length);
  const maxLevel = remaining.length;

  for (let level = 1; level <= maxLevel; level += 1) {
    const counts = new Map(
      remaining.map((competitorId) => [
        competitorId,
        countAtOrBetter(ballots, competitorId, level),
      ]),
    );
    const bestCount = Math.max(...counts.values());
    const candidates = remaining.filter((competitorId) => counts.get(competitorId) === bestCount);

    if (bestCount < majority) {
      continue;
    }

    if (candidates.length === 1) {
      return candidates[0];
    }

    const totals = new Map(
      candidates.map((competitorId) => [competitorId, placementTotal(ballots, competitorId)]),
    );
    const lowestTotal = Math.min(...totals.values());
    const lowestTotalCandidates = candidates.filter(
      (competitorId) => totals.get(competitorId) === lowestTotal,
    );

    if (lowestTotalCandidates.length === 1) {
      return lowestTotalCandidates[0];
    }
  }

  return [...remaining].sort((a, b) => {
    const totalDiff = placementTotal(ballots, a) - placementTotal(ballots, b);

    if (totalDiff !== 0) {
      return totalDiff;
    }

    return String(a).localeCompare(String(b), undefined, { numeric: true });
  })[0];
}

/**
 * Apply the relative placement majority algorithm across multiple judge ballots.
 */
export function tabulateRelativePlacement(ballots: JudgeBallot[]): TabulationResult {
  if (ballots.length === 0) {
    return { standings: [], judgeCount: 0 };
  }

  const competitorIds = [
    ...new Set(ballots.flatMap((ballot) => ballot.placements.map((entry) => entry.competitorId))),
  ];
  const remaining = [...competitorIds];
  const standings: TabulationStanding[] = [];
  let nextPlacement = 1;

  while (remaining.length > 0) {
    const winner = pickWinner(ballots, remaining);

    standings.push({
      competitorId: winner,
      finalPlacement: nextPlacement,
      placementTotal: placementTotal(ballots, winner),
      judgePlacements: judgePlacementsFor(ballots, winner),
    });

    remaining.splice(remaining.indexOf(winner), 1);
    nextPlacement += 1;
  }

  standings.sort((a, b) => a.finalPlacement - b.finalPlacement);

  return {
    standings,
    judgeCount: ballots.length,
  };
}
