export type SortFilterOption =
  | 'bib'
  | 'rawScore'
  | 'leaderLastName'
  | 'followerLastName'
  | 'unscoredOnly';

export const SORT_FILTER_LABELS: Record<SortFilterOption, string> = {
  bib: "Sort by Bib #",
  rawScore: 'Sort by Raw Score',
  leaderLastName: "Sort by Leader's Last Name",
  followerLastName: "Sort by Follower's Last Name",
  unscoredOnly: 'Unscored Only',
};

export const SORT_FILTER_ORDER: SortFilterOption[] = [
  'bib',
  'rawScore',
  'leaderLastName',
  'followerLastName',
  'unscoredOnly',
];
