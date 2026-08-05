import { Box, Container, Paper, Typography } from '@mui/material';
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

/** First day of TSL X (Arrival / Charter Rep Reception). */
const DEFAULT_VISIBLE_DATE = new Date(2026, 6, 29);

export default function ScheduleDemoPage() {
  const { containerMaxWidth } = useLayoutTier();
  const resources = useMemo(
    () => TSL_SCHEDULE_RESOURCES as SchedulerResource[],
    [],
  );
  const initialEvents = useMemo(
    () => parseDemoSchedule(TSL_EXAMPLE_SCHEDULE) as SchedulerEvent[],
    [],
  );
  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Schedule Demo" backTo="/demo" backLabel="Back to Demo" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
          TSL X – 10th Annual Tournament · Minneapolis, Minnesota
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', textAlign: 'center' }}>
          Parsed from{' '}
          <a href="https://www.thesaberlegion.org/schedule.html" target="_blank" rel="noreferrer">
            thesaberlegion.org/schedule.html
          </a>
        </Typography>

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
            defaultView="week"
            defaultVisibleDate={DEFAULT_VISIBLE_DATE}
            views={['day', 'week', 'month', 'agenda']}
            preferences={{ ampm: true, showWeekends: true }}
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
