/** Dev/test deployment host (eventsystem.fun Dokploy). */
export function isEventsystemFunDeployment(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.hostname === 'eventsystem.fun';
}

/** Secret must begin with this prefix (additional characters allowed). */
export const AUDIT_PURGE_SECRET_PREFIX = 'DefyantYorkie';

export function isValidAuditPurgeSecret(secret: string): boolean {
  return secret.trim().startsWith(AUDIT_PURGE_SECRET_PREFIX);
}
