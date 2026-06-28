import benchmarksJson from './relative-placement-benchmarks.json';

export type RelativePlacementBenchmarkEntry = {
  label: string;
  judgePlacements: number[];
  officialPlace: number;
};

export type RelativePlacementBenchmarkValidation = {
  validatedOn: string;
  algorithm: string;
  officialOrder: string[];
  ourOrder: string[];
  notes: string;
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
};

export type RelativePlacementBenchmarkFile = {
  schemaVersion: number;
  description: string;
  datasets: RelativePlacementBenchmark[];
};

export const relativePlacementBenchmarks =
  benchmarksJson as RelativePlacementBenchmarkFile;

export function getRelativePlacementBenchmark(id: string): RelativePlacementBenchmark | undefined {
  return relativePlacementBenchmarks.datasets.find((dataset) => dataset.id === id);
}
