import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

const DEMO_ITEMS = [
  {
    label: 'Tournament Bracket Demo',
    path: '/tournament-bracket-demo',
    available: true,
  },
  {
    label: 'Schedule Demo',
    path: '/demo-schedule',
    available: true,
  },
] as const;

export default function DemoPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title="Demo" backTo="/adminhome" backLabel="Back to Admin" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
          Try interactive previews. More demos coming soon.
        </Typography>

        {showXsLayout ? (
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
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {DEMO_ITEMS.map((item) => (
              <Grid key={item.path} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!item.available}
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
