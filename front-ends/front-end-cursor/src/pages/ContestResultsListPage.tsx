import { Button, CircularProgress, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchResolvedContestResults, type ResolvedContestResult } from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { useLayoutTier } from '../hooks/useLayoutTier';

function resultsPath(contest: ResolvedContestResult): string {
  if (contest.contestId !== null) {
    return `/results/${contest.contestId}`;
  }
  const params = new URLSearchParams({
    eventId: String(contest.eventId ?? ''),
    contestItemId: contest.contestItemId,
  });
  return `/results/item?${params.toString()}`;
}

export default function ContestResultsListPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [contests, setContests] = useState<ResolvedContestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetchResolvedContestResults()
      .then((rows) => {
        if (!cancelled) {
          setContests(rows);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load contest results.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
        <PageHeader title="Results" backTo="/home" backLabel="Back to Home" />

        {loading ? (
          <Stack
            direction="row"
            spacing={1}
            sx={{ my: 3, alignItems: 'center', justifyContent: 'center' }}
          >
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading results…
            </Typography>
          </Stack>
        ) : error ? (
          <Typography variant="body2" color="error" sx={{ my: 3 }}>
            {error}
          </Typography>
        ) : contests.length === 0 ? (
          <Typography variant="body1" sx={{ my: 3 }}>
            There are no resolved contests yet.
          </Typography>
        ) : showXsLayout ? (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {contests.map((contest) => (
              <Button
                key={contest.contestId ?? `${contest.eventId}-${contest.contestItemId}`}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(resultsPath(contest))}
              >
                {contest.label}
              </Button>
            ))}
          </Stack>
        ) : (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {contests.map((contest) => (
              <Grid key={contest.contestId ?? `${contest.eventId}-${contest.contestItemId}`} size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(resultsPath(contest))}
                  sx={{ height: '100%' }}
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
