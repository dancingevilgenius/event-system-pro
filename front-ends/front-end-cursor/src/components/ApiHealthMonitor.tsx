import { useEffect, useRef } from 'react';
import {
  API_UNREACHABLE_MESSAGE,
  API_UNREACHABLE_MESSAGE_ID,
  checkApiReachable,
} from '../api/postgrest';
import { useMessages } from '../hooks/useMessages';

const POLL_WHILE_DOWN_MS = 15_000;

/**
 * Probes PostgREST on mount, window focus, and while unreachable.
 * Shows a sticky problem message when the API is down (e.g. Docker not running).
 */
export default function ApiHealthMonitor() {
  const { messages, showProblem, dismissMessage } = useMessages();
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  useEffect(() => {
    let cancelled = false;
    let pollTimer: number | undefined;

    const clearPoll = () => {
      if (pollTimer !== undefined) {
        window.clearTimeout(pollTimer);
        pollTimer = undefined;
      }
    };

    const schedulePoll = () => {
      clearPoll();
      pollTimer = window.setTimeout(() => {
        void runCheck();
      }, POLL_WHILE_DOWN_MS);
    };

    const runCheck = async () => {
      const reachable = await checkApiReachable();
      if (cancelled) {
        return;
      }

      if (reachable) {
        dismissMessage(API_UNREACHABLE_MESSAGE_ID);
        clearPoll();
        return;
      }

      const alreadyShowing = messagesRef.current.some(
        (message) => message.id === API_UNREACHABLE_MESSAGE_ID,
      );
      if (!alreadyShowing) {
        showProblem(API_UNREACHABLE_MESSAGE, {
          sticky: true,
          id: API_UNREACHABLE_MESSAGE_ID,
        });
      }
      schedulePoll();
    };

    const onFocus = () => {
      void runCheck();
    };

    void runCheck();
    window.addEventListener('focus', onFocus);

    return () => {
      cancelled = true;
      clearPoll();
      window.removeEventListener('focus', onFocus);
    };
  }, [dismissMessage, showProblem]);

  return null;
}
