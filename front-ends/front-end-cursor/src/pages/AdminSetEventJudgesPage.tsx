import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  MenuItem,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchEventGroups,
  fetchEventsForEventGroup,
  fetchEventJudgingPool,
  judgeSearchUserToPoolMember,
  persistEventJudgingPool,
  searchUsersByFirstAndLastName,
  type EventGroupListRow,
  type EventJudgePoolMember,
  type EventListRow,
  type JudgeSearchUser,
} from '../api/postgrest';
import AppTextField from '../components/AppTextField';
import { centeredContentStackSx } from '../constants/layout';
import { useMessages } from '../hooks/useMessages';
import { formatReadableDateTime } from '../utils/auditTimestamps';

function displayValue(value: string): string {
  return value.trim() === '' ? '—' : value;
}

function formatEventStartDate(startDate: string | null): string {
  if (!startDate?.trim()) {
    return '—';
  }

  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) {
    return startDate;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventDates(startDate: string | null, endDate: string | null): string {
  const start = formatEventStartDate(startDate);
  const end = endDate ? formatReadableDateTime(endDate) : '—';
  return `Start: ${start} · End: ${end}`;
}

function eventOptionLabel(event: EventListRow): string {
  const startDate = formatEventStartDate(event.startDate);
  const name = event.name.trim();
  return name ? `${name} (${startDate})` : startDate;
}

export default function AdminSetEventJudgesPage() {
  const navigate = useNavigate();
  const { showProblem, showSuccess } = useMessages();

  const [eventGroups, setEventGroups] = useState<EventGroupListRow[]>([]);
  const [events, setEvents] = useState<EventListRow[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  const [selectedEventCode, setSelectedEventCode] = useState('');

  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingPool, setLoadingPool] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [poolError, setPoolError] = useState<string | null>(null);

  const [judges, setJudges] = useState<EventJudgePoolMember[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JudgeSearchUser[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.eventCode === selectedEventCode) ?? null,
    [events, selectedEventCode],
  );

  const judgeUserIds = useMemo(() => new Set(judges.map((judge) => judge.userId)), [judges]);

  useEffect(() => {
    let cancelled = false;

    void fetchEventGroups()
      .then((groups) => {
        if (!cancelled) {
          setEventGroups(groups);
          setGroupsError(null);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setEventGroups([]);
          setGroupsError(error instanceof Error ? error.message : 'Unable to load event groups.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingGroups(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadEventsForGroup = useCallback(async (eventGroupCode: string) => {
    if (!eventGroupCode) {
      setEvents([]);
      return;
    }

    setLoadingEvents(true);
    setEventsError(null);

    try {
      const rows = await fetchEventsForEventGroup(eventGroupCode);
      setEvents(rows);
    } catch (error) {
      setEvents([]);
      setEventsError(error instanceof Error ? error.message : 'Unable to load events.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const loadJudgingPool = useCallback(async (eventCode: string) => {
    if (!eventCode) {
      setJudges([]);
      return;
    }

    setLoadingPool(true);
    setPoolError(null);

    try {
      const rows = await fetchEventJudgingPool(eventCode);
      setJudges(rows);
    } catch (error) {
      setJudges([]);
      setPoolError(error instanceof Error ? error.message : 'Unable to load judging pool.');
    } finally {
      setLoadingPool(false);
    }
  }, []);

  const handleGroupChange = (eventGroupCode: string) => {
    setSelectedGroupCode(eventGroupCode);
    setSelectedEventCode('');
    setEvents([]);
    setJudges([]);
    setSearchResults([]);
    setSelectedUserIds(new Set());
    setEventsError(null);
    setPoolError(null);
    setSaveError(null);
    void loadEventsForGroup(eventGroupCode);
  };

  const handleEventChange = (eventCode: string) => {
    setSelectedEventCode(eventCode);
    setSearchResults([]);
    setSelectedUserIds(new Set());
    setPoolError(null);
    setSaveError(null);
    void loadJudgingPool(eventCode);
  };

  const handleSearch = async () => {
    const firstName = firstNameQuery.trim();
    const lastName = lastNameQuery.trim();

    if (!firstName && !lastName) {
      setSearchResults([]);
      setSearchError('Enter a first name and/or last name to search.');
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const results = await searchUsersByFirstAndLastName(firstName, lastName);
      setSearchResults(results);
      setSelectedUserIds(new Set());
    } catch (error) {
      setSearchResults([]);
      setSelectedUserIds(new Set());
      setSearchError(error instanceof Error ? error.message : 'Unable to search users.');
    } finally {
      setSearching(false);
    }
  };

  const toggleSelectedUser = (userId: number) => {
    setSelectedUserIds((current) => {
      const next = new Set(current);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleAddSelectedToPool = () => {
    if (selectedUserIds.size === 0) {
      return;
    }

    const toAdd = searchResults
      .filter((user) => selectedUserIds.has(user.userId))
      .map(judgeSearchUserToPoolMember);

    setJudges((current) => {
      const existing = new Set(current.map((judge) => judge.userId));
      const merged = [...current];

      for (const judge of toAdd) {
        if (!existing.has(judge.userId)) {
          merged.push(judge);
          existing.add(judge.userId);
        }
      }

      return merged;
    });

    setSelectedUserIds(new Set());
    setSaveError(null);
  };

  const handleRemoveJudge = (userId: number) => {
    setJudges((current) => current.filter((judge) => judge.userId !== userId));
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!selectedEventCode) {
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const result = await persistEventJudgingPool(selectedEventCode, judges);
      if (!result.ok) {
        setSaveError(result.message);
        showProblem(result.message);
        return;
      }

      setJudges(Array.isArray(result.judges) ? result.judges : judges);
      showSuccess(result.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save judging pool.';
      setSaveError(message);
      showProblem(message);
    } finally {
      setSaving(false);
    }
  };

  const eventSelectionReady = Boolean(selectedEventCode && selectedEvent);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Set Event Judges
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Choose an event group and event, then search users by name to build the judging pool.
        </Typography>

        <Stack spacing={3}>
          <Stack spacing={2}>
            <AppTextField
              select
              label="Event group"
              value={selectedGroupCode}
              onChange={(event) => handleGroupChange(event.target.value)}
              disabled={loadingGroups}
              fullWidth
            >
              <MenuItem value="">
                <em>Select an event group</em>
              </MenuItem>
              {eventGroups.map((group) => (
                <MenuItem key={group.eventGroupCode} value={group.eventGroupCode}>
                  {group.fullName}
                </MenuItem>
              ))}
            </AppTextField>

            {groupsError && (
              <Typography variant="body2" color="error">
                {groupsError}
              </Typography>
            )}

            <AppTextField
              select
              label="Event"
              value={selectedEventCode}
              onChange={(event) => handleEventChange(event.target.value)}
              disabled={!selectedGroupCode || loadingEvents}
              fullWidth
              helperText={
                selectedEvent
                  ? formatEventDates(selectedEvent.startDate, selectedEvent.endDate)
                  : selectedGroupCode
                    ? 'Select an event'
                    : 'Choose an event group first'
              }
            >
              <MenuItem value="">
                <em>Select an event</em>
              </MenuItem>
              {events.map((event) => (
                <MenuItem key={event.eventCode} value={event.eventCode}>
                  {eventOptionLabel(event)}
                </MenuItem>
              ))}
            </AppTextField>

            {loadingEvents && (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CircularProgress size={18} />
                <Typography variant="body2" color="text.secondary">
                  Loading events…
                </Typography>
              </Stack>
            )}

            {eventsError && (
              <Typography variant="body2" color="error">
                {eventsError}
              </Typography>
            )}
          </Stack>

          {eventSelectionReady && (
            <>
              {loadingPool ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" color="text.secondary">
                    Loading judging pool…
                  </Typography>
                </Stack>
              ) : (
                poolError && (
                  <Alert severity="warning">{poolError}</Alert>
                )
              )}

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Search users
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <AppTextField
                    label="First name"
                    value={firstNameQuery}
                    onChange={(event) => setFirstNameQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void handleSearch();
                      }
                    }}
                    fullWidth
                    autoComplete="off"
                  />
                  <AppTextField
                    label="Last name"
                    value={lastNameQuery}
                    onChange={(event) => setLastNameQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        void handleSearch();
                      }
                    }}
                    fullWidth
                    autoComplete="off"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => void handleSearch()}
                    disabled={searching}
                    sx={{ minWidth: 120, height: 56 }}
                  >
                    {searching ? 'Searching…' : 'Search'}
                  </Button>
                </Stack>
                {searchError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {searchError}
                  </Typography>
                )}
              </Box>

              <Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{ mb: 1, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
                >
                  <Typography variant="subtitle2">Search results</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={selectedUserIds.size === 0}
                    onClick={handleAddSelectedToPool}
                  >
                    Add selected to judging pool
                  </Button>
                </Stack>

                {searching ? (
                  <Stack sx={{ py: 3, alignItems: 'center' }}>
                    <CircularProgress size={28} />
                  </Stack>
                ) : (
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" aria-label="User search results">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">Add</TableCell>
                          <TableCell>First name</TableCell>
                          <TableCell>Last name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Username</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              {firstNameQuery.trim() || lastNameQuery.trim()
                                ? 'No users found.'
                                : 'Search by first and/or last name.'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          searchResults.map((user) => {
                            const alreadyInPool = judgeUserIds.has(user.userId);
                            const checked = selectedUserIds.has(user.userId);

                            return (
                              <TableRow key={user.userId} hover selected={checked}>
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    checked={checked}
                                    disabled={alreadyInPool}
                                    onChange={() => toggleSelectedUser(user.userId)}
                                    slotProps={{
                                      input: {
                                        'aria-label': `Add ${user.firstName} ${user.lastName} to judging pool`,
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{displayValue(user.firstName)}</TableCell>
                                <TableCell>{displayValue(user.lastName)}</TableCell>
                                <TableCell>{displayValue(user.email)}</TableCell>
                                <TableCell>{displayValue(user.username)}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Judging pool — {selectedEventCode}
                </Typography>
                <TableContainer sx={{ overflowX: 'auto' }}>
                  <Table size="small" aria-label="Event judging pool">
                    <TableHead>
                      <TableRow>
                        <TableCell>First name</TableCell>
                        <TableCell>Last name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell align="center">Remove</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {judges.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No judges in the pool yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        judges.map((judge) => (
                          <TableRow key={judge.userId} hover>
                            <TableCell>{displayValue(judge.firstname)}</TableCell>
                            <TableCell>{displayValue(judge.lastname)}</TableCell>
                            <TableCell>{displayValue(judge.email)}</TableCell>
                            <TableCell>{displayValue(judge.username)}</TableCell>
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                onClick={() => handleRemoveJudge(judge.userId)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {saveError && (
                <Typography variant="body2" color="error">
                  {saveError}
                </Typography>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={saving || loadingPool}
                onClick={() => void handleSave()}
              >
                {saving ? 'Saving…' : 'Save judging pool'}
              </Button>
            </>
          )}
        </Stack>

        <Stack spacing={2} sx={{ mt: 3, ...centeredContentStackSx }}>
          <Button variant="outlined" fullWidth onClick={() => navigate('/adminhome')}>
            Back to Admin
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
