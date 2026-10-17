import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJudgingHomeContests } from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import type { JudgingHomeContest } from '../lib/judgingHome';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function JudgingHomePage() {
  const navigate = useNavigate();
  const { containerMaxWidth } = useLayoutTier();
  const [contests, setContests] = useState<JudgingHomeContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetchJudgingHomeContests()
      .then((rows) => {
        if (!cancelled) {
          setContests(rows);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setContests([]);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load contests.');
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

  const headerSx = { fontWeight: 700, whiteSpace: 'nowrap' } as const;

  const openScore = (contest: JudgingHomeContest) => {
    const search = contest.contestId === null ? '' : `?contestId=${contest.contestId}`;
    navigate(
      { pathname: '/judge-finals', search },
      {
        state: {
          eventId: contest.eventId,
          contestItemId: contest.contestItemId,
          eventName: contest.eventName,
          skillLevel: contest.skillLevelLabel,
          contestType: contest.divisionLabel,
          ...(contest.contestId === null ? {} : { contestId: contest.contestId }),
        },
      },
    );
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Judging" backTo="/home" backLabel="Back to Home" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Contests you judge whose event starts within the past or next 6 hours.
        </Typography>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Contests to score">
            <TableHead>
              <TableRow>
                <TableCell sx={headerSx}>Event name</TableCell>
                <TableCell sx={headerSx}>Swing level</TableCell>
                <TableCell sx={headerSx}>Contest type</TableCell>
                <TableCell align="right" sx={headerSx}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ py: 2, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <CircularProgress size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Loading contests…
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="error" sx={{ py: 2 }}>
                      {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : contests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      No contests to score in this window.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contests.map((contest) => (
                  <TableRow key={contest.id} hover>
                    <TableCell>{displayValue(contest.eventName)}</TableCell>
                    <TableCell>{displayValue(contest.skillLevelLabel)}</TableCell>
                    <TableCell>{displayValue(contest.divisionLabel)}</TableCell>
                    <TableCell align="right">
                      <Button
                        type="button"
                        variant="contained"
                        size="small"
                        onClick={() => openScore(contest)}
                        aria-label={`Score ${contest.eventName}`.trim()}
                        sx={{ minWidth: { xs: 72, md: 88 }, textTransform: 'none' }}
                      >
                        Score
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
