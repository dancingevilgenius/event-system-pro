/**
 * Checkbox map to apply when the upcoming-contest list is loaded or replaced.
 * Exactly one contest is pre-checked. Any other count stays unchecked.
 */
export function checkedIdsForContestLoad(contestIds: readonly string[]): Record<string, boolean> {
  if (contestIds.length !== 1) {
    return {};
  }
  return { [contestIds[0]]: true };
}
