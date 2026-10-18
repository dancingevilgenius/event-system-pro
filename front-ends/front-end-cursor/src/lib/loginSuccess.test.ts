import { afterEach, describe, expect, it } from 'vitest';
import { sessionFromLoginResult } from './loginSuccess';
import { loadSession, saveSession } from './session';

describe('sessionFromLoginResult', () => {
  afterEach(() => {
    delete (globalThis as { sessionStorage?: Storage }).sessionStorage;
  });

  it('stores a session and goes to /home when email is null and roles are empty', () => {
    const store = new Map<string, string>();
    globalThis.sessionStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
      key: (index: number) => [...store.keys()][index] ?? null,
      get length() {
        return store.size;
      },
    };

    const success = sessionFromLoginResult({
      ok: true,
      user_id: 1014,
      username: 'rludwick',
      email: null,
      roles: [],
      token: 'token',
    });

    expect(success?.homePath).toBe('/home');
    expect(success?.session).toEqual({
      user_id: 1014,
      username: 'rludwick',
      email: '',
      roles: [],
      token: 'token',
    });

    saveSession(success!.session);
    expect(loadSession()).toEqual(success?.session);
  });

  it('still goes to /home when roles are not an array', () => {
    const success = sessionFromLoginResult({
      ok: true,
      user_id: 1012,
      username: 'dbushe',
      email: null,
      roles: null,
      token: null,
    });

    expect(success?.homePath).toBe('/home');
    expect(success?.session.roles).toEqual([]);
    expect(success?.session.email).toBe('');
  });
});
