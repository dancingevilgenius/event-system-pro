import { Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEventById, fetchEventGroupByCode } from '../api/postgrest';
import SwingDanceContestSet from '../components/SwingDanceContestSet';
import AddEventButton from '../components/AddEventButton';
import { centeredContentStackSx } from '../constants/layout';
import { eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';

export default function AdminEventContestsPage() {
  const navigate = useNavigate();
  const { eventGroupCode = '', eventId = '' } = useParams<{
    eventGroupCode: string;
    eventId: string;
  }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);
  const parsedEventId = Number.parseInt(eventId, 10);

  const [groupFullName, setGroupFullName] = useState('');
  const [eventLabel, setEventLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventBasePath = eventDetailPath(decodedGroupCode, parsedEventId);

  const loadEvent = useCallback(async () => {
    if (!decodedGroupCode || !Number.isFinite(parsedEventId)) {
      setError('Event not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [group, event] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventById(parsedEventId),
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
      setEventLabel(formatEventMonthYear(event.startDate));
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
          Contests
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {groupFullName || decodedGroupCode}
          {eventLabel ? ` — ${eventLabel}` : ''}
        </Typography>

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

        {!loading && !error && <SwingDanceContestSet />}

        <Stack spacing={2} sx={{ mt: 4, ...centeredContentStackSx }}>
          {decodedGroupCode && <AddEventButton eventGroupCode={decodedGroupCode} />}
          <Button variant="outlined" fullWidth onClick={() => navigate(eventBasePath)}>
            Back to Event
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
