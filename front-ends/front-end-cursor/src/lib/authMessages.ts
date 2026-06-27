export const INACTIVITY_LOGOUT_MESSAGE =
  'You have been signed out due to inactivity to protect your account.';

export type LoginFlashState = {
  flashSuccess?: string;
  flashWarning?: string;
};

const FLASH_SUCCESS_KEY = 'esp_flash_success';
const FLASH_WARNING_KEY = 'esp_flash_warning';

export function setFlashSuccess(message: string): void {
  sessionStorage.setItem(FLASH_SUCCESS_KEY, message);
}

export function setFlashWarning(message: string): void {
  sessionStorage.setItem(FLASH_WARNING_KEY, message);
}

export function peekFlashSuccess(): string | null {
  return sessionStorage.getItem(FLASH_SUCCESS_KEY);
}

export function peekFlashWarning(): string | null {
  return sessionStorage.getItem(FLASH_WARNING_KEY);
}

export function clearFlashSuccess(): void {
  sessionStorage.removeItem(FLASH_SUCCESS_KEY);
}

export function clearFlashWarning(): void {
  sessionStorage.removeItem(FLASH_WARNING_KEY);
}

export function hasPendingLoginFlash(): boolean {
  return peekFlashSuccess() !== null || peekFlashWarning() !== null;
}
