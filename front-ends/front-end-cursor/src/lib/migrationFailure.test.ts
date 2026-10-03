import { describe, expect, it } from 'vitest';
import { diagnoseMigrationFailure } from './migrationFailure';

describe('diagnoseMigrationFailure', () => {
  it('explains an earlier script that still needs to be applied', () => {
    const report = diagnoseMigrationFailure('104_scheduler_role.sql', {
      message: 'Apply 096_ticket_sales.sql first.',
    });

    expect(report.cause).toContain('096_ticket_sales.sql');
    expect(report.steps[0]).toBe('Apply 096_ticket_sales.sql first.');
  });

  it('leaves unknown errors without invented steps', () => {
    const report = diagnoseMigrationFailure('096_ticket_sales.sql', {
      message: 'connection reset by peer',
    });

    expect(report.cause).toBeNull();
    expect(report.steps).toEqual([]);
  });
});
