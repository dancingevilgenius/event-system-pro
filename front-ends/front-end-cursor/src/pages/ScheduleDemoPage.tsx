import { Box, Container, Paper, Typography } from '@mui/material';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { MUI_SCHEDULER_EXAMPLE_SCHEDULE } from '../data/muiSchedulerExampleSchedule';
import { useLayoutTier } from '../hooks/useLayoutTier';
import { parseDemoSchedule } from '../utils/parseDemoSchedule';

const DEFAULT_VISIBLE_DATE = new Date(2025, 6, 1);

export default function ScheduleDemoPage() {
  const { containerMaxWidth } = useLayoutTier();
  const initialEvents = useMemo(
    () => parseDemoSchedule(MUI_SCHEDULER_EXAMPLE_SCHEDULE) as SchedulerEvent[],
    [],
  );
  const [events, setEvents] = useState<SchedulerEvent[]>(initialEvents);

  return (
    <Container maxWidth={containerMaxWidth} sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 3, lg: 4 } }}>
        <PageHeader title="Schedule Demo" backTo="/demo" backLabel="Back to Demo" />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
          Example events parsed from the MUI X Scheduler sample calendar (July 2025).
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
            onEventsChange={setEvents}
            defaultView="week"
            defaultVisibleDate={DEFAULT_VISIBLE_DATE}
            views={['day', 'week', 'month', 'agenda']}
            readOnly={false}
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
