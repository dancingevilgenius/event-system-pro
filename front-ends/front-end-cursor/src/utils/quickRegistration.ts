/**
 * Quick Registration (quickreg).
 *
 * Password is the first letter of the first name plus the last name, with
 * whitespace removed, all lowercase. Carlos Garcia → cgarcia.
 *
 * The username starts as that same string. When it is already taken, append
 * 1, then 2, and so on. Carlos Garcia → cgarcia, or cgarcia1 when cgarcia exists.
 *
 * Keep this in step with api._next_quickreg_username in
 * database/migrations/165_quickreg_username_suffix.sql.
 */

export function quickRegistrationPassword(firstName: string, lastName: string): string | null {
  const first = firstName.trim().toLowerCase();
  const last = lastName.trim().toLowerCase().replace(/\s+/g, '');
  if (first === '' || last === '') {
    return null;
  }

  const password = `${first.charAt(0)}${last}`;
  if (password.length < 2 || password.length > 64) {
    return null;
  }

  return password;
}

export function quickRegistrationRegisteredMessage(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  return `${first} ${last} is registered.`;
}

/** Next free username. `reserved` holds usernames already taken, compared lowercase. */
export function nextQuickRegistrationUsername(base: string, reserved: Iterable<string>): string | null {
  const taken = new Set(Array.from(reserved, (name) => name.toLowerCase()));
  if (!taken.has(base)) {
    return base;
  }

  for (let suffix = 1; suffix <= 99; suffix += 1) {
    const username = `${base}${suffix}`;
    if (username.length > 64) {
      return null;
    }
    if (!taken.has(username)) {
      return username;
    }
  }

  return null;
}

export function quickRegistrationUsernameHint(
  name: string,
  baseUsername: string,
  username: string,
  tense: 'will' | 'uses',
): string | null {
  if (username.toLowerCase() === baseUsername.toLowerCase()) {
    return null;
  }

  const verb = tense === 'will' ? 'will use' : 'uses';
  return `Username ${baseUsername} already exists, so ${name} ${verb} ${username}.`;
}

export function quickRegistrationBatchSummary(
  successCount: number,
  failures: string[],
  hints: string[] = [],
): string {
  const registered = successCount === 1
    ? 'Quick Registered 1 staff member.'
    : `Quick Registered ${successCount} staff.`;
  const parts = [registered, ...hints.filter((hint) => hint.trim() !== '')];
  if (failures.length > 0) {
    const failed = failures.length === 1 ? '1 failed' : `${failures.length} failed`;
    parts.push(`${failed}: ${failures.join(' ')}`);
  }
  return parts.join(' ');
}
