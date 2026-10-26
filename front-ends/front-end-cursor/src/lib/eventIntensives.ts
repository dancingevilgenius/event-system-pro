export type EventIntensiveFormState = {
  id: string;
  name: string;
  instructors: string;
  cost: string;
  dateTime: string;
};

export function createEmptyEventIntensive(): EventIntensiveFormState {
  return {
    id: crypto.randomUUID(),
    name: '',
    instructors: '',
    cost: '',
    dateTime: '',
  };
}

export function getEventIntensiveDisplayName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Untitled Intensive';
}

/** Whole dollars only. A decimal portion and any other non-digit characters are dropped. */
export function sanitizeIntensiveCostInput(value: string): string {
  const whole = value.trim().split(/[.,]/, 1)[0] ?? '';
  let result = '';
  for (const char of whole) {
    if (char >= '0' && char <= '9') {
      result += char;
    }
  }
  return result;
}

export function intensiveCostLabel(cost: string): string {
  const dollars = sanitizeIntensiveCostInput(cost);
  return dollars.length > 0 ? `$${dollars}` : '';
}

export function intensivesAccordionTitle(hasIntensives: boolean, intensiveCount: number): string {
  if (!hasIntensives) {
    return 'Intensive Workshops - N/A';
  }

  if (intensiveCount >= 1) {
    return `Intensive Workshops - ${intensiveCount}`;
  }

  return 'Intensive Workshops';
}
