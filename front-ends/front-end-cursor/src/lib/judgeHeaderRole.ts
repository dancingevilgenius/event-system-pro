/**
 * Header caption above the signed-in judge's initials.
 * Head Judge is the app role (`HEAD_JUDGE` or the label "Head Judge"), or the
 * head judge assigned to the contest open on the page. Admin and Judge stay "Judge".
 */
export function judgeHeaderRoleLabel(input: {
  appRoles?: readonly string[] | null;
  contestHeadJudge?: boolean;
}): 'Head Judge' | 'Judge' {
  if (input.contestHeadJudge === true) {
    return 'Head Judge';
  }

  const headJudge = (input.appRoles ?? []).some(
    (role) => role.trim().toUpperCase().replace(/[\s-]+/g, '_') === 'HEAD_JUDGE',
  );
  return headJudge ? 'Head Judge' : 'Judge';
}
