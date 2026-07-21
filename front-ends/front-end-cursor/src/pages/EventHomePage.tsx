import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { EVENT_GROUPS_PATH, EVENTS_PATH } from '../constants/eventRoutes';
import { useLayoutTier } from '../hooks/useLayoutTier';

const EVENT_HOME_BUTTONS = [
  { label: 'Event Groups', path: EVENT_GROUPS_PATH },
  { label: 'Events', path: EVENTS_PATH },
] as const;

export default function EventHomePage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>

        {showXsLayout ? (
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
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {EVENT_HOME_BUTTONS.map((button) => (
              <Grid key={button.label} size={{ xs: 12, md: 6 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(button.path)}
                >
                  {button.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
