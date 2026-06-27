import { createContext } from 'react';
import type { AppRole, UserSession } from '../lib/session';

export type AuthContextValue = {
  session: UserSession | null;
  setSession: (session: UserSession) => void;
  logout: () => void;
  hasAnyRole: (roles: AppRole[]) => boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
