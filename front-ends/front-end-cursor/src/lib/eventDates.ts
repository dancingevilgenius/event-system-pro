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
