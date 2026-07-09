export const DEFAULT_EVENT_PASS_NAME = 'Basic Pass';

export type EventPassFormState = {
  id: string;
  name: string;
  cost: string;
  description: string;
};

export function createDefaultEventPass(): EventPassFormState {
  return {
    id: crypto.randomUUID(),
    name: DEFAULT_EVENT_PASS_NAME,
    cost: '',
    description: '',
  };
}

export function createEmptyEventPass(): EventPassFormState {
  return {
    id: crypto.randomUUID(),
    name: '',
    cost: '',
    description: '',
  };
}

export function getEventPassDisplayName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Untitled Pass';
}

/** Keeps positive numeric input: digits and at most one decimal point. */
export function sanitizePassCostInput(value: string): string {
  let result = '';
  let hasDecimal = false;

  for (const char of value) {
    if (char >= '0' && char <= '9') {
      result += char;
      continue;
    }

    if (char === '.' && !hasDecimal) {
      hasDecimal = true;
      result += char;
    }
  }

  return result;
}
