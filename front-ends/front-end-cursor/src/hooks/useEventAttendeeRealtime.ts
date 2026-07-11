import { useEffect, useRef } from 'react';
import { getRealtimeWsUrl } from '../api/realtime';

type EventAttendeeChangeMessage = {
  type?: string;
  eventId?: number;
  op?: string;
};

/**
 * Subscribes to realtime attendee-change pushes for one event.
 * onChange is called (debounced) when the DB notifies that event's attendees changed.
 */
export function useEventAttendeeRealtime(
  eventId: number | null | undefined,
  onChange: () => void,
  debounceMs = 300,
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!Number.isFinite(eventId) || (eventId ?? 0) <= 0) {
      return;
    }

    const targetEventId = eventId as number;
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let debounceTimer: number | null = null;

    const scheduleChange = () => {
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        if (active) {
          onChangeRef.current();
        }
      }, debounceMs);
    };

    const connect = () => {
      socket = new WebSocket(getRealtimeWsUrl());

      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(String(event.data)) as EventAttendeeChangeMessage;
          if (
            message.type === 'event_attendee_change' &&
            Number(message.eventId) === targetEventId
          ) {
            scheduleChange();
          }
        } catch {
          // Ignore malformed messages.
        }
      });

      socket.addEventListener('close', () => {
        if (!active) {
          return;
        }

        reconnectTimer = window.setTimeout(connect, 3000);
      });
    };

    connect();

    return () => {
      active = false;

      if (reconnectTimer !== null) {
        window.clearTimeout(reconnectTimer);
      }

      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }

      socket?.close();
    };
  }, [debounceMs, eventId]);
}
