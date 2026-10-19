import {
  Box,
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
  type FloorParentContest,
  type FloorParentTitle,
} from '../lib/floorParent';
import { formatReadableDateTime } from '../utils/auditTimestamps';

type EventContestGroup = {
  eventId: number;
  eventName: string;
  startsAt: string;
  contests: FloorParentContest[];
};

function contestButtonLabel(contest: FloorParentContest): string {
  const label = [contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
  return label === '' ? 'Contest' : label;
}

function contestStartLabel(startsAt: string): string {
  if (startsAt.trim() === '') {
    return '';
  }
  return formatReadableDateTime(startsAt);
}

function groupContestsByEvent(contests: FloorParentContest[]): EventContestGroup[] {
  const byEvent = new Map<number, EventContestGroup>();
  for (const contest of contests) {
    const existing = byEvent.get(contest.eventId);
    if (existing) {
      existing.contests.push(contest);
      continue;
    }
    const eventName = contest.eventName.trim();
    byEvent.set(contest.eventId, {
      eventId: contest.eventId,
      eventName: eventName === '' ? 'Event' : eventName,
      startsAt: contest.startsAt,
      contests: [contest],
    });
  }

  return [...byEvent.values()].sort((left, right) => {
    const leftStart = new Date(left.startsAt).getTime();
    const rightStart = new Date(right.startsAt).getTime();
    if (leftStart !== rightStart) {
      return leftStart - rightStart;
    }
    return left.eventId - right.eventId;
  });
}

export default function FloorParentHomePage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { containerMaxWidth } = useLayoutTier();
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
          ) : (
            <Stack spacing={2} sx={{ width: '100%', alignItems: 'stretch' }}>
              {groupContestsByEvent(contests).map((group) => (
                <EventContestGroupBox
                  key={group.eventId}
                  group={group}
                  onOpen={(contest) => navigate(floorParentCheckinPath(contest))}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}

function EventContestGroupBox({
  group,
  onOpen,
}: {
  group: EventContestGroup;
  onOpen: (contest: FloorParentContest) => void;
}) {
  const start = contestStartLabel(group.startsAt);
  return (
    <Box
      component="fieldset"
      sx={{
        m: 0,
        width: '100%',
        minWidth: 0,
        p: { xs: 1.5, md: 2 },
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography component="legend" sx={{ px: 0.5, fontWeight: 700 }}>
        {group.eventName}
      </Typography>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ alignItems: { md: 'center' } }}
      >
        <Typography
          variant="body2"
          sx={{
            flexShrink: 0,
            width: { md: '16rem' },
            color: start === '' ? 'text.secondary' : 'text.primary',
          }}
        >
          {start === '' ? 'Start time unavailable' : start}
        </Typography>
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          {group.contests.map((contest) => {
            const label = contestButtonLabel(contest);
            return (
              <Button
                key={contest.id}
                type="button"
                variant="contained"
                size="large"
                fullWidth
                onClick={() => onOpen(contest)}
                aria-label={
                  start === ''
                    ? `${group.eventName}, ${label}`
                    : `${group.eventName}, ${label}, starts ${start}`
                }
                sx={{ textTransform: 'none' }}
              >
                {label}
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
