export type SalesTransactionType = 'sale' | 'return' | 'exchange' | 'void';

export type SalesPaymentMethod =
  | 'cash'
  | 'credit'
  | 'debit'
  | 'gift_card'
  | 'mobile_wallet'
  | 'other';

export type SalesLineItem = {
  lineNumber: number;
  sku: string;
  description: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  lineTotal: number;
};

export type SalesPayment = {
  method: SalesPaymentMethod;
  amount: number;
  cardBrand?: string;
  cardLast4?: string;
  authorizationCode?: string;
  referenceNumber?: string;
};

export type SalesTransactionReceipt = {
  receiptId: string;
  eventCode: string;
  receiptSeq: number;
  transactionType: SalesTransactionType;
  transactionAt: string;
  eventName: string;
  eventLocation?: string;
  registerId?: string;
  cashierName?: string;
  customerName?: string;
  customerEmail?: string;
  lineItems: SalesLineItem[];
  currencyCode: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  payments: SalesPayment[];
  amountTendered?: number;
  changeDue?: number;
  notes?: string;
  footerMessage?: string;
};

const TRANSACTION_TYPE_LABELS: Record<SalesTransactionType, string> = {
  sale: 'Sale',
  return: 'Return',
  exchange: 'Exchange',
  void: 'Void',
};

const PAYMENT_METHOD_LABELS: Record<SalesPaymentMethod, string> = {
  cash: 'Cash',
  credit: 'Credit card',
  debit: 'Debit card',
  gift_card: 'Gift card',
  mobile_wallet: 'Mobile wallet',
  other: 'Other',
};

export function formatReceiptId(eventCode: string, receiptSeq: number): string {
  return `${eventCode}-${String(receiptSeq).padStart(5, '0')}`;
}

export function formatSalesTransactionType(type: SalesTransactionType): string {
  return TRANSACTION_TYPE_LABELS[type];
}

export function formatPaymentMethod(method: SalesPaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method];
}

export function formatReceiptCurrency(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function formatReceiptDateTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  if (Number.isNaN(date.getTime())) {
    return isoTimestamp;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function createSampleSalesTransactionReceipt(): SalesTransactionReceipt {
  const eventCode = 'SWING_STATE_CLASSIC_2025_JUN';
  const receiptSeq = 142;

  return {
    receiptId: formatReceiptId(eventCode, receiptSeq),
    eventCode,
    receiptSeq,
    transactionType: 'sale',
    transactionAt: '2025-06-22T14:35:00-05:00',
    eventName: 'Swing State Classic 2025',
    eventLocation: 'Meridian Wharf Sports Complex, Swing State, MN',
    registerId: 'REG-03',
    cashierName: 'Jordan Lee',
    customerName: 'Alex Morgan',
    customerEmail: 'alex.morgan@example.com',
    currencyCode: 'USD',
    lineItems: [
      {
        lineNumber: 1,
        sku: 'TEE-CLASSIC-M',
        description: 'Event T-Shirt',
        size: 'M',
        color: 'Navy',
        quantity: 1,
        unitPrice: 28,
        lineTotal: 28,
      },
      {
        lineNumber: 2,
        sku: 'HAT-EMB-01',
        description: 'Embroidered Cap',
        color: 'Black',
        quantity: 1,
        unitPrice: 22,
        discountAmount: 2,
        lineTotal: 20,
      },
      {
        lineNumber: 3,
        sku: 'BAG-TOTE-24',
        description: 'Canvas Tote Bag',
        quantity: 2,
        unitPrice: 12,
        lineTotal: 24,
      },
    ],
    subtotal: 72,
    discountTotal: 2,
    taxTotal: 5.67,
    total: 75.67,
    payments: [
      {
        method: 'credit',
        amount: 75.67,
        cardBrand: 'Visa',
        cardLast4: '4242',
        authorizationCode: 'A12345',
      },
    ],
    footerMessage: 'Thank you for your purchase. Returns accepted within 30 days with receipt.',
  };
}
