import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

const DEMO_ITEMS = [
  {
    label: 'Tournament Bracket Demo',
    path: '/tournament-bracket-demo',
    available: true,
  },
  {
    label: 'Event Merchandise POS',
    path: '/event-merchandise-pos-demo',
    available: true,
  },
] as const;

export default function DemoPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Demo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
          Try interactive previews. More demos coming soon.
        </Typography>

        <Stack spacing={2} sx={{ mb: 4, ...centeredContentStackSx }}>
          {DEMO_ITEMS.map((item) => (
            <Button
              key={item.path}
              variant="contained"
              size="large"
              fullWidth
              disabled={!item.available}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home-page')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
