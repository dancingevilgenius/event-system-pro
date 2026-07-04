import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Stack,
  Typography,
} from '@mui/material';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { CONTENT_MAX_WIDTH } from '../constants/layout';
import { type ScheduleTimeBlockDay } from '../lib/eventDates';
import AddEventSectionStatusToggle, {
  type AddEventSectionStatus,
} from './AddEventSectionStatusToggle';

const innerAccordionSummarySx = {
  px: 1.5,
  minHeight: 44,
  '& .MuiAccordionSummary-content': {
    my: 0.75,
  },
} as const;

export type EventScheduleDaysProps = {
  scheduleTimeBlocks: ScheduleTimeBlockDay[];
  status: AddEventSectionStatus;
  onStatusChange: (status: AddEventSectionStatus) => void;
  disabledStatuses?: AddEventSectionStatus[];
};

export default function EventScheduleDays({
  scheduleTimeBlocks,
  status,
  onStatusChange,
  disabledStatuses,
}: EventScheduleDaysProps) {
  const [expandedDayId, setExpandedDayId] = useState<string | false>(false);

  useEffect(() => {
    const firstDayId = scheduleTimeBlocks[0]?.id ?? 'day-1';
    setExpandedDayId((current) => {
      if (current && scheduleTimeBlocks.some((day) => day.id === current)) {
        return current;
      }

      return firstDayId;
    });
  }, [scheduleTimeBlocks]);

  const handleDayAccordionChange =
    (dayId: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpandedDayId(isExpanded ? dayId : false);
    };

  return (
    <Stack spacing={2}>
      {scheduleTimeBlocks.length === 0 ? (
        <Alert severity="warning" sx={{ width: '100%', maxWidth: CONTENT_MAX_WIDTH }}>
          Enter a day or dates for the event in the Date(s) accordion panel.
        </Alert>
      ) : (
        <Stack
          spacing={1}
          sx={{ width: '100%' }}
          data-schedule-time-blocks
          aria-label="Schedule time blocks"
        >
          {scheduleTimeBlocks.map((day) => (
            <Accordion
              key={day.id}
              expanded={expandedDayId === day.id}
              onChange={handleDayAccordionChange(day.id)}
              disableGutters
              elevation={0}
              variant="outlined"
              sx={{ width: '100%', overflow: 'hidden' }}
            >
              <AccordionSummary
                aria-controls={`${day.id}-schedule-content`}
                id={`${day.id}-schedule-header`}
                sx={innerAccordionSummarySx}
              >
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {day.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
                <Typography variant="body2" color="text.secondary">
                  Time blocks for this day will be configured here.
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      <AddEventSectionStatusToggle
        value={status}
        onChange={onStatusChange}
        disabledStatuses={disabledStatuses}
        aria-label="Schedule status"
      />
    </Stack>
  );
}
