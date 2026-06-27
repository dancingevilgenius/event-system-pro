import type { EntryScoreState } from '../../types/judgingScore';
import { digitsToScore } from '../../types/judgingScore';
import { scoresToPlacements } from './scoresToPlacements';
import type { CompetitorId, JudgeSubmission } from './types';

export function buildJudgeSubmission(
  scoreByBib: Record<number, EntryScoreState>,
  competitorIds: CompetitorId[],
  judgeId: CompetitorId = 'local-judge',
): JudgeSubmission {
  const scores = competitorIds.map((competitorId) => ({
    competitorId,
    score: digitsToScore(scoreByBib[Number(competitorId)]?.digits ?? [0, 0, 0, 0]),
  }));

  const placements = scoresToPlacements(scores);

  return {
    judgeId,
    submittedAt: new Date().toISOString(),
    scores,
    placements,
  };
}
