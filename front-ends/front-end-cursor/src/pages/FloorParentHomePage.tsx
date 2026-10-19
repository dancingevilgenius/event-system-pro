import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchFloorParentContests,
  fetchFloorParentTitle,
  setFloorParentTitle,
} from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import { useLayoutTier } from '../hooks/useLayoutTier';
import {
  FLOOR_PARENT_TITLES,
  floorParentCheckinPath,
  floorParentContestLabel,
  type FloorParentContest,
  type FloorParentTitle,
} from '../lib/floorParent';
import { formatReadableDateTime } from '../utils/auditTimestamps';

function contestStartLabel(contest: FloorParentContest): string {
  if (contest.startsAt.trim() === '') {
    return '';
  }
  return formatReadableDateTime(contest.startsAt);
}

export default function FloorParentHomePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const [title, setTitle] = useState<FloorParentTitle>('Floor Parent');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [savingTitle, setSavingTitle] = useState(false);
  const [contests, setContests] = useState<FloorParentContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;
    void fetchFloorParentTitle(session.user_id)
      .then((saved) => {
        if (!cancelled) {
          setTitle(saved);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTitleError('Unable to load your saved floor title.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchFloorParentContests()
      .then((rows) => {
        if (!cancelled) {
          setContests(rows);
          setError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setContests([]);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load upcoming contests.');
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

  function changeTitle(next: FloorParentTitle) {
    const previous = title;
    setTitle(next);
    setTitleError(null);
    setSavingTitle(true);
    void setFloorParentTitle(next)
      .then((result) => {
        if (result.ok === false) {
          setTitle(previous);
          setTitleError(result.message ?? 'Unable to save your floor title.');
        }
      })
      .catch((saveError: unknown) => {
        setTitle(previous);
        setTitleError(saveError instanceof Error ? saveError.message : 'Unable to save your floor title.');
      })
      .finally(() => {
        setSavingTitle(false);
      });
  }

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title={title} backTo="/home" backLabel="Back to Home" />
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <FormControl fullWidth sx={{ maxWidth: { xs: '100%', md: 360 } }}>
            <InputLabel id="floor-parent-title-label" sx={{ fontWeight: 700 }}>
              Title
            </InputLabel>
            <Select
              labelId="floor-parent-title-label"
              label="Title"
              value={title}
              disabled={savingTitle}
              onChange={(event) => {
                const next = FLOOR_PARENT_TITLES.find((option) => option === event.target.value);
                if (next) {
                  changeTitle(next);
                }
              }}
            >
              {FLOOR_PARENT_TITLES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {titleError ? (
            <Typography variant="body2" color="error">
              {titleError}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Contests whose event starts within the next 6 hours.
          </Typography>
          {loading ? (
            <Stack direction="row" spacing={1} sx={{ py: 2, alignItems: 'center' }}>
              <CircularProgress size={18} />
              <Typography variant="body2" color="text.secondary">
                Loading contests…
              </Typography>
            </Stack>
          ) : error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : contests.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No contests start in the next 6 hours.
            </Typography>
          ) : showXsLayout ? (
            <Stack spacing={2} sx={{ width: '100%' }}>
              {contests.map((contest) => (
                <ContestButton key={contest.id} contest={contest} onOpen={() => navigate(floorParentCheckinPath(contest))} />
              ))}
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 720 }}>
              {contests.map((contest) => (
                <ContestButton key={contest.id} contest={contest} onOpen={() => navigate(floorParentCheckinPath(contest))} />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

function ContestButton({ contest, onOpen }: { contest: FloorParentContest; onOpen: () => void }) {
  const start = contestStartLabel(contest);
  const label = floorParentContestLabel(contest);
  return (
    <Button
      type="button"
      variant="contained"
      size="large"
      fullWidth
      onClick={onOpen}
      aria-label={start === '' ? label : `${label}, starts ${start}`}
      sx={{ textTransform: 'none', py: 1.25 }}
    >
      <Stack spacing={0.25} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Typography component="span" sx={{ fontWeight: 700 }}>
          {label}
        </Typography>
        {start === '' ? null : (
          <Typography component="span" variant="body2">
            {start}
          </Typography>
        )}
      </Stack>
    </Button>
  );
}
