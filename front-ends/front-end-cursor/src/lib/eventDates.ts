import {
  countInclusiveEventDays,
  parseDateTimeLocalValue,
} from './eventDuration';

export type EventDateMode = 'single_day' | 'multi_day';

export type EventDatesFormState = {
  mode: EventDateMode;
  startDateTime: string;
  endDateTime: string;
};

export const EMPTY_EVENT_DATES: EventDatesFormState = {
  mode: 'single_day',
  startDateTime: '',
  endDateTime: '',
};

function padDateTimePart(value: number): string {
  return String(value).padStart(2, '0');
}

/** Convert an API timestamptz string into a `datetime-local` input value. */
export function toDateTimeLocalValue(value: string | null | undefined): string {
  if (!value || value.trim() === '') {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return [
    `${date.getFullYear()}-${padDateTimePart(date.getMonth() + 1)}-${padDateTimePart(date.getDate())}`,
    `${padDateTimePart(date.getHours())}:${padDateTimePart(date.getMinutes())}`,
  ].join('T');
}

/** Build form date state from stored event start/end timestamps when available. */
export function eventDatesFromApiTimestamps(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): EventDatesFormState {
  const startDateTime = toDateTimeLocalValue(startDate);
  const endDateTime = toDateTimeLocalValue(endDate);

  if (!startDateTime && !endDateTime) {
    return EMPTY_EVENT_DATES;
  }

  if (endDateTime) {
    return {
      mode: 'multi_day',
      startDateTime,
      endDateTime,
    };
  }

  return {
    mode: 'single_day',
    startDateTime,
    endDateTime: '',
  };
}

export type ScheduleTimeBlockDay = {
  id: string;
  title: string;
};

export function getEventDayCount(dates: EventDatesFormState): number | null {
  const start = parseDateTimeLocalValue(dates.startDateTime);

  if (!start) {
    return null;
  }

  if (dates.mode === 'single_day') {
    return 1;
  }

  const end = parseDateTimeLocalValue(dates.endDateTime);
  if (!end) {
    return null;
  }

  return countInclusiveEventDays(start, end);
}

/** True when dates are complete and end is on or after start (single-day: start only). */
export function isEventDatesValid(dates: EventDatesFormState): boolean {
  return getEventDayCount(dates) !== null;
}

/** One inner-accordion entry per event calendar day for the Schedule panel. */
export function getScheduleTimeBlockDays(dates: EventDatesFormState): ScheduleTimeBlockDay[] {
  const start = parseDateTimeLocalValue(dates.startDateTime);
  const dayCount = getEventDayCount(dates);

  if (start && dayCount !== null && dayCount > 0) {
    return Array.from({ length: dayCount }, (_, index) => ({
      id: `day-${index + 1}`,
      title: `Day ${index + 1}`,
    }));
  }

  return [];
}

export function hasEventDatesForSchedule(dates: EventDatesFormState): boolean {
  return getScheduleTimeBlockDays(dates).length > 0;
}
