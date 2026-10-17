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
