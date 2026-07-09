import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMerchandiseByCode,
  fetchEventPosContextByCode,
  type MerchandiseDetail,
  type EventPosContext,
} from '../api/postgrest';
import SalesTransactionReceiptView from '../components/SalesTransactionReceipt';
import {
  merchandiseLineTotal,
  summarizeCart,
  type MerchandiseCartLine,
  type MerchandiseItem,
  type MerchandiseGender,
} from '../lib/merchandise';
import {
  formatReceiptCurrency,
  formatReceiptId,
  type SalesTransactionReceipt,
} from '../lib/salesTransactionReceipt';

const DEMO_EVENT_CODE = 'SWING_STATE_CLASSIC_2025_JUN';
const DEMO_REGISTER_ID = 'REG-DEMO-01';
const DEMO_TAX_RATE = 0.08;

type GenderFilter = 'All' | MerchandiseGender;

function buildReceipt(
  cart: MerchandiseCartLine[],
  event: EventPosContext,
  nextReceiptSeq: number,
): SalesTransactionReceipt {
  const { subtotal } = summarizeCart(cart);
  const taxTotal = Math.round(subtotal * DEMO_TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxTotal) * 100) / 100;

  return {
    receiptId: formatReceiptId(event.eventCode, nextReceiptSeq),
    eventCode: event.eventCode,
    receiptSeq: nextReceiptSeq,
    transactionType: 'sale',
    transactionAt: new Date().toISOString(),
    eventName: event.name,
    eventLocation: event.locationLabel ?? undefined,
    registerId: DEMO_REGISTER_ID,
    cashierName: 'Demo Cashier',
    currencyCode: 'USD',
    lineItems: cart.map((line, index) => ({
      lineNumber: index + 1,
      sku: line.sku,
      description: line.description,
      size: line.size,
      color: line.color,
      quantity: line.quantity,
      unitPrice: line.unit_price,
      lineTotal: merchandiseLineTotal(line, line.quantity),
    })),
    subtotal,
    discountTotal: 0,
    taxTotal,
    total,
    payments: [
      {
        method: 'credit',
        amount: total,
        cardBrand: 'Visa',
        cardLast4: '4242',
        authorizationCode: 'DEMO-AUTH',
      },
    ],
    footerMessage: 'Demo transaction — not charged. Thank you for your purchase.',
  };
}

function ProductCard({
  item,
  onAdd,
}: {
  item: MerchandiseItem;
  onAdd: (item: MerchandiseItem) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Stack spacing={1} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip size="small" label={item.gender} />
          <Chip size="small" variant="outlined" label={item.size} />
          <Chip size="small" variant="outlined" label={item.color} />
        </Stack>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {item.description}
        </Typography>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2">
            {formatReceiptCurrency(item.unit_price, 'USD')}
          </Typography>
          <Button size="small" variant="contained" onClick={() => onAdd(item)}>
            Add
          </Button>
        </Stack>
        <Typography variant="caption" color="text.secondary">
          SKU {item.sku}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default function EventMerchandisePosDemoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventContext, setEventContext] = useState<EventPosContext | null>(null);
  const [merchandise, setMerchandise] = useState<MerchandiseDetail | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('All');
  const [cart, setCart] = useState<MerchandiseCartLine[]>([]);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<SalesTransactionReceipt | null>(null);
  const [demoReceiptSeq, setDemoReceiptSeq] = useState(1);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchEventPosContextByCode(DEMO_EVENT_CODE, 'omit'),
      fetchMerchandiseByCode(DEMO_EVENT_CODE, 'omit'),
    ])
      .then(([event, merch]) => {
        if (cancelled) {
          return;
        }

        if (!event) {
          setError(`Event ${DEMO_EVENT_CODE} was not found. Run dev seeds (011, then 016).`);
          return;
        }

        if (!merch || merch.merchandise.items.length === 0) {
          setError(`No merchandise inventory for ${DEMO_EVENT_CODE}. Run seed 016_merchandise_pos_demo.sql.`);
          return;
        }

        setEventContext(event);
        setMerchandise(merch);
        setDemoReceiptSeq(merch.nextReceiptSeq);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load merchandise.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const items = merchandise?.merchandise.items ?? [];
    if (genderFilter === 'All') {
      return items;
    }
    return items.filter((item) => item.gender === genderFilter);
  }, [genderFilter, merchandise]);

  const { subtotal, itemCount } = summarizeCart(cart);
  const taxTotal = Math.round(subtotal * DEMO_TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + taxTotal) * 100) / 100;

  const addToCart = (item: MerchandiseItem) => {
    setCart((current) => {
      const existing = current.find((line) => line.sku === item.sku);
      if (existing) {
        return current.map((line) =>
          line.sku === item.sku ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const adjustQuantity = (sku: string, delta: number) => {
    setCart((current) =>
      current
        .map((line) =>
          line.sku === sku ? { ...line, quantity: line.quantity + delta } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  };

  const completeSale = () => {
    if (!eventContext || cart.length === 0) {
      return;
    }

    const receipt = buildReceipt(cart, eventContext, demoReceiptSeq);
    setCompletedReceipt(receipt);
    setReceiptOpen(true);
    setDemoReceiptSeq((current) => current + 1);
    setCart([]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" component="h1">
            Event Merchandise POS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Demo register for {DEMO_EVENT_CODE}
          </Typography>
        </Stack>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress />
          </Stack>
        )}

        {!loading && error && (
          <Typography color="error">{error}</Typography>
        )}

        {!loading && !error && eventContext && merchandise && (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
                  >
                    <Typography variant="h6">{eventContext.name}</Typography>
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={genderFilter}
                      onChange={(_event, value: GenderFilter | null) => {
                        if (value) {
                          setGenderFilter(value);
                        }
                      }}
                    >
                      <ToggleButton value="All">All</ToggleButton>
                      <ToggleButton value="Men">Men</ToggleButton>
                      <ToggleButton value="Women">Women</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>

                  <Grid container spacing={2}>
                    {filteredItems.map((item) => (
                      <Grid key={item.sku} size={{ xs: 12, sm: 6 }}>
                        <ProductCard item={item} onAdd={addToCart} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Typography variant="h6">Cart</Typography>
                  {cart.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Add shirts from the inventory grid.
                    </Typography>
                  )}
                  {cart.map((line) => (
                    <Stack key={line.sku} spacing={0.5}>
                      <Typography variant="body2">{line.description}</Typography>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          aria-label={`Decrease ${line.sku}`}
                          onClick={() => adjustQuantity(line.sku, -1)}
                        >
                          −
                        </IconButton>
                        <Typography variant="body2">{line.quantity}</Typography>
                        <IconButton
                          size="small"
                          aria-label={`Increase ${line.sku}`}
                          onClick={() => adjustQuantity(line.sku, 1)}
                        >
                          +
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        <Typography variant="body2">
                          {formatReceiptCurrency(
                            merchandiseLineTotal(line, line.quantity),
                            'USD',
                          )}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}

                  {cart.length > 0 && (
                    <>
                      <Divider />
                      <Stack spacing={0.5}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="body2">Items</Typography>
                          <Typography variant="body2">{itemCount}</Typography>
                        </Stack>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="body2">Subtotal</Typography>
                          <Typography variant="body2">
                            {formatReceiptCurrency(subtotal, 'USD')}
                          </Typography>
                        </Stack>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="body2">Tax (8%)</Typography>
                          <Typography variant="body2">
                            {formatReceiptCurrency(taxTotal, 'USD')}
                          </Typography>
                        </Stack>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2">Total</Typography>
                          <Typography variant="subtitle2">
                            {formatReceiptCurrency(total, 'USD')}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Button variant="contained" fullWidth onClick={completeSale}>
                        Complete sale
                      </Button>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate('/demo')}>
            Back to Demo
          </Button>
        </Stack>
      </Stack>

      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Sales receipt</DialogTitle>
        <DialogContent dividers>
          {completedReceipt && <SalesTransactionReceiptView receipt={completedReceipt} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
