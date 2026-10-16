export function compareSchemaMigrationRowsDescending(
  a: { number: string; script: string },
  b: { number: string; script: string },
): number {
  const aNumber = Number.parseInt(a.number, 10);
  const bNumber = Number.parseInt(b.number, 10);
  const aRank = Number.isFinite(aNumber) ? aNumber : Number.NEGATIVE_INFINITY;
  const bRank = Number.isFinite(bNumber) ? bNumber : Number.NEGATIVE_INFINITY;
  if (aRank !== bRank) {
    return bRank - aRank;
  }

  return b.script.localeCompare(a.script);
}
