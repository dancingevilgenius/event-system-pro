/** Whole-dollar pass prices stop at four digits. */
export const PASS_COST_MAX_DIGITS = 4;

export const SPECTATOR_PASS_TOOLTIP =
  'A Spectator pass does not require registration or taking of any additional information.';

export type EventPassFormState = {
  id: string;
  name: string;
  /** Standard pass price in whole US dollars. Hidden while early bird price rows are showing. */
  cost: string;
  description: string;
  /** Whole-dollar price for each early bird window, keyed by that window's id. */
  earlyBirdCosts: Record<string, string>;
  /** Checked when this pass does not collect registration details. */
  spectator: boolean;
};

export function createEmptyEventPass(): EventPassFormState {
  return {
    id: crypto.randomUUID(),
    name: '',
    cost: '',
    description: '',
    earlyBirdCosts: {},
    spectator: false,
  };
}

export function passesAccordionTitle(hasPasses: boolean, passCount: number): string {
  if (!hasPasses) {
    return 'Passes - N/A';
  }

  if (passCount >= 1) {
    return `Passes - ${passCount}`;
  }

  return 'Passes';
}

export function getEventPassDisplayName(name: string): string {
  return name.trim();
}

/** Whole US dollars only. A decimal portion and any other non-digit characters are dropped. */
export function sanitizePassCostInput(value: string): string {
  const whole = value.trim().split(/[.,]/, 1)[0] ?? '';
  let result = '';
  for (const char of whole) {
    if (char >= '0' && char <= '9') {
      result += char;
    }
  }
  return result.slice(0, PASS_COST_MAX_DIGITS);
}
