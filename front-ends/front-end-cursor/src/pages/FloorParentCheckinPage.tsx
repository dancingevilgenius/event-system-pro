import { Box, Checkbox, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchJudgingContestRoster, setContestRosterCheckedIn, type ContestRosterPerson, type ContestRosterRole } from '../api/postgrest';
import PageHeader from '../components/PageHeader';
import PercentCompleteBar from '../components/PercentCompleteBar';
import { useLayoutTier } from '../hooks/useLayoutTier';
import type { JudgingHomeContest } from '../lib/judgingHome';
import { compareRosterByBib } from '../utils/rosterBibOrder';

function checkinTitle(contest: Pick<JudgingHomeContest, 'skillLevelLabel' | 'divisionLabel'>): string {
  const label = [contest.skillLevelLabel, contest.divisionLabel]
    .map((part) => part.trim())
    .filter((part) => part !== '')
    .join(' · ');
  return label === '' ? 'Check-in' : label;
}

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

function RosterPersonRow({
  person,
  checked,
  onToggle,
}: {
  person: ContestRosterPerson;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const name = rosterFullName(person);
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
        {name}
      </Typography>
      <Checkbox
        checked={checked}
        onChange={(_event, next) => onToggle(next)}
        slotProps={{ input: { 'aria-label': `Checked in ${name}` } }}
        sx={{ flexShrink: 0, p: 0.5, ml: 'auto' }}
      />
    </Stack>
  );
}

function RosterColumn({
  title,
  people,
  checkedIds,
  onToggle,
}: {
  title: string;
  people: ContestRosterPerson[];
  checkedIds: Record<string, boolean>;
  onToggle: (personId: string, checked: boolean) => void;
}) {
  const checkedCount = people.filter((person) => checkedIds[person.id] === true).length;
  const percent = people.length === 0 ? 0 : (checkedCount / people.length) * 100;

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
      <Box sx={{ mb: 1.5 }}>
        <PercentCompleteBar
          percent={percent}
          label={`Percent Checked-in: ${Math.round(percent)}%`}
          ariaLabel={`${title} percent checked in`}
          completeColor="success"
        />
      </Box>
      <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1}>
        {people.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            None registered
          </Typography>
        ) : (
          people.map((person) => (
            <RosterPersonRow
              key={person.id}
              person={person}
              checked={checkedIds[person.id] === true}
              onToggle={(next) => onToggle(person.id, next)}
            />
          ))
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
    leadersCheckedIn: 0,
    followersCheckedIn: 0,
    locked: false,
    canToggleLock: false,
  };
}

export default function FloorParentCheckinPage() {
  const [searchParams] = useSearchParams();
  const { containerMaxWidth } = useLayoutTier();
  const contest = useMemo(() => contestFromSearch(searchParams), [searchParams]);
  const [people, setPeople] = useState<ContestRosterPerson[]>([]);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(contest !== null);
  const [error, setError] = useState<string | null>(null);
  const title = contest ? checkinTitle(contest) : 'Check-in';

  const toggleChecked = (person: ContestRosterPerson, checked: boolean) => {
    if (!contest) {
      return;
    }
    setCheckedIds((current) => ({ ...current, [person.id]: checked }));
    setError(null);
    void setContestRosterCheckedIn(contest, person, checked).catch((saveError: unknown) => {
      setCheckedIds((current) => ({ ...current, [person.id]: !checked }));
      setError(saveError instanceof Error ? saveError.message : 'Unable to save check-in.');
    });
  };

  useEffect(() => {
    if (!contest) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setCheckedIds({});
    void fetchJudgingContestRoster(contest)
      .then((rows) => {
        if (!cancelled) {
          setPeople(rows);
          setCheckedIds(
            Object.fromEntries(rows.filter((person) => person.checkedIn).map((person) => [person.id, true])),
          );
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
            <RosterColumn
              title="Leaders"
              people={peopleInRole(people, 'leader')}
              checkedIds={checkedIds}
              onToggle={(_personId, checked) => {
                const person = people.find((entry) => entry.id === _personId);
                if (person) {
                  toggleChecked(person, checked);
                }
              }}
            />
            <RosterColumn
              title="Followers"
              people={peopleInRole(people, 'follower')}
              checkedIds={checkedIds}
              onToggle={(_personId, checked) => {
                const person = people.find((entry) => entry.id === _personId);
                if (person) {
                  toggleChecked(person, checked);
                }
              }}
            />
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
