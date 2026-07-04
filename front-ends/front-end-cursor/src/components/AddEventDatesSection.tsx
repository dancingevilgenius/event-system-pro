import { Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  countInclusiveEventDays,
  parseDateTimeLocalValue,
} from '../lib/eventDuration';
import AppTextField from './AppTextField';

type AddEventDatesSectionProps = {
  onFieldEdit?: () => void;
};

export default function AddEventDatesSection({ onFieldEdit }: AddEventDatesSectionProps) {
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  const startDate = useMemo(
    () => parseDateTimeLocalValue(startDateTime),
    [startDateTime],
  );
  const endDate = useMemo(() => parseDateTimeLocalValue(endDateTime), [endDateTime]);

  const numberOfDays = useMemo(() => {
    if (!startDate || !endDate) {
      return null;
    }

    return countInclusiveEventDays(startDate, endDate);
  }, [endDate, startDate]);

  const rangeError =
    startDate && endDate && numberOfDays === null
      ? 'End date and time must be on or after the start date and time.'
      : null;

  return (
    <Stack spacing={2}>
      <AppTextField
        label="Start Date"
        type="datetime-local"
        value={startDateTime}
        onChange={(event) => {
          setStartDateTime(event.target.value);
          onFieldEdit?.();
        }}
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <AppTextField
        label="End Date"
        type="datetime-local"
        value={endDateTime}
        onChange={(event) => {
          setEndDateTime(event.target.value);
          onFieldEdit?.();
        }}
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        error={Boolean(rangeError)}
        helperText={rangeError ?? undefined}
      />
      <AppTextField
        label="Number of Days"
        value={numberOfDays === null ? '' : String(numberOfDays)}
        fullWidth
        slotProps={{
          input: { readOnly: true },
          inputLabel: { shrink: true },
        }}
      />
      {numberOfDays !== null && (
        <Typography variant="caption" color="text.secondary">
          Each calendar day touched by the event counts as one day, including partial days.
        </Typography>
      )}
    </Stack>
  );
}
