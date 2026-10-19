function firstLetter(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '';
  }

  return trimmed.charAt(0).toLocaleUpperCase();
}

/**
 * Uppercase initials: first letter of the first name and first letter of the last name.
 * When only a stored display name exists, use the first and last words of that name.
 * Returns an empty string when there is no name to derive from.
 */
export function userInitials(name: {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
}): string {
  const first = (name.firstName ?? '').trim();
  const last = (name.lastName ?? '').trim();

  if (first || last) {
    return `${firstLetter(first)}${firstLetter(last)}`;
  }

  const display = (name.displayName ?? '').trim();
  if (!display) {
    return '';
  }

  const parts = display.split(/\s+/).filter(Boolean);
  if (parts.length < 2) {
    return '';
  }

  return `${firstLetter(parts[0])}${firstLetter(parts[parts.length - 1])}`;
}

/** Up to two letters from a username when no first and last name is available. */
export function usernameInitials(username: string | null | undefined): string {
  const letters = (username ?? '').match(/\p{L}/gu) ?? [];
  return letters.slice(0, 2).join('').toLocaleUpperCase();
}

/**
 * Judge/header initials: first and last name when present, otherwise up to two
 * letters of the signed-in username.
 */
export function signedInUserInitials(name: {
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  username?: string | null;
}): string {
  const fromName = userInitials(name);
  if (fromName) {
    return fromName;
  }

  return usernameInitials(name.username);
}
