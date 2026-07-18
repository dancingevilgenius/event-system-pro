const SESSION_KEY = 'esp_session';
const ACTIVITY_EXPIRES_AT_KEY = 'esp_activity_expires_at';

export const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

/** Skip client inactivity logout on local dev hosts (localhost / 127.0.0.*). */
export function isInactivityLogoutDisabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname.startsWith('127.0.0.');
}

export type AppRole =
  | 'ADMIN'
  | 'STAFF'
  | 'JUDGE'
  | 'HEAD_JUDGE'
  | 'REGISTRATION'
  | 'FLOOR_PARENT'
  | 'EVENT_MANAGER'
  | 'DJ'
  | 'EVENT_DIRECTOR'
  | 'COMPETITOR';

export type UserSession = {
  user_id: number;
  username: string;
  email: string;
  roles: AppRole[];
  token: string | null;
};

const APP_ROLES: AppRole[] = [
  'ADMIN',
  'STAFF',
  'JUDGE',
  'HEAD_JUDGE',
  'REGISTRATION',
  'FLOOR_PARENT',
  'EVENT_MANAGER',
  'DJ',
  'EVENT_DIRECTOR',
  'COMPETITOR',
];

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

export function getActivityExpiresAt(): number | null {
  const raw = sessionStorage.getItem(ACTIVITY_EXPIRES_AT_KEY);
  if (!raw) {
    return null;
  }

  const expiresAt = Number(raw);
  return Number.isFinite(expiresAt) ? expiresAt : null;
}

export function setActivityExpiresAt(expiresAtMs: number): void {
  sessionStorage.setItem(ACTIVITY_EXPIRES_AT_KEY, String(expiresAtMs));
}

export function bumpActivityExpiry(): number {
  const expiresAt = Date.now() + INACTIVITY_TIMEOUT_MS;
  setActivityExpiresAt(expiresAt);
  return expiresAt;
}

/**
 * Merge client and server inactivity deadlines.
 * Prefer the later time so a freshly reset local timer is not shortened by a
 * stale server `activity_expires_at` before `touch_last_activity` lands.
 */
export function mergeActivityExpiresAt(
  clientExpiresAt: number | null,
  serverExpiresAt: number | null,
): number | null {
  if (serverExpiresAt === null) {
    return clientExpiresAt;
  }

  if (clientExpiresAt === null) {
    return serverExpiresAt;
  }

  return Math.max(clientExpiresAt, serverExpiresAt);
}

export function clearActivityExpiry(): void {
  sessionStorage.removeItem(ACTIVITY_EXPIRES_AT_KEY);
}

export function isActivityExpired(): boolean {
  if (isInactivityLogoutDisabled()) {
    return false;
  }

  const expiresAt = getActivityExpiresAt();
  return expiresAt !== null && Date.now() >= expiresAt;
}

export function ensureActivityExpiry(): number {
  const existing = getActivityExpiresAt();
  if (existing !== null) {
    return existing;
  }

  return bumpActivityExpiry();
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
  clearActivityExpiry();
}

export function sessionHasAnyRole(session: UserSession, requiredRoles: AppRole[]): boolean {
  if (session.roles.includes('ADMIN')) {
    return true;
  }

  return requiredRoles.some((role) => session.roles.includes(role));
}
