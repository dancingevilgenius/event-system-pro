import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  clearJudgingContestScores,
  ensureContestRelativePlacement,
  fetchJudgingContestPairs,
  fetchJudgingHomeContests,
  setJudgingContestLocked,
} from '../api/postgrest';
import JudgingContestPairsDialog from '../components/JudgingContestPairsDialog';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { formatRegisteredCounts, type JudgingHomeContest } from '../lib/judgingHome';
import { savedPairsOpenFinals, type StoredContestPair } from '../lib/judgingPairs';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function contestClearLabel(contest: JudgingHomeContest): string {
  return [contest.eventName, contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
}

export default function JudgingHomePage() {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);
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
  const [placementError, setPlacementError] = useState<string | null>(null);
  const [clearTarget, setClearTarget] = useState<JudgingHomeContest | null>(null);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const scoreRequestRef = useRef(0);
  const loadRequestRef = useRef(0);

  const loadContests = useCallback(() => {
    const request = loadRequestRef.current + 1;
    loadRequestRef.current = request;
    setLoading(true);
    setError(null);
    void fetchJudgingHomeContests()
      .then((rows) => {
        if (loadRequestRef.current !== request) {
          return;
        }
        setContests(rows);
        setError(null);
        void Promise.all(
          rows.map((contest) =>
            ensureContestRelativePlacement({
              eventId: contest.eventId,
              contestId: contest.contestId,
              contestItemId: contest.contestItemId,
              eventName: contest.eventName,
              skillLevel: contest.skillLevelLabel,
              division: contest.divisionLabel,
            }),
          ),
        )
          .then(() => {
            if (loadRequestRef.current === request) {
              setPlacementError(null);
            }
          })
          .catch(() => {
            if (loadRequestRef.current === request) {
              setPlacementError('Unable to save relative placement for a finished contest.');
            }
          });
      })
      .catch((loadError: unknown) => {
        if (loadRequestRef.current !== request) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : 'Unable to load contests.');
      })
      .finally(() => {
        if (loadRequestRef.current === request) {
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    loadContests();
    return () => {
      loadRequestRef.current += 1;
    };
  }, [loadContests]);

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
    if (contest.locked || contest.viewerSubmitted) {
      return;
    }
    const request = scoreRequestRef.current + 1;
    scoreRequestRef.current = request;
    setCheckingScoreId(contest.id);
    setScoreError(null);
    void fetchJudgingContestPairs(contest)
      .then((pairs) => {
        if (scoreRequestRef.current !== request) {
          return;
        }
        if (savedPairsOpenFinals(pairs)) {
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

  const closeClearDialog = () => {
    if (clearing) {
      return;
    }
    setClearTarget(null);
    setClearError(null);
  };

  const confirmClearScores = () => {
    const contest = clearTarget;
    if (!contest || clearing) {
      return;
    }
    setClearing(true);
    setClearError(null);
    void clearJudgingContestScores(contest)
      .then(() => {
        setClearTarget(null);
        loadContests();
      })
      .catch((saveError: unknown) => {
        setClearError(saveError instanceof Error ? saveError.message : 'Unable to clear contest scores.');
      })
      .finally(() => {
        setClearing(false);
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
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 12rem', minWidth: 0 }}>
            Contests whose event starts within the past or next 6 hours.
          </Typography>
          <Button
            type="button"
            size="small"
            variant="outlined"
            onClick={loadContests}
            disabled={loading}
            sx={{ textTransform: 'none', flexShrink: 0 }}
          >
            {loading ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
            Refresh
          </Button>
        </Stack>
        {error && contests.length > 0 ? (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}
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
        {placementError ? (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {placementError}
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
              {loading && contests.length === 0 ? (
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
              ) : error && contests.length === 0 ? (
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
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}
                      >
                        {isAdmin ? (
                          <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            disabled={clearing}
                            onClick={() => {
                              setClearError(null);
                              setClearTarget(contest);
                            }}
                            aria-label={`Clear scores for ${contestClearLabel(contest)}`}
                            sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                          >
                            Clear Scores
                          </Button>
                        ) : null}
                        <Box
                          component="span"
                          title={contest.viewerSubmitted ? 'Scores already submitted' : undefined}
                          sx={{ display: 'inline-flex' }}
                        >
                          <Button
                            type="button"
                            variant="contained"
                            size="small"
                            disabled={contest.locked || contest.viewerSubmitted || checkingScoreId === contest.id}
                            onClick={() => openScore(contest)}
                            aria-label={
                              contest.viewerSubmitted
                                ? `Scores already submitted for ${contest.eventName}`.trim()
                                : `Score ${contest.eventName}`.trim()
                            }
                            sx={{ minWidth: { xs: 72, md: 88 }, textTransform: 'none' }}
                          >
                            Score
                          </Button>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={clearTarget !== null} onClose={closeClearDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>Clear scores?</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {clearTarget
                ? `Clear all judge scores and the relative placement result for ${contestClearLabel(clearTarget)}?`
                : ''}
            </Typography>
            {clearError ? (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {clearError}
              </Typography>
            ) : null}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Button
              type="button"
              onClick={closeClearDialog}
              disabled={clearing}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="error"
              onClick={confirmClearScores}
              disabled={clearing || clearTarget === null}
              sx={{ textTransform: 'none' }}
            >
              {clearing ? <CircularProgress size={14} sx={{ mr: 1 }} /> : null}
              Clear Scores
            </Button>
          </DialogActions>
        </Dialog>
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
