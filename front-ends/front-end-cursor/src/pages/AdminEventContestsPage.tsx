import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchContestsForEvent,
  fetchEventById,
  fetchEventGroupByCode,
  type ContestListRow,
} from '../api/postgrest';
import AddEventButton from '../components/AddEventButton';
import PageHeader from '../components/PageHeader';
import SwingDanceContestSet from '../components/SwingDanceContestSet';
import TslContestDivisionsPanel from '../components/TslContestDivisionsPanel';
import { centeredContentStackSx } from '../constants/layout';
import { eventContestPath, eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';
import { isTslContestEvent } from '../lib/tslContests';
import { useLayoutTier } from '../hooks/useLayoutTier';

function usesSwingContestBuilder(eventTypeCode: string | null): boolean {
  if (!eventTypeCode) {
    return false;
  }
  const normalized = eventTypeCode.toUpperCase();
  return normalized.includes('SWING') || normalized.includes('COUPLES');
}

export default function AdminEventContestsPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '', eventId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const parsedEventId = Number.parseInt(eventId, 10);

  const [groupFullName, setGroupFullName] = useState('');
  const [eventTypeCode, setEventTypeCode] = useState<string | null>(null);
  const [eventLabel, setEventLabel] = useState('');
  const [eventCode, setEventCode] = useState('');
  const [contests, setContests] = useState<ContestListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);
  const tslEvent = isTslContestEvent(decodedGroupCode, eventTypeCode);

  const loadEvent = useCallback(async () => {
    if (!decodedGroupCode || !Number.isFinite(parsedEventId)) {
      setError('Event not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [group, event, contestRows] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
        fetchContestsForEvent(parsedEventId),
      ]);

      if (!group) {
        setError('Event group not found.');
        return;
      }

      if (!event || event.eventGroupCode !== decodedGroupCode) {
        setError('Event not found for this group.');
        return;
      }

      setGroupFullName(group.fullName);
      setEventTypeCode(group.eventTypeCode ?? null);
      setEventLabel(formatEventMonthYear(event.startDate));
      setEventCode(event.eventCode);
      setContests(contestRows);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load event.');
    } finally {
      setLoading(false);
    }
  }, [decodedGroupCode, parsedEventId]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Contests" backTo={eventBasePath} backLabel="Back to Event" />
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          {groupFullName || decodedGroupCode}
          {eventLabel ? ` — ${eventLabel}` : ''}
        </Typography>
        {eventCode ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            {eventCode}
          </Typography>
        ) : null}

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ py: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {!loading && !error && tslEvent && (
          <TslContestDivisionsPanel
            eventGroupCode={decodedGroupCode}
            eventId={parsedEventId}
            eventCode={eventCode}
            eventTypeCode={eventTypeCode}
            contests={contests}
            onContestsChanged={loadEvent}
          />
        )}

        {!loading && !error && !tslEvent && contests.length > 0 && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {contests.map((contest) => (
              <Button
                key={contest.contestId}
                variant="contained"
                size="large"
                fullWidth
                onClick={() =>
                  navigate(eventContestPath(decodedGroupCode, parsedEventId, contest.contestId))
                }
              >
                {contest.name}
                {contest.participantCount > 0 ? ` (${contest.participantCount})` : ''}
              </Button>
            ))}
          </Stack>
        )}

        {!loading && !error && !tslEvent && contests.length > 0 && !showXsLayout && (
          <Grid container spacing={2} sx={{ my: 2, justifyContent: 'center' }}>
            {contests.map((contest) => (
              <Grid key={contest.contestId} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() =>
                    navigate(eventContestPath(decodedGroupCode, parsedEventId, contest.contestId))
                  }
                >
                  {contest.name}
                  {contest.participantCount > 0 ? ` (${contest.participantCount})` : ''}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading &&
          !error &&
          !tslEvent &&
          contests.length === 0 &&
          usesSwingContestBuilder(eventTypeCode) && (
            <Stack sx={showXsLayout ? undefined : { width: '100%' }}>
              <SwingDanceContestSet />
            </Stack>
          )}

        {!loading &&
          !error &&
          !tslEvent &&
          contests.length === 0 &&
          !usesSwingContestBuilder(eventTypeCode) && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No contests found for this event.
            </Typography>
          )}

        <Stack
          spacing={2}
          sx={{
            mt: 4,
            ...(showXsLayout
              ? centeredContentStackSx
              : { maxWidth: 480, mx: 'auto', width: '100%' }),
          }}
        >
          {decodedGroupCode && <AddEventButton eventGroupCode={decodedGroupCode} />}
        </Stack>
      </Paper>
    </Container>
  );
}
