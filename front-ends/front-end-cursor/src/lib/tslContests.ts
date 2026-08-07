/** Helpers for TSL / saber contest division UI. */

export function isTslContestEvent(
  eventGroupCode: string,
  eventTypeCode: string | null | undefined,
): boolean {
  const group = eventGroupCode.trim().toUpperCase();
  if (group.startsWith('TSL_')) {
    return true;
  }

  const type = (eventTypeCode ?? '').trim().toUpperCase();
  return type === 'SWORD_LIGHT_SABER';
}
