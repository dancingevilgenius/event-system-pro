import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ensureRealtimeService } from '../api/realtime';
import { INACTIVITY_LOGOUT_MESSAGE, setFlashWarning } from '../lib/authMessages';
import {
  bumpActivityExpiry,
  clearSession,
  ensureActivityExpiry,
  isActivityExpired,
  loadSession,
  saveSession,
  sessionHasAnyRole,
  type AppRole,
  type UserSession,
} from '../lib/session';
import { AuthContext } from './AuthContext';

type AuthProviderProps = {
  children: ReactNode;
};

function loadInitialSession(): UserSession | null {
  const loaded = loadSession();
  if (!loaded) {
    return null;
  }

  ensureActivityExpiry();

  if (isActivityExpired()) {
    clearSession();
    setFlashWarning(INACTIVITY_LOGOUT_MESSAGE);
    return null;
  }

  return loaded;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSessionState] = useState<UserSession | null>(() => loadInitialSession());

  const setSession = useCallback((nextSession: UserSession) => {
    saveSession(nextSession);
    bumpActivityExpiry();
    setSessionState(nextSession);
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    void ensureRealtimeService();
  }, [session]);

  const logout = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  const hasAnyRole = useCallback(
    (roles: AppRole[]) => {
      if (!session) {
        return false;
      }

      return sessionHasAnyRole(session, roles);
    },
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      setSession,
      logout,
      hasAnyRole,
    }),
    [session, setSession, logout, hasAnyRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
