import { describe, expect, it } from 'vitest';
import { autoQuickRegisterAction } from './autoQuickRegister';

describe('autoQuickRegisterAction', () => {
  it('quick registers when a bib and a role are both set', () => {
    expect(autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '12',
      role: 'leader',
      eligible: true,
      attemptedKeys: [],
    })).toEqual({
      run: true,
      attemptKey: 'carlos|garcia|12|leader',
    });
    expect(autoQuickRegisterAction({
      firstName: 'Ana',
      lastName: 'Lopez',
      bib: '7',
      role: 'follower',
      eligible: true,
      attemptedKeys: [],
    }).run).toBe(true);
  });

  it('does not quick register from a bib alone or a role alone', () => {
    expect(autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '12',
      role: null,
      eligible: true,
      attemptedKeys: [],
    }).run).toBe(false);
    expect(autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '',
      role: 'leader',
      eligible: true,
      attemptedKeys: [],
    }).run).toBe(false);
  });

  it('does not quick register someone already registered or already attempted for that bib and role', () => {
    const attempted = autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '12',
      role: 'leader',
      eligible: true,
      attemptedKeys: [],
    }).attemptKey;

    expect(autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '12',
      role: 'leader',
      eligible: false,
      attemptedKeys: [],
    }).run).toBe(false);
    expect(autoQuickRegisterAction({
      firstName: 'Carlos',
      lastName: 'Garcia',
      bib: '12',
      role: 'leader',
      eligible: true,
      attemptedKeys: attempted ? [attempted] : [],
    }).run).toBe(false);
  });
});
