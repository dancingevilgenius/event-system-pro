function startOfLocalCalendarDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Inclusive calendar-day count; any time on a day counts that whole day. */
export function countInclusiveEventDays(start: Date, end: Date): number | null {
  if (end.getTime() < start.getTime()) {
    return null;
  }

  const startDay = startOfLocalCalendarDay(start);
  const endDay = startOfLocalCalendarDay(end);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const dayOffset = Math.round((endDay.getTime() - startDay.getTime()) / millisecondsPerDay);

  return dayOffset + 1;
}

export function parseDateTimeLocalValue(value: string): Date | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
