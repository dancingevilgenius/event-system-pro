import { describe, expect, it } from 'vitest';
import { judgeHeaderRoleLabel } from './judgeHeaderRole';

describe('judgeHeaderRoleLabel', () => {
  it('uses Head Judge for the app role or the Head Judge label', () => {
    expect(judgeHeaderRoleLabel({ appRoles: ['HEAD_JUDGE'] })).toBe('Head Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['Head Judge'] })).toBe('Head Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['JUDGE', 'HEAD_JUDGE'] })).toBe('Head Judge');
  });

  it('keeps Judge for a scoring judge or an admin who is not a head judge', () => {
    expect(judgeHeaderRoleLabel({ appRoles: ['JUDGE'] })).toBe('Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['ADMIN'] })).toBe('Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['ADMIN', 'JUDGE'] })).toBe('Judge');
    expect(judgeHeaderRoleLabel({ appRoles: [] })).toBe('Judge');
  });

  it('uses Head Judge when this user is the contest head judge', () => {
    expect(judgeHeaderRoleLabel({ appRoles: ['JUDGE'], contestHeadJudge: true })).toBe('Head Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['ADMIN'], contestHeadJudge: true })).toBe('Head Judge');
    expect(judgeHeaderRoleLabel({ appRoles: ['JUDGE'], contestHeadJudge: false })).toBe('Judge');
  });
});
