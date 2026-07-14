import type { CompetitorPlacement, CompetitorScore } from './types';

function compareCompetitorScores(a: CompetitorScore, b: CompetitorScore): number {
  const scoreDiff = b.score - a.score;

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return String(a.competitorId).localeCompare(String(b.competitorId), undefined, {
    numeric: true,
  });
}

/**
 * Convert one judge's numeric scores into ordinal placements.
 * Higher score receives a better (lower) placement; 1 is best.
 */
export function scoresToPlacements(scores: CompetitorScore[]): CompetitorPlacement[] {
  const sorted = [...scores].sort(compareCompetitorScores);
  const placements: CompetitorPlacement[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const previous = sorted[index - 1];
    const placement =
      index > 0 && current.score === previous.score
        ? placements[index - 1].placement
        : index + 1;

    placements.push({
      competitorId: current.competitorId,
      placement,
      score: current.score,
    });
  }

  return placements;
}
