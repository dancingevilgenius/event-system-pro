/** Sentinel integer for min-age / max-age when no limit applies. */
export const NOT_APPLICABLE_INT = -1;

/** `static_list.list_code` for United States states and territories. */
export const US_STATES_LIST_CODE = 'US_STATES';

/** `static_list.list_code` for countries and territories. */
export const COUNTRIES_LIST_CODE = 'COUNTRIES';

/** `static_list.list_code` for WSDC swing competition event types. */
export const WSDC_SWING_EVENTS_LIST_CODE = 'WSDC_SWING_EVENTS';

/** `static_list.list_code` for WSDC ability / age levels. */
export const WSDC_LEVELS_LIST_CODE = 'WSDC_LEVELS';

/** `static_list.list_code` for competition and event type definitions. */
export const EVENT_TYPES_LIST_CODE = 'EVENT_TYPES';

export type StaticListJsonField = 'min-age' | 'max-age' | 'description';

export function staticListHasDescription(
  entries: Array<{ description?: string }>,
): boolean {
  return entries.some((entry) => entry.description !== undefined);
}

export function staticListHasJsonField(
  entries: Array<{ minAge?: number; maxAge?: number; description?: string }>,
  field: StaticListJsonField,
): boolean {
  if (field === 'min-age') {
    return entries.some((entry) => entry.minAge !== undefined);
  }

  if (field === 'max-age') {
    return entries.some((entry) => entry.maxAge !== undefined);
  }

  return entries.some((entry) => entry.description !== undefined);
}

export function staticListFieldLabel(field: StaticListJsonField): string {
  if (field === 'min-age') {
    return 'Min Age';
  }

  if (field === 'max-age') {
    return 'Max Age';
  }

  return 'Description';
}

export function formatStaticListAge(value: number): string {
  return value === NOT_APPLICABLE_INT ? 'N/A' : String(value);
}

export function truncateStaticListDescription(value: string, maxLength = 72): string {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1)}…`;
}
