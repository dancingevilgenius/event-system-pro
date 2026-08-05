import type { SchedulerEvent, SchedulerEventColor } from '@mui/x-scheduler/models';
import type { ParsedScheduleEvent } from './parseDemoSchedule';

/** Minneapolis / Central Time — matches TSL X venue. */
export const TSL_EVENT_TIMEZONE = 'America/Chicago';

const READ_ONLY_TITLE_MATCHERS = [
  /opening ceremon/i,
  /end of day/i,
  /everyone out/i,
  /doors open/i,
  /lunch break/i,
  /rotate break/i,
];

function colorForTitle(title: string): SchedulerEventColor {
  const value = title.toLowerCase();

  if (value.includes('exotic')) {
    return 'orange';
  }
  if (value.includes('women')) {
    return 'pink';
  }
  if (value.includes('masters')) {
    return 'indigo';
  }
  if (value.includes('unity')) {
    return 'purple';
  }
  if (value.includes('tag team')) {
    return 'lime';
  }
  if (value.includes('standard')) {
    return 'teal';
  }
  if (value.includes('prom') || value.includes('premiere') || value.includes('dinner')) {
    return 'amber';
  }
  if (value.includes('patch') || value.includes('saber games')) {
    return 'green';
  }
  if (value.includes('gear') || value.includes('setup') || value.includes('judge')) {
    return 'blue';
  }

  return 'grey';
}

function isReadOnlyTitle(title: string): boolean {
  return READ_ONLY_TITLE_MATCHERS.some((matcher) => matcher.test(title));
}

/**
 * Map parsed TSL schedule rows onto Event Calendar event properties
 * (color, timezone, resource, readOnly) from the MUI X events docs.
 */
export function toEventCalendarEvents(parsed: ParsedScheduleEvent[]): SchedulerEvent[] {
  return parsed.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    ...(event.allDay ? { allDay: true } : {}),
    ...(event.resource ? { resource: event.resource } : {}),
    ...(event.description ? { description: event.description } : {}),
    timezone: TSL_EVENT_TIMEZONE,
    color: colorForTitle(event.title),
    ...(isReadOnlyTitle(event.title) ? { readOnly: true } : {}),
  }));
}
