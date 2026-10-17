import { describe, expect, it } from 'vitest';
import {
  maskQuickRegistrationPassword,
  quickRegistrationPassword,
  quickRegistrationRegisteredMessage,
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

describe('maskQuickRegistrationPassword', () => {
  it('keeps the first and last letters and stars the rest', () => {
    expect(maskQuickRegistrationPassword('cgarcia')).toBe('c*****a');
    expect(maskQuickRegistrationPassword('bli')).toBe('b*i');
    expect(maskQuickRegistrationPassword('ab')).toBe('ab');
  });
});

describe('quickRegistrationRegisteredMessage', () => {
  it('names the person and shows the masked password', () => {
    expect(quickRegistrationRegisteredMessage('Carlos', 'Garcia', 'cgarcia')).toBe(
      'Carlos Garcia is registered with generated password c*****a.',
    );
  });
});
