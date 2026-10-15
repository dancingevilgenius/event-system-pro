import { Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

const JUDGE_DEMOS = [
  { label: 'Prelims', path: '/judge-prelims' },
  { label: 'Contest 1', path: '/judge-finals' },
  { label: 'Contest 2', path: '/judge-finals' },
  { label: 'Contest 3', path: '/judge-finals' },
] as const;

export default function JudgeDemosPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title="Judge Demos" backTo="/demo" backLabel="Back to Demo" />

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {JUDGE_DEMOS.map((item) => (
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
            {JUDGE_DEMOS.map((item) => (
              <Grid key={item.label} size={{ xs: 12, md: 6, lg: 6 }}>
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
