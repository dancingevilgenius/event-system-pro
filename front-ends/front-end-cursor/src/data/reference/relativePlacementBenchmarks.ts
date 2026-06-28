import benchmarksJson from './relative-placement-benchmarks.json';

export type JudgeMarkViolation = 'SVW' | 'SV-1' | 'SV-3';

/** One judge's mark as published on the results sheet (placement plus optional violation suffix). */
export type JudgeMark = {
  raw: string;
  placement: number;
  violation?: JudgeMarkViolation;
};

export type ViolationDefinition = {
  code: JudgeMarkViolation;
  label: string;
  placementAdjustment: number;
  description: string;
};

export type RelativePlacementBenchmarkEntry = {
  label: string;
  /** Nominal placement digits from each judge mark (before violation adjustment). */
  judgePlacements: number[];
  officialPlace: number;
  /** Published marks-sorted string after penalties, when provided by the source. */
  marksSorted?: string;
  /** Raw judge marks including violation annotations, when provided by the source. */
  judgeMarks?: JudgeMark[];
};

export type RelativePlacementBenchmarkValidation = {
  validatedOn: string;
  algorithm: string;
  officialOrder: string[];
  ourOrder?: string[];
  notes: string;
  skipped?: boolean;
};

export type RelativePlacementBenchmark = {
  id: string;
  sport: string;
  judges: number;
  competitors: number;
  match: string;
  sourceUrl: string;
  event: string;
  scoringSystem: string;
  judgeLabels: string[];
  placementMeaning: string;
  officialResults: Array<{ label: string; place: number }>;
  entries: RelativePlacementBenchmarkEntry[];
  validations: RelativePlacementBenchmarkValidation[];
  /** When true, computeRelativePlacementOrder cannot match official order until violations are applied. */
  requiresViolationHandling?: boolean;
  violationDefinitions?: ViolationDefinition[];
  swingContentRules?: string;
};

export type RelativePlacementImplementationTodo = {
  id: string;
  status: 'pending' | 'in_progress' | 'completed';
  title: string;
  items: string[];
  relatedDatasetIds?: string[];
};

export type RelativePlacementBenchmarkFile = {
  schemaVersion: number;
  description: string;
  datasets: RelativePlacementBenchmark[];
  implementationTodos?: RelativePlacementImplementationTodo[];
};

export const relativePlacementBenchmarks =
  benchmarksJson as RelativePlacementBenchmarkFile;

export function getRelativePlacementBenchmark(id: string): RelativePlacementBenchmark | undefined {
  return relativePlacementBenchmarks.datasets.find((dataset) => dataset.id === id);
}

export function getRelativePlacementImplementationTodos(): RelativePlacementImplementationTodo[] {
  return relativePlacementBenchmarks.implementationTodos ?? [];
}
