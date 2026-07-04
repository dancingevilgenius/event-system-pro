import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  formatPaymentMethod,
  formatReceiptCurrency,
  formatReceiptDateTime,
  formatSalesTransactionType,
  type SalesLineItem,
  type SalesPayment,
  type SalesTransactionReceipt,
} from '../lib/salesTransactionReceipt';

type SalesTransactionReceiptProps = {
  receipt: SalesTransactionReceipt;
};

type ReceiptMetaRowProps = {
  label: string;
  value: string;
};

function ReceiptMetaRow({ label, value }: ReceiptMetaRowProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  );
}

type MoneyRowProps = {
  label: string;
  amount: number;
  currencyCode: string;
  emphasized?: boolean;
};

function MoneyRow({ label, amount, currencyCode, emphasized = false }: MoneyRowProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
      <Typography variant={emphasized ? 'subtitle2' : 'body2'} sx={{ fontWeight: emphasized ? 700 : 400 }}>
        {label}
      </Typography>
      <Typography variant={emphasized ? 'subtitle2' : 'body2'} sx={{ fontWeight: emphasized ? 700 : 400 }}>
        {formatReceiptCurrency(amount, currencyCode)}
      </Typography>
    </Stack>
  );
}

function LineItemDescription({ item }: { item: SalesLineItem }) {
  const details = [item.size ? `Size ${item.size}` : null, item.color ? item.color : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <Stack spacing={0.25}>
      <Typography variant="body2">{item.description}</Typography>
      <Typography variant="caption" color="text.secondary">
        SKU {item.sku}
        {details ? ` · ${details}` : ''}
      </Typography>
    </Stack>
  );
}

function PaymentRows({
  payments,
  currencyCode,
}: {
  payments: SalesPayment[];
  currencyCode: string;
}) {
  return (
    <Stack spacing={0.75}>
      {payments.map((payment, index) => {
        const cardDetail =
          payment.cardBrand && payment.cardLast4
            ? `${payment.cardBrand} •••• ${payment.cardLast4}`
            : payment.cardLast4
              ? `•••• ${payment.cardLast4}`
              : null;

        return (
          <Stack key={`${payment.method}-${index}`} spacing={0.25}>
            <MoneyRow
              label={formatPaymentMethod(payment.method)}
              amount={payment.amount}
              currencyCode={currencyCode}
            />
            {cardDetail && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
                {cardDetail}
              </Typography>
            )}
            {payment.authorizationCode && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
                Auth {payment.authorizationCode}
              </Typography>
            )}
            {payment.referenceNumber && (
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right' }}>
                Ref {payment.referenceNumber}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function SalesTransactionReceiptView({ receipt }: SalesTransactionReceiptProps) {
  const isReturn = receipt.transactionType === 'return' || receipt.transactionType === 'void';

  return (
    <Paper
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 360,
        mx: 'auto',
        p: 2.5,
        bgcolor: 'background.paper',
        fontFamily: 'monospace',
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'inherit' }}>
            {receipt.eventName}
          </Typography>
          {receipt.eventLocation && (
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
              {receipt.eventLocation}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
            {formatSalesTransactionType(receipt.transactionType).toUpperCase()}
          </Typography>
        </Stack>

        <Divider />

        <Stack spacing={0.75}>
          <ReceiptMetaRow label="Receipt" value={receipt.receiptId} />
          <ReceiptMetaRow label="Event code" value={receipt.eventCode} />
          <ReceiptMetaRow label="Date" value={formatReceiptDateTime(receipt.transactionAt)} />
          {receipt.registerId && <ReceiptMetaRow label="Register" value={receipt.registerId} />}
          {receipt.cashierName && <ReceiptMetaRow label="Cashier" value={receipt.cashierName} />}
          {receipt.customerName && <ReceiptMetaRow label="Customer" value={receipt.customerName} />}
          {receipt.customerEmail && <ReceiptMetaRow label="Email" value={receipt.customerEmail} />}
        </Stack>

        <Divider />

        <TableContainer>
          <Table size="small" sx={{ fontFamily: 'inherit' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, px: 0 }}>Item</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, px: 0, whiteSpace: 'nowrap' }}>
                  Qty
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, px: 0, whiteSpace: 'nowrap' }}>
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipt.lineItems.map((item) => (
                <TableRow key={item.lineNumber}>
                  <TableCell sx={{ px: 0, verticalAlign: 'top' }}>
                    <LineItemDescription item={item} />
                    {item.discountAmount != null && item.discountAmount > 0 && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                        Discount -{formatReceiptCurrency(item.discountAmount, receipt.currencyCode)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 0, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {item.quantity}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 0, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                    {formatReceiptCurrency(isReturn ? -Math.abs(item.lineTotal) : item.lineTotal, receipt.currencyCode)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <Stack spacing={0.75}>
          <MoneyRow label="Subtotal" amount={receipt.subtotal} currencyCode={receipt.currencyCode} />
          {receipt.discountTotal > 0 && (
            <MoneyRow
              label="Discounts"
              amount={-receipt.discountTotal}
              currencyCode={receipt.currencyCode}
            />
          )}
          <MoneyRow label="Tax" amount={receipt.taxTotal} currencyCode={receipt.currencyCode} />
          <MoneyRow label="Total" amount={receipt.total} currencyCode={receipt.currencyCode} emphasized />
        </Stack>

        {receipt.payments.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, fontFamily: 'inherit' }}>
                Payment
              </Typography>
              <PaymentRows payments={receipt.payments} currencyCode={receipt.currencyCode} />
            </Box>
          </>
        )}

        {receipt.amountTendered != null && (
          <MoneyRow label="Tendered" amount={receipt.amountTendered} currencyCode={receipt.currencyCode} />
        )}

        {receipt.changeDue != null && receipt.changeDue > 0 && (
          <MoneyRow label="Change" amount={receipt.changeDue} currencyCode={receipt.currencyCode} />
        )}

        {receipt.notes && (
          <>
            <Divider />
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'inherit' }}>
              {receipt.notes}
            </Typography>
          </>
        )}

        {receipt.footerMessage && (
          <>
            <Divider />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center', fontFamily: 'inherit' }}
            >
              {receipt.footerMessage}
            </Typography>
          </>
        )}
      </Stack>
    </Paper>
  );
}
