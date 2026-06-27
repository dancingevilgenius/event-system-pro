const SESSION_KEY = 'esp_session';

export type UserSession = {
  user_id: number;
  username: string;
  email: string;
};

export function saveSession(session: UserSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): UserSession | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as UserSession;
    if (
      typeof parsed.user_id === 'number'
      && typeof parsed.username === 'string'
      && typeof parsed.email === 'string'
    ) {
      return parsed;
    }
  } catch {
    // Ignore invalid session data.
  }

  return null;
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
