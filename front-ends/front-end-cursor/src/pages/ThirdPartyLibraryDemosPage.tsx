import { Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

const THIRD_PARTY_LIBRARY_DEMOS = [
  { label: 'Tournament Bracket Demo', path: '/tournament-bracket-demo' },
  { label: 'Event Calendar', path: '/demo-event-calendar' },
  { label: 'Schedule Demo', path: '/demo-schedule' },
] as const;

export default function ThirdPartyLibraryDemosPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader
          title="3rd Party Library Demos"
          backTo="/demo"
          backLabel="Back to Demo"
        />

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {THIRD_PARTY_LIBRARY_DEMOS.map((item) => (
              <Button
                key={item.label}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {THIRD_PARTY_LIBRARY_DEMOS.map((item) => (
              <Grid key={item.label} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
