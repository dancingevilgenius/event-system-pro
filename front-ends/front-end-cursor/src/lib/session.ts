const SESSION_KEY = 'esp_session';
/** Legacy key from the removed client inactivity timer; cleared on logout. */
const ACTIVITY_EXPIRES_AT_KEY = 'esp_activity_expires_at';

/**
 * TEMPORARY — delete this constant and `isInactivityLogoutPausedForDate` after 2026-10-17.
 * Inactivity logout is off for this US Central (America/Chicago) calendar day only.
 */
export const INACTIVITY_LOGOUT_DISABLED_CENTRAL_DATE = '2026-10-17';

const INACTIVITY_LOGOUT_PAUSE_TIME_ZONE = 'America/Chicago';

/** True only on the temporary pause day. Easy to remove with the constant above. */
export function isInactivityLogoutPausedForDate(now: Date = new Date()): boolean {
  const centralDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: INACTIVITY_LOGOUT_PAUSE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  return centralDate === INACTIVITY_LOGOUT_DISABLED_CENTRAL_DATE;
}

/**
 * Skip inactivity logout polling/touches.
 * Always on for the 2026-10-17 Central pause day; otherwise on local dev hosts
 * (localhost / 127.0.0.*).
 */
export function isInactivityLogoutDisabled(now: Date = new Date()): boolean {
  if (isInactivityLogoutPausedForDate(now)) {
    return true;
  }

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
  | 'INSTRUCTOR'
  | 'SETUP'
  | 'TEARDOWN'
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
  'INSTRUCTOR',
  'SETUP',
  'TEARDOWN',
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
  sessionStorage.removeItem(ACTIVITY_EXPIRES_AT_KEY);
}

export function sessionHasAnyRole(session: UserSession, requiredRoles: AppRole[]): boolean {
  if (session.roles.includes('ADMIN')) {
    return true;
  }

  return requiredRoles.some((role) => session.roles.includes(role));
}
