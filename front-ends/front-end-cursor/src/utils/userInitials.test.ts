import { describe, expect, it } from 'vitest';
import { signedInUserInitials, userInitials } from './userInitials';

describe('userInitials', () => {
  it('uses the first letter of the first and last name', () => {
    expect(userInitials({ firstName: 'Carlos', lastName: 'Garcia' })).toBe('CG');
    expect(userInitials({ firstName: 'Elizabeth', lastName: 'Gutzwiler-Daigle' })).toBe('EG');
    expect(userInitials({ firstName: '  ana ', lastName: ' lopez ' })).toBe('AL');
  });

  it('derives a pair from a stored display name when first and last are missing', () => {
    expect(userInitials({ displayName: 'Carlos Garcia' })).toBe('CG');
    expect(userInitials({ displayName: 'Elizabeth Gutzwiler-Daigle' })).toBe('EG');
    expect(userInitials({ firstName: '', lastName: '', displayName: 'Ada Lovelace' })).toBe('AL');
  });

  it('returns nothing when there is no name', () => {
    expect(userInitials({})).toBe('');
    expect(userInitials({ displayName: 'dancingevilgenius' })).toBe('');
    expect(userInitials({ firstName: '   ', lastName: '  ' })).toBe('');
  });
});

describe('signedInUserInitials', () => {
  it('prefers first and last name over the username', () => {
    expect(
      signedInUserInitials({
        firstName: 'Carlos',
        lastName: 'Garcia',
        username: 'dancingevilgenius',
      }),
    ).toBe('CG');
  });

  it('uses up to two letters of the username when no name is available', () => {
    expect(signedInUserInitials({ username: 'dancingevilgenius' })).toBe('DA');
    expect(signedInUserInitials({ username: 'c.garcia' })).toBe('CG');
    expect(signedInUserInitials({ username: 'a' })).toBe('A');
    expect(signedInUserInitials({ username: '123' })).toBe('');
  });
});
