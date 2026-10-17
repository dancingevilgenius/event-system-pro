/**
 * Quick Registration (quickreg).
 *
 * Password is the first letter of the first name plus the last name, with
 * whitespace removed, all lowercase. Carlos Garcia → cgarcia.
 *
 * Keep this in step with api.quick_register_user in
 * database/migrations/159_quick_register_user.sql.
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

/** First and last letters stay visible. Every letter between them is `*`. */
export function maskQuickRegistrationPassword(password: string): string {
  if (password.length <= 2) {
    return password;
  }

  return `${password.charAt(0)}${'*'.repeat(password.length - 2)}${password.charAt(password.length - 1)}`;
}

export function quickRegistrationRegisteredMessage(
  firstName: string,
  lastName: string,
  password: string,
): string {
  const first = firstName.trim();
  const last = lastName.trim();
  return `${first} ${last} is registered with generated password ${maskQuickRegistrationPassword(password)}.`;
}
