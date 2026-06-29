import { loadSession, type AppRole } from '../lib/session';

const POSTGREST_URL =
  import.meta.env.VITE_POSTGREST_URL ?? 'http://localhost:3000';

type RpcErrorBody = {
  message?: string;
  hint?: string;
  details?: string;
};

function buildAuthHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const token = loadSession()?.token;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function callRpc<TResponse>(
  functionName: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const response = await fetch(`${POSTGREST_URL}/rpc/${functionName}`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
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

export type Country = {
  iso3: string;
  long_name: string;
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
  firstName: string;
  lastName: string;
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

export type UserSortColumn = 'firstName' | 'lastName' | 'city' | 'state' | 'primaryRole';

export type UserSort = {
  column: UserSortColumn;
  direction: 'asc' | 'desc';
};

export type FetchUsersPageResult = {
  users: UserListRow[];
  total: number;
};

const SORT_COLUMN_TO_POSTGREST: Record<UserSortColumn, string> = {
  firstName: 'name_json->>first',
  lastName: 'name_json->>last',
  city: 'addresses_json->0->>city',
  state: 'addresses_json->0->>state_or_province',
  primaryRole: 'additional_info_json->>primary-role',
};

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

function buildUserQueryParams(
  offset: number,
  limit: number,
  filters: UserFilters,
  sort: UserSort,
): URLSearchParams {
  const params = new URLSearchParams({
    select: 'user_id,username,name_json,addresses_json,additional_info_json',
    limit: String(limit),
    offset: String(offset),
  });

  appendIlikeFilter(params, 'name_json->>first', filters.firstName);
  appendIlikeFilter(params, 'name_json->>last', filters.lastName);
  appendIlikeFilter(params, 'addresses_json->0->>city', filters.city);
  appendEqFilter(params, 'addresses_json->0->>state_or_province', filters.state);
  if (filters.primaryRole !== null) {
    appendEqFilter(params, 'additional_info_json->>primary-role', filters.primaryRole);
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

function mapUserToListRow(user: ApiUserRecord): UserListRow {
  const address = primaryAddress(user.addresses_json);
  const additionalInfo = user.additional_info_json ?? {};
  const primaryRole = additionalInfo['primary-role'];

  return {
    userId: user.user_id,
    firstName: user.name_json?.first?.trim() ?? '',
    lastName: user.name_json?.last?.trim() ?? '',
    city: address?.city?.trim() ?? '',
    state: address?.state_or_province?.trim() ?? '',
    primaryRole: typeof primaryRole === 'string' ? primaryRole.trim() : '',
  };
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
): Promise<FetchUsersPageResult> {
  const params = buildUserQueryParams(offset, limit, filters, sort);

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

export async function fetchUsStateCodes(): Promise<string[]> {
  const states = await fetchUsStates();
  return states.map((state) => state.code);
}

export async function fetchUsStates(): Promise<UsState[]> {
  const response = await fetch(`${POSTGREST_URL}/us_state_lu?select=code,name&order=name`, {
    headers: buildAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Unable to load states (${response.status})`);
  }

  return (await response.json()) as UsState[];
}

export async function fetchCountries(): Promise<Country[]> {
  const response = await fetch(
    `${POSTGREST_URL}/country_lu?select=iso3,long_name&iso3=not.is.null&order=long_name`,
    { headers: buildAuthHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Unable to load countries (${response.status})`);
  }

  return (await response.json()) as Country[];
}

export async function fetchSecretQuestions(): Promise<SecretQuestion[]> {
  const response = await fetch(
    `${POSTGREST_URL}/secret_question_lu?order=secret_question_id`,
    { headers: buildAuthHeaders() },
  );

  if (!response.ok) {
    throw new Error(`Unable to load secret questions (${response.status})`);
  }

  return (await response.json()) as SecretQuestion[];
}

export function login(identifier: string, password: string) {
  return callRpc<LoginResult>('login', {
    p_identifier: identifier,
    p_password: password,
  });
}

export function logout() {
  return callRpc<LogoutResult>('logout', {});
}

export function touchLastActivity() {
  return callRpc<TouchActivityResult>('touch_last_activity', {});
}

export function sessionStatus() {
  return callRpc<SessionStatusResult>('session_status', {});
}

export function forgotPasswordRequest(identifier: string) {
  return callRpc<ForgotPasswordRequestResult>('forgot_password_request', {
    identifier,
  });
}

export function forgotPasswordVerify(email: string, code: string) {
  return callRpc<ForgotPasswordSimpleResult>('forgot_password_verify', {
    p_email: email,
    p_code: code,
  });
}

export function forgotPasswordComplete(
  email: string,
  code: string,
  newPassword: string,
) {
  return callRpc<ForgotPasswordSimpleResult>('forgot_password_complete', {
    p_email: email,
    p_code: code,
    p_new_password: newPassword,
  });
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

export type EventGroupListRow = {
  eventGroupCode: string;
  fullName: string;
};

type ApiEventWithAttendees = {
  event_id: number;
  event_group_code: string | null;
  attendee: Array<{ attendee_id: number }>;
};

type ApiEventGroupRecord = {
  event_group_code: string;
  full_name: string;
};

async function fetchJson<T>(url: string, errorMessage: string): Promise<T> {
  const response = await fetch(url, {
    headers: buildAuthHeaders(),
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
    select: 'event_group_code,full_name',
    order: 'full_name',
  });
  params.append('event_group_code', `in.(${eventGroupCodes.join(',')})`);
  params.append('more_json->>demo', 'eq.true');

  const eventGroups = await fetchJson<ApiEventGroupRecord[]>(
    `${POSTGREST_URL}/event_group?${params.toString()}`,
    'Unable to load event groups',
  );

  return eventGroups.map((row) => ({
    eventGroupCode: row.event_group_code,
    fullName: row.full_name,
  }));
}

export type EventListRow = {
  eventId: number;
  name: string;
  startDate: string | null;
};

export type EventGroupDetail = {
  eventGroupCode: string;
  fullName: string;
};

export type EventAttendeeListRow = {
  attendeeId: number;
  firstName: string;
  lastName: string;
  state: string;
};

type ApiEventRecord = {
  event_id: number;
  name: string;
  start_date: string | null;
  event_group_code: string | null;
};

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
    select: 'event_id,name,start_date',
    order: 'start_date',
  });
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const rows = await fetchJson<ApiEventRecord[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load events',
  );

  return rows.map((row) => ({
    eventId: row.event_id,
    name: row.name,
    startDate: row.start_date,
  }));
}

export async function fetchEventById(
  eventId: number,
): Promise<(EventListRow & { eventGroupCode: string | null }) | null> {
  const params = new URLSearchParams({
    select: 'event_id,name,start_date,event_group_code',
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
    eventId: row.event_id,
    name: row.name,
    startDate: row.start_date,
    eventGroupCode: row.event_group_code,
  };
}

type ApiAttendeeWithUser = {
  attendee_id: number;
  user: {
    name_json: ApiUserRecord['name_json'];
    addresses_json: ApiUserRecord['addresses_json'];
  } | null;
};

function mapAttendeeToListRow(row: ApiAttendeeWithUser): EventAttendeeListRow {
  const address = primaryAddress(row.user?.addresses_json ?? null);

  return {
    attendeeId: row.attendee_id,
    firstName: row.user?.name_json?.first?.trim() ?? '',
    lastName: row.user?.name_json?.last?.trim() ?? '',
    state: address?.state_or_province?.trim() ?? '',
  };
}

export async function fetchEventAttendeesPage(
  eventId: number,
  offset: number,
  limit: number,
): Promise<{ attendees: EventAttendeeListRow[]; total: number }> {
  const params = new URLSearchParams({
    select: 'attendee_id,user(name_json,addresses_json)',
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
  preserved_above_3000?: number;
  event_groups?: string[];
};

export function generateDemoAttendees() {
  return callRpc<GenerateDemoAttendeesResult>('generate_demo_attendees', {});
}

export function hashPasswordRecoveryAnswers(
  answers: Array<{ secret_question_id: number; answer: string }>,
) {
  return callRpc<HashPasswordRecoveryResult>('hash_password_recovery_answers', {
    p_answers: answers,
  });
}

export function registerUser(params: {
  username: string;
  email: string;
  password: string;
  nameJson: Record<string, unknown>;
  phoneNumbersJson: unknown[];
  addressesJson: unknown[];
  passwordRecoveryJson: PasswordRecoveryJson;
}) {
  return callRpc<RegisterUserResult>('register_user', {
    p_username: params.username,
    p_email: params.email,
    p_password: params.password,
    p_name_json: params.nameJson,
    p_phone_numbers_json: params.phoneNumbersJson,
    p_addresses_json: params.addressesJson,
    p_password_recovery_json: params.passwordRecoveryJson,
  });
}
