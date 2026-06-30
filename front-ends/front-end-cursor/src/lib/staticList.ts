/** Sentinel integer for min-age / max-age when no limit applies. */
export const NOT_APPLICABLE_INT = -1;

export type StaticListJsonField = 'min-age' | 'max-age';

export function formatStaticListAge(value: number): string {
  return value === NOT_APPLICABLE_INT ? 'N/A' : String(value);
}

export function staticListHasJsonField(
  entries: Array<{ minAge?: number; maxAge?: number }>,
  field: StaticListJsonField,
): boolean {
  if (field === 'min-age') {
    return entries.some((entry) => entry.minAge !== undefined);
  }

  return entries.some((entry) => entry.maxAge !== undefined);
}

export function staticListFieldLabel(field: StaticListJsonField): string {
  return field === 'min-age' ? 'Min Age' : 'Max Age';
}
