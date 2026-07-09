import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { type MouseEvent, useEffect, useMemo } from 'react';
import { mobileColumnSx } from '../constants/layout';
import {
  type EventDateMode,
  type EventDatesFormState,
  getEventDayCount,
  isEventDatesValid,
} from '../lib/eventDates';
import { parseDateTimeLocalValue } from '../lib/eventDuration';
import AppTextField from './AppTextField';

const dateModeToggleSx = {
  ...mobileColumnSx,
  '& .MuiToggleButton-root': {
    flex: 1,
    py: 1,
    px: { xs: 0.5, sm: 1.5 },
    fontSize: { xs: '0.75rem', sm: '0.875rem' },
    lineHeight: 1.2,
    whiteSpace: 'normal',
  },
} as const;

export type AddEventDatesProps = {
  dates: EventDatesFormState;
  onDatesChange: (dates: EventDatesFormState) => void;
  onFieldEdit?: () => void;
  onValidityChange?: (isEventDateValid: boolean) => void;
};

export default function AddEventDates({
  dates,
  onDatesChange,
  onFieldEdit,
  onValidityChange,
}: AddEventDatesProps) {
  const isEventDateValid = useMemo(() => isEventDatesValid(dates), [dates]);

  useEffect(() => {
    onValidityChange?.(isEventDateValid);
  }, [isEventDateValid, onValidityChange]);

  const startDate = useMemo(
    () => parseDateTimeLocalValue(dates.startDateTime),
    [dates.startDateTime],
  );
  const endDate = useMemo(
    () => parseDateTimeLocalValue(dates.endDateTime),
    [dates.endDateTime],
  );

  const numberOfDays = useMemo(() => getEventDayCount(dates), [dates]);

  const rangeError =
    dates.mode === 'multi_day' && startDate && endDate && !isEventDateValid
      ? 'End date and time must be on or after the start date and time.'
      : null;

  const updateDates = (patch: Partial<EventDatesFormState>) => {
    onDatesChange({ ...dates, ...patch });
    onFieldEdit?.();
  };

  const handleDateModeChange = (
    _event: MouseEvent<HTMLElement>,
    nextMode: EventDateMode | null,
  ) => {
    if (nextMode === null) {
      return;
    }

    if (nextMode === 'single_day') {
      updateDates({ mode: nextMode, endDateTime: '' });
      return;
    }

    updateDates({ mode: nextMode });
  };

  return (
    <Stack spacing={2} data-event-dates-valid={isEventDateValid}>
      <ToggleButtonGroup
        value={dates.mode}
        exclusive
        fullWidth
        onChange={handleDateModeChange}
        aria-label="Event date mode"
        sx={dateModeToggleSx}
      >
        <ToggleButton value="single_day" aria-label="Single day">
          Single Day
        </ToggleButton>
        <ToggleButton value="multi_day" aria-label="Multi-day">
          Multi-Day
        </ToggleButton>
      </ToggleButtonGroup>

      <AppTextField
        label="Start Date"
        type="datetime-local"
        value={dates.startDateTime}
        onChange={(event) => updateDates({ startDateTime: event.target.value })}
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
      />

      {dates.mode === 'multi_day' && (
        <AppTextField
          label="End Date"
          type="datetime-local"
          value={dates.endDateTime}
          onChange={(event) => updateDates({ endDateTime: event.target.value })}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          error={Boolean(rangeError)}
          helperText={rangeError ?? undefined}
        />
      )}

      <AppTextField
        label="Number of Days"
        value={numberOfDays === null ? '' : String(numberOfDays)}
        fullWidth
        slotProps={{
          input: { readOnly: true },
          inputLabel: { shrink: true },
        }}
      />

      {numberOfDays !== null && dates.mode === 'multi_day' && (
        <Typography variant="caption" color="text.secondary">
          Each calendar day touched by the event counts as one day, including partial days.
        </Typography>
      )}
    </Stack>
  );
}
