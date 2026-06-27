export type CompetitorId = string | number;

export type CompetitorScore = {
  competitorId: CompetitorId;
  score: number;
};

export type CompetitorPlacement = {
  competitorId: CompetitorId;
  placement: number;
  score: number;
};

export type JudgeBallot = {
  judgeId: CompetitorId;
  placements: CompetitorPlacement[];
};

export type TabulationStanding = {
  competitorId: CompetitorId;
  finalPlacement: number;
  placementTotal: number;
  judgePlacements: Record<string, number>;
};

export type TabulationResult = {
  standings: TabulationStanding[];
  judgeCount: number;
};

export type JudgeScoreEntry = {
  competitorId: CompetitorId;
  score: number;
};

export type JudgeSubmission = {
  judgeId: CompetitorId;
  submittedAt: string;
  scores: JudgeScoreEntry[];
  placements: CompetitorPlacement[];
};
