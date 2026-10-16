import { describe, expect, it } from 'vitest';
import {
  SCHEDULER_HEARTBEAT_MAX_AGE_MS,
  schedulerHeartbeatIsHealthy,
} from './schedulerHeartbeat';

describe('schedulerHeartbeatIsHealthy', () => {
  const now = Date.parse('2026-10-16T22:00:00.000Z');

  it('is healthy when the stamp is inside the window', () => {
    const heartbeatAt = new Date(now - 15_000).toISOString();
    expect(schedulerHeartbeatIsHealthy(heartbeatAt, now)).toBe(true);
  });

  it('is failing when the stamp is overdue', () => {
    const heartbeatAt = new Date(now - SCHEDULER_HEARTBEAT_MAX_AGE_MS - 1_000).toISOString();
    expect(schedulerHeartbeatIsHealthy(heartbeatAt, now)).toBe(false);
  });

  it('is failing when the scheduler has never stamped', () => {
    expect(schedulerHeartbeatIsHealthy(null, now)).toBe(false);
  });
});
