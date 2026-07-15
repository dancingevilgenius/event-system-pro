import { loadSession, type AppRole } from '../lib/session';
import { parseMerchandiseJson, type MerchandiseJson } from '../lib/merchandise';
import {
  NOT_APPLICABLE_INT,
  COUNTRIES_LIST_CODE,
  SECRET_QUESTIONS_LIST_CODE,
  US_STATES_LIST_CODE,
} from '../lib/staticList';
import { secretQuestionsFromStaticListEntries } from '../utils/secretQuestions';

const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL ?? (import.meta.env.DEV ? '/api' : 'http://localhost:3000');

type RpcErrorBody = {
  message?: string;
  hint?: string;
  details?: string;
};

type RequestAuthMode = 'include' | 'omit';

function buildAuthHeaders(
  extra?: Record<string, string>,
  auth: RequestAuthMode = 'include',
): Record<string, string> {
  const headers: Record<string, string> = { ...extra };

  if (auth === 'include') {
    const token = loadSession()?.token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

async function callRpc<TResponse>(
  functionName: string,
  body: Record<string, unknown>,
  auth: RequestAuthMode = 'include',
): Promise<TResponse> {
  const response = await fetch(`${POSTGREST_URL}/rpc/${functionName}`, {
    method: 'POST',
    headers: buildAuthHeaders(
      {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      auth,
    ),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errorBody = (await response.json()) as RpcErrorBody;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as TResponse;
}

export type ForgotPasswordRequestResult = {
  ok: boolean;
  message: string;
  email?: string;
  dev_verification_code?: string;
};

export type ForgotPasswordSimpleResult = {
  ok: boolean;
  message: string;
};

export type ForgotPasswordRecoveryOptionsResult = {
  ok: boolean;
  found: boolean;
  has_secret_questions: boolean;
  email?: string;
};

export type SecretQuestionPrompt = {
  secret_question_id: number;
  question: string;
};

export type ForgotPasswordSecretQuestionsStartResult = {
  ok: boolean;
  message: string;
  email?: string;
  questions?: SecretQuestionPrompt[];
};

export type ForgotPasswordSecretQuestionsVerifyResult = {
  ok: boolean;
  message: string;
  correct_count?: number;
  incorrect_count?: number;
  correct_question_ids?: number[];
  incorrect_question_ids?: number[];
};

export type LoginResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
  email?: string;
  roles?: AppRole[];
  token?: string | null;
};

export type LogoutResult = {
  ok: boolean;
  message: string;
};

export type SessionStatusResult = {
  ok: boolean;
  active: boolean;
  message?: string;
  'last-activity'?: string;
  activity_expires_at?: string;
};

export type TouchActivityResult = {
  ok: boolean;
  active: boolean;
  message?: string;
  'last-activity'?: string;
};

export type SecretQuestion = {
  secret_question_id: number;
  question: string;
  created_date: string;
};

export type UsState = {
  code: string;
  name: string;
};

export type PasswordRecoveryJson = {
  method: 'secret_questions';
  questions: Array<{
    secret_question_id: number;
    answer_hash: string;
  }>;
};

export type HashPasswordRecoveryResult = {
  ok: boolean;
  message: string;
  password_recovery_json?: PasswordRecoveryJson;
};

export type RegisterUserResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
  email?: string;
};

export type ApiUserRecord = {
  user_id: number;
  username: string;
  email?: string | null;
  phone_numbers_json?: unknown;
  name_json: {
    first?: string | null;
    last?: string | null;
    display?: string | null;
  } | null;
  addresses_json:
    | Array<{
        city?: string | null;
        state_or_province?: string | null;
      }>
    | {
        city?: string | null;
        state_or_province?: string | null;
      }
    | null;
  additional_info_json: Record<string, unknown> | null;
};

export type UserListRow = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  /** E.164 phone for edit forms, or empty when none. */
  phone: string;
  /** Raw `phone_numbers_json` for unchanged pass-through on edit save. */
  phoneNumbersJson: unknown[];
  /** From `additional_info_json.demo` — demo users skip libphonenumber validation. */
  isDemo: boolean;
  city: string;
  state: string;
  primaryRole: string;
};

export type UserFilters = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  primaryRole: null | 'leader' | 'follower';
};

/** Advanced filters used by the Search Users dialog (AND combined with quick search). */
export type UserAdvancedSearchFilters = {
  username: string;
  state: string;
  country: string;
  isDemo: boolean | null;
  primaryRole: null | 'leader' | 'follower';
};

export type UserSortColumn = 'firstName' | 'lastName' | 'city' | 'state' | 'primaryRole';

export type UserSort = {
  column: UserSortColumn;
  direction: 'asc' | 'desc';
};

export type FetchUsersPageResult = {
  users: UserListRow[];
  total: number;
};

export const EMPTY_ADVANCED_USER_FILTERS: UserAdvancedSearchFilters = {
  username: '',
  state: '',
  country: '',
  isDemo: null,
  primaryRole: null,
};

const SORT_COLUMN_TO_POSTGREST: Record<UserSortColumn, string> = {
  firstName: 'name_json->>first',
  lastName: 'name_json->>last',
  city: 'addresses_json->0->>city',
  state: 'addresses_json->0->>state_or_province',
  primaryRole: 'additional_info_json->>primary-role',
};

const PHONE_NUMBER_COLUMN = 'phone_numbers_json->0->>number';

function escapePostgrestFilterValue(value: string): string {
  return value.replace(/[*(),.\\]/g, (character) => `\\${character}`);
}

function appendIlikeFilter(params: URLSearchParams, column: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }

  params.append(column, `ilike.*${escapePostgrestFilterValue(trimmed)}*`);
}

function appendEqFilter(params: URLSearchParams, column: string, value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    return;
  }

  params.append(column, `eq.${trimmed}`);
}

/** No letters, at least one digit — treated as a phone-number quick search. */
export function isPhoneOnlyQuickSearch(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && !/[A-Za-z]/.test(trimmed) && /\d/.test(trimmed);
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function appendQuickSearchFilters(params: URLSearchParams, quickSearch: string) {
  const trimmed = quickSearch.trim();
  if (!trimmed) {
    return;
  }

  if (trimmed.includes('@')) {
    appendIlikeFilter(params, 'email', trimmed);
    return;
  }

  if (isPhoneOnlyQuickSearch(trimmed)) {
    const digits = digitsOnly(trimmed);
    if (digits) {
      appendIlikeFilter(params, PHONE_NUMBER_COLUMN, digits);
    } else {
      // Numbers/punctuation that yield no digits: match nothing.
      params.append('user_id', 'eq.-1');
    }
    return;
  }

  const escaped = escapePostgrestFilterValue(trimmed);
  const phoneDigits = digitsOnly(trimmed);
  const phoneClause = phoneDigits
    ? `,${PHONE_NUMBER_COLUMN}.ilike.*${escapePostgrestFilterValue(phoneDigits)}*`
    : `,${PHONE_NUMBER_COLUMN}.ilike.*${escaped}*`;

  params.append(
    'or',
    `(name_json->>first.ilike.*${escaped}*,name_json->>last.ilike.*${escaped}*,email.ilike.*${escaped}*${phoneClause})`,
  );
}

function appendAdvancedSearchFilters(
  params: URLSearchParams,
  advanced: UserAdvancedSearchFilters,
) {
  appendIlikeFilter(params, 'username', advanced.username);
  appendEqFilter(params, 'addresses_json->0->>state_or_province', advanced.state);
  appendEqFilter(params, 'addresses_json->0->>country_code', advanced.country);

  if (advanced.primaryRole !== null) {
    appendEqFilter(params, 'additional_info_json->>primary-role', advanced.primaryRole);
  }

  if (advanced.isDemo === true) {
    appendEqFilter(params, 'additional_info_json->>demo', 'true');
  } else if (advanced.isDemo === false) {
    // Exclude demo=true without a second top-level `or` (conflicts with quick search).
    params.append('not.and', '(additional_info_json->>demo.eq.true)');
  }
}

export type FetchUsersPageOptions = {
  /**
   * Search-as-you-type query:
   * - contains `@` → email only
   * - digits/phone punctuation only → phone only
   * - otherwise → first name, last name, email, or phone
   */
  quickSearch?: string;
  /** @deprecated Prefer `quickSearch`. */
  nameSearch?: string;
  advancedFilters?: UserAdvancedSearchFilters;
};

function buildUserQueryParams(
  offset: number,
  limit: number,
  filters: UserFilters,
  sort: UserSort,
  options: FetchUsersPageOptions = {},
): URLSearchParams {
  const params = new URLSearchParams({
    select: 'user_id,username,email,phone_numbers_json,name_json,addresses_json,additional_info_json',
    limit: String(limit),
    offset: String(offset),
  });

  const quickSearch = (options.quickSearch ?? options.nameSearch ?? '').trim();
  if (quickSearch) {
    appendQuickSearchFilters(params, quickSearch);
  } else {
    appendIlikeFilter(params, 'name_json->>first', filters.firstName);
    appendIlikeFilter(params, 'name_json->>last', filters.lastName);
  }

  appendIlikeFilter(params, 'addresses_json->0->>city', filters.city);
  appendEqFilter(params, 'addresses_json->0->>state_or_province', filters.state);
  if (filters.primaryRole !== null) {
    appendEqFilter(params, 'additional_info_json->>primary-role', filters.primaryRole);
  }

  if (options.advancedFilters) {
    appendAdvancedSearchFilters(params, options.advancedFilters);
  }

  const sortColumn = SORT_COLUMN_TO_POSTGREST[sort.column];
  const nulls = sort.direction === 'asc' ? 'nullslast' : 'nullsfirst';
  params.set('order', `${sortColumn}.${sort.direction}.${nulls},user_id.asc`);

  return params;
}

function parseContentRangeTotal(contentRange: string | null): number | null {
  if (!contentRange) {
    return null;
  }

  const match = contentRange.match(/\/(\d+|\*)$/);
  if (!match || match[1] === '*') {
    return null;
  }

  return Number.parseInt(match[1], 10);
}

function primaryAddress(
  addressesJson: ApiUserRecord['addresses_json'],
): { city?: string | null; state_or_province?: string | null } | null {
  if (Array.isArray(addressesJson)) {
    return addressesJson[0] ?? null;
  }

  if (addressesJson && typeof addressesJson === 'object') {
    return addressesJson;
  }

  return null;
}

function primaryPhoneE164(phoneNumbersJson: unknown): string {
  if (!Array.isArray(phoneNumbersJson) || phoneNumbersJson.length === 0) {
    return '';
  }

  const entries = phoneNumbersJson.filter(
    (entry): entry is {
      number?: string | null;
      country_code?: string | null;
      primary?: boolean;
    } => Boolean(entry) && typeof entry === 'object',
  );
  const selected =
    entries.find((entry) => entry.primary) ??
    entries.find((entry) => entry.number?.trim()) ??
    entries[0];

  const number = selected?.number?.replace(/\D/g, '') ?? '';
  if (!number) {
    return '';
  }

  const countryCode = String(selected?.country_code ?? '1').replace(/\D/g, '') || '1';
  return `+${countryCode}${number}`;
}

function mapUserToListRow(user: ApiUserRecord): UserListRow {
  const address = primaryAddress(user.addresses_json);
  const additionalInfo = user.additional_info_json ?? {};
  const primaryRole = additionalInfo['primary-role'];
  const phoneNumbersJson = Array.isArray(user.phone_numbers_json)
    ? user.phone_numbers_json
    : [];
  const demoFlag = additionalInfo.demo;

  return {
    userId: user.user_id,
    username: user.username?.trim() ?? '',
    firstName: user.name_json?.first?.trim() ?? '',
    lastName: user.name_json?.last?.trim() ?? '',
    email: user.email?.trim() ?? '',
    phone: primaryPhoneE164(user.phone_numbers_json ?? null),
    phoneNumbersJson,
    isDemo: demoFlag === true || demoFlag === 'true',
    city: address?.city?.trim() ?? '',
    state: address?.state_or_province?.trim() ?? '',
    primaryRole: typeof primaryRole === 'string' ? primaryRole.trim() : '',
  };
}

export type AdminUpdateUserResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
};

export function adminUpdateUser(params: {
  userId: number;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  phoneNumbersJson?: unknown[];
  newPassword?: string;
}) {
  return callRpc<AdminUpdateUserResult>('admin_update_user', {
    p_user_id: params.userId,
    p_first_name: params.firstName,
    p_last_name: params.lastName,
    p_username: params.username,
    p_email: params.email?.trim() ? params.email.trim() : null,
    p_phone_numbers_json: params.phoneNumbersJson ?? [],
    p_new_password: params.newPassword?.trim() ? params.newPassword : null,
  });
}

export async function fetchUsersPage(
  offset: number,
  limit: number,
  filters: UserFilters = {
    firstName: '',
    lastName: '',
    city: '',
    state: '',
    primaryRole: null,
  },
  sort: UserSort = { column: 'lastName', direction: 'asc' },
  options: FetchUsersPageOptions = {},
): Promise<FetchUsersPageResult> {
  const params = buildUserQueryParams(offset, limit, filters, sort, options);

  const response = await fetch(`${POSTGREST_URL}/user?${params.toString()}`, {
    headers: buildAuthHeaders({
      Prefer: 'count=exact',
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to load users (${response.status})`);
  }

  const records = (await response.json()) as ApiUserRecord[];
  const total = parseContentRangeTotal(response.headers.get('Content-Range')) ?? records.length;

  return {
    users: records.map(mapUserToListRow),
    total,
  };
}

export type DemoBracketCompetitor = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  'display-name': string;
  label: string;
};

export async function fetchDemoBracketCompetitors(): Promise<DemoBracketCompetitor[]> {
  const rows = await callRpc<unknown>('demo_tournament_bracket_competitors', {}, 'omit');

  if (!Array.isArray(rows)) {
    return [];
  }

  return rows
    .filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === 'object')
    .map((row) => {
      const userId = typeof row.user_id === 'number' ? row.user_id : Number(row.user_id);
      const username = typeof row.username === 'string' ? row.username.trim() : '';
      const firstName = typeof row.first_name === 'string' ? row.first_name.trim() : '';
      const lastName = typeof row.last_name === 'string' ? row.last_name.trim() : '';
      const displayName =
        typeof row['display-name'] === 'string' && row['display-name'].trim() !== ''
          ? row['display-name'].trim()
          : [firstName, lastName].filter(Boolean).join(' ') || 'Unnamed user';

      return {
        userId,
        username,
        firstName,
        lastName,
        'display-name': displayName,
        label: displayName,
      };
    })
    .filter((row) => Number.isFinite(row.userId));
}

export async function fetchUsStateCodes(): Promise<string[]> {
  const states = await fetchUsStates();
  return states.map((state) => state.code);
}

export async function fetchUsStatesStaticList(): Promise<StaticListEntry[]> {
  return fetchSortedStaticListEntries(US_STATES_LIST_CODE, 'states');
}

export async function fetchUsStates(): Promise<UsState[]> {
  const entries = await fetchUsStatesStaticList();
  return entries.map((entry) => ({ code: entry.key, name: entry.label }));
}

export async function fetchCountries(): Promise<StaticListEntry[]> {
  return fetchSortedStaticListEntries(COUNTRIES_LIST_CODE, 'countries');
}

export async function fetchSecretQuestions(): Promise<SecretQuestion[]> {
  const list = await fetchStaticListByCode(SECRET_QUESTIONS_LIST_CODE, 'omit');
  if (!list) {
    throw new Error('Unable to load secret questions (SECRET_QUESTIONS list not found)');
  }

  return secretQuestionsFromStaticListEntries(list.listJson);
}

export type DeploymentInfo = {
  deployedAt: string | null;
  deploySource: string | null;
};

type ApiDeploymentInfo = {
  deployed_at?: string;
  deploy_source?: string;
};

function parseDeploymentInfo(value: unknown): DeploymentInfo | null {
  if (value == null) {
    return null;
  }

  let parsed: ApiDeploymentInfo;

  if (typeof value === 'string') {
    if (!value.trim()) {
      return null;
    }

    try {
      parsed = JSON.parse(value) as ApiDeploymentInfo;
    } catch {
      return null;
    }
  } else if (typeof value === 'object') {
    parsed = value as ApiDeploymentInfo;
  } else {
    return null;
  }

  return {
    deployedAt: typeof parsed.deployed_at === 'string' ? parsed.deployed_at : null,
    deploySource: typeof parsed.deploy_source === 'string' ? parsed.deploy_source : null,
  };
}

export async function fetchDeploymentInfo(): Promise<DeploymentInfo | null> {
  const params = new URLSearchParams({
    select: 'value',
    label: 'eq.deployment_info',
  });

  const rows = await fetchJson<Array<{ value: unknown }>>(
    `${POSTGREST_URL}/system_config?${params.toString()}`,
    'Unable to load deployment info',
  );

  return parseDeploymentInfo(rows[0]?.value);
}

export function login(identifier: string, password: string) {
  return callRpc<LoginResult>(
    'login',
    {
      p_identifier: identifier,
      p_password: password,
    },
    'omit',
  );
}

export function logout() {
  return callRpc<LogoutResult>('logout', {});
}

export function touchLastActivity() {
  return callRpc<TouchActivityResult>('touch_last_activity', {});
}

export type StartRobotRiotAttendeeChurnResult = {
  ok: boolean;
  message?: string;
  duration_minutes?: number;
  until?: string;
  first_run?: {
    ok?: boolean;
    skipped?: boolean;
    reason?: string;
    replaced?: number;
    attendee_count?: number;
    event_name?: string;
  };
};

/** Admin: start timed Robot Riot 2026 attendee rotation (scheduler every 60s until expiry). */
export function startRobotRiotAttendeeChurn(durationMinutes = 10) {
  return callRpc<StartRobotRiotAttendeeChurnResult>('start_robot_riot_attendee_churn', {
    p_duration_minutes: durationMinutes,
  });
}

export function sessionStatus() {
  return callRpc<SessionStatusResult>('session_status', {});
}

export function forgotPasswordRequest(identifier: string) {
  return callRpc<ForgotPasswordRequestResult>(
    'forgot_password_request',
    { identifier },
    'omit',
  );
}

export function forgotPasswordVerify(email: string, code: string) {
  return callRpc<ForgotPasswordSimpleResult>(
    'forgot_password_verify',
    {
      p_email: email,
      p_code: normalizeVerificationCode(code),
    },
    'omit',
  );
}

export function forgotPasswordComplete(
  email: string,
  code: string,
  newPassword: string,
) {
  return callRpc<ForgotPasswordSimpleResult>(
    'forgot_password_complete',
    {
      p_email: email,
      p_code: normalizeVerificationCode(code),
      p_new_password: newPassword,
    },
    'omit',
  );
}

export function forgotPasswordRecoveryOptions(identifier: string) {
  return callRpc<ForgotPasswordRecoveryOptionsResult>(
    'forgot_password_recovery_options',
    { p_identifier: identifier },
    'omit',
  );
}

export function forgotPasswordSecretQuestionsStart(identifier: string) {
  return callRpc<ForgotPasswordSecretQuestionsStartResult>(
    'forgot_password_secret_questions_start',
    { p_identifier: identifier },
    'omit',
  );
}

export function forgotPasswordSecretQuestionsVerify(
  identifier: string,
  answers: Array<{ secret_question_id: number; answer: string }>,
) {
  return callRpc<ForgotPasswordSecretQuestionsVerifyResult>(
    'forgot_password_secret_questions_verify',
    {
      p_identifier: identifier,
      p_answers: answers,
    },
    'omit',
  );
}

export function forgotPasswordSecretQuestionsComplete(
  identifier: string,
  answers: Array<{ secret_question_id: number; answer: string }>,
  newPassword: string,
) {
  return callRpc<ForgotPasswordSimpleResult>(
    'forgot_password_secret_questions_complete',
    {
      p_identifier: identifier,
      p_answers: answers,
      p_new_password: newPassword,
    },
    'omit',
  );
}

function normalizeVerificationCode(code: string): string {
  const digits = code.replace(/\D/g, '');
  if (digits.length === 0 || digits.length > 6) {
    return digits;
  }

  return digits.padStart(6, '0');
}

export function changePassword(
  userId: number,
  oldPassword: string,
  newPassword: string,
) {
  return callRpc<ForgotPasswordSimpleResult>('change_password', {
    p_user_id: userId,
    p_old_password: oldPassword,
    p_new_password: newPassword,
  });
}

export type EventGroupDirector = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};

export type EventGroupListRow = {
  eventGroupCode: string;
  fullName: string;
  directors: EventGroupDirector[];
};

type ApiEventGroupDirector = {
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
};

type ApiEventGroupRecord = {
  event_group_code: string;
  full_name: string;
  directors_json?: ApiEventGroupDirector[] | null;
};

function parseEventGroupDirectors(value: unknown): EventGroupDirector[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is ApiEventGroupDirector => Boolean(entry) && typeof entry === 'object')
    .map((entry) => ({
      username: typeof entry.username === 'string' ? entry.username.trim() : '',
      firstname: typeof entry.firstname === 'string' ? entry.firstname.trim() : '',
      lastname: typeof entry.lastname === 'string' ? entry.lastname.trim() : '',
      email: typeof entry.email === 'string' ? entry.email.trim() : '',
    }))
    .filter((entry) => entry.username !== '');
}

type ApiEventWithAttendees = {
  event_id: number;
  event_group_code: string | null;
  attendee: Array<{ attendee_id: number }>;
};

function mapEventGroupRow(row: ApiEventGroupRecord): EventGroupListRow {
  return {
    eventGroupCode: row.event_group_code,
    fullName: row.full_name,
    directors: parseEventGroupDirectors(row.directors_json),
  };
}

async function fetchJson<T>(
  url: string,
  errorMessage: string,
  auth: RequestAuthMode = 'include',
): Promise<T> {
  const response = await fetch(url, {
    headers: buildAuthHeaders(undefined, auth),
  });

  if (!response.ok) {
    throw new Error(`${errorMessage} (${response.status})`);
  }

  return (await response.json()) as T;
}

/** Demo event groups that have at least one event with attendee rows. */
export async function fetchDemoEventGroupsWithAttendees(): Promise<EventGroupListRow[]> {
  const events = await fetchJson<ApiEventWithAttendees[]>(
    `${POSTGREST_URL}/event?select=event_id,event_group_code,attendee!inner(attendee_id)`,
    'Unable to load events with attendees',
  );

  const eventGroupCodes = [
    ...new Set(
      events
        .map((row) => row.event_group_code?.trim() ?? '')
        .filter((code) => code !== ''),
    ),
  ];
  if (eventGroupCodes.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    select: 'event_group_code,full_name,directors_json',
    order: 'full_name',
  });
  params.append('event_group_code', `in.(${eventGroupCodes.join(',')})`);
  params.append('more_json->>demo', 'eq.true');

  const eventGroups = await fetchJson<ApiEventGroupRecord[]>(
    `${POSTGREST_URL}/event_group?${params.toString()}`,
    'Unable to load event groups',
  );

  return eventGroups.map(mapEventGroupRow);
}

export type DirectorSearchUser = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
};

type ApiUserSearchRecord = {
  username: string;
  name_json: ApiUserRecord['name_json'];
  email: string | null;
};

function mapUserToDirectorSearch(row: ApiUserSearchRecord): DirectorSearchUser {
  return {
    username: row.username?.trim() ?? '',
    firstname: row.name_json?.first?.trim() ?? '',
    lastname: row.name_json?.last?.trim() ?? '',
    email: row.email?.trim() ?? '',
  };
}

/** Search users by first name, last name, or email (admin user listing). */
export async function searchUsersByNameOrEmail(
  query: string,
  limit = 25,
): Promise<DirectorSearchUser[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const escaped = escapePostgrestFilterValue(trimmed);
  const params = new URLSearchParams({
    select: 'username,name_json,email',
    limit: String(limit),
    order: 'name_json->>last.asc,name_json->>first.asc',
  });
  params.append(
    'or',
    `(name_json->>first.ilike.*${escaped}*,name_json->>last.ilike.*${escaped}*,email.ilike.*${escaped}*)`,
  );

  const records = await fetchJson<ApiUserSearchRecord[]>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to search users',
  );

  return records.map(mapUserToDirectorSearch).filter((user) => user.username !== '');
}

export async function updateEventGroupDirectors(
  eventGroupCode: string,
  directors: EventGroupDirector[],
): Promise<EventGroupListRow> {
  const params = new URLSearchParams();
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const response = await fetch(`${POSTGREST_URL}/event_group?${params.toString()}`, {
    method: 'PATCH',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      directors_json: directors.map((director) => ({
        username: director.username,
        firstname: director.firstname,
        lastname: director.lastname,
        email: director.email,
      })),
    }),
  });

  if (!response.ok) {
    let message = `Unable to update event group directors (${response.status})`;
    try {
      const errorBody = (await response.json()) as RpcErrorBody;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new Error(message);
  }

  const rows = (await response.json()) as ApiEventGroupRecord[];
  const row = rows[0];
  if (!row) {
    throw new Error('Event group directors update returned no rows.');
  }

  return mapEventGroupRow(row);
}

/** All event groups ordered by full name. */
export async function fetchEventGroups(): Promise<EventGroupListRow[]> {
  const params = new URLSearchParams({
    select: 'event_group_code,full_name,directors_json',
    order: 'full_name',
  });

  const eventGroups = await fetchJson<ApiEventGroupRecord[]>(
    `${POSTGREST_URL}/event_group?${params.toString()}`,
    'Unable to load event groups',
  );

  return eventGroups.map(mapEventGroupRow);
}

export type CreateEventGroupInput = {
  eventGroupCode: string;
  fullName: string;
  shortName: string;
};

export async function createEventGroup(input: CreateEventGroupInput): Promise<EventGroupListRow> {
  const response = await fetch(`${POSTGREST_URL}/event_group`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: input.eventGroupCode.trim(),
      full_name: input.fullName.trim(),
      short_name: input.shortName.trim(),
      more_json: { demo: false },
    }),
  });

  if (!response.ok) {
    let message = `Unable to create event group (${response.status})`;
    try {
      const errorBody = (await response.json()) as RpcErrorBody;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new Error(message);
  }

  const rows = (await response.json()) as ApiEventGroupRecord[];
  const row = rows[0];
  if (!row) {
    throw new Error('Event group create returned no rows.');
  }

  return mapEventGroupRow(row);
}

export type EventListRow = {
  eventId: number;
  eventCode: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
};

export type EventGroupDetail = {
  eventGroupCode: string;
  fullName: string;
};

export type EventAttendeeListRow = {
  attendeeId: number;
  userId: number | null;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  wsdcId: string;
};

type ApiEventRecord = {
  event_id: number;
  event_code: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  event_group_code: string | null;
};

function mapEventListRow(row: ApiEventRecord): EventListRow {
  return {
    eventId: row.event_id,
    eventCode: row.event_code,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

export async function fetchEventGroupByCode(
  eventGroupCode: string,
): Promise<EventGroupDetail | null> {
  const params = new URLSearchParams({
    select: 'event_group_code,full_name',
  });
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const rows = await fetchJson<ApiEventGroupRecord[]>(
    `${POSTGREST_URL}/event_group?${params.toString()}`,
    'Unable to load event group',
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    eventGroupCode: row.event_group_code,
    fullName: row.full_name,
  };
}

export async function fetchEventsForEventGroup(eventGroupCode: string): Promise<EventListRow[]> {
  const params = new URLSearchParams({
    select: 'event_id,event_code,name,start_date,end_date',
    order: 'start_date',
  });
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const rows = await fetchJson<ApiEventRecord[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load events',
  );

  return rows.map(mapEventListRow);
}

export async function fetchEventById(
  eventId: number,
): Promise<(EventListRow & { eventGroupCode: string | null }) | null> {
  const params = new URLSearchParams({
    select: 'event_id,event_code,name,start_date,end_date,event_group_code',
  });
  params.append('event_id', `eq.${eventId}`);

  const rows = await fetchJson<ApiEventRecord[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load event',
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    ...mapEventListRow(row),
    eventGroupCode: row.event_group_code,
  };
}

type ApiAttendeeWithUser = {
  attendee_id: number;
  user: {
    user_id: number;
    name_json: ApiUserRecord['name_json'];
    email: string | null;
    phone_numbers_json: unknown;
    additional_info_json: Record<string, unknown> | null;
  } | null;
};

function wsdcIdFromAdditionalInfo(info: Record<string, unknown> | null | undefined): string {
  const grouped =
    info?.wsdc && typeof info.wsdc === 'object' && !Array.isArray(info.wsdc)
      ? (info.wsdc as Record<string, unknown>)
      : null;
  const raw = grouped?.wsdc_id ?? grouped?.dancer_wsdcid ?? info?.wsdc_id;
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return String(raw);
  }
  if (typeof raw === 'string' && raw.trim()) {
    return raw.replace(/\D/g, '');
  }
  return '';
}

type PhoneNumberJson = {
  number?: string | null;
  primary?: boolean;
};

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return value.trim();
}

function primaryPhone(phoneNumbersJson: unknown): string {
  if (!Array.isArray(phoneNumbersJson) || phoneNumbersJson.length === 0) {
    return '';
  }

  const entries = phoneNumbersJson.filter(
    (entry): entry is PhoneNumberJson => Boolean(entry) && typeof entry === 'object',
  );
  const selected =
    entries.find((entry) => entry.primary) ??
    entries.find((entry) => entry.number?.trim()) ??
    entries[0];

  if (!selected?.number) {
    return '';
  }

  return formatPhoneNumber(selected.number);
}

function mapAttendeeToListRow(row: ApiAttendeeWithUser): EventAttendeeListRow {
  return {
    attendeeId: row.attendee_id,
    userId: row.user?.user_id ?? null,
    firstName: row.user?.name_json?.first?.trim() ?? '',
    lastName: row.user?.name_json?.last?.trim() ?? '',
    phone: primaryPhone(row.user?.phone_numbers_json ?? null),
    email: row.user?.email?.trim() ?? '',
    wsdcId: wsdcIdFromAdditionalInfo(row.user?.additional_info_json),
  };
}

export async function fetchEventAttendeesPage(
  eventId: number,
  offset: number,
  limit: number,
): Promise<{ attendees: EventAttendeeListRow[]; total: number }> {
  const params = new URLSearchParams({
    select: 'attendee_id,user(user_id,name_json,email,phone_numbers_json,additional_info_json)',
    order: 'attendee_id',
    offset: String(offset),
    limit: String(limit),
  });
  params.append('event_id', `eq.${eventId}`);

  const response = await fetch(`${POSTGREST_URL}/attendee?${params.toString()}`, {
    headers: buildAuthHeaders({
      Prefer: 'count=exact',
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to load attendees (${response.status})`);
  }

  const records = (await response.json()) as ApiAttendeeWithUser[];
  const total = parseContentRangeTotal(response.headers.get('Content-Range')) ?? records.length;

  return {
    attendees: records.map(mapAttendeeToListRow),
    total,
  };
}

/** Loads all attendees for an event (demo events cap at 200 rows per event). */
export async function fetchEventAttendeesForEvent(
  eventId: number,
): Promise<EventAttendeeListRow[]> {
  const result = await fetchEventAttendeesPage(eventId, 0, 1000);
  return result.attendees;
}

export type GenerateDemoAttendeesResult = {
  ok: boolean;
  message: string;
  inserted?: number;
  events?: number;
  preserved_above_reserve?: number;
  preserved_above_3000?: number;
  event_groups?: string[];
};

export function generateDemoAttendees() {
  return callRpc<GenerateDemoAttendeesResult>('generate_demo_attendees', {});
}

export type DemoEventActiveWindowEvent = {
  event_id: number;
  event_group_code: string;
  name: string;
  start_date: string;
  end_date: string;
};

export type RunDemoEventActiveWindowResult = {
  ok: boolean;
  message?: string;
  current_year?: number;
  window_start?: string;
  window_end?: string;
  events_updated?: number;
  events?: DemoEventActiveWindowEvent[];
};

/** Admin: set Hollowfen Blade Congress and Jitterbug Jamboree (current year) in-progress dates. */
export function runDemoEventActiveWindow() {
  return callRpc<RunDemoEventActiveWindowResult>('run_demo_event_active_window', {});
}

export type WsdcRefreshTarget = {
  user_id: number;
  username?: string;
  wsdc_id: string;
};

export type PrepareWsdcAttendeeRefreshResult = {
  ok: boolean;
  message?: string;
  events_count?: number;
  attendees_added?: number;
  target_count?: number;
  seed_user_id?: number;
  seed_username?: string;
  targets?: WsdcRefreshTarget[];
};

/** Admin: ensure seed attendee rows and list users with WSDC # to refresh. */
export function prepareWsdcAttendeeRefresh() {
  return callRpc<PrepareWsdcAttendeeRefreshResult>('prepare_wsdc_attendee_refresh', {});
}

export type StaticListEntry = {
  key: string;
  label: string;
  minAge?: number;
  maxAge?: number;
  description?: string;
  majorGroup?: string;
  minorGroup?: string;
  minPersonsPerEntry?: number;
  maxPersonsPerEntry?: number;
};

export type StaticListListRow = {
  listCode: string;
  governingBodyCode: string;
  shortDesc: string;
};

export type StaticListRecord = StaticListListRow & {
  listJson: StaticListEntry[];
};

type ApiStaticListRecord = {
  list_code: string;
  governing_body_code: string;
  short_desc: string | null;
  list_json: unknown;
};

function parseStaticListAge(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed.toUpperCase() === 'N/A') {
      return NOT_APPLICABLE_INT;
    }

    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return NOT_APPLICABLE_INT;
}

function parseStaticListJson(value: unknown): StaticListEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item) => {
      const entry: StaticListEntry = {
        key: typeof item.key === 'string' ? item.key.trim() : String(item.key ?? '').trim(),
        label:
          typeof item.label === 'string' ? item.label.trim() : String(item.label ?? '').trim(),
      };

      if (Object.prototype.hasOwnProperty.call(item, 'min-age')) {
        entry.minAge = parseStaticListAge(item['min-age']);
      }

      if (Object.prototype.hasOwnProperty.call(item, 'max-age')) {
        entry.maxAge = parseStaticListAge(item['max-age']);
      }

      if (Object.prototype.hasOwnProperty.call(item, 'description')) {
        entry.description =
          typeof item.description === 'string'
            ? item.description.trim()
            : String(item.description ?? '').trim();
      }

      if (Object.prototype.hasOwnProperty.call(item, 'major-group')) {
        entry.majorGroup =
          typeof item['major-group'] === 'string'
            ? item['major-group'].trim()
            : String(item['major-group'] ?? '').trim();
      }

      if (Object.prototype.hasOwnProperty.call(item, 'minor-group')) {
        entry.minorGroup =
          typeof item['minor-group'] === 'string'
            ? item['minor-group'].trim()
            : String(item['minor-group'] ?? '').trim();
      }

      if (Object.prototype.hasOwnProperty.call(item, 'min-persons-per-entry')) {
        entry.minPersonsPerEntry = parseStaticListAge(item['min-persons-per-entry']);
      }

      if (Object.prototype.hasOwnProperty.call(item, 'max-persons-per-entry')) {
        entry.maxPersonsPerEntry = parseStaticListAge(item['max-persons-per-entry']);
      }

      return entry;
    })
    .filter((item) => item.key !== '');
}

function serializeStaticListEntry(entry: StaticListEntry): Record<string, string | number> {
  const serialized: Record<string, string | number> = {
    key: entry.key,
    label: entry.label,
  };

  if (entry.minAge !== undefined) {
    serialized['min-age'] = entry.minAge;
  }

  if (entry.maxAge !== undefined) {
    serialized['max-age'] = entry.maxAge;
  }

  if (entry.description !== undefined) {
    serialized.description = entry.description;
  }

  if (entry.majorGroup !== undefined) {
    serialized['major-group'] = entry.majorGroup;
  }

  if (entry.minorGroup !== undefined) {
    serialized['minor-group'] = entry.minorGroup;
  }

  if (entry.minPersonsPerEntry !== undefined) {
    serialized['min-persons-per-entry'] = entry.minPersonsPerEntry;
  }

  if (entry.maxPersonsPerEntry !== undefined) {
    serialized['max-persons-per-entry'] = entry.maxPersonsPerEntry;
  }

  return serialized;
}

function mapStaticListRecord(row: ApiStaticListRecord): StaticListRecord {
  return {
    listCode: row.list_code,
    governingBodyCode: row.governing_body_code,
    shortDesc: row.short_desc?.trim() ?? '',
    listJson: parseStaticListJson(row.list_json),
  };
}

export async function fetchStaticLists(): Promise<StaticListListRow[]> {
  const rows = await fetchJson<ApiStaticListRecord[]>(
    `${POSTGREST_URL}/static_list?select=list_code,governing_body_code,short_desc&order=list_code`,
    'Unable to load static lists',
  );

  return rows.map((row) => ({
    listCode: row.list_code,
    governingBodyCode: row.governing_body_code,
    shortDesc: row.short_desc?.trim() ?? '',
  }));
}

export async function fetchStaticListByCode(
  listCode: string,
  auth: RequestAuthMode = 'include',
): Promise<StaticListRecord | null> {
  const params = new URLSearchParams({
    select: 'list_code,governing_body_code,short_desc,list_json',
  });
  params.append('list_code', `eq.${listCode}`);

  const response = await fetch(`${POSTGREST_URL}/static_list?${params.toString()}`, {
    headers: buildAuthHeaders(undefined, auth),
  });

  if (!response.ok) {
    throw new Error(`Unable to load static list (${response.status})`);
  }

  const rows = (await response.json()) as ApiStaticListRecord[];
  const row = rows[0];
  if (!row) {
    return null;
  }

  return mapStaticListRecord(row);
}

export async function fetchSortedStaticListEntries(
  listCode: string,
  resourceLabel: string,
): Promise<StaticListEntry[]> {
  const list = await fetchStaticListByCode(listCode);
  if (!list) {
    throw new Error(`Unable to load ${resourceLabel} (${listCode} list not found)`);
  }

  return [...list.listJson].sort((a, b) => a.label.localeCompare(b.label));
}

export async function updateStaticListJson(
  listCode: string,
  listJson: StaticListEntry[],
): Promise<StaticListRecord> {
  const params = new URLSearchParams();
  params.append('list_code', `eq.${listCode}`);

  const response = await fetch(`${POSTGREST_URL}/static_list?${params.toString()}`, {
    method: 'PATCH',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      list_json: listJson.map(serializeStaticListEntry),
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to update static list (${response.status})`);
  }

  const rows = (await response.json()) as ApiStaticListRecord[];
  const row = rows[0];
  if (!row) {
    throw new Error('Static list update returned no rows.');
  }

  return mapStaticListRecord(row);
}

export type GoverningBodyRow = {
  code: string;
  longName: string;
  shortName: string;
  moreJson: Record<string, string>;
};

type ApiGoverningBodyRow = {
  governing_body_code: string;
  long_name: string;
  short_name: string | null;
  more_json: unknown;
};

export function parseGoverningBodyMoreJson(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => key.trim() !== '')
      .map(([key, entryValue]) => [key, entryValue == null ? '' : String(entryValue)]),
  );
}

function mapGoverningBodyRow(row: ApiGoverningBodyRow): GoverningBodyRow {
  return {
    code: row.governing_body_code,
    longName: row.long_name,
    shortName: row.short_name?.trim() ?? '',
    moreJson: parseGoverningBodyMoreJson(row.more_json),
  };
}

export async function fetchGoverningBodies(): Promise<GoverningBodyRow[]> {
  const rows = await fetchJson<ApiGoverningBodyRow[]>(
    `${POSTGREST_URL}/governing_body?select=governing_body_code,long_name,short_name,more_json&order=governing_body_code`,
    'Unable to load governing bodies',
  );

  return rows.map(mapGoverningBodyRow);
}

export async function updateGoverningBodyMoreJson(
  code: string,
  moreJson: Record<string, string>,
): Promise<GoverningBodyRow> {
  const params = new URLSearchParams();
  params.append('governing_body_code', `eq.${code}`);

  const serialized =
    Object.keys(moreJson).length === 0
      ? null
      : Object.fromEntries(
          Object.entries(moreJson).map(([key, value]) => [key, value]),
        );

  const response = await fetch(`${POSTGREST_URL}/governing_body?${params.toString()}`, {
    method: 'PATCH',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      more_json: serialized,
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to update governing body (${response.status})`);
  }

  const rows = (await response.json()) as ApiGoverningBodyRow[];
  const row = rows[0];
  if (!row) {
    throw new Error('Governing body update returned no rows.');
  }

  return mapGoverningBodyRow(row);
}

export type AuditLogRow = {
  auditId: number;
  occurredAt: string;
  action: string;
  actorUserId: number | null;
  actorUsername: string;
  actorFirstName: string;
  actorLastName: string;
  tableName: string;
  recordKey: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

export type AuditLogFilters = {
  fromDateTime: string;
  toDateTime: string;
  tableName: string;
  actorSearch: string;
  action: string;
};

export const EMPTY_AUDIT_LOG_FILTERS: AuditLogFilters = {
  fromDateTime: '',
  toDateTime: '',
  tableName: '',
  actorSearch: '',
  action: '',
};

export type AuditLogFilterOptions = {
  tables: string[];
  actions: string[];
};

type ApiAuditLogRow = {
  audit_id: number;
  occurred_at: string;
  action: string;
  actor_user_id: number | null;
  actor_username: string | null;
  actor_first_name: string | null;
  actor_last_name: string | null;
  table_name: string | null;
  record_key: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
};

function mapAuditLogRow(row: ApiAuditLogRow): AuditLogRow {
  return {
    auditId: row.audit_id,
    occurredAt: row.occurred_at,
    action: row.action,
    actorUserId: row.actor_user_id,
    actorUsername: row.actor_username?.trim() ?? '',
    actorFirstName: row.actor_first_name?.trim() ?? '',
    actorLastName: row.actor_last_name?.trim() ?? '',
    tableName: row.table_name?.trim() ?? '',
    recordKey: row.record_key?.trim() ?? '',
    oldData: row.old_data,
    newData: row.new_data,
    metadata: row.metadata,
  };
}

function dateTimeLocalToIso(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function buildAuditLogQueryParams(
  offset: number,
  limit: number,
  filters: AuditLogFilters,
): URLSearchParams {
  const params = new URLSearchParams({
    select:
      'audit_id,occurred_at,action,actor_user_id,actor_username,actor_first_name,actor_last_name,table_name,record_key,old_data,new_data,metadata',
    order: 'occurred_at.desc,audit_id.desc',
    offset: String(offset),
    limit: String(limit),
  });

  const fromIso = dateTimeLocalToIso(filters.fromDateTime);
  if (fromIso) {
    params.append('occurred_at', `gte.${fromIso}`);
  }

  const toIso = dateTimeLocalToIso(filters.toDateTime);
  if (toIso) {
    params.append('occurred_at', `lte.${toIso}`);
  }

  if (filters.tableName.trim()) {
    params.append('table_name', `eq.${filters.tableName.trim()}`);
  }

  if (filters.action.trim()) {
    params.append('action', `eq.${filters.action.trim()}`);
  }

  if (filters.actorSearch.trim()) {
    const escaped = escapePostgrestFilterValue(filters.actorSearch.trim());
    params.append(
      'or',
      `(actor_username.ilike.*${escaped}*,actor_first_name.ilike.*${escaped}*,actor_last_name.ilike.*${escaped}*)`,
    );
  }

  return params;
}

export async function fetchAuditLogPage(
  offset: number,
  limit: number,
  filters: AuditLogFilters = EMPTY_AUDIT_LOG_FILTERS,
): Promise<{ rows: AuditLogRow[]; total: number }> {
  const params = buildAuditLogQueryParams(offset, limit, filters);

  const response = await fetch(`${POSTGREST_URL}/audit_log?${params.toString()}`, {
    headers: buildAuthHeaders({
      Prefer: 'count=exact',
    }),
  });

  if (!response.ok) {
    throw new Error(`Unable to load audit log (${response.status})`);
  }

  const records = (await response.json()) as ApiAuditLogRow[];
  const total = parseContentRangeTotal(response.headers.get('Content-Range')) ?? records.length;

  return {
    rows: records.map(mapAuditLogRow),
    total,
  };
}

export async function fetchAuditLogFilterOptions(): Promise<AuditLogFilterOptions> {
  const result = await callRpc<{ tables?: string[]; actions?: string[] }>(
    'audit_log_filter_options',
    {},
  );

  return {
    tables: Array.isArray(result.tables) ? result.tables : [],
    actions: Array.isArray(result.actions) ? result.actions : [],
  };
}

export type PurgeAuditLogResult = {
  ok: boolean;
  message: string;
  deleted_count?: number;
};

export function purgeAuditLog(confirmationSecret: string) {
  return callRpc<PurgeAuditLogResult>('admin_purge_audit_log', {
    p_confirmation_secret: confirmationSecret,
  });
}

export function hashPasswordRecoveryAnswers(
  answers: Array<{ secret_question_id: number; answer: string }>,
) {
  return callRpc<HashPasswordRecoveryResult>(
    'hash_password_recovery_answers',
    { p_answers: answers },
    'omit',
  );
}

export type PasswordRecoverySetupResult = {
  ok: boolean;
  message?: string;
  has_setup?: boolean;
  secret_question_ids?: number[];
};

export function getPasswordRecoverySetup(userId: number) {
  return callRpc<PasswordRecoverySetupResult>('get_password_recovery_setup', {
    p_user_id: userId,
  });
}

export function updatePasswordRecovery(
  answers: Array<{ secret_question_id: number; answer: string }>,
  userId: number,
) {
  return callRpc<HashPasswordRecoveryResult>(
    'update_password_recovery',
    {
      p_answers: answers,
      p_user_id: userId,
    },
  );
}

export function registerUser(params: {
  username: string;
  email?: string;
  password: string;
  nameJson: Record<string, unknown>;
  phoneNumbersJson: unknown[];
  addressesJson: unknown[];
  passwordRecoveryJson?: PasswordRecoveryJson | null;
  wsdcId?: string | null;
}) {
  return callRpc<RegisterUserResult>(
    'register_user',
    {
      p_username: params.username,
      p_email: params.email?.trim() || null,
      p_password: params.password,
      p_name_json: params.nameJson,
      p_phone_numbers_json: params.phoneNumbersJson,
      p_addresses_json: params.addressesJson,
      p_password_recovery_json: params.passwordRecoveryJson ?? null,
      p_wsdc_id: params.wsdcId?.trim() || null,
    },
    'omit',
  );
}

export type SetUserWsdcIdResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  wsdc_id?: string | null;
  wsdc?: Record<string, unknown> | null;
};

export type SaveWsdcForMatchingUserResult = SetUserWsdcIdResult & {
  username?: string;
  display_name?: string | null;
  match_by?: 'wsdc_id' | 'name' | string;
  match_count?: number;
  match_user_ids?: number[];
};

export type FindUserForWsdcMatchResult = {
  ok: boolean;
  matched: boolean;
  ambiguous?: boolean;
  message?: string;
  match_count?: number;
  match_user_ids?: number[];
  user_id?: number;
  username?: string;
  display_name?: string | null;
  match_by?: 'wsdc_id' | 'name' | string;
  wsdc_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  has_stored_wsdc?: boolean;
  stored_dancer_first?: string | null;
  stored_last_update_datetime?: string | null;
};

export function setUserWsdcId(params: {
  userId?: number | null;
  wsdcId: string | null;
  wsdcInfo?: Record<string, unknown> | null;
}) {
  return callRpc<SetUserWsdcIdResult>('set_user_wsdc_id', {
    p_user_id: params.userId ?? null,
    p_wsdc_id: params.wsdcId,
    p_wsdc_info: params.wsdcInfo ?? null,
  });
}

/** Admin: find ESP user matching WSDC #, else exact first+last name. */
export function findUserForWsdcMatch(params: {
  wsdcId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}) {
  return callRpc<FindUserForWsdcMatchResult>('find_user_for_wsdc_match', {
    p_wsdc_id: params.wsdcId?.trim() || null,
    p_first_name: params.firstName?.trim() || null,
    p_last_name: params.lastName?.trim() || null,
  });
}

/** Admin: save WSDC info to the user matching WSDC #, else exact first+last name. */
export function saveWsdcForMatchingUser(params: {
  wsdcId: string;
  wsdcInfo: Record<string, unknown>;
  firstName?: string;
  lastName?: string;
}) {
  return callRpc<SaveWsdcForMatchingUserResult>('save_wsdc_for_matching_user', {
    p_wsdc_id: params.wsdcId,
    p_wsdc_info: params.wsdcInfo,
    p_first_name: params.firstName ?? null,
    p_last_name: params.lastName ?? null,
  });
}

export async function fetchUserWsdcId(userId: number): Promise<string | null> {
  const params = new URLSearchParams({
    select: 'additional_info_json',
  });
  params.append('user_id', `eq.${userId}`);

  const rows = await fetchJson<Array<{ additional_info_json: Record<string, unknown> | null }>>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to load WSDC ID',
  );

  const id = wsdcIdFromAdditionalInfo(rows[0]?.additional_info_json);
  return id || null;
}

/** Prefer "First Last" from user.name_json; fall back to email when name is empty. */
export function formatCashierDisplayName(params: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string {
  const fullName = [params.firstName?.trim(), params.lastName?.trim()].filter(Boolean).join(' ');
  if (fullName) {
    return fullName;
  }

  return params.email?.trim() ?? '';
}

export async function fetchCashierDisplayName(userId: number): Promise<string | null> {
  const params = new URLSearchParams({
    select: 'name_json,email',
  });
  params.append('user_id', `eq.${userId}`);

  const rows = await fetchJson<
    Array<{
      name_json: { first?: string | null; last?: string | null } | null;
      email: string | null;
    }>
  >(`${POSTGREST_URL}/user?${params.toString()}`, 'Unable to load cashier name');

  const row = rows[0];
  if (!row) {
    return null;
  }

  const displayName = formatCashierDisplayName({
    firstName: row.name_json?.first,
    lastName: row.name_json?.last,
    email: row.email,
  });

  return displayName || null;
}

type ApiMerchandiseRecord = {
  event_code: string;
  merchandise_json: unknown;
  next_receipt_seq: number;
};

export type MerchandiseDetail = {
  eventCode: string;
  merchandise: MerchandiseJson;
  nextReceiptSeq: number;
};

export async function fetchMerchandiseByCode(
  eventCode: string,
  auth: RequestAuthMode = 'include',
): Promise<MerchandiseDetail | null> {
  const params = new URLSearchParams({
    select: 'event_code,merchandise_json,next_receipt_seq',
  });
  params.append('event_code', `eq.${eventCode}`);

  const rows = await fetchJson<ApiMerchandiseRecord[]>(
    `${POSTGREST_URL}/merchandise_sales?${params.toString()}`,
    'Unable to load merchandise sales',
    auth,
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    eventCode: row.event_code,
    merchandise: parseMerchandiseJson(row.merchandise_json),
    nextReceiptSeq: row.next_receipt_seq,
  };
}

type ApiEventByCodeRecord = {
  event_code: string;
  name: string;
};

export type EventPosContext = {
  eventCode: string;
  name: string;
};

export async function fetchEventPosContextByCode(
  eventCode: string,
  auth: RequestAuthMode = 'include',
): Promise<EventPosContext | null> {
  const params = new URLSearchParams({
    select: 'event_code,name',
  });
  params.append('event_code', `eq.${eventCode}`);

  const rows = await fetchJson<ApiEventByCodeRecord[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load event',
    auth,
  );

  const row = rows[0];
  if (!row) {
    return null;
  }

  return {
    eventCode: row.event_code,
    name: row.name,
  };
}

export type JudgeSearchUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
};

/** Search users by first and/or last name (admin judging pool). */
export async function searchUsersByFirstAndLastName(
  firstName: string,
  lastName: string,
  limit = 50,
): Promise<JudgeSearchUser[]> {
  const trimmedFirst = firstName.trim();
  const trimmedLast = lastName.trim();

  if (!trimmedFirst && !trimmedLast) {
    return [];
  }

  const params = new URLSearchParams({
    select: 'user_id,name_json,email',
    limit: String(limit),
    order: 'name_json->>last.asc,name_json->>first.asc',
  });

  appendIlikeFilter(params, 'name_json->>first', trimmedFirst);
  appendIlikeFilter(params, 'name_json->>last', trimmedLast);

  const records = await fetchJson<ApiUserRecord[]>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to search users',
  );

  return records
    .map((row) => ({
      userId: row.user_id,
      firstName: row.name_json?.first?.trim() ?? '',
      lastName: row.name_json?.last?.trim() ?? '',
      email: row.email?.trim() ?? '',
    }))
    .filter((user) => user.userId > 0);
}

export type EventJudgePoolMember = {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
};

type ApiEventJudgePoolMember = {
  user_id?: number | string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
};

function parseEventJudgePoolMembers(value: unknown): EventJudgePoolMember[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is ApiEventJudgePoolMember => Boolean(entry) && typeof entry === 'object')
    .map((entry) => ({
      userId: Number(entry.user_id),
      firstname: typeof entry.firstname === 'string' ? entry.firstname.trim() : '',
      lastname: typeof entry.lastname === 'string' ? entry.lastname.trim() : '',
      email: typeof entry.email === 'string' ? entry.email.trim() : '',
    }))
    .filter((entry) => Number.isFinite(entry.userId) && entry.userId > 0);
}

export type GetEventJudgingPoolResult = {
  ok: boolean;
  message?: string;
  event_code?: string;
  judges?: unknown;
};

export type SaveEventJudgingPoolResult = {
  ok: boolean;
  message: string;
  event_code?: string;
  judges?: EventJudgePoolMember[];
};

export function getEventJudgingPool(eventCode: string) {
  return callRpc<GetEventJudgingPoolResult>('get_event_judging_pool', {
    p_event_code: eventCode,
  });
}

export function saveEventJudgingPool(eventCode: string, judges: EventJudgePoolMember[]) {
  return callRpc<SaveEventJudgingPoolResult>('save_event_judging_pool', {
    p_event_code: eventCode,
    p_judges: judges.map((judge) => ({
      user_id: judge.userId,
      firstname: judge.firstname,
      lastname: judge.lastname,
      email: judge.email,
    })),
  });
}

export async function fetchEventJudgingPool(eventCode: string): Promise<EventJudgePoolMember[]> {
  const result = await getEventJudgingPool(eventCode);
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load judging pool.');
  }

  return parseEventJudgePoolMembers(result.judges);
}

export async function persistEventJudgingPool(
  eventCode: string,
  judges: EventJudgePoolMember[],
): Promise<SaveEventJudgingPoolResult> {
  const result = await saveEventJudgingPool(eventCode, judges);
  if (result.ok && result.judges) {
    return {
      ...result,
      judges: parseEventJudgePoolMembers(result.judges),
    };
  }

  return result;
}

export function judgeSearchUserToPoolMember(user: JudgeSearchUser): EventJudgePoolMember {
  return {
    userId: user.userId,
    firstname: user.firstName,
    lastname: user.lastName,
    email: user.email,
  };
}

export type ScheduledTaskRow = {
  jobName: string;
  description: string;
  rpcSchema: string;
  rpcName: string;
  scheduleCron: string | null;
  intervalSeconds: number | null;
  scheduleLabel: string;
  isEnabled: boolean;
  lastJobRunId: number | null;
  lastStatus: string | null;
  lastStartedAt: string | null;
  lastFinishedAt: string | null;
  lastErrorMessage: string | null;
  health: string;
};

type ApiScheduledTaskRow = {
  job_name: string;
  description: string | null;
  rpc_schema: string;
  rpc_name: string;
  schedule_cron: string | null;
  interval_seconds: number | null;
  schedule_label: string;
  is_enabled: boolean;
  last_job_run_id: number | null;
  last_status: string | null;
  last_started_at: string | null;
  last_finished_at: string | null;
  last_error_message: string | null;
  health: string;
};

function mapScheduledTaskRow(row: ApiScheduledTaskRow): ScheduledTaskRow {
  return {
    jobName: row.job_name,
    description: row.description?.trim() ?? '',
    rpcSchema: row.rpc_schema,
    rpcName: row.rpc_name,
    scheduleCron: row.schedule_cron,
    intervalSeconds: row.interval_seconds,
    scheduleLabel: row.schedule_label,
    isEnabled: row.is_enabled,
    lastJobRunId: row.last_job_run_id,
    lastStatus: row.last_status,
    lastStartedAt: row.last_started_at,
    lastFinishedAt: row.last_finished_at,
    lastErrorMessage: row.last_error_message,
    health: row.health,
  };
}

export type ListScheduledTasksResult = {
  ok: boolean;
  message?: string;
  tasks?: ApiScheduledTaskRow[];
};

export async function fetchScheduledTasks(): Promise<ScheduledTaskRow[]> {
  const result = await callRpc<ListScheduledTasksResult>('list_scheduled_tasks', {});

  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load scheduled tasks.');
  }

  return (result.tasks ?? []).map(mapScheduledTaskRow);
}

export type RunScheduledTaskResult = {
  ok: boolean;
  job_name?: string;
  job_run_id?: number;
  status?: string;
  error_message?: string;
  message?: string;
  result?: Record<string, unknown>;
  triggered_by?: string;
  manual?: boolean;
  started_at?: string;
  finished_at?: string;
  is_enabled?: boolean;
};

export function runScheduledTask(jobName: string) {
  return callRpc<RunScheduledTaskResult>('run_scheduled_task', { p_job_name: jobName });
}

export type SetScheduledTaskEnabledResult = {
  ok: boolean;
  job_name?: string;
  is_enabled?: boolean;
  message?: string;
};

export function setScheduledTaskEnabled(jobName: string, isEnabled: boolean) {
  return callRpc<SetScheduledTaskEnabledResult>('set_scheduled_task_enabled', {
    p_job_name: jobName,
    p_is_enabled: isEnabled,
  });
}

export type SetScheduledTaskScheduleResult = {
  ok: boolean;
  job_name?: string;
  schedule_cron?: string;
  interval_seconds?: number | null;
  message?: string;
};

export function setScheduledTaskSchedule(
  jobName: string,
  scheduleCron: string,
  staleAfterInterval?: string,
) {
  return callRpc<SetScheduledTaskScheduleResult>('set_scheduled_task_schedule', {
    p_job_name: jobName,
    p_schedule_cron: scheduleCron,
    p_stale_after_interval: staleAfterInterval ?? null,
  });
}
