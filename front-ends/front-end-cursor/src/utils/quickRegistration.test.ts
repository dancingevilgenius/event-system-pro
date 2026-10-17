import { describe, expect, it } from 'vitest';
import {
  nextQuickRegistrationUsername,
  quickRegistrationPassword,
  quickRegistrationRegisteredMessage,
  quickRegistrationBatchSummary,
  quickRegistrationUsernameHint,
} from './quickRegistration';

describe('quickRegistrationPassword', () => {
  it('builds the password from the first initial and last name', () => {
    expect(quickRegistrationPassword('Carlos', 'Garcia')).toBe('cgarcia');
    expect(quickRegistrationPassword('  Ana ', 'De La Cruz')).toBe('adelacruz');
    expect(quickRegistrationPassword('Bo', 'Li')).toBe('bli');
  });

  it('returns null when a name is missing', () => {
    expect(quickRegistrationPassword(' ', 'Garcia')).toBeNull();
    expect(quickRegistrationPassword('Carlos', '   ')).toBeNull();
  });
});

describe('quickRegistrationRegisteredMessage', () => {
  it('names the person without showing the password', () => {
    expect(quickRegistrationRegisteredMessage('Carlos', 'Garcia')).toBe('Carlos Garcia is registered.');
  });
});

describe('nextQuickRegistrationUsername', () => {
  it('keeps the base username when it is free', () => {
    expect(nextQuickRegistrationUsername('cgarcia', [])).toBe('cgarcia');
  });

  it('appends 1 when the base username exists', () => {
    expect(nextQuickRegistrationUsername('cgarcia', ['cgarcia'])).toBe('cgarcia1');
  });

  it('keeps looking when the numbered username is also taken', () => {
    expect(nextQuickRegistrationUsername('cgarcia', ['cgarcia', 'cgarcia1'])).toBe('cgarcia2');
  });
});

describe('quickRegistrationUsernameHint', () => {
  it('explains an incremented username', () => {
    expect(quickRegistrationUsernameHint('Chris Garcia', 'cgarcia', 'cgarcia1', 'will')).toBe(
      'Username cgarcia already exists, so Chris Garcia will use cgarcia1.',
    );
  });

  it('stays quiet when the username was not incremented', () => {
    expect(quickRegistrationUsernameHint('Carlos Garcia', 'cgarcia', 'cgarcia', 'uses')).toBeNull();
  });
});

describe('quickRegistrationBatchSummary', () => {
  it('reports the number of successful inserts', () => {
    expect(quickRegistrationBatchSummary(4, [])).toBe('Quick Registered 4 staff.');
    expect(quickRegistrationBatchSummary(1, [])).toBe('Quick Registered 1 staff member.');
  });

  it('reports failures with the success count', () => {
    expect(
      quickRegistrationBatchSummary(3, ['April Prince already has an account.']),
    ).toBe('Quick Registered 3 staff. 1 failed: April Prince already has an account.');
  });

  it('reports zero successes when every insert fails', () => {
    expect(quickRegistrationBatchSummary(0, ['Dylan Bushe was not registered.'])).toBe(
      'Quick Registered 0 staff. 1 failed: Dylan Bushe was not registered.',
    );
  });
});
