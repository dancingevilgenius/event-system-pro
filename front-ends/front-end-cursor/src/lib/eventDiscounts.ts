export type DiscountValueKind = 'percent' | 'amount';

export type EventDiscountFormState = {
  id: string;
  name: string;
  valueKind: DiscountValueKind;
  value: string;
  description: string;
};

export function createEmptyEventDiscount(): EventDiscountFormState {
  return {
    id: crypto.randomUUID(),
    name: '',
    valueKind: 'percent',
    value: '',
    description: '',
  };
}

export function getEventDiscountDisplayName(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : 'Untitled Discount';
}

export function discountValueLabel(valueKind: DiscountValueKind): 'Percent' | 'Amount' {
  return valueKind === 'amount' ? 'Amount' : 'Percent';
}
