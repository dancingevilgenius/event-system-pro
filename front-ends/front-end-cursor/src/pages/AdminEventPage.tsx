import { Button, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEventById, fetchEventGroupByCode } from '../api/postgrest';
import AddEventButton from '../components/AddEventButton';
import { centeredContentStackSx } from '../constants/layout';
import { eventDetailPath, eventGroupDetailPath } from '../constants/eventRoutes';
import { formatEventMonthYear } from '../lib/eventDisplay';

const EVENT_SECTION_BUTTONS = [
  { label: 'Attendees', segment: 'attendees' },
  { label: 'Competitors', segment: 'competitors' },
  { label: 'Contests', segment: 'contests' },
] as const;

export default function AdminEventPage() {
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
  const groupBasePath = eventGroupDetailPath(decodedGroupCode);

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
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {groupFullName || decodedGroupCode}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {eventLabel || 'Event'}
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
            {EVENT_SECTION_BUTTONS.map((button) => (
              <Button
                key={button.segment}
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate(`${eventBasePath}/${button.segment}`)}
              >
                {button.label}
              </Button>
            ))}
          </Stack>
        )}

        <Stack spacing={2} sx={centeredContentStackSx}>
          {decodedGroupCode && Number.isFinite(parsedEventId) && (
            <AddEventButton
              eventGroupCode={decodedGroupCode}
              eventId={parsedEventId}
              label="Edit Event"
            />
          )}
          <Button variant="outlined" fullWidth onClick={() => navigate(groupBasePath)}>
            Back to {groupFullName || 'Group'}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
