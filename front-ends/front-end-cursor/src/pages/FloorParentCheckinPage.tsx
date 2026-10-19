import { Box, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJudgingContestRoster, type ContestRosterPerson, type ContestRosterRole } from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
import type { JudgingHomeContest } from '../lib/judgingHome';
import { floorParentContestLabel } from '../lib/floorParent';
import { compareRosterByBib } from '../utils/rosterBibOrder';

function rosterFullName(person: ContestRosterPerson): string {
  const name = [person.firstName, person.lastName].filter((part) => part.trim() !== '').join(' ');
  return name === '' ? 'Unnamed competitor' : name;
}

function rosterBibLabel(person: ContestRosterPerson): string {
  if (typeof person.bib === 'number' && Number.isFinite(person.bib)) {
    return String(person.bib);
  }
  return '—';
}

function peopleInRole(people: ContestRosterPerson[], role: ContestRosterRole): ContestRosterPerson[] {
  return people.filter((person) => person.role === role).sort(compareRosterByBib);
}

function RosterPersonRow({ person }: { person: ContestRosterPerson }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        minHeight: 40,
        px: 1,
        py: 0.75,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          minWidth: 28,
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
          color: 'text.secondary',
        }}
      >
        {rosterBibLabel(person)}
      </Typography>
      <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
        {rosterFullName(person)}
      </Typography>
    </Stack>
  );
}

function RosterColumn({ title, people }: { title: string; people: ContestRosterPerson[] }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        minHeight: { xs: 180, md: 240 },
        p: { xs: 1.5, md: 2 },
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {people.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            None registered
          </Typography>
        ) : (
          people.map((person) => <RosterPersonRow key={person.id} person={person} />)
        )}
      </Stack>
    </Box>
  );
}

function contestFromSearch(params: URLSearchParams): JudgingHomeContest | null {
  const eventId = Number(params.get('eventId'));
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return null;
  }

  const contestIdRaw = params.get('contestId');
  const contestId = contestIdRaw === null || contestIdRaw.trim() === '' ? null : Number(contestIdRaw);
  const itemId = params.get('itemId')?.trim() ?? '';
  if ((contestId === null || !Number.isInteger(contestId)) && itemId === '') {
    return null;
  }

  return {
    id: `floor-${eventId}-${contestId ?? itemId}`,
    eventId,
    eventName: params.get('eventName')?.trim() ?? '',
    skillLevelLabel: params.get('skill')?.trim() ?? '',
    divisionLabel: params.get('division')?.trim() ?? '',
    contestId: contestId !== null && Number.isInteger(contestId) ? contestId : null,
    contestItemId: itemId,
    skillLevelKey: '',
    divisionKey: '',
    leaderCount: 0,
    followerCount: 0,
    locked: false,
    canToggleLock: false,
  };
}

export default function FloorParentCheckinPage() {
  const [searchParams] = useSearchParams();
  const { containerMaxWidth } = useLayoutTier();
  const contest = useMemo(() => contestFromSearch(searchParams), [searchParams]);
  const [people, setPeople] = useState<ContestRosterPerson[]>([]);
  const [loading, setLoading] = useState(contest !== null);
  const [error, setError] = useState<string | null>(null);
  const title = contest ? floorParentContestLabel(contest) || 'Check-in' : 'Check-in';

  useEffect(() => {
    if (!contest) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    void fetchJudgingContestRoster(contest)
      .then((rows) => {
        if (!cancelled) {
          setPeople(rows);
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setPeople([]);
          setError(loadError instanceof Error ? loadError.message : 'Unable to load the contest roster.');
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
  }, [contest]);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title={title} backTo="/floor-parent-home" backLabel="Back to Floor Parent" />
        {!contest ? (
          <Typography variant="body2" color="text.secondary">
            Choose a contest on the Floor Parent page.
          </Typography>
        ) : loading ? (
          <Stack direction="row" spacing={1} sx={{ py: 3, alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Loading roster…
            </Typography>
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <RosterColumn title="Leaders" people={peopleInRole(people, 'leader')} />
            <RosterColumn title="Followers" people={peopleInRole(people, 'follower')} />
          </Stack>
        )}
        {error ? (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        ) : null}
      </Paper>
    </Container>
  );
}
