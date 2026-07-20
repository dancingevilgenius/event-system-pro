import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

const CONTESTS = ['Contest 1', 'Contest 2', 'Contest 3'] as const;

export default function AdminContestsPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contests
        </Typography>

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {CONTESTS.map((contest) => (
              <Button
                key={contest}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/admin/contests/contest')}
              >
                {contest}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {CONTESTS.map((contest) => (
              <Grid key={contest} size={{ xs: 12, md: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/admin/contests/contest')}
                >
                  {contest}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack sx={showXsLayout ? centeredContentStackSx : undefined}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
