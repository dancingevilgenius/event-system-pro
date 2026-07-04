const LAST_EVENT_GROUP_CODE_KEY = 'esp_last_event_group_code';

export function rememberEventGroupCode(eventGroupCode: string): void {
  const trimmed = eventGroupCode.trim();
  if (!trimmed) {
    return;
  }

  sessionStorage.setItem(LAST_EVENT_GROUP_CODE_KEY, trimmed);
}

export function getRememberedEventGroupCode(): string | null {
  const value = sessionStorage.getItem(LAST_EVENT_GROUP_CODE_KEY)?.trim();
  return value || null;
}

export function resolveEventGroupCode(
  navigationState?: { eventGroupCode?: string } | null,
): string | null {
  const fromState = navigationState?.eventGroupCode?.trim();
  if (fromState) {
    rememberEventGroupCode(fromState);
    return fromState;
  }

  return getRememberedEventGroupCode();
}
