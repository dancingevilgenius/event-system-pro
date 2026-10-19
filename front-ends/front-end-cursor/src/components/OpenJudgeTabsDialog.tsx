import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchEventGroups,
  fetchEventsForEventGroup,
  fetchOpenJudgeContestChoices,
  openContestJudgeTabs,
  type EventGroupListRow,
  type EventListRow,
} from '../api/postgrest';
import AppTextField from './AppTextField';
import { sessionFromLoginResult } from '../lib/loginSuccess';
import {
  filterEventGroupOptions,
  pendingJudgeTabPath,
  publishJudgeTabHandoff,
  type OpenJudgeContestChoice,
} from '../lib/openJudgeTabs';

type OpenJudgeTabsDialogProps = {
  open: boolean;
  onClose: () => void;
};

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

function eventOptionLabel(event: EventListRow): string {
  const name = event.name.trim();
  const start = formatEventStartDate(event.startDate);
  return name === '' ? start : `${name} (${start})`;
}

function openJudgeWindows(count: number): { slotId: string; tab: Window | null }[] {
  return Array.from({ length: count }, () => {
    const slotId = crypto.randomUUID();
    const tab = window.open(
      new URL(pendingJudgeTabPath(slotId), window.location.origin).toString(),
      '_blank',
    );
    return { slotId, tab };
  });
}

export default function OpenJudgeTabsDialog({ open, onClose }: OpenJudgeTabsDialogProps) {
  const [eventGroups, setEventGroups] = useState<EventGroupListRow[]>([]);
  const [groupFilter, setGroupFilter] = useState('');
  const [selectedGroupCode, setSelectedGroupCode] = useState('');
  const [events, setEvents] = useState<EventListRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [contests, setContests] = useState<OpenJudgeContestChoice[]>([]);
  const [selectedContestKey, setSelectedContestKey] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingContests, setLoadingContests] = useState(false);
  const [opening, setOpening] = useState(false);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [contestsError, setContestsError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ severity: 'success' | 'warning' | 'error'; text: string } | null>(
    null,
  );
  const eventsRequest = useRef(0);
  const contestsRequest = useRef(0);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;
    setLoadingGroups(true);
    setGroupsError(null);

    void fetchEventGroups()
      .then((groups) => {
        if (!cancelled) {
          setEventGroups(groups);
        }
      })
      .catch((error: unknown) => {
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
  }, [open]);

  const filteredGroups = useMemo(() => {
    const matches = filterEventGroupOptions(eventGroups, groupFilter);
    const selected = eventGroups.find((group) => group.eventGroupCode === selectedGroupCode);
    if (selected && !matches.some((group) => group.eventGroupCode === selected.eventGroupCode)) {
      return [selected, ...matches];
    }
    return matches;
  }, [eventGroups, groupFilter, selectedGroupCode]);

  const selectedContest = contests.find((contest) => contest.key === selectedContestKey) ?? null;
  const assignedJudgeCount = selectedContest?.judgeStaffIds.length ?? 0;

  const handleGroupChange = (eventGroupCode: string) => {
    setSelectedGroupCode(eventGroupCode);
    setSelectedEventId('');
    setEvents([]);
    setContests([]);
    setSelectedContestKey('');
    setEventsError(null);
    setContestsError(null);
    setNotice(null);

    if (!eventGroupCode) {
      return;
    }

    const request = eventsRequest.current + 1;
    eventsRequest.current = request;
    setLoadingEvents(true);
    void fetchEventsForEventGroup(eventGroupCode)
      .then((rows) => {
        if (request !== eventsRequest.current) {
          return;
        }
        setEvents(rows);
      })
      .catch((error: unknown) => {
        if (request !== eventsRequest.current) {
          return;
        }
        setEvents([]);
        setEventsError(error instanceof Error ? error.message : 'Unable to load events.');
      })
      .finally(() => {
        if (request === eventsRequest.current) {
          setLoadingEvents(false);
        }
      });
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
    setContests([]);
    setSelectedContestKey('');
    setContestsError(null);
    setNotice(null);

    const numericId = Number(eventId);
    if (!Number.isInteger(numericId) || numericId <= 0) {
      return;
    }

    const request = contestsRequest.current + 1;
    contestsRequest.current = request;
    setLoadingContests(true);
    void fetchOpenJudgeContestChoices(numericId)
      .then((rows) => {
        if (request !== contestsRequest.current) {
          return;
        }
        setContests(rows);
      })
      .catch((error: unknown) => {
        if (request !== contestsRequest.current) {
          return;
        }
        setContests([]);
        setContestsError(error instanceof Error ? error.message : 'Unable to load contests.');
      })
      .finally(() => {
        if (request === contestsRequest.current) {
          setLoadingContests(false);
        }
      });
  };

  const handleOpenTabs = () => {
    const eventId = Number(selectedEventId);
    if (!selectedContest || assignedJudgeCount === 0 || !Number.isInteger(eventId)) {
      return;
    }

    const openedWindows = openJudgeWindows(assignedJudgeCount);
    setOpening(true);
    setNotice(null);

    void openContestJudgeTabs(eventId, selectedContest.key)
      .then((result) => {
        if (!result.ok) {
          openedWindows.forEach(({ tab }) => tab?.close());
          setNotice({
            severity: 'error',
            text: result.message ?? 'Unable to open judge tabs.',
          });
          return;
        }

        const sessions = (result.sessions ?? []).flatMap((session) => {
          const success = sessionFromLoginResult(session);
          return success ? [success.session] : [];
        });
        let opened = 0;
        sessions.forEach((session, index) => {
          const target = openedWindows[index];
          if (!target?.tab || target.tab.closed) {
            return;
          }
          publishJudgeTabHandoff(target.slotId, session);
          opened += 1;
        });
        for (let index = sessions.length; index < openedWindows.length; index += 1) {
          openedWindows[index]?.tab?.close();
        }

        const skipped = (result.skipped ?? []).flatMap((entry) => {
          const name = typeof entry.name === 'string' ? entry.name.trim() : '';
          const reason = typeof entry.reason === 'string' ? entry.reason.trim() : '';
          if (name === '' && reason === '') {
            return [];
          }
          return [`${name || 'Judge'}: ${reason || 'Unable to sign this judge in.'}`];
        });
        const blocked = sessions.length > opened;

        if (opened === 0) {
          setNotice({
            severity: 'error',
            text: skipped.length > 0
              ? skipped.join(' ')
              : blocked
                ? 'The browser blocked the judge tabs. Allow pop-ups for this site, then try again.'
                : 'No judge tabs were opened.',
          });
          return;
        }

        const summary = `Opened ${opened} judge tab${opened === 1 ? '' : 's'}.`;
        const extra = [
          blocked ? 'The browser blocked some tabs. Allow pop-ups for this site, then try again.' : '',
          ...skipped,
        ].filter((line) => line !== '');
        setNotice({
          severity: extra.length > 0 ? 'warning' : 'success',
          text: extra.length > 0 ? `${summary} ${extra.join(' ')}` : summary,
        });
      })
      .catch((error: unknown) => {
        openedWindows.forEach(({ tab }) => tab?.close());
        setNotice({
          severity: 'error',
          text: error instanceof Error ? error.message : 'Unable to open judge tabs.',
        });
      })
      .finally(() => {
        setOpening(false);
      });
  };

  const handleClose = () => {
    if (opening) {
      return;
    }
    setGroupFilter('');
    setSelectedGroupCode('');
    setEvents([]);
    setSelectedEventId('');
    setContests([]);
    setSelectedContestKey('');
    setNotice(null);
    setGroupsError(null);
    setEventsError(null);
    setContestsError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Open Judge Tabs</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {notice && <Alert severity={notice.severity}>{notice.text}</Alert>}

          <AppTextField
            label="Filter"
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
            fullWidth
            autoComplete="off"
            helperText="Narrows the event group list"
          />

          <AppTextField
            select
            label="Event group"
            value={selectedGroupCode}
            onChange={(event) => handleGroupChange(event.target.value)}
            disabled={loadingGroups}
            fullWidth
            helperText={loadingGroups ? 'Loading event groups…' : 'Select an event group'}
          >
            {filteredGroups.map((group) => (
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

          {selectedGroupCode && (
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Events
              </Typography>
              {loadingEvents ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Loading events…
                  </Typography>
                </Stack>
              ) : eventsError ? (
                <Typography variant="body2" color="error">
                  {eventsError}
                </Typography>
              ) : events.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  This event group has no events.
                </Typography>
              ) : (
                <RadioGroup
                  value={selectedEventId}
                  onChange={(event) => handleEventChange(event.target.value)}
                  sx={{ maxHeight: { xs: 220, md: 280 }, overflow: 'auto' }}
                >
                  {events.map((event) => (
                    <FormControlLabel
                      key={event.eventId}
                      value={String(event.eventId)}
                      control={<Radio />}
                      label={eventOptionLabel(event)}
                    />
                  ))}
                </RadioGroup>
              )}
            </Stack>
          )}

          {selectedEventId && (
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Contests
              </Typography>
              {loadingContests ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <CircularProgress size={18} />
                  <Typography variant="body2" color="text.secondary">
                    Loading contests…
                  </Typography>
                </Stack>
              ) : contestsError ? (
                <Typography variant="body2" color="error">
                  {contestsError}
                </Typography>
              ) : contests.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  This event has no contests.
                </Typography>
              ) : (
                <RadioGroup
                  value={selectedContestKey}
                  onChange={(event) => {
                    setSelectedContestKey(event.target.value);
                    setNotice(null);
                  }}
                  sx={{ maxHeight: { xs: 220, md: 280 }, overflow: 'auto' }}
                >
                  {contests.map((contest) => (
                    <FormControlLabel
                      key={contest.key}
                      value={contest.key}
                      control={<Radio />}
                      label={
                        contest.judgeStaffIds.length > 0
                          ? `${contest.label} (${contest.judgeStaffIds.length} judges)`
                          : contest.label
                      }
                    />
                  ))}
                </RadioGroup>
              )}
              {selectedContest && assignedJudgeCount === 0 && (
                <Typography variant="body2" color="text.secondary">
                  This contest has no judges assigned.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button onClick={handleClose} disabled={opening}>
          Close
        </Button>
        <Button
          variant="contained"
          disabled={assignedJudgeCount === 0 || opening}
          onClick={handleOpenTabs}
        >
          {opening ? 'Opening Judge Tabs…' : 'Open Judge Tabs'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
