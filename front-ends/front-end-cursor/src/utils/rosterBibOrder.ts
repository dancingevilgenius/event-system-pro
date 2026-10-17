/** Positive bibs sort ascending. Missing or invalid bibs sort last. */
export function compareRosterByBib(left: { bib?: unknown }, right: { bib?: unknown }): number {
  const leftBib = rosterSortBib(left.bib);
  const rightBib = rosterSortBib(right.bib);
  if (leftBib === null && rightBib === null) {
    return 0;
  }
  if (leftBib === null) {
    return 1;
  }
  if (rightBib === null) {
    return -1;
  }
  return leftBib - rightBib;
}

function rosterSortBib(bib: unknown): number | null {
  if (typeof bib === 'number' && Number.isInteger(bib) && bib > 0) {
    return bib;
  }
  return null;
}
