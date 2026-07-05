export type EventPassFormState = {
  id: string;
  name: string;
  cost: string;
};

export function createEmptyEventPass(): EventPassFormState {
  return {
    id: crypto.randomUUID(),
    name: '',
    cost: '',
  };
}

/** Keeps digits and at most one decimal point for currency-style cost input. */
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
