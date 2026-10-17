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
  ToggleButton,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchJudgingContestPairs,
  fetchJudgingHomeContests,
  setJudgingContestLocked,
} from '../api/postgrest';
import JudgingContestPairsDialog from '../components/JudgingContestPairsDialog';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { formatRegisteredCounts, type JudgingHomeContest } from '../lib/judgingHome';
import type { StoredContestPair } from '../lib/judgingPairs';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

export default function JudgingHomePage() {
  const navigate = useNavigate();
  const { containerMaxWidth } = useLayoutTier();
  const [contests, setContests] = useState<JudgingHomeContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockError, setLockError] = useState<string | null>(null);
  const [savingLockId, setSavingLockId] = useState<string | null>(null);
  const [pairsRequest, setPairsRequest] = useState<{
    contest: JudgingHomeContest;
    continueToScore: boolean;
  } | null>(null);
  const [checkingScoreId, setCheckingScoreId] = useState<string | null>(null);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const scoreRequestRef = useRef(0);

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
  const showLockColumn = contests.some((contest) => contest.canToggleLock);
  const columnCount = showLockColumn ? 6 : 5;

  const goToFinals = (contest: JudgingHomeContest, pairs: StoredContestPair[]) => {
    const params = new URLSearchParams();
    if (contest.contestId !== null) {
      params.set('contestId', String(contest.contestId));
    }
    if (Number.isInteger(contest.eventId) && contest.eventId > 0) {
      params.set('eventId', String(contest.eventId));
    }
    const contestItemId = contest.contestItemId.trim();
    if (contestItemId !== '') {
      params.set('contestItemId', contestItemId);
    }
    const search = params.size > 0 ? `?${params.toString()}` : '';
    navigate(
      { pathname: '/judge-finals', search },
      {
        state: {
          eventId: contest.eventId,
          contestItemId: contest.contestItemId,
          eventName: contest.eventName,
          skillLevel: contest.skillLevelLabel,
          contestType: contest.divisionLabel,
          pairs,
          ...(contest.contestId === null ? {} : { contestId: contest.contestId }),
        },
      },
    );
  };

  const openScore = (contest: JudgingHomeContest) => {
    const request = scoreRequestRef.current + 1;
    scoreRequestRef.current = request;
    setCheckingScoreId(contest.id);
    setScoreError(null);
    void fetchJudgingContestPairs(contest)
      .then((pairs) => {
        if (scoreRequestRef.current !== request) {
          return;
        }
        if (pairs.length > 0) {
          goToFinals(contest, pairs);
          return;
        }
        setPairsRequest({ contest, continueToScore: true });
      })
      .catch((loadError: unknown) => {
        if (scoreRequestRef.current !== request) {
          return;
        }
        setScoreError(loadError instanceof Error ? loadError.message : 'Unable to load contest pairs.');
      })
      .finally(() => {
        if (scoreRequestRef.current === request) {
          setCheckingScoreId(null);
        }
      });
  };

  const toggleLock = (contest: JudgingHomeContest) => {
    const nextLocked = !contest.locked;
    setSavingLockId(contest.id);
    setLockError(null);
    void setJudgingContestLocked(contest, nextLocked)
      .then(() => {
        setContests((current) =>
          current.map((row) => (row.id === contest.id ? { ...row, locked: nextLocked } : row)),
        );
      })
      .catch((saveError: unknown) => {
        setLockError(saveError instanceof Error ? saveError.message : 'Unable to update the contest lock.');
      })
      .finally(() => {
        setSavingLockId((current) => (current === contest.id ? null : current));
      });
  };

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Judging" backTo="/home" backLabel="Back to Home" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Contests whose event starts within the past or next 6 hours.
        </Typography>
        {lockError ? (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {lockError}
          </Typography>
        ) : null}
        {scoreError ? (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {scoreError}
          </Typography>
        ) : null}
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small" aria-label="Contests to score">
            <TableHead>
              <TableRow>
                <TableCell sx={headerSx}>Event name</TableCell>
                <TableCell sx={headerSx}>Swing level</TableCell>
                <TableCell sx={headerSx}>Contest type</TableCell>
                <TableCell sx={headerSx}>Registered</TableCell>
                {showLockColumn ? <TableCell sx={headerSx}>Lock</TableCell> : null}
                <TableCell align="right" sx={headerSx}>
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columnCount} align="center">
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
                  <TableCell colSpan={columnCount} align="center">
                    <Typography variant="body2" color="error" sx={{ py: 2 }}>
                      {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : contests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columnCount} align="center">
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
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        onClick={() => setPairsRequest({ contest, continueToScore: false })}
                        aria-label={`Registered competitors for ${contest.eventName} ${contest.skillLevelLabel} ${contest.divisionLabel}`.trim()}
                        sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                      >
                        {formatRegisteredCounts(contest.leaderCount, contest.followerCount)}
                      </Button>
                    </TableCell>
                    {showLockColumn ? (
                      <TableCell>
                        {contest.canToggleLock ? (
                          <ToggleButton
                            value="locked"
                            selected={contest.locked}
                            disabled={savingLockId === contest.id}
                            onChange={() => toggleLock(contest)}
                            aria-label={`${contest.locked ? 'Locked' : 'Unlocked'} ${contest.eventName} ${contest.divisionLabel}`.trim()}
                            sx={{
                              px: { xs: 1, md: 1.5 },
                              py: 0.5,
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {contest.locked ? 'Locked' : 'Unlocked'}
                          </ToggleButton>
                        ) : null}
                      </TableCell>
                    ) : null}
                    <TableCell align="right">
                      <Button
                        type="button"
                        variant="contained"
                        size="small"
                        disabled={contest.locked || checkingScoreId === contest.id}
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
        <JudgingContestPairsDialog
          contest={pairsRequest?.contest ?? null}
          continueToScore={pairsRequest?.continueToScore ?? false}
          onClose={() => setPairsRequest(null)}
          onSaved={(pairs) => {
            const request = pairsRequest;
            if (!request?.continueToScore) {
              return;
            }
            setPairsRequest(null);
            goToFinals(request.contest, pairs);
          }}
        />
      </Paper>
    </Container>
  );
}
