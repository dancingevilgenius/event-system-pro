import { describe, expect, it } from 'vitest';
import { pendingMigrationsMessage } from './pendingMigrations';

describe('pendingMigrationsMessage', () => {
  it('names the pending count', () => {
    expect(pendingMigrationsMessage(18)).toBe('This environment needs to apply 18 Migrations');
  });

  it('stays quiet when nothing is pending', () => {
    expect(pendingMigrationsMessage(0)).toBeNull();
    expect(pendingMigrationsMessage(-1)).toBeNull();
  });
});
