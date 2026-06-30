export const MESSAGE_AUTO_DISMISS_STORAGE_KEY = 'evp.messageAutoDismissMs';

export const DEFAULT_MESSAGE_AUTO_DISMISS_MS = 3000;

export const MESSAGE_AUTO_DISMISS_OPTIONS = [
  { label: '3 seconds', value: 3000 },
  { label: '10 seconds', value: 10000 },
  { label: '1 minute', value: 60000 },
  { label: '5 minutes', value: 300000 },
  { label: '10 minutes', value: 600000 },
] as const;

export type MessageAutoDismissMs = (typeof MESSAGE_AUTO_DISMISS_OPTIONS)[number]['value'];

export function isMessageAutoDismissMs(value: number): value is MessageAutoDismissMs {
  return MESSAGE_AUTO_DISMISS_OPTIONS.some((option) => option.value === value);
}

export function readStoredMessageAutoDismissMs(): MessageAutoDismissMs {
  const raw = localStorage.getItem(MESSAGE_AUTO_DISMISS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_MESSAGE_AUTO_DISMISS_MS;
  }

  const parsed = Number.parseInt(raw, 10);
  if (isMessageAutoDismissMs(parsed)) {
    return parsed;
  }

  return DEFAULT_MESSAGE_AUTO_DISMISS_MS;
}

export function storeMessageAutoDismissMs(ms: MessageAutoDismissMs): void {
  localStorage.setItem(MESSAGE_AUTO_DISMISS_STORAGE_KEY, String(ms));
}
