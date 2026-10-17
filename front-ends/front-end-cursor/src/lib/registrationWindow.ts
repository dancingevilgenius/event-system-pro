const CHICAGO = 'America/Chicago';
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Same window as `api.event_in_registration_window`:
 * a future start counts only within the next 24 hours;
 * an event with an end date is current from start through end;
 * a null end date stays current through the end of the start day in America/Chicago.
 */
export function eventInRegistrationWindow(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!startIso) {
    return false;
  }

  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) {
    return false;
  }

  const nowMs = now.getTime();
  if (start.getTime() > nowMs) {
    return start.getTime() <= nowMs + DAY_MS;
  }

  if (endIso) {
    const end = new Date(endIso);
    return !Number.isNaN(end.getTime()) && nowMs <= end.getTime();
  }

  return nowMs < endOfChicagoStartDay(start);
}

function endOfChicagoStartDay(start: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(start);
  const year = Number(partValue(parts, 'year'));
  const month = Number(partValue(parts, 'month'));
  const day = Number(partValue(parts, 'day'));
  const next = new Date(Date.UTC(year, month - 1, day));
  next.setUTCDate(next.getUTCDate() + 1);
  return zonedWallTimeToUtc(
    next.getUTCFullYear(),
    next.getUTCMonth() + 1,
    next.getUTCDate(),
  );
}

function zonedWallTimeToUtc(year: number, month: number, day: number): number {
  const utcGuess = Date.UTC(year, month - 1, day, 0, 0, 0);
  const offset = timeZoneOffsetMs(utcGuess);
  const utc = utcGuess - offset;
  const offsetAtResult = timeZoneOffsetMs(utc);
  return offsetAtResult === offset ? utc : utcGuess - offsetAtResult;
}

function timeZoneOffsetMs(utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(utcMs));
  let hour = Number(partValue(parts, 'hour'));
  let day = Number(partValue(parts, 'day'));
  let month = Number(partValue(parts, 'month'));
  let year = Number(partValue(parts, 'year'));
  if (hour === 24) {
    hour = 0;
    const next = new Date(Date.UTC(year, month - 1, day));
    next.setUTCDate(next.getUTCDate() + 1);
    year = next.getUTCFullYear();
    month = next.getUTCMonth() + 1;
    day = next.getUTCDate();
  }
  const asUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    Number(partValue(parts, 'minute')),
    Number(partValue(parts, 'second')),
  );
  return asUtc - utcMs;
}

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? '';
}
