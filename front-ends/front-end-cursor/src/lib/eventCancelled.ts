/** True only when event metadata stores `cancelled: true`. Missing or false means active. */
export function eventIsCancelled(moreJson: unknown): boolean {
  if (!moreJson || typeof moreJson !== 'object' || Array.isArray(moreJson)) {
    return false;
  }

  return (moreJson as { cancelled?: unknown }).cancelled === true;
}
