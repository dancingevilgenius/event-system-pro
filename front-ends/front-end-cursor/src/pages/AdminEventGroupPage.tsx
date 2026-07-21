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
  fetchEventGroupByCode,
  fetchEventsForEventGroup,
  type EventListRow,
} from '../api/postgrest';
import AddEventButton from '../components/AddEventButton';
import { centeredContentStackSx } from '../constants/layout';
import { EVENT_GROUPS_PATH, eventDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';
import { useLayoutTier } from '../hooks/useLayoutTier';

export default function AdminEventGroupPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
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
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 }, textAlign: 'center' }}>
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

        {!loading && !error && events.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
            No events found for this group.
          </Typography>
        )}

        {!loading && !error && events.length > 0 && showXsLayout && (
          <Stack spacing={2} sx={{ my: 3, ...centeredContentStackSx }}>
            {events.map((event) => (
              <Button
                key={event.eventId}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(eventDetailPath(decodedGroupCode, event.eventId))}
              >
                {formatEventMonthYear(event.startDate)}
              </Button>
            ))}
          </Stack>
        )}

        {!loading && !error && events.length > 0 && !showXsLayout && (
          <Grid container spacing={2} sx={{ my: 3 }}>
            {events.map((event) => (
              <Grid key={event.eventId} size={{ xs: 12, md: 6, lg: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate(eventDetailPath(decodedGroupCode, event.eventId))}
                >
                  {formatEventMonthYear(event.startDate)}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        {decodedGroupCode && (
          <Stack spacing={2} sx={{ mb: 3, ...(showXsLayout ? centeredContentStackSx : {}) }}>
            <AddEventButton eventGroupCode={decodedGroupCode} />
          </Stack>
        )}

        <Stack spacing={2} sx={showXsLayout ? centeredContentStackSx : undefined}>
          <Button variant="outlined" fullWidth onClick={() => navigate(EVENT_GROUPS_PATH)}>
            Back to Event Groups
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
