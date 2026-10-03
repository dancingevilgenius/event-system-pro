import { Button, Container, Grid, Paper, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

type ContestSelectionLink = {
  label: string;
  route?: string;
};

type ContestSelectionPageProps = {
  title: string;
  contestRoute?: string;
  links?: ContestSelectionLink[];
};

export default function ContestSelectionPage({
  title,
  contestRoute,
  links,
}: ContestSelectionPageProps) {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const contests: ContestSelectionLink[] =
    links ??
    ['Contest 1', 'Contest 2', 'Contest 3'].map((label) => ({
      label,
      route: contestRoute,
    }));
  const gridSize =
    contests.length === 4 ? { xs: 12, md: 6, lg: 6 } : { xs: 12, md: 4, lg: 4 };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title={title} backTo="/home" backLabel="Back to Home" />

        {showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {contests.map((contest) => (
              <Button
                key={contest.label}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => contest.route && navigate(contest.route)}
              >
                {contest.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {contests.map((contest) => (
              <Grid key={contest.label} size={gridSize}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => contest.route && navigate(contest.route)}
                >
                  {contest.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
}
