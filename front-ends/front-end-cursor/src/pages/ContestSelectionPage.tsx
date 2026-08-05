import { Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
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
        <PageHeader title={title} backTo="/home" backLabel="Back to Home" />

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
      </Paper>
    </Container>
  );
}
