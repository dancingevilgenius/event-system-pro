export const EVENT_HOME_PATH = '/event-home';
export const EVENT_GROUPS_PATH = '/event-groups';
export const EVENTS_PATH = '/events';
export const ADD_EVENT_PATH = '/add-event';

export function eventGroupDetailPath(eventGroupCode: string): string {
  return `${EVENT_GROUPS_PATH}/${encodeURIComponent(eventGroupCode)}`;
}

export function eventDetailPath(eventGroupCode: string, eventId: number): string {
  return `${eventGroupDetailPath(eventGroupCode)}/${eventId}`;
}
