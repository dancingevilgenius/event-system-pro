import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';
import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
  TSL_EXAMPLE_SCHEDULE,
  TSL_SCHEDULE_RESOURCES,
} from '../data/tslExampleSchedule';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { parseDemoSchedule } from '../utils/parseDemoSchedule';
import { toEventCalendarEvents } from '../utils/toEventCalendarEvents';

/** First competition day at YMCA (Registration + Standard Day One). */
const DEFAULT_VISIBLE_DATE = new Date(2026, 6, 30);

export default function EventCalendarDemoPage() {
  const { containerMaxWidth } = useLayoutTier();
  const resources = useMemo(
    () => TSL_SCHEDULE_RESOURCES as SchedulerResource[],
    [],
  );
  const initialEvents = useMemo(
    () => toEventCalendarEvents(parseDemoSchedule(TSL_EXAMPLE_SCHEDULE)),
    [],
  );
  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Event Calendar" backTo="/demo" backLabel="Back to Demo" />
        <Stack spacing={0.5} sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            TSL X schedule rendered with MUI X Event Calendar event properties
            (color, timezone, resource, read-only).
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Source:{' '}
            <a href="https://www.thesaberlegion.org/schedule.html" target="_blank" rel="noreferrer">
              thesaberlegion.org/schedule.html
            </a>
            {' · '}
            <a
              href="https://mui.com/x/react-scheduler/event-calendar/events/"
              target="_blank"
              rel="noreferrer"
            >
              Event Calendar – Events
            </a>
          </Typography>
        </Stack>

        <Box
          sx={{
            width: '100%',
            height: { xs: 520, md: 640 },
            minHeight: 480,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <EventCalendar
            events={events}
            resources={resources}
            onEventsChange={setEvents}
            defaultView="day"
            defaultVisibleDate={DEFAULT_VISIBLE_DATE}
            views={['day', 'week', 'month', 'agenda']}
            preferences={{ ampm: true, showWeekends: true, isSidePanelOpen: true }}
            displayTimezone="America/Chicago"
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
