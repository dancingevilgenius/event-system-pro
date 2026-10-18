export type AutoQuickRegisterRole = 'leader' | 'follower';

export type AutoQuickRegisterAction = {
  run: boolean;
  attemptKey: string | null;
};

function positiveBibNumber(value: string): number {
  const trimmed = value.trim();
  if (!/^\d{1,3}$/.test(trimmed)) {
    return 0;
  }
  const bib = Number(trimmed);
  return bib > 0 ? bib : 0;
}

/**
 * Whether assigning a bib and a Leader/Follower role should Quick Register this person.
 * A bib alone, a role alone, an existing registration, or a repeat of the same
 * person, bib, and role does not run again.
 */
export function autoQuickRegisterAction(input: {
  firstName: string;
  lastName: string;
  bib: string;
  role: AutoQuickRegisterRole | null;
  eligible: boolean;
  attemptedKeys: readonly string[];
}): AutoQuickRegisterAction {
  const firstName = input.firstName.trim().toLowerCase();
  const lastName = input.lastName.trim().toLowerCase();
  const bib = positiveBibNumber(input.bib);
  const role = input.role === 'leader' || input.role === 'follower' ? input.role : null;
  if (!input.eligible || firstName === '' || lastName === '' || bib <= 0 || role === null) {
    return { run: false, attemptKey: null };
  }

  const attemptKey = `${firstName}|${lastName}|${bib}|${role}`;
  if (input.attemptedKeys.includes(attemptKey)) {
    return { run: false, attemptKey };
  }

  return { run: true, attemptKey };
}
