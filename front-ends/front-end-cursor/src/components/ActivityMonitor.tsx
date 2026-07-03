import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sessionStatus, touchLastActivity } from '../api/postgrest';
import { useAuth } from '../hooks/useAuth';
import { useMessages } from '../hooks/useMessages';
import {
  INACTIVITY_LOGOUT_MESSAGE,
  setFlashWarning,
} from '../lib/authMessages';
import {
  bumpActivityExpiry,
  getActivityExpiresAt,
  isActivityExpired,
  setActivityExpiresAt,
} from '../lib/session';

const SYNC_DEBOUNCE_MS = 30 * 1000;
const TIMER_INTERVAL_MS = 1_000;
const SERVER_SYNC_INTERVAL_MS = 15 * 1000;

function parseServerExpiresAt(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const text = typeof value === 'string'
    ? value.replace(/^"|"$/g, '')
    : String(value);
  const expiresAt = Date.parse(text);
  return Number.isNaN(expiresAt) ? null : expiresAt;
}

function isInactiveLogout(status: { ok?: boolean; active?: boolean }): boolean {
  return status.ok !== false && status.active === false;
}

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

  const forceInactiveLogout = useCallback(() => {
    if (!session || loggingOutRef.current) {
      return;
    }

    loggingOutRef.current = true;
    setFlashWarning(INACTIVITY_LOGOUT_MESSAGE);
    showWarning(INACTIVITY_LOGOUT_MESSAGE);
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate, session, showWarning]);

  const applyServerStatus = useCallback(
    async     (status: Awaited<ReturnType<typeof sessionStatus>>) => {
      if (isInactiveLogout(status)) {
        forceInactiveLogout();
        return true;
      }

      const serverExpiresAt = parseServerExpiresAt(status.activity_expires_at);
      if (serverExpiresAt !== null) {
        const clientExpiresAt = getActivityExpiresAt();
        if (clientExpiresAt === null || serverExpiresAt < clientExpiresAt) {
          setActivityExpiresAt(serverExpiresAt);
        }
      }

      return false;
    },
    [forceInactiveLogout],
  );

  const refreshExpiryFromServer = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const status = await sessionStatus();
      await applyServerStatus(status);
    } catch {
      // Fall back to the front-end timer when the server is unreachable.
    }
  }, [applyServerStatus, session]);

  const syncActivityToServer = useCallback(
    async (force = false) => {
      if (!session || syncingRef.current) {
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
    [forceInactiveLogout, session],
  );

  const recordActivity = useCallback(() => {
    bumpActivityExpiry();
    void syncActivityToServer();
  }, [syncActivityToServer]);

  const checkLocalExpiry = useCallback(() => {
    if (!session) {
      return;
    }

    if (isActivityExpired()) {
      forceInactiveLogout();
    }
  }, [forceInactiveLogout, session]);

  useEffect(() => {
    loggingOutRef.current = false;
  }, [session?.user_id]);

  useEffect(() => {
    if (!session) {
      sessionUserIdRef.current = null;
      prevPathnameRef.current = null;
      return;
    }

    if (sessionUserIdRef.current === session.user_id) {
      return;
    }

    sessionUserIdRef.current = session.user_id;
    prevPathnameRef.current = location.pathname;

    void (async () => {
      try {
        const status = await sessionStatus();
        const loggedOut = await applyServerStatus(status);
        if (loggedOut) {
          return;
        }

        if (getActivityExpiresAt() === null) {
          bumpActivityExpiry();
        }
      } catch {
        if (getActivityExpiresAt() === null) {
          bumpActivityExpiry();
        }
      }
    })();
  }, [applyServerStatus, location.pathname, session]);

  useEffect(() => {
    if (!session) {
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
  }, [location.pathname, recordActivity, session]);

  useEffect(() => {
    if (!session) {
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
  }, [recordActivity, session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    checkLocalExpiry();
    void refreshExpiryFromServer();

    const timerId = window.setInterval(checkLocalExpiry, TIMER_INTERVAL_MS);
    const serverSyncId = window.setInterval(() => {
      void refreshExpiryFromServer();
    }, SERVER_SYNC_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkLocalExpiry();
        void refreshExpiryFromServer();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(timerId);
      window.clearInterval(serverSyncId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [checkLocalExpiry, refreshExpiryFromServer, session]);

  return null;
}
