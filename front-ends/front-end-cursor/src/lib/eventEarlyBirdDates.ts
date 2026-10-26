import { trimSavedText } from '../utils/trimSavedText';

export type EarlyBirdWindow = {
  id: string;
  name: string;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
};

export function defaultEarlyBirdName(index: number): string {
  return `Early Bird ${index + 1}`;
}

export function createEmptyEarlyBirdWindow(index = 0): EarlyBirdWindow {
  return {
    id: crypto.randomUUID(),
    name: defaultEarlyBirdName(index),
    enabled: false,
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
