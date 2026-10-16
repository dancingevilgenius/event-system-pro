import { useEffect, useRef } from 'react';
import { getRealtimeWsUrl } from '../api/realtime';

type ContestRosterChangeMessage = {
  type?: string;
  contestId?: number;
  eventId?: number | null;
  op?: string;
};

/**
 * Subscribes to realtime contest-roster pushes for one contest.
 * onChange is called (debounced) when a contest_entry row for that contest changes.
 *
 * Call this from prelims, finals, and the floor-parent page once those screens
 * load contest_entry rows for a contestId. Do not attach it to mock rosters.
 *
 * onChange should silently refetch the roster and replace that list only.
 * Leave in-progress judge marks and scores in place, keyed by bib
 * (markByBib, scoreByBib). Do not show a loading spinner for this refresh.
 */
export function useContestRosterRealtime(
  contestId: number | null | undefined,
  onChange: () => void,
  debounceMs = 300,
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!Number.isFinite(contestId) || (contestId ?? 0) <= 0) {
      return;
    }

    const targetContestId = contestId as number;
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
          const message = JSON.parse(String(event.data)) as ContestRosterChangeMessage;
          if (
            message.type === 'contest_roster_change' &&
            Number(message.contestId) === targetContestId
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
  }, [contestId, debounceMs]);
}
