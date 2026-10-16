/** A stamp older than this means the scheduler loop has stopped. */
export const SCHEDULER_HEARTBEAT_MAX_AGE_MS = 60_000;

export function schedulerHeartbeatIsHealthy(
  heartbeatAt: string | null | undefined,
  nowMs: number,
): boolean {
  if (!heartbeatAt) {
    return false;
  }

  const at = Date.parse(heartbeatAt);
  if (!Number.isFinite(at)) {
    return false;
  }

  return nowMs - at <= SCHEDULER_HEARTBEAT_MAX_AGE_MS;
}
