import { parseRoles, type UserSession } from './session';

export const LOGIN_HOME_PATH = '/home';

export type LoginSuccess = {
  session: UserSession;
  homePath: typeof LOGIN_HOME_PATH;
};

type LoginSuccessInput = {
  ok?: boolean;
  user_id?: unknown;
  username?: unknown;
  email?: unknown;
  roles?: unknown;
  token?: unknown;
};

function loginUserId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && /^[1-9]\d*$/.test(value)) {
    const parsed = Number(value);
    if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }

  return null;
}

/**
 * Session to store after `api.login` returns ok.
 * Quick Registration accounts have a null email and often no roles; both still sign in.
 */
export function sessionFromLoginResult(result: LoginSuccessInput): LoginSuccess | null {
  if (!result.ok) {
    return null;
  }

  const userId = loginUserId(result.user_id);
  const username = typeof result.username === 'string' ? result.username.trim() : '';
  if (userId == null || username === '') {
    return null;
  }

  const email = typeof result.email === 'string' ? result.email.trim() : '';

  return {
    homePath: LOGIN_HOME_PATH,
    session: {
      user_id: userId,
      username,
      email,
      roles: parseRoles(result.roles),
      token: typeof result.token === 'string' ? result.token : null,
    },
  };
}
