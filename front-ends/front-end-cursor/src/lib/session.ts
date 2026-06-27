const SESSION_KEY = 'esp_session';

export type AppRole = 'admin' | 'staff' | 'judge' | 'competitor';

export type UserSession = {
  user_id: number;
  username: string;
  email: string;
  roles: AppRole[];
  token: string | null;
};

const APP_ROLES: AppRole[] = ['admin', 'staff', 'judge', 'competitor'];

function isAppRole(value: unknown): value is AppRole {
  return typeof value === 'string' && APP_ROLES.includes(value as AppRole);
}

function parseRoles(value: unknown): AppRole[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isAppRole);
}

export function saveSession(session: UserSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): UserSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (
      typeof parsed.user_id === 'number'
      && typeof parsed.username === 'string'
      && typeof parsed.email === 'string'
    ) {
      return {
        user_id: parsed.user_id,
        username: parsed.username,
        email: parsed.email,
        roles: parseRoles(parsed.roles),
        token: typeof parsed.token === 'string' ? parsed.token : null,
      };
    }
  } catch {
    // Ignore invalid session data.
  }

  return null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function sessionHasAnyRole(session: UserSession, requiredRoles: AppRole[]): boolean {
  if (session.roles.includes('admin')) {
    return true;
  }

  return requiredRoles.some((role) => session.roles.includes(role));
}
