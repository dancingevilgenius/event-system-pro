import { trimSavedText } from '../utils/trimSavedText';

export type EarlyBirdWindow = {
  id: string;
  name: string;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
};

/** Third row in the fixed early bird list. It starts on, as the regular price. */
const FULL_PRICE_WINDOW_INDEX = 2;

export function defaultEarlyBirdName(index: number): string {
  if (index === FULL_PRICE_WINDOW_INDEX) {
    return 'Full Price';
  }
  return `Early Bird ${index + 1}`;
}

export function createEmptyEarlyBirdWindow(index = 0): EarlyBirdWindow {
  return {
    id: crypto.randomUUID(),
    name: defaultEarlyBirdName(index),
    enabled: index === FULL_PRICE_WINDOW_INDEX,
    startDate: null,
    endDate: null,
  };
}

export function createInitialEarlyBirdWindows(count = 3): EarlyBirdWindow[] {
  return Array.from({ length: count }, (_, index) => createEmptyEarlyBirdWindow(index));
}

/** Saved label: trimmed text, or the row default when the name is empty. */
export function savedEarlyBirdName(name: string, index: number): string {
  const trimmed = trimSavedText(name);
  return trimmed === '' ? defaultEarlyBirdName(index) : trimmed;
}

/**
 * Checkbox state for a loaded row.
 * An explicit boolean wins. Older rows with no flag stay on when they already have dates.
 */
export function earlyBirdEnabledFromStored(
  enabled: unknown,
  startDate: string | null,
  endDate: string | null,
): boolean {
  if (typeof enabled === 'boolean') {
    return enabled;
  }
  return Boolean(startDate || endDate);
}

export const EARLY_BIRD_DATE_ORDER_ERROR =
  'Start date must be earlier than the end date.';

/** `YYYY-MM-DD` from a date input, or null when the value is empty or not a calendar date. */
export function normalizeEarlyBirdDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);
  if (
    parsed.getFullYear() !== year
    || parsed.getMonth() !== month - 1
    || parsed.getDate() !== day
  ) {
    return null;
  }

  return trimmed;
}

/**
 * Per-row order check. Disabled rows and rows with only one date are not errors.
 * When both dates are present, start must be strictly earlier than end.
 */
export function earlyBirdDateOrderError(
  enabled: boolean,
  startDate: string | null,
  endDate: string | null,
): string | null {
  if (!enabled) {
    return null;
  }

  const start = normalizeEarlyBirdDate(startDate);
  const end = normalizeEarlyBirdDate(endDate);
  if (!start || !end || start < end) {
    return null;
  }

  return EARLY_BIRD_DATE_ORDER_ERROR;
}

/** Local calendar date as `YYYY-MM-DD`, without a time of day. */
export function localCalendarDateIso(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** True when `value` is a real calendar date strictly before `today` (`YYYY-MM-DD`). */
export function isEarlyBirdDateInPast(value: string | null, today: string): boolean {
  const date = normalizeEarlyBirdDate(value);
  const todayDate = normalizeEarlyBirdDate(today);
  if (!date || !todayDate) {
    return false;
  }

  return date < todayDate;
}

const EARLY_BIRD_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Calendar date as `Jul 11, 2026`. Empty or invalid values stay blank. */
export function formatEarlyBirdDate(value: string | null): string {
  const date = normalizeEarlyBirdDate(value);
  if (!date) {
    return '';
  }

  const [year, month, day] = date.split('-');
  const monthName = EARLY_BIRD_MONTHS[Number(month) - 1];
  return `${monthName} ${Number(day)}, ${year}`;
}

export type PricedEarlyBirdWindow = EarlyBirdWindow & {
  index: number;
};

/**
 * Enabled windows that already have a start or end date.
 * Those are the early bird prices shown on each pass.
 */
export function pricedEarlyBirdWindows(
  mode: 'none' | 'create' | undefined,
  windows: EarlyBirdWindow[] | undefined,
): PricedEarlyBirdWindow[] {
  if (mode !== 'create' || !windows) {
    return [];
  }

  return windows.flatMap((window, index) => {
    const hasDate = Boolean(
      normalizeEarlyBirdDate(window.startDate) || normalizeEarlyBirdDate(window.endDate),
    );
    return window.enabled && hasDate ? [{ ...window, index }] : [];
  });
}

export function earlyBirdDatesCanBeFinalized(
  mode: 'none' | 'create',
  windows: Array<Pick<EarlyBirdWindow, 'enabled' | 'startDate' | 'endDate'>>,
): boolean {
  if (mode !== 'create') {
    return true;
  }

  return windows.every(
    (window) => earlyBirdDateOrderError(window.enabled, window.startDate, window.endDate) === null,
  );
}
