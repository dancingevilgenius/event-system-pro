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
import PageHeader from '../components/PageHeader';
import { centeredContentStackSx } from '../constants/layout';
import { CREATE_EVENT_PATH, EVENT_GROUPS_PATH } from '../constants/eventRoutes';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { formatEventMonthYear } from '../lib/eventDisplay';
import { rememberEventGroupCode } from '../lib/eventGroupSession';

function eventListLabel(event: EventListRow): string {
  const name = event.name?.trim() || event.eventCode || 'Untitled event';
  if (!event.startDate) {
    return name;
  }

  return `${name} (${formatEventMonthYear(event.startDate)})`;
}

export default function AdminEventGroupPage() {
  const navigate = useNavigate();
  const { showXsLayout, containerMaxWidth } = useLayoutTier();
  const { eventGroupCode = '' } = useParams<{ eventGroupCode: string }>();
  const decodedGroupCode = decodeURIComponent(eventGroupCode);

  const openSavedEvent = (eventId: number) => {
    rememberEventGroupCode(decodedGroupCode);
    navigate(CREATE_EVENT_PATH, {
      state: {
        eventGroupCode: decodedGroupCode,
        eventId,
      },
    });
  };

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
        <PageHeader
          title={fullName || decodedGroupCode || 'Events'}
          backTo={EVENT_GROUPS_PATH}
          backLabel="Back to Event Groups"
        />

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
                onClick={() => openSavedEvent(event.eventId)}
                sx={{ whiteSpace: 'normal', textAlign: 'center' }}
              >
                {eventListLabel(event)}
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
                  onClick={() => openSavedEvent(event.eventId)}
                  sx={{ whiteSpace: 'normal', textAlign: 'center', height: '100%' }}
                >
                  {eventListLabel(event)}
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
      </Paper>
    </Container>
  );
}
