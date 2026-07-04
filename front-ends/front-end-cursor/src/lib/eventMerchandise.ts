export type MerchandiseGender = 'Men' | 'Women';

export type EventMerchandiseItem = {
  sku: string;
  gender: MerchandiseGender;
  size: string;
  color: string;
  description: string;
  unit_price: number;
};

export type EventMerchandiseJson = {
  items: EventMerchandiseItem[];
};

export type EventMerchandiseCartLine = EventMerchandiseItem & {
  quantity: number;
};

const MAX_DESCRIPTION_LENGTH = 256;

export function parseEventMerchandiseJson(value: unknown): EventMerchandiseJson {
  if (!value || typeof value !== 'object' || !('items' in value)) {
    return { items: [] };
  }

  const record = value as { items?: unknown };
  if (!Array.isArray(record.items)) {
    return { items: [] };
  }

  const items: EventMerchandiseItem[] = [];

  for (const entry of record.items) {
    if (!entry || typeof entry !== 'object') {
      continue;
    }

    const row = entry as Record<string, unknown>;
    const gender = row.gender === 'Men' || row.gender === 'Women' ? row.gender : null;
    const sku = typeof row.sku === 'string' ? row.sku.trim() : '';
    const size = typeof row.size === 'string' ? row.size.trim() : '';
    const color = typeof row.color === 'string' ? row.color.trim() : '';
    const description =
      typeof row.description === 'string'
        ? row.description.trim().slice(0, MAX_DESCRIPTION_LENGTH)
        : '';
    const unitPrice =
      typeof row.unit_price === 'number'
        ? row.unit_price
        : Number(row.unit_price);

    if (!gender || !sku || !description || !Number.isFinite(unitPrice)) {
      continue;
    }

    items.push({
      sku,
      gender,
      size,
      color,
      description,
      unit_price: unitPrice,
    });
  }

  return { items };
}

export function merchandiseLineTotal(item: EventMerchandiseItem, quantity: number): number {
  return Math.round(item.unit_price * quantity * 100) / 100;
}

export function summarizeCart(lines: EventMerchandiseCartLine[]): {
  subtotal: number;
  itemCount: number;
} {
  let subtotal = 0;
  let itemCount = 0;

  for (const line of lines) {
    subtotal += merchandiseLineTotal(line, line.quantity);
    itemCount += line.quantity;
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
  };
}
