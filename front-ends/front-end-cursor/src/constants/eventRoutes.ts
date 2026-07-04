export const EVENT_HOME_PATH = '/event-home';
export const EVENT_GROUPS_PATH = '/event-groups';
export const EVENTS_PATH = '/events';
export const CREATE_EVENT_PATH = '/create-event';

/** @deprecated Use CREATE_EVENT_PATH */
export const ADD_EVENT_PATH = CREATE_EVENT_PATH;

export function eventGroupDetailPath(eventGroupCode: string): string {
  return `${EVENT_GROUPS_PATH}/${encodeURIComponent(eventGroupCode)}`;
}

export function eventDetailPath(eventGroupCode: string, eventId: number): string {
  return `${eventGroupDetailPath(eventGroupCode)}/${eventId}`;
}
