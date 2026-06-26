import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';

const ADMIN_BUTTONS = [
  { label: 'Event Details', path: '/admin/event-details' },
  { label: 'Contests', path: '/admin/contests' },
  { label: 'Competitors', path: '/admin/competitors' },
  { label: 'Competition Entries', path: '/admin/competition-entries' },
  { label: 'Staff', path: '/staff' },
] as const;

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin
        </Typography>

        <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
          {ADMIN_BUTTONS.map((button) => (
            <Button
              key={button.label}
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate(button.path)}
            >
              {button.label}
            </Button>
          ))}
        </Stack>

        <Stack sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
