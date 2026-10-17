const REGISTRATION_SELECTED_USER_KEY = 'esp_registration_selected_user';

export type RegistrationSelectedUser = {
  username: string;
  firstName: string;
  lastName: string;
};

/** Desk routes that share the selected registrant. Public `/register` is not included. */
export function isRegistrationDeskPath(pathname: string): boolean {
  return (
    pathname === '/registrationHome' ||
    pathname.startsWith('/registrationHome/') ||
    pathname === '/registration' ||
    pathname.startsWith('/registration/')
  );
}

function isSelectedUser(value: unknown): value is RegistrationSelectedUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const row = value as Partial<RegistrationSelectedUser>;
  return (
    typeof row.username === 'string' &&
    row.username.trim() !== '' &&
    typeof row.firstName === 'string' &&
    typeof row.lastName === 'string'
  );
}

export function readRegistrationSelectedUser(): RegistrationSelectedUser | null {
  const raw = sessionStorage.getItem(REGISTRATION_SELECTED_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSelectedUser(parsed)) {
      sessionStorage.removeItem(REGISTRATION_SELECTED_USER_KEY);
      return null;
    }

    return {
      username: parsed.username.trim(),
      firstName: parsed.firstName.trim(),
      lastName: parsed.lastName.trim(),
    };
  } catch {
    sessionStorage.removeItem(REGISTRATION_SELECTED_USER_KEY);
    return null;
  }
}

export function writeRegistrationSelectedUser(user: RegistrationSelectedUser): void {
  sessionStorage.setItem(
    REGISTRATION_SELECTED_USER_KEY,
    JSON.stringify({
      username: user.username.trim(),
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
    }),
  );
}

export function clearRegistrationSelectedUser(): void {
  sessionStorage.removeItem(REGISTRATION_SELECTED_USER_KEY);
}
