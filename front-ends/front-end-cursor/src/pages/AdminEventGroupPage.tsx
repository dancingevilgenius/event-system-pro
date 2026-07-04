import {
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchEventGroupByCode,
  fetchEventsForEventGroup,
  type EventListRow,
} from '../api/postgrest';
import { centeredContentStackSx } from '../constants/layout';
import { ADD_EVENT_PATH, EVENT_GROUPS_PATH, eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';

export default function AdminEventGroupPage() {
  const navigate = useNavigate();
  const { eventGroupCode = '' } = useParams<{ eventGroupCode: string }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);

  const [fullName, setFullName] = useState('');
  const [events, setEvents] = useState<EventListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEventGroup = useCallback(async () => {
    if (!decodedGroupCode) {
      setError('Event group not specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [group, groupEvents] = await Promise.all([
        fetchEventGroupByCode(decodedGroupCode),
        fetchEventsForEventGroup(decodedGroupCode),
      ]);

      if (!group) {
        setFullName('');
        setEvents([]);
        setError('Event group not found.');
        return;
      }

      setFullName(group.fullName);
      setEvents(groupEvents);
    } catch (loadError) {
      setFullName('');
      setEvents([]);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load event group.');
    } finally {
      setLoading(false);
    }
  }, [decodedGroupCode]);

  useEffect(() => {
    void loadEventGroup();
  }, [loadEventGroup]);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {fullName || decodedGroupCode || 'Events'}
        </Typography>

        {loading && (
          <Stack sx={{ py: 6, alignItems: 'center' }}>
            <CircularProgress size={32} />
          </Stack>
        )}

        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ py: 4 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {events.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No events found for this group.
              </Typography>
            ) : (
              events.map((event) => (
                <Button
                  key={event.eventId}
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(eventDetailPath(decodedGroupCode, event.eventId))}
                >
                  {formatEventMonthYear(event.startDate)}
                </Button>
              ))
            )}
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() =>
                navigate(ADD_EVENT_PATH, { state: { eventGroupCode: decodedGroupCode } })
              }
            >
              Add Event
            </Button>
          </Stack>
        )}

        <Stack spacing={2} sx={centeredContentStackSx}>
          <Button variant="outlined" fullWidth onClick={() => navigate(EVENT_GROUPS_PATH)}>
            Back to Event Groups
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
