import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { EVENT_GROUPS_PATH, EVENTS_PATH } from '../constants/eventRoutes';

const EVENT_HOME_BUTTONS = [
  { label: 'Events', path: EVENTS_PATH },
  { label: 'Event Groups', path: EVENT_GROUPS_PATH },
] as const;

export default function EventHomePage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>

        <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
          {EVENT_HOME_BUTTONS.map((button) => (
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

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
