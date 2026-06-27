import {
  buildMockJudgeSheets,
  createMockContestEntries,
  MOCK_JUDGE_LABELS,
  type MockContestEntry,
  type MockContestJudgeSheet,
} from '../data/mockContestEntries';
import {
  buildRelativePlacementRows,
  type RelativePlacementRow,
} from '../utils/relativePlacement';

export type MockContestResults = {
  entries: MockContestEntry[];
  judgeSheets: MockContestJudgeSheet[];
  placementRows: RelativePlacementRow[];
  entryByBib: Map<number, MockContestEntry>;
};

export function buildMockContestResults(): MockContestResults {
  const entries = createMockContestEntries();
  const judgeSheets = buildMockJudgeSheets(entries);
  const bibs = entries.map((entry) => entry.number);

  const placementByBib = new Map<number, number[]>();

  for (const entry of entries) {
    placementByBib.set(
      entry.number,
      judgeSheets.map((sheet) => sheet.placements[entry.number]),
    );
  }

  const placementRows = buildRelativePlacementRows(bibs, placementByBib);
  const entryByBib = new Map(entries.map((entry) => [entry.number, entry]));

  return {
    entries,
    judgeSheets,
    placementRows,
    entryByBib,
  };
}

export { MOCK_JUDGE_LABELS };
