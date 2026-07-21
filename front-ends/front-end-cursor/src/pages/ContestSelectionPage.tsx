import { Button, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

type ContestSelectionPageProps = {
  title: string;
  contestRoute?: string;
};

export default function ContestSelectionPage({
  title,
  contestRoute,
}: ContestSelectionPageProps) {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const contests = ['Contest 1', 'Contest 2', 'Contest 3'];

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {title}
        </Typography>

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {contests.map((contest) => (
              <Button
                key={contest}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => contestRoute && navigate(contestRoute)}
              >
                {contest}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {contests.map((contest) => (
              <Grid key={contest} size={{ xs: 12, md: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => contestRoute && navigate(contestRoute)}
                >
                  {contest}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        <Stack sx={showXsLayout ? centeredContentStackSx : { maxWidth: 480, mx: 'auto', width: '100%' }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
