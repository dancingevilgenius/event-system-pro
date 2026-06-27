import { type ReactNode, useCallback, useMemo, useState } from 'react';
import {
  clearSession,
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

export default function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSessionState] = useState<UserSession | null>(() => loadSession());

  const setSession = useCallback((nextSession: UserSession) => {
    saveSession(nextSession);
    setSessionState(nextSession);
  }, []);

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
