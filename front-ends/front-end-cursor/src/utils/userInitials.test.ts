import { describe, expect, it } from 'vitest';
import { userInitials } from './userInitials';

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
