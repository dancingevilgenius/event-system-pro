import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionStatus, touchLastActivity } from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import {
  INACTIVITY_LOGOUT_MESSAGE,
  setFlashWarning,
} from '../lib/authMessages';
import { isInactivityLogoutDisabled } from '../lib/session';

const SYNC_DEBOUNCE_MS = 30 * 1000;
const SERVER_SYNC_INTERVAL_MS = 15 * 1000;

function isInactiveLogout(status: { ok?: boolean; active?: boolean }): boolean {
  return status.ok !== false && status.active === false;
}

/**
 * Keeps server last-activity fresh for the inactivity_logout cron, and clears
 * the local session once that cron stamps inactive_logout_at.
 * Does not run its own inactivity timer.
 */
export default function ActivityMonitor() {
  const { session, logout } = useAuth();
  const { showWarning } = useMessages();
  const navigate = useNavigate();
  const location = useLocation();
  const lastSyncRef = useRef(0);
  const syncingRef = useRef(false);
  const loggingOutRef = useRef(false);
  const prevPathnameRef = useRef<string | null>(null);
  const sessionUserIdRef = useRef<number | null>(null);
  const inactivityDisabled = isInactivityLogoutDisabled();

  const forceInactiveLogout = useCallback(() => {
    if (inactivityDisabled || !session || loggingOutRef.current) {
      return;
    }

    loggingOutRef.current = true;
    setFlashWarning(INACTIVITY_LOGOUT_MESSAGE);
    showWarning(INACTIVITY_LOGOUT_MESSAGE);
    logout();
    navigate('/', { replace: true });
  }, [inactivityDisabled, logout, navigate, session, showWarning]);

  const syncActivityToServer = useCallback(
    async (force = false) => {
      if (inactivityDisabled || !session || syncingRef.current) {
        return;
      }

      const now = Date.now();
      if (!force && now - lastSyncRef.current < SYNC_DEBOUNCE_MS) {
        return;
      }

      syncingRef.current = true;
      try {
        const result = await touchLastActivity();
        lastSyncRef.current = Date.now();

        if (isInactiveLogout(result)) {
          forceInactiveLogout();
        }
      } catch {
        // Keep the local session when activity sync fails transiently.
      } finally {
        syncingRef.current = false;
      }
    },
    [forceInactiveLogout, inactivityDisabled, session],
  );

  const refreshSessionStatus = useCallback(async () => {
    if (inactivityDisabled || !session) {
      return;
    }

    try {
      const status = await sessionStatus();
      if (isInactiveLogout(status)) {
        forceInactiveLogout();
      }
    } catch {
      // Fall back to the next poll when the server is unreachable.
    }
  }, [forceInactiveLogout, inactivityDisabled, session]);

  const recordActivity = useCallback(() => {
    if (inactivityDisabled) {
      return;
    }

    void syncActivityToServer();
  }, [inactivityDisabled, syncActivityToServer]);

  useEffect(() => {
    loggingOutRef.current = false;
  }, [session?.user_id]);

  useEffect(() => {
    if (!session) {
      sessionUserIdRef.current = null;
      prevPathnameRef.current = null;
      return;
    }

    if (inactivityDisabled) {
      return;
    }

    if (sessionUserIdRef.current === session.user_id) {
      return;
    }

    sessionUserIdRef.current = session.user_id;
    prevPathnameRef.current = location.pathname;
    void refreshSessionStatus();
  }, [inactivityDisabled, location.pathname, refreshSessionStatus, session]);

  useEffect(() => {
    if (inactivityDisabled || !session) {
      return;
    }

    if (prevPathnameRef.current === null) {
      prevPathnameRef.current = location.pathname;
      return;
    }

    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      recordActivity();
    }
  }, [inactivityDisabled, location.pathname, recordActivity, session]);

  useEffect(() => {
    if (inactivityDisabled || !session) {
      return;
    }

    const onClick = () => {
      recordActivity();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
      ) {
        recordActivity();
      }
    };

    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [inactivityDisabled, recordActivity, session]);

  useEffect(() => {
    if (inactivityDisabled || !session) {
      return;
    }

    void refreshSessionStatus();

    const serverSyncId = window.setInterval(() => {
      void refreshSessionStatus();
    }, SERVER_SYNC_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshSessionStatus();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(serverSyncId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [inactivityDisabled, refreshSessionStatus, session]);

  return null;
}
