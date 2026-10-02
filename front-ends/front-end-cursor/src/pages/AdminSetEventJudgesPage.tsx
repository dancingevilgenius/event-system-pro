import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
  Radio,
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
import AuditTrailCard from '../components/AuditTrailCard';
import PageHeader from '../components/PageHeader';
import { useLayoutTier } from '../hooks/useLayoutTier';
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

function JudgeSearchResultMobileCard({
  user,
  selected,
  alreadyInPool,
  disabled,
  onSelect,
}: {
  user: JudgeSearchUser;
  selected: boolean;
  alreadyInPool: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <AuditTrailCard
      columns={2}
      actionsAlign="right"
      actionsInGrid
      fields={[
        { key: 'first', label: 'First name', value: displayValue(user.firstName) },
        { key: 'last', label: 'Last name', value: displayValue(user.lastName) },
        { key: 'city', label: 'City', value: displayValue(user.city) },
        { key: 'state', label: 'State', value: displayValue(user.state) },
      ]}
      actions={
        <Radio
          checked={selected}
          disabled={alreadyInPool || disabled}
          onChange={onSelect}
          value={user.userId}
          name="judge-search-selection"
          slotProps={{
            input: {
              'aria-label': `Select ${user.firstName} ${user.lastName} to add to judging pool`,
            },
          }}
        />
      }
    />
  );
}

function JudgePoolMobileCard({
  judge,
  removing,
  onRemove,
}: {
  judge: EventJudgePoolMember;
  removing: boolean;
  onRemove: () => void;
}) {
  return (
    <AuditTrailCard
      columns={2}
      actionsAlign="right"
      actionsInGrid
      fields={[
        { key: 'first', label: 'First name', value: displayValue(judge.firstname) },
        { key: 'last', label: 'Last name', value: displayValue(judge.lastname) },
        { key: 'city', label: 'City', value: displayValue(judge.city) },
        { key: 'state', label: 'State', value: displayValue(judge.state) },
      ]}
      actions={
        <Button variant="outlined" size="small" color="error" disabled={removing} onClick={onRemove}>
          Remove
        </Button>
      }
    />
  );
}

export default function AdminSetEventJudgesPage() {
  const { showProblem, showSuccess } = useMessages();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();

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

  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [searchResults, setSearchResults] = useState<JudgeSearchUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
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
    setSelectedUserId(null);
    setEventsError(null);
    setPoolError(null);
    void loadEventsForGroup(eventGroupCode);
  };

  const handleEventChange = (eventCode: string) => {
    setSelectedEventCode(eventCode);
    setSearchResults([]);
    setSelectedUserId(null);
    setPoolError(null);
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

      const onlyResult = results.length === 1 ? results[0] : null;
      if (onlyResult && !judgeUserIds.has(onlyResult.userId)) {
        setSelectedUserId(onlyResult.userId);
      } else {
        setSelectedUserId(null);
      }
    } catch (error) {
      setSearchResults([]);
      setSelectedUserId(null);
      setSearchError(error instanceof Error ? error.message : 'Unable to search users.');
    } finally {
      setSearching(false);
    }
  };

  const persistPool = async (nextJudges: EventJudgePoolMember[]): Promise<boolean> => {
    if (!selectedEventCode) {
      return false;
    }

    setSaving(true);

    try {
      const result = await persistEventJudgingPool(selectedEventCode, nextJudges);
      if (!result.ok) {
        showProblem(result.message);
        return false;
      }

      setJudges(Array.isArray(result.judges) ? result.judges : nextJudges);
      showSuccess(result.message);
      return true;
    } catch (error) {
      showProblem(error instanceof Error ? error.message : 'Unable to save judging pool.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const selectSearchUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  const handleAddSelectedToPool = async () => {
    if (selectedUserId === null || saving || !selectedEventCode) {
      return;
    }

    const user = searchResults.find((result) => result.userId === selectedUserId);
    if (!user || judgeUserIds.has(user.userId)) {
      return;
    }

    const nextJudges = [...judges, judgeSearchUserToPoolMember(user)];
    const saved = await persistPool(nextJudges);
    if (saved) {
      setSelectedUserId(null);
    }
  };

  const handleRemoveJudge = async (userId: number) => {
    if (saving || !selectedEventCode) {
      return;
    }

    const nextJudges = judges.filter((judge) => judge.userId !== userId);
    await persistPool(nextJudges);
  };

  const eventSelectionReady = Boolean(selectedEventCode && selectedEvent);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Set Event Judges" backTo="/adminhome" backLabel="Back to Admin" />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Choose an event group and event, then search users by name to build the judging pool.
          Additions and removals are saved automatically.
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

          {eventSelectionReady && selectedEvent && (
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
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1}>
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
                    fullWidth={showXsLayout}
                    sx={{ minWidth: { xs: '100%', md: 120 }, height: { xs: 'auto', md: 56 } }}
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
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  sx={{ mb: 1, alignItems: { md: 'center' }, justifyContent: 'space-between' }}
                >
                  <Typography variant="subtitle2">Search results</Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={selectedUserId === null || saving}
                    onClick={() => void handleAddSelectedToPool()}
                  >
                    {saving ? 'Saving…' : 'Add selected to judging pool'}
                  </Button>
                </Stack>

                {searching ? (
                  <Stack sx={{ py: 3, alignItems: 'center' }}>
                    <CircularProgress size={28} />
                  </Stack>
                ) : showXsLayout ? (
                  <Stack spacing={1.5}>
                    {searchResults.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                        {firstNameQuery.trim() || lastNameQuery.trim()
                          ? 'No users found.'
                          : 'Search by first and/or last name.'}
                      </Typography>
                    ) : (
                      searchResults.map((user) => {
                        const alreadyInPool = judgeUserIds.has(user.userId);
                        const selected = selectedUserId === user.userId;

                        return (
                          <JudgeSearchResultMobileCard
                            key={user.userId}
                            user={user}
                            selected={selected}
                            alreadyInPool={alreadyInPool}
                            disabled={saving}
                            onSelect={() => selectSearchUser(user.userId)}
                          />
                        );
                      })
                    )}
                  </Stack>
                ) : (
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" aria-label="User search results">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">Add</TableCell>
                          <TableCell>First name</TableCell>
                          <TableCell>Last name</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
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
                            const selected = selectedUserId === user.userId;

                            return (
                              <TableRow key={user.userId} hover selected={selected}>
                                <TableCell padding="checkbox">
                                  <Radio
                                    checked={selected}
                                    disabled={alreadyInPool || saving}
                                    onChange={() => selectSearchUser(user.userId)}
                                    value={user.userId}
                                    name="judge-search-selection"
                                    slotProps={{
                                      input: {
                                        'aria-label': `Select ${user.firstName} ${user.lastName} to add to judging pool`,
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell>{displayValue(user.firstName)}</TableCell>
                                <TableCell>{displayValue(user.lastName)}</TableCell>
                                <TableCell>{displayValue(user.city)}</TableCell>
                                <TableCell>{displayValue(user.state)}</TableCell>
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
                  Judging pool — {eventOptionLabel(selectedEvent)}
                </Typography>
                {showXsLayout ? (
                  <Stack spacing={1.5}>
                    {judges.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                        No judges in the pool yet.
                      </Typography>
                    ) : (
                      judges.map((judge) => (
                        <JudgePoolMobileCard
                          key={judge.userId}
                          judge={judge}
                          removing={saving}
                          onRemove={() => void handleRemoveJudge(judge.userId)}
                        />
                      ))
                    )}
                  </Stack>
                ) : (
                  <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table size="small" aria-label="Event judging pool">
                      <TableHead>
                        <TableRow>
                          <TableCell>First name</TableCell>
                          <TableCell>Last name</TableCell>
                          <TableCell>City</TableCell>
                          <TableCell>State</TableCell>
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
                              <TableCell>{displayValue(judge.city)}</TableCell>
                              <TableCell>{displayValue(judge.state)}</TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="error"
                                  disabled={saving}
                                  onClick={() => void handleRemoveJudge(judge.userId)}
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
                )}
              </Box>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
