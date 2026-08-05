export type ParsedScheduleEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  resource?: string;
  description?: string;
};

const TIME_RANGE =
  /^(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

function toHour24(hour12: number, period: string): number {
  const normalized = period.toUpperCase();
  const hour = ((hour12 - 1) % 12) + 1;
  if (normalized === 'AM') {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function toWallTime(date: string, hour12: number, minute: number, period: string): string {
  return `${date}T${pad(toHour24(hour12, period))}:${pad(minute)}:00`;
}

/**
 * Parse demo schedule text into MUI X Scheduler events.
 *
 * Lines:
 *   YYYY-MM-DD | h:mm AM/PM - h:mm AM/PM | Title [| resourceId [| Description]]
 *   YYYY-MM-DD | all-day | Title [| resourceId [| Description]]
 */
export function parseDemoSchedule(raw: string): ParsedScheduleEvent[] {
  const events: ParsedScheduleEvent[] = [];
  let nextId = 1;

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const parts = trimmed.split('|').map((part) => part.trim());
    if (parts.length < 3) {
      continue;
    }

    const [date, timePart, title, resource, description] = parts;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !title) {
      continue;
    }

    const extras: Pick<ParsedScheduleEvent, 'resource' | 'description'> = {};
    if (resource) {
      extras.resource = resource;
    }
    if (description) {
      extras.description = description;
    }

    if (/^all-day$/i.test(timePart)) {
      events.push({
        id: String(nextId),
        title,
        start: `${date}T00:00:00`,
        end: `${date}T23:59:59`,
        allDay: true,
        ...extras,
      });
      nextId += 1;
      continue;
    }

    const match = TIME_RANGE.exec(timePart);
    if (!match) {
      continue;
    }

    const [, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] = match;
    events.push({
      id: String(nextId),
      title,
      start: toWallTime(date, Number(startHour), Number(startMinute), startPeriod),
      end: toWallTime(date, Number(endHour), Number(endMinute), endPeriod),
      ...extras,
    });
    nextId += 1;
  }

  return events;
}
