import { assertClearedScoresKeepRoster, withoutContestScores } from '../lib/clearContestScores';
import { parseTrainingLesson } from '../lib/pageTraining';
import {
  eventInJudgingWindow,
  JUDGING_WINDOW_MS,
  selectJudgingHomeContests,
  staffPersonMatchesUser,
  type JudgingHomeContest,
  type JudgingUserIdentity,
} from '../lib/judgingHome';
import {
  assignedContestJudgeIds,
  buildJudgingFinalsEntries,
  judgeSubmissionProgress,
  readStoredJudgeIds,
  seesJudgeSubmissionBar,
  type JudgeSubmissionProgress,
} from '../lib/judgingFinalsEntries';
import {
  contestResultsLabel,
  findHeadJudgeId,
  indexJudgeNames,
  parseSavedRelativePlacement,
  readSavedSubmissionKey,
  relativePlacementJson,
  relativePlacementStorageKey,
  resolveRelativePlacement,
  type JudgeDirectoryEntry,
  type PlacementCouple,
  type SavedRelativePlacement,
} from '../lib/relativePlacementResults';
import { formatReadableDateTime } from '../utils/auditTimestamps';
import type { JudgeSubmission } from '../services/tabulation/types';
import { readStoredContestPairs, storedContestPairs, type ContestPair, type StoredContestPair } from '../lib/judgingPairs';
import { eventIsCancelled } from '../lib/eventCancelled';
import {
  FLOOR_PARENT_WINDOW_MS,
  floorParentTitleFromAdditionalInfo,
  selectFloorParentContests,
  type FloorParentContest,
  type FloorParentTitle,
} from '../lib/floorParent';
import { eventInRegistrationWindow } from '../lib/registrationWindow';
import { compareSchemaMigrationRowsDescending } from '../lib/schemaMigrationOrder';
import { schedulerHeartbeatIsHealthy } from '../lib/schedulerHeartbeat';
import { loadSession, type AppRole } from '../lib/session';
import { eventLocationToJson, type EventLocationJson } from '../lib/eventLocation';
import {
  alreadyRegisteredContestMessage,
  bibOwnerNames,
  contestSkillDivisionLabel,
  duplicateContestBibMessage,
  rosterHasBib,
  rosterPersonById,
} from '../utils/duplicateContestBib';
import {
  COMPETITORS_GENERATED_FLAG,
  accountsToCreate,
  assignTestCompetitorBibs,
  isGeneratedCompetitor,
  rosterHasGeneratedCompetitors,
  usedContestBibNumbers,
} from '../utils/generatedCompetitors';
import { distinctFinalsRawScores } from '../lib/finalsScoreFill';
import { scoresToPlacements } from '../services/tabulation/scoresToPlacements';
import { trimSavedText } from '../utils/trimSavedText';
import { userInitials } from '../utils/userInitials';
import type { TrainingLesson } from '../types/pageTraining';
import {
  createEmptyContestStageBracketJson,
  parseContestStageBracketJson,
  type ContestStageBracketJson,
} from '../lib/contestStageBrackets';
import {
  createEmptyContestStagePoolsJson,
  parseContestStagePoolsJson,
  type ContestStagePoolsJson,
} from '../lib/contestStagePools';
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

/** Fixed id for the sticky API-unreachable message box. */
export const API_UNREACHABLE_MESSAGE_ID = 'api-unreachable';

export const API_UNREACHABLE_MESSAGE = import.meta.env.DEV
  ? 'Cannot reach the API. Is Docker Desktop running? Start PostgREST (port 3000), then try again.'
  : 'Cannot reach the API. Check your connection and try again.';

export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.message === API_UNREACHABLE_MESSAGE) {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    error.name === 'TypeError' ||
    error.name === 'AbortError' ||
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('load failed') ||
    message.includes('network request failed')
  );
}

function apiUnreachableError(): Error {
  return new Error(API_UNREACHABLE_MESSAGE);
}

/** True when PostgREST (via /api in dev) responds successfully. */
export async function checkApiReachable(timeoutMs = 4000): Promise<boolean> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${POSTGREST_URL}/`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
      headers: buildAuthHeaders(undefined, 'omit'),
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

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

function isGatewayOrProxyFailureStatus(status: number): boolean {
  return status === 500 || status === 502 || status === 503 || status === 504;
}

async function callRpc<TResponse>(
  functionName: string,
  body: Record<string, unknown>,
  auth: RequestAuthMode = 'include',
): Promise<TResponse> {
  let response: Response;
  try {
    response = await fetch(`${POSTGREST_URL}/rpc/${functionName}`, {
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
  } catch (error) {
    if (isNetworkError(error)) {
      throw apiUnreachableError();
    }
    throw error;
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    let hasJsonMessage = false;
    try {
      const errorBody = (await response.json()) as RpcErrorBody;
      if (errorBody.message) {
        message = errorBody.message;
        hasJsonMessage = true;
      }
    } catch {
      // Keep default message when body is not JSON.
    }

    if (!hasJsonMessage && isGatewayOrProxyFailureStatus(response.status)) {
      throw apiUnreachableError();
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
  email?: string | null;
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
  eventTypeCode: string | null;
  isDemo: boolean;
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
  event_type_code?: string | null;
  more_json?: unknown;
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

function parseEventGroupIsDemo(moreJson: unknown): boolean {
  if (!moreJson || typeof moreJson !== 'object' || Array.isArray(moreJson)) {
    return false;
  }

  const demoFlag = (moreJson as Record<string, unknown>).demo;
  return demoFlag === true || demoFlag === 'true';
}

type ApiEventWithAttendees = {
  event_id: number;
  event_group_code: string | null;
  attendee: Array<{ attendee_id: number }>;
};

function mapEventGroupRow(row: ApiEventGroupRecord): EventGroupListRow {
  const eventTypeCode =
    typeof row.event_type_code === 'string' ? row.event_type_code.trim() : '';

  return {
    eventGroupCode: row.event_group_code,
    fullName: row.full_name,
    directors: parseEventGroupDirectors(row.directors_json),
    eventTypeCode: eventTypeCode === '' ? null : eventTypeCode,
    isDemo: parseEventGroupIsDemo(row.more_json),
  };
}

async function fetchJson<T>(
  url: string,
  errorMessage: string,
  auth: RequestAuthMode = 'include',
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildAuthHeaders(undefined, auth),
    });
  } catch (error) {
    if (isNetworkError(error)) {
      throw apiUnreachableError();
    }
    throw error;
  }

  if (!response.ok) {
    if (isGatewayOrProxyFailureStatus(response.status)) {
      let hasJsonMessage = false;
      try {
        const errorBody = (await response.json()) as RpcErrorBody;
        hasJsonMessage = Boolean(errorBody.message);
      } catch {
        // Non-JSON body — treat 5xx as API unreachable (e.g. Vite proxy when Docker is down).
      }
      if (!hasJsonMessage) {
        throw apiUnreachableError();
      }
    }
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
    select: 'event_group_code,full_name,directors_json,event_type_code,more_json',
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

export async function updateEventGroupEventType(
  eventGroupCode: string,
  eventTypeCode: string | null,
): Promise<EventGroupListRow> {
  const params = new URLSearchParams();
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const trimmedType = eventTypeCode?.trim() ?? '';

  const response = await fetch(`${POSTGREST_URL}/event_group?${params.toString()}`, {
    method: 'PATCH',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_type_code: trimmedType === '' ? null : trimmedType,
    }),
  });

  if (!response.ok) {
    let message = `Unable to update event group type (${response.status})`;
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
    throw new Error('Event group type update returned no rows.');
  }

  return mapEventGroupRow(row);
}

/** All event groups ordered by full name. */
export async function fetchEventGroups(): Promise<EventGroupListRow[]> {
  const params = new URLSearchParams({
    select: 'event_group_code,full_name,directors_json,event_type_code,more_json',
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
  eventTypeCode?: string | null;
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
    select: 'event_group_code,full_name,event_type_code',
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

  const eventTypeCode =
    typeof row.event_type_code === 'string' ? row.event_type_code.trim() : '';

  return {
    eventGroupCode: row.event_group_code,
    fullName: row.full_name,
    eventTypeCode: eventTypeCode === '' ? null : eventTypeCode,
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

export type EventRoleAssignment = {
  roleCode: string;
  used: boolean;
  label: string;
  count: number | null;
};

type StoredEventRole = {
  role_code: string;
  used: boolean;
  label: string;
  count: number | null;
};

const EVENT_ROLE_COUNT_MIN = 1;
const EVENT_ROLE_COUNT_MAX = 10;

export function clampEventRoleCount(value: unknown): number {
  const count = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(count) || count < EVENT_ROLE_COUNT_MIN || count > EVENT_ROLE_COUNT_MAX) {
    return EVENT_ROLE_COUNT_MIN;
  }

  return count;
}

function moreJsonObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return { ...(value as Record<string, unknown>) };
}

export function parseEventRoleAssignments(moreJson: unknown): EventRoleAssignment[] {
  const roles = moreJsonObject(moreJson).roles;
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles.flatMap((entry) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      return [];
    }

    const record = entry as Partial<StoredEventRole>;
    const roleCode = typeof record.role_code === 'string' ? record.role_code.trim() : '';
    if (roleCode === '') {
      return [];
    }

    return [
      {
        roleCode,
        used: record.used === true,
        label: typeof record.label === 'string' ? record.label : '',
        count: roleCode === 'COMPETITOR' ? null : clampEventRoleCount(record.count),
      },
    ];
  });
}

async function readApiErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const errorBody = (await response.json()) as RpcErrorBody;
    if (errorBody.message) {
      return errorBody.message;
    }
  } catch {
    // Keep the fallback when the body is not JSON.
  }

  return fallback;
}

export async function fetchEventMoreJson(eventId: number): Promise<Record<string, unknown>> {
  const params = new URLSearchParams({
    select: 'more_json',
  });
  params.append('event_id', `eq.${eventId}`);

  const rows = await fetchJson<Array<{ more_json: unknown }>>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load event roles',
  );

  return moreJsonObject(rows[0]?.more_json);
}

async function countryCodeForEventGroup(eventGroupCode: string): Promise<string> {
  const params = new URLSearchParams({
    select: 'country_code',
    limit: '1',
  });
  params.append('event_group_code', `eq.${eventGroupCode}`);

  const rows = await fetchJson<Array<{ country_code: string | null }>>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load event country',
  );
  const countryCode = rows[0]?.country_code?.trim() ?? '';
  return countryCode === '' ? 'USA' : countryCode;
}

export type EventStaffMember = {
  id: string;
  firstName: string;
  lastName: string;
  primaryRoleCode: string;
  secondaryRoleCode: string;
};

export type EventStaffState = {
  hasStaff: boolean;
  members: EventStaffMember[];
};

type StoredEventStaffMember = {
  id: string;
  first_name: string;
  last_name: string;
  primary_role_code: string;
  secondary_role_code: string;
};

function parseStaffMember(entry: unknown): EventStaffMember | null {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null;
  }

  const record = entry as Partial<StoredEventStaffMember>;
  const firstName = typeof record.first_name === 'string' ? record.first_name : '';
  const lastName = typeof record.last_name === 'string' ? record.last_name : '';
  const primaryRoleCode = typeof record.primary_role_code === 'string' ? record.primary_role_code : '';
  const secondaryRoleCode =
    typeof record.secondary_role_code === 'string' ? record.secondary_role_code : '';
  const hasContent =
    firstName.trim() !== ''
    || lastName.trim() !== ''
    || primaryRoleCode.trim() !== ''
    || secondaryRoleCode.trim() !== '';
  if (!hasContent) {
    return null;
  }

  const id = typeof record.id === 'string' && record.id.trim() !== '' ? record.id : crypto.randomUUID();
  return {
    id,
    firstName,
    lastName,
    primaryRoleCode,
    secondaryRoleCode,
  };
}

export function parseEventStaff(moreJson: unknown): EventStaffState {
  const staff = moreJsonObject(moreJson).staff;
  if (!staff || typeof staff !== 'object' || Array.isArray(staff)) {
    return { hasStaff: false, members: [] };
  }

  const record = staff as { has_staff?: unknown; people?: unknown };
  const people = Array.isArray(record.people) ? record.people : [];
  return {
    hasStaff: record.has_staff === true,
    members: people.flatMap((entry) => {
      const member = parseStaffMember(entry);
      return member ? [member] : [];
    }),
  };
}

function storedStaffMembers(members: EventStaffMember[]): StoredEventStaffMember[] {
  return members.flatMap((member) => {
    const firstName = trimSavedText(member.firstName);
    const lastName = trimSavedText(member.lastName);
    const primaryRoleCode = trimSavedText(member.primaryRoleCode);
    const secondaryRoleCode = trimSavedText(member.secondaryRoleCode);
    if (
      firstName === ''
      && lastName === ''
      && primaryRoleCode === ''
      && secondaryRoleCode === ''
    ) {
      return [];
    }

    return [
      {
        id: member.id,
        first_name: firstName,
        last_name: lastName,
        primary_role_code: primaryRoleCode,
        secondary_role_code: secondaryRoleCode,
      },
    ];
  });
}

export const SCORING_JUDGE_COUNTS = [3, 5, 7] as const;

export type ScoringJudgeCount = (typeof SCORING_JUDGE_COUNTS)[number];

export type EventContestDraft = {
  id: string;
  divisionKey: string;
  divisionLabel: string;
  skillLevelKey: string;
  skillLevelLabel: string;
  headJudgeStaffId: string;
  scoringJudgeCount: ScoringJudgeCount | null;
  scoringJudgeStaffIds: string[];
};

export type EventContestsState = {
  hasContests: boolean;
  contests: EventContestDraft[];
};

type StoredEventContest = {
  id: string;
  division_key: string;
  division_label: string;
  skill_level_key: string;
  skill_level_label: string;
  head_judge_staff_id?: string;
  scoring_judge_count?: number | null;
  scoring_judge_staff_ids?: string[];
  leaders?: unknown[];
  followers?: unknown[];
  competitors_generated?: boolean;
  Locked?: boolean;
};

function parseScoringJudgeCount(value: unknown): ScoringJudgeCount | null {
  const count = typeof value === 'number' ? value : Number.NaN;
  return count === 3 || count === 5 || count === 7 ? count : null;
}

function parseScoringJudgeStaffIds(value: unknown, count: ScoringJudgeCount | null): string[] {
  if (count === null) {
    return [];
  }

  const raw = Array.isArray(value) ? value : [];
  const seen = new Set<string>();
  const ids = raw.slice(0, count).map((entry) => {
    const staffId = typeof entry === 'string' ? entry.trim() : '';
    if (staffId === '' || seen.has(staffId)) {
      return '';
    }
    seen.add(staffId);
    return staffId;
  });
  while (ids.length < count) {
    ids.push('');
  }
  return ids;
}

function parseContestDraft(entry: unknown): EventContestDraft | null {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return null;
  }

  const record = entry as Partial<StoredEventContest>;
  const divisionKey = typeof record.division_key === 'string' ? record.division_key.trim() : '';
  const skillLevelKey = typeof record.skill_level_key === 'string' ? record.skill_level_key.trim() : '';
  if (divisionKey === '' || skillLevelKey === '') {
    return null;
  }

  const id = typeof record.id === 'string' && record.id.trim() !== '' ? record.id : crypto.randomUUID();
  const scoringJudgeCount = parseScoringJudgeCount(record.scoring_judge_count);
  return {
    id,
    divisionKey,
    divisionLabel: typeof record.division_label === 'string' ? record.division_label : divisionKey,
    skillLevelKey,
    skillLevelLabel: typeof record.skill_level_label === 'string' ? record.skill_level_label : skillLevelKey,
    headJudgeStaffId:
      typeof record.head_judge_staff_id === 'string' ? record.head_judge_staff_id.trim() : '',
    scoringJudgeCount,
    scoringJudgeStaffIds: parseScoringJudgeStaffIds(record.scoring_judge_staff_ids, scoringJudgeCount),
  };
}

export function parseEventContests(moreJson: unknown): EventContestsState {
  const contests = moreJsonObject(moreJson).contests;
  if (!contests || typeof contests !== 'object' || Array.isArray(contests)) {
    return { hasContests: false, contests: [] };
  }

  const record = contests as { has_contests?: unknown; items?: unknown };
  const items = Array.isArray(record.items) ? record.items : [];
  return {
    hasContests: record.has_contests === true,
    contests: items.flatMap((entry) => {
      const contest = parseContestDraft(entry);
      return contest ? [contest] : [];
    }),
  };
}

function existingJsonArray(value: unknown): unknown[] | null {
  return Array.isArray(value) ? value : null;
}

/** Choosing No must not replace stored rows with an empty list. */
function rowsForHiddenSection(keepExisting: boolean, nextRows: unknown[], existingRows: unknown): unknown[] {
  if (!keepExisting || nextRows.length > 0) {
    return nextRows;
  }

  return existingJsonArray(existingRows) ?? nextRows;
}

function preservedContestRoster(
  existingItems: unknown,
  id: string,
): { leaders?: unknown[]; followers?: unknown[]; competitors_generated?: boolean; Locked?: boolean } {
  if (!Array.isArray(existingItems)) {
    return {};
  }

  const match = existingItems
    .map((entry) => jsonRecord(entry))
    .find((record) => textField(record ?? {}, 'id') === id);
  if (!match) {
    return {};
  }

  const preserved: {
    leaders?: unknown[];
    followers?: unknown[];
    competitors_generated?: boolean;
    Locked?: boolean;
  } = {};
  if (Array.isArray(match.leaders)) {
    preserved.leaders = match.leaders;
  }
  if (Array.isArray(match.followers)) {
    preserved.followers = match.followers;
  }
  if (match[COMPETITORS_GENERATED_FLAG] === true) {
    preserved.competitors_generated = true;
  }
  if (typeof match.Locked === 'boolean') {
    preserved.Locked = match.Locked;
  }
  return preserved;
}

function storedContestItems(
  contests: EventContestDraft[],
  existingItems: unknown,
): StoredEventContest[] {
  return contests.flatMap((contest) => {
    const divisionKey = trimSavedText(contest.divisionKey);
    const skillLevelKey = trimSavedText(contest.skillLevelKey);
    if (divisionKey === '' || skillLevelKey === '') {
      return [];
    }

    return [
      {
        id: contest.id,
        division_key: divisionKey,
        division_label: trimSavedText(contest.divisionLabel) || divisionKey,
        skill_level_key: skillLevelKey,
        skill_level_label: trimSavedText(contest.skillLevelLabel) || skillLevelKey,
        head_judge_staff_id: trimSavedText(contest.headJudgeStaffId ?? ''),
        scoring_judge_count: contest.scoringJudgeCount ?? null,
        scoring_judge_staff_ids: contest.scoringJudgeStaffIds ?? [],
        ...preservedContestRoster(existingItems, contest.id),
      },
    ];
  });
}

export async function saveEventContests(input: {
  eventId: number | null;
  eventGroupCode: string;
  eventName: string;
  contests: EventContestsState;
}): Promise<number> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save event contests.');
  }

  if (input.eventId !== null) {
    const moreJson = await fetchEventMoreJson(input.eventId);
    const existingContests = moreJson.contests;
    const existingItems =
      existingContests && typeof existingContests === 'object' && !Array.isArray(existingContests)
        ? (existingContests as { items?: unknown }).items
        : null;
    const storedContests = {
      has_contests: input.contests.hasContests,
      items: rowsForHiddenSection(
        !input.contests.hasContests,
        storedContestItems(input.contests.contests, existingItems),
        existingItems,
      ),
    };
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          modified_by: username,
          more_json: {
            ...moreJson,
            contests: storedContests,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save event contests.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving contests.');
  }

  const eventName = trimSavedText(input.eventName);
  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      ...(eventName === '' ? {} : { name: eventName }),
      more_json: {
        contests: {
          has_contests: input.contests.hasContests,
          items: storedContestItems(input.contests.contests, null),
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save event contests.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving event contests did not return an event.');
  }

  return eventId;
}

export function parseEventLocation(value: unknown): EventLocationJson {
  let record: unknown = value;
  if (typeof value === 'string') {
    try {
      record = JSON.parse(value) as unknown;
    } catch {
      record = null;
    }
  }

  const source =
    record && typeof record === 'object' && !Array.isArray(record)
      ? (record as Record<string, unknown>)
      : {};
  const text = (key: keyof EventLocationJson) =>
    typeof source[key] === 'string' ? source[key] : '';

  return eventLocationToJson({
    venue: text('venue'),
    street: text('street'),
    city: text('city'),
    state: text('state'),
    country: text('country'),
    map_url: text('map_url'),
  });
}

export async function fetchEventLocation(eventId: number): Promise<EventLocationJson> {
  const params = new URLSearchParams({
    select: 'location_json',
  });
  params.append('event_id', `eq.${eventId}`);

  const rows = await fetchJson<Array<{ location_json: unknown }>>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load event location',
  );

  return parseEventLocation(rows[0]?.location_json);
}

export async function saveEventLocation(input: {
  eventId: number | null;
  eventGroupCode: string;
  eventName: string;
  location: EventLocationJson;
}): Promise<number> {
  const location = eventLocationToJson(input.location);
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save the event location.');
  }

  if (input.eventId !== null) {
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          modified_by: username,
          location_json: location,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save the event location.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving the location.');
  }

  const eventName = trimSavedText(input.eventName);
  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      ...(eventName === '' ? {} : { name: eventName }),
      location_json: location,
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save the event location.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving the event location did not return an event.');
  }

  return eventId;
}

export async function saveEventStaff(input: {
  eventId: number | null;
  eventGroupCode: string;
  eventName: string;
  staff: EventStaffState;
}): Promise<number> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save event staff.');
  }

  if (input.eventId !== null) {
    const moreJson = await fetchEventMoreJson(input.eventId);
    const existingStaff = moreJson.staff;
    const existingPeople =
      existingStaff && typeof existingStaff === 'object' && !Array.isArray(existingStaff)
        ? (existingStaff as { people?: unknown }).people
        : null;
    const storedStaff = {
      has_staff: input.staff.hasStaff,
      people: rowsForHiddenSection(
        !input.staff.hasStaff,
        storedStaffMembers(input.staff.members),
        existingPeople,
      ),
    };
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          modified_by: username,
          more_json: {
            ...moreJson,
            staff: storedStaff,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save event staff.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving staff.');
  }

  const eventName = trimSavedText(input.eventName);
  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      ...(eventName === '' ? {} : { name: eventName }),
      more_json: {
        staff: {
          has_staff: input.staff.hasStaff,
          people: storedStaffMembers(input.staff.members),
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save event staff.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving event staff did not return an event.');
  }

  return eventId;
}

export type StaffRegistrationStatus = 'registered' | 'partial' | 'none';

export type StaffRegistrationMatch = {
  status: StaffRegistrationStatus;
  username: string | null;
  isAdmin: boolean;
  quickReg: boolean;
};

export async function lookupStaffRegistration(
  people: Array<{ id: string; firstName: string; lastName: string }>,
): Promise<Record<string, StaffRegistrationMatch>> {
  if (people.length === 0) {
    return {};
  }

  const result = await callRpc<{
    ok?: boolean;
    matches?: Array<{
      id?: string;
      status?: string;
      username?: string | null;
      is_admin?: boolean;
      quickreg?: boolean;
    }>;
  }>('lookup_staff_registration', {
    p_people: people.map((person) => ({
      id: person.id,
      first_name: person.firstName.trim(),
      last_name: person.lastName.trim(),
    })),
  });

  if (!result.ok) {
    return {};
  }

  const matches: Record<string, StaffRegistrationMatch> = {};
  for (const match of result.matches ?? []) {
    if (!match.id) {
      continue;
    }
    if (match.status === 'registered' || match.status === 'partial' || match.status === 'none') {
      const username = match.username?.trim() ?? '';
      matches[match.id] = {
        status: match.status,
        username: username === '' ? null : username,
        isAdmin: match.is_admin === true,
        quickReg: match.quickreg === true,
      };
    }
  }
  return matches;
}

export type QuickRegisterUserResult = {
  ok: boolean;
  message: string;
  user_id?: number;
  username?: string;
  password?: string;
  base_username?: string;
  username_incremented?: boolean;
};

export type QuickRegisterPreviewPerson = {
  id: string;
  firstName: string;
  lastName: string;
  ok: boolean;
  message: string;
  baseUsername: string;
  username: string;
  incremented: boolean;
};

type PreviewQuickRegisterUsernamesResult = {
  ok: boolean;
  message?: string;
  people?: Array<{
    id?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    ok?: boolean;
    message?: string | null;
    base_username?: string | null;
    username?: string | null;
    incremented?: boolean;
  }>;
};

/** Admin preview of Quick Registration usernames, including numbered suffixes. */
export async function previewQuickRegisterUsernames(
  people: Array<{ id: string; firstName: string; lastName: string }>,
): Promise<QuickRegisterPreviewPerson[]> {
  const result = await callRpc<PreviewQuickRegisterUsernamesResult>(
    'preview_quick_register_usernames',
    {
      p_people: people.map((person) => ({
        id: person.id,
        first_name: trimSavedText(person.firstName),
        last_name: trimSavedText(person.lastName),
      })),
    },
  );

  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to preview Quick Registration usernames.');
  }

  return (result.people ?? []).map((person) => ({
    id: person.id?.trim() ?? '',
    firstName: person.first_name?.trim() ?? '',
    lastName: person.last_name?.trim() ?? '',
    ok: person.ok === true,
    message: person.message?.trim() ?? '',
    baseUsername: person.base_username?.trim() ?? '',
    username: person.username?.trim() ?? '',
    incremented: person.incremented === true,
  }));
}

export function quickRegisterUser(firstName: string, lastName: string) {
  return callRpc<QuickRegisterUserResult>('quick_register_user', {
    p_first_name: trimSavedText(firstName),
    p_last_name: trimSavedText(lastName),
  });
}

export async function saveEventRoleAssignments(input: {
  eventId: number | null;
  eventGroupCode: string;
  eventName: string;
  roles: EventRoleAssignment[];
}): Promise<number> {
  const storedRoles: StoredEventRole[] = input.roles.map((role) => ({
    role_code: role.roleCode,
    used: role.used,
    label: trimSavedText(role.label),
    count: role.roleCode === 'COMPETITOR' ? null : clampEventRoleCount(role.count),
  }));

  if (input.eventId !== null) {
    const moreJson = await fetchEventMoreJson(input.eventId);
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          more_json: {
            ...moreJson,
            roles: storedRoles,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save event roles.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving roles.');
  }

  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save event roles.');
  }

  const eventName = trimSavedText(input.eventName);
  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      ...(eventName === '' ? {} : { name: eventName }),
      more_json: {
        roles: storedRoles,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save event roles.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving event roles did not return an event.');
  }

  return eventId;
}

export async function saveEventDraft(input: {
  eventId: number | null;
  eventGroupCode: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  updateDates: boolean;
  /** Single day hides the end date. Leave the stored end date in place. */
  updateEndDate?: boolean;
  dateMode?: 'single_day' | 'multi_day' | null;
  /** `more_json.cancelled`. Missing on the caller means not cancelled. */
  cancelled?: boolean;
}): Promise<number> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save the event.');
  }

  const name = trimSavedText(input.name);
  const cancelled = input.cancelled === true;
  const dateFields = input.updateDates
    ? {
        start_date: input.startDate,
        ...(input.updateEndDate === false ? {} : { end_date: input.endDate }),
      }
    : {};

  if (input.eventId !== null) {
    const moreJsonPatch = {
      more_json: {
        ...(await fetchEventMoreJson(input.eventId)),
        ...(input.dateMode == null ? {} : { date_mode: input.dateMode }),
        cancelled,
      },
    };
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          name: name === '' ? null : name,
          modified_by: username,
          ...dateFields,
          ...moreJsonPatch,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save the event.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving the event.');
  }

  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      name,
      ...dateFields,
      more_json: {
        cancelled,
        ...(input.dateMode == null ? {} : { date_mode: input.dateMode }),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save the event.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving the event did not return an event.');
  }

  return eventId;
}

export type StoredSectionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'FINALIZED';

const STORED_SECTION_STATUSES = new Set<StoredSectionStatus>([
  'NOT_STARTED',
  'IN_PROGRESS',
  'FINALIZED',
]);

export function parseStoredSectionStatuses(moreJson: unknown): Record<string, StoredSectionStatus> {
  const raw = moreJsonObject(moreJson).section_statuses;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }

  const statuses: Record<string, StoredSectionStatus> = {};
  for (const [sectionId, value] of Object.entries(raw)) {
    if (typeof value === 'string' && STORED_SECTION_STATUSES.has(value as StoredSectionStatus)) {
      statuses[sectionId] = value as StoredSectionStatus;
    }
  }

  return statuses;
}

export async function saveEventSectionStatuses(input: {
  eventId: number | null;
  eventGroupCode: string;
  eventName: string;
  sectionStatuses: Record<string, StoredSectionStatus>;
}): Promise<number> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save the event.');
  }

  if (input.eventId !== null) {
    const moreJson = await fetchEventMoreJson(input.eventId);
    const response = await fetch(
      `${POSTGREST_URL}/event?event_id=eq.${input.eventId}`,
      {
        method: 'PATCH',
        headers: buildAuthHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        }),
        body: JSON.stringify({
          modified_by: username,
          more_json: {
            ...moreJson,
            section_statuses: {
              ...parseStoredSectionStatuses(moreJson),
              ...input.sectionStatuses,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response, 'Unable to save section status.'));
    }

    return input.eventId;
  }

  const eventGroupCode = input.eventGroupCode.trim();
  if (eventGroupCode === '') {
    throw new Error('Choose an event group before saving the event.');
  }

  const eventName = trimSavedText(input.eventName);
  const response = await fetch(`${POSTGREST_URL}/event`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      event_group_code: eventGroupCode,
      country_code: await countryCodeForEventGroup(eventGroupCode),
      created_by: username,
      ...(eventName === '' ? {} : { name: eventName }),
      more_json: {
        section_statuses: input.sectionStatuses,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, 'Unable to save section status.'));
  }

  const rows = (await response.json()) as Array<{ event_id?: number }>;
  const eventId = rows[0]?.event_id;
  if (typeof eventId !== 'number') {
    throw new Error('Saving section status did not return an event.');
  }

  return eventId;
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

export type AppRoleRow = {
  roleCode: string;
  labels: string[];
};

type ApiAppRoleRow = {
  role_code: string;
  more_json: unknown;
};

export function parseAppRoleLabels(value: unknown): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }

  const labels = (value as { Labels?: unknown }).Labels;
  if (!Array.isArray(labels)) {
    return [];
  }

  return labels
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '');
}

function mapAppRoleRow(row: ApiAppRoleRow): AppRoleRow {
  return {
    roleCode: row.role_code,
    labels: parseAppRoleLabels(row.more_json),
  };
}

export async function fetchAppRoles(): Promise<AppRoleRow[]> {
  const rows = await fetchJson<ApiAppRoleRow[]>(
    `${POSTGREST_URL}/app_role?select=role_code,more_json&order=role_code.asc`,
    'Unable to load roles',
  );

  return rows.map(mapAppRoleRow);
}

type UpdateAppRoleLabelsResult = {
  ok: boolean;
  message?: string;
  role_code?: string;
  labels?: unknown;
};

export async function updateAppRoleLabels(roleCode: string, labels: string[]): Promise<AppRoleRow> {
  const result = await callRpc<UpdateAppRoleLabelsResult>('update_app_role_labels', {
    p_role_code: roleCode,
    p_labels: labels,
  });

  if (!result.ok || !result.role_code) {
    throw new Error(result.message ?? 'Unable to save role labels.');
  }

  const savedLabels = Array.isArray(result.labels)
    ? result.labels.filter((entry): entry is string => typeof entry === 'string')
    : labels;

  return {
    roleCode: result.role_code,
    labels: savedLabels,
  };
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

export type UserPersonName = {
  firstName: string;
  lastName: string;
};

export async function fetchUserPersonName(userId: number): Promise<UserPersonName> {
  const params = new URLSearchParams({
    select: 'name_json',
  });
  params.append('user_id', `eq.${userId}`);

  const rows = await fetchJson<Array<{ name_json: ApiUserRecord['name_json'] }>>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to load user name',
  );

  return {
    firstName: rows[0]?.name_json?.first?.trim() ?? '',
    lastName: rows[0]?.name_json?.last?.trim() ?? '',
  };
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

const CURSOR_RULES_STARRED_KEY = 'cursor_rules_starred';

function cursorRulesStarredFromAdditionalInfo(
  additionalInfo: Record<string, unknown> | null | undefined,
): string[] {
  const value = additionalInfo?.[CURSOR_RULES_STARRED_KEY];
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.trim() !== '');
}

export async function fetchUserCursorRulesStarred(userId: number): Promise<string[]> {
  const params = new URLSearchParams({
    select: 'additional_info_json',
  });
  params.append('user_id', `eq.${userId}`);

  const rows = await fetchJson<Array<{ additional_info_json: Record<string, unknown> | null }>>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to load starred Cursor rules',
  );

  return cursorRulesStarredFromAdditionalInfo(rows[0]?.additional_info_json);
}

export type SetUserCursorRulesStarredResult = {
  ok: boolean;
  message?: string;
  user_id?: number;
  cursor_rules_starred?: string[];
};

export function setUserCursorRulesStarred(starred: string[]) {
  return callRpc<SetUserCursorRulesStarredResult>('set_user_cursor_rules_starred', {
    p_starred: starred,
  });
}

export async function fetchFloorParentTitle(userId: number): Promise<FloorParentTitle> {
  const params = new URLSearchParams({
    select: 'additional_info_json',
  });
  params.append('user_id', `eq.${userId}`);

  const rows = await fetchJson<Array<{ additional_info_json: Record<string, unknown> | null }>>(
    `${POSTGREST_URL}/user?${params.toString()}`,
    'Unable to load floor title',
  );

  return floorParentTitleFromAdditionalInfo(rows[0]?.additional_info_json);
}

export type SetFloorParentTitleResult = {
  ok: boolean;
  message?: string;
  user_id?: number;
  floor_parent_title?: string;
};

export function setFloorParentTitle(title: FloorParentTitle) {
  return callRpc<SetFloorParentTitleResult>('set_floor_parent_title', {
    p_title: title,
  });
}

/** Contests whose event starts within the next 6 hours, earliest first. */
export async function fetchFloorParentContests(
  now: Date = new Date(),
): Promise<FloorParentContest[]> {
  const windowEnd = new Date(now.getTime() + FLOOR_PARENT_WINDOW_MS).toISOString();
  const nowIso = now.toISOString();
  const params = new URLSearchParams({
    select: 'event_id,name,start_date,more_json',
    order: 'start_date.asc,event_id.asc',
  });
  params.append('start_date', `gte.${nowIso}`);
  params.append('start_date', `lte.${windowEnd}`);

  const rows = await fetchJson<JudgingHomeEventRow[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load floor contests',
  );
  const events = rows.flatMap((row) => {
    if (!Number.isInteger(row.event_id) || eventIsCancelled(row.more_json)) {
      return [];
    }

    return [
      {
        eventId: row.event_id,
        name: row.name?.trim() ?? '',
        startDate: row.start_date,
        moreJson: row.more_json,
      },
    ];
  });

  if (events.length === 0) {
    return [];
  }

  const contestParams = new URLSearchParams({
    select: 'contest_id,event_id,event_type_code,more_json',
    order: 'contest_id.asc',
  });
  contestParams.append('event_id', `in.(${events.map((event) => event.eventId).join(',')})`);

  const tableRows = await fetchJson<
    Array<{
      contest_id: number;
      event_id: number | null;
      event_type_code: string | null;
      more_json: unknown;
    }>
  >(
    `${POSTGREST_URL}/contest?${contestParams.toString()}`,
    'Unable to load floor contests',
  );

  return selectFloorParentContests({
    events,
    contests: tableRows.flatMap((row) => {
      if (row.event_id === null || !Number.isInteger(row.contest_id)) {
        return [];
      }
      return [
        {
          contestId: row.contest_id,
          eventId: row.event_id,
          eventTypeCode: row.event_type_code,
          moreJson: row.more_json,
        },
      ];
    }),
    now,
  });
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

export type RegistrationSearchUser = {
  username: string;
  firstName: string;
  lastName: string;
  state: string;
  email: string;
};

type SearchRegistrationUsersResult = {
  ok: boolean;
  message?: string;
  truncated?: boolean;
  users?: Array<{
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    state?: string | null;
    email?: string | null;
  }>;
};

export type QuickRegUser = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  createdByName: string;
  createdByUsername: string;
  createdDate: string;
};

type SearchQuickRegUsersResult = {
  ok: boolean;
  message?: string;
  truncated?: boolean;
  users?: Array<{
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    quickreg_pw?: string | null;
    created_by_first?: string | null;
    created_by_last?: string | null;
    created_by_name?: string | null;
    created_by_username?: string | null;
    created_date?: string | null;
  }>;
};

/** Admin search of accounts created with Quick Registration. */
export async function searchQuickRegUsers(
  firstName: string,
  lastName: string,
): Promise<{ users: QuickRegUser[]; truncated: boolean }> {
  const result = await callRpc<SearchQuickRegUsersResult>('search_quickreg_users', {
    p_first_name: firstName,
    p_last_name: lastName,
  });

  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to search Quick Registration accounts.');
  }

  return {
    truncated: result.truncated === true,
    users: (result.users ?? []).map((row) => {
      const createdByFirst = row.created_by_first?.trim() ?? '';
      const createdByLast = row.created_by_last?.trim() ?? '';
      const createdByName = [createdByFirst, createdByLast].filter((part) => part !== '').join(' ');

      return {
        firstName: row.first_name?.trim() ?? '',
        lastName: row.last_name?.trim() ?? '',
        username: row.username?.trim() ?? '',
        password: row.quickreg_pw?.trim() ?? '',
        createdByName: createdByName || (row.created_by_name?.trim() ?? ''),
        createdByUsername: row.created_by_username?.trim() ?? '',
        createdDate: row.created_date?.trim() ?? '',
      };
    }),
  };
}

type RegistrationHomeAccessResult = {
  ok?: boolean;
  allowed?: boolean;
};

/** True when this account may open Registration from Home. */
export async function fetchRegistrationHomeAccess(): Promise<boolean> {
  const result = await callRpc<RegistrationHomeAccessResult>('registration_home_access', {});
  return result.ok !== false && result.allowed === true;
}

type JudgingHomeEventRow = {
  event_id: number;
  name: string | null;
  start_date: string | null;
  more_json: unknown;
};

type JudgingHomeContestTableRow = {
  contest_id: number;
  event_id: number | null;
  event_type_code: string | null;
  more_json: unknown;
  results_json: unknown;
  staff_json: unknown;
  competitors_json: unknown;
};

/** Contests this signed-in user can open from Judging Home in the 6-hour start window. */
export async function fetchJudgingHomeContests(
  now: Date = new Date(),
): Promise<JudgingHomeContest[]> {
  const session = loadSession();
  if (!session) {
    return [];
  }

  const name = await fetchUserPersonName(session.user_id);
  const windowStart = new Date(now.getTime() - JUDGING_WINDOW_MS).toISOString();
  const windowEnd = new Date(now.getTime() + JUDGING_WINDOW_MS).toISOString();
  const params = new URLSearchParams({
    select: 'event_id,name,start_date,more_json',
    order: 'start_date.asc,event_id.asc',
  });
  params.append('start_date', `gte.${windowStart}`);
  params.append('start_date', `lte.${windowEnd}`);

  const rows = await fetchJson<JudgingHomeEventRow[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load judging contests',
  );
  const events = rows.flatMap((row) => {
    if (
      !Number.isInteger(row.event_id)
      || !eventInJudgingWindow(row.start_date, now)
      || eventIsCancelled(row.more_json)
    ) {
      return [];
    }

    return [
      {
        eventId: row.event_id,
        name: row.name?.trim() ?? '',
        startDate: row.start_date,
        moreJson: row.more_json,
      },
    ];
  });

  if (events.length === 0) {
    return [];
  }

  const contestParams = new URLSearchParams({
    select: 'contest_id,event_id,event_type_code,more_json,results_json,staff_json,competitors_json',
    order: 'contest_id.asc',
  });
  contestParams.append('event_id', `in.(${events.map((event) => event.eventId).join(',')})`);

  const tableRows = await fetchJson<JudgingHomeContestTableRow[]>(
    `${POSTGREST_URL}/contest?${contestParams.toString()}`,
    'Unable to load judging contests',
  );

  return selectJudgingHomeContests({
    events,
    contests: tableRows.flatMap((row) => {
      if (row.event_id === null || !Number.isInteger(row.contest_id)) {
        return [];
      }

      return [
        {
          contestId: row.contest_id,
          eventId: row.event_id,
          eventTypeCode: row.event_type_code,
          moreJson: row.more_json,
          resultsJson: row.results_json,
          staffJson: row.staff_json,
          competitorsJson: row.competitors_json,
        },
      ];
    }),
    user: {
      userId: session.user_id,
      username: session.username,
      firstName: name.firstName,
      lastName: name.lastName,
      appRoles: session.roles,
    },
    now,
  });
}

/** Writes `Locked` on the contest JSON item and, when present, contest.more_json. */
export async function setJudgingContestLocked(
  contest: Pick<JudgingHomeContest, 'eventId' | 'contestId' | 'contestItemId'>,
  locked: boolean,
): Promise<void> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to update the contest lock.');
  }

  let updated = false;
  const contestItemId = contest.contestItemId.trim();
  if (contestItemId !== '') {
    const moreJson = await fetchEventMoreJson(contest.eventId);
    const contestsNode = jsonRecord(moreJson.contests);
    const items = Array.isArray(contestsNode?.items) ? contestsNode.items : null;
    if (contestsNode && items) {
      const index = items.findIndex((entry) => jsonRecord(entry)?.id === contestItemId);
      const current = jsonRecord(items[index]);
      if (index >= 0 && current) {
        const nextItems = [...items];
        nextItems[index] = { ...current, Locked: locked };
        await patchTable(
          'event',
          `event_id=eq.${contest.eventId}`,
          {
            modified_by: username,
            more_json: {
              ...moreJson,
              contests: {
                ...contestsNode,
                items: nextItems,
              },
            },
          },
          'Unable to update the contest lock.',
        );
        updated = true;
      }
    }
  }

  if (contest.contestId !== null) {
    const params = new URLSearchParams({ select: 'more_json' });
    params.append('contest_id', `eq.${contest.contestId}`);
    const rows = await fetchJson<Array<{ more_json: unknown }>>(
      `${POSTGREST_URL}/contest?${params.toString()}`,
      'Unable to update the contest lock',
    );
    if (rows[0]) {
      const today = new Date().toISOString().slice(0, 10);
      await patchTable(
        'contest',
        `contest_id=eq.${contest.contestId}`,
        {
          more_json: { ...moreJsonObject(rows[0].more_json), Locked: locked },
          modified_by: username,
          modified_date: today,
        },
        'Unable to update the contest lock.',
      );
      updated = true;
    }
  }

  if (!updated) {
    throw new Error('Unable to update the contest lock.');
  }
}

function withStoredPairs(moreJson: Record<string, unknown>, pairs: ContestPair[]): Record<string, unknown> {
  const next = { ...moreJson };
  const stored = storedContestPairs(pairs);
  if (stored.length === 0) {
    delete next.pairs;
  } else {
    next.pairs = stored;
  }
  return next;
}

/** Writes randomized leader/follower couples on the contest row, or the event contest item when no row exists. */
export async function saveJudgingContestPairs(
  contest: Pick<JudgingHomeContest, 'eventId' | 'contestId' | 'contestItemId'>,
  pairs: ContestPair[],
): Promise<void> {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save contest pairs.');
  }

  let updated = false;
  const contestItemId = contest.contestItemId.trim();
  if (contestItemId !== '') {
    const moreJson = await fetchEventMoreJson(contest.eventId);
    const contestsNode = jsonRecord(moreJson.contests);
    const items = Array.isArray(contestsNode?.items) ? contestsNode.items : null;
    if (contestsNode && items) {
      const index = items.findIndex((entry) => jsonRecord(entry)?.id === contestItemId);
      const current = jsonRecord(items[index]);
      if (index >= 0 && current) {
        const nextItems = [...items];
        nextItems[index] = withStoredPairs(current, pairs);
        await patchTable(
          'event',
          `event_id=eq.${contest.eventId}`,
          {
            modified_by: username,
            more_json: {
              ...moreJson,
              contests: {
                ...contestsNode,
                items: nextItems,
              },
            },
          },
          'Unable to save contest pairs.',
        );
        updated = true;
      }
    }
  }

  if (contest.contestId !== null) {
    const params = new URLSearchParams({ select: 'more_json' });
    params.append('contest_id', `eq.${contest.contestId}`);
    const rows = await fetchJson<Array<{ more_json: unknown }>>(
      `${POSTGREST_URL}/contest?${params.toString()}`,
      'Unable to save contest pairs',
    );
    if (rows[0]) {
      const today = new Date().toISOString().slice(0, 10);
      await patchTable(
        'contest',
        `contest_id=eq.${contest.contestId}`,
        {
          more_json: withStoredPairs(moreJsonObject(rows[0].more_json), pairs),
          modified_by: username,
          modified_date: today,
        },
        'Unable to save contest pairs.',
      );
      updated = true;
    }
  }

  if (!updated) {
    throw new Error('Unable to save contest pairs.');
  }
}

function storedPairsOnRecord(record: Record<string, unknown> | null | undefined): StoredContestPair[] {
  return readStoredContestPairs(record?.pairs);
}

/** Non-empty couples already stored on the contest row, or on the event contest item. */
export async function fetchJudgingContestPairs(
  contest: Pick<JudgingHomeContest, 'eventId' | 'contestId' | 'contestItemId'>,
): Promise<StoredContestPair[]> {
  if (contest.contestId !== null) {
    const params = new URLSearchParams({ select: 'more_json' });
    params.append('contest_id', `eq.${contest.contestId}`);
    const rows = await fetchJson<Array<{ more_json: unknown }>>(
      `${POSTGREST_URL}/contest?${params.toString()}`,
      'Unable to load contest pairs',
    );
    const stored = storedPairsOnRecord(jsonRecord(rows[0]?.more_json));
    if (stored.length > 0) {
      return stored;
    }
  }

  const contestItemId = contest.contestItemId.trim();
  if (contestItemId !== '') {
    const moreJson = await fetchEventMoreJson(contest.eventId);
    const contestsNode = jsonRecord(moreJson.contests);
    const items = Array.isArray(contestsNode?.items) ? contestsNode.items : [];
    const item = items.map((entry) => jsonRecord(entry)).find((record) => record?.id === contestItemId);
    return storedPairsOnRecord(item);
  }

  return [];
}

export type JudgingFinalsSubmissionStatus = JudgeSubmissionProgress & {
  showBar: boolean;
  judgeId: string;
  /** Signed-in user is this contest's head judge (assignment or contest staff role). */
  contestHeadJudge: boolean;
};

type JudgeScoreContest = {
  eventId: number | null;
  contestId: number | null;
  contestItemId: string;
};

type JudgeContestDocs = {
  eventMore: Record<string, unknown> | null;
  contestsNode: Record<string, unknown> | null;
  item: Record<string, unknown> | null;
  itemIndex: number;
  contestMore: Record<string, unknown> | null;
  results: Record<string, unknown> | null;
  staffJson: unknown;
  panelJudges: unknown;
  contestRow: boolean;
};

function eventStaffPeople(moreJson: Record<string, unknown> | null): Record<string, unknown>[] {
  const staff = jsonRecord(moreJson?.staff);
  const people = staff?.people;
  if (!Array.isArray(people)) {
    return [];
  }
  return people.flatMap((entry) => {
    const person = jsonRecord(entry);
    return person ? [person] : [];
  });
}

function personIsHeadJudge(person: Record<string, unknown>): boolean {
  return ['primary_role_code', 'secondary_role_code', 'role', 'role_code'].some((key) => {
    const value = person[key];
    return typeof value === 'string' && value.trim().toUpperCase() === 'HEAD_JUDGE';
  });
}

function staffJsonMatchesHeadJudge(staffJson: unknown, user: JudgingUserIdentity): boolean {
  if (!Array.isArray(staffJson)) {
    return false;
  }
  return staffJson.some((entry) => {
    const row = jsonRecord(entry);
    return row !== null && staffPersonMatchesUser(row, user) && personIsHeadJudge(row);
  });
}

async function fetchPanelJudges(contestId: number | null): Promise<unknown[]> {
  if (contestId === null) {
    return [];
  }
  try {
    const params = new URLSearchParams({ select: 'judges_json' });
    params.append('contest_id', `eq.${contestId}`);
    const rows = await fetchJson<Array<{ judges_json: unknown }>>(
      `${POSTGREST_URL}/judging_panel?${params.toString()}`,
      'Unable to load judging panel',
    );
    return rows.flatMap((row) => (Array.isArray(row.judges_json) ? row.judges_json : []));
  } catch {
    return [];
  }
}

async function loadJudgeContestDocs(contest: JudgeScoreContest): Promise<JudgeContestDocs> {
  let eventMore: Record<string, unknown> | null = null;
  let contestsNode: Record<string, unknown> | null = null;
  let item: Record<string, unknown> | null = null;
  let itemIndex = -1;
  const contestItemId = contest.contestItemId.trim();
  if (contest.eventId !== null && contest.eventId > 0 && contestItemId !== '') {
    eventMore = await fetchEventMoreJson(contest.eventId);
    contestsNode = jsonRecord(eventMore.contests);
    const items = Array.isArray(contestsNode?.items) ? contestsNode.items : [];
    itemIndex = items.findIndex((entry) => jsonRecord(entry)?.id === contestItemId);
    item = jsonRecord(items[itemIndex]);
  } else if (contest.eventId !== null && contest.eventId > 0) {
    eventMore = await fetchEventMoreJson(contest.eventId);
  }

  let contestMore: Record<string, unknown> | null = null;
  let results: Record<string, unknown> | null = null;
  let staffJson: unknown = null;
  let contestRow = false;
  if (contest.contestId !== null) {
    const params = new URLSearchParams({ select: 'more_json,results_json,staff_json' });
    params.append('contest_id', `eq.${contest.contestId}`);
    const rows = await fetchJson<Array<{ more_json: unknown; results_json: unknown; staff_json: unknown }>>(
      `${POSTGREST_URL}/contest?${params.toString()}`,
      'Unable to load contest scores',
    );
    contestRow = Boolean(rows[0]);
    contestMore = jsonRecord(rows[0]?.more_json);
    results = jsonRecord(rows[0]?.results_json);
    staffJson = rows[0]?.staff_json ?? null;
  }

  return {
    eventMore,
    contestsNode,
    item,
    itemIndex,
    contestMore,
    results,
    staffJson,
    panelJudges: await fetchPanelJudges(contest.contestId),
    contestRow,
  };
}

async function currentJudgingUser(): Promise<JudgingUserIdentity | null> {
  const session = loadSession();
  if (!session) {
    return null;
  }
  const name = await fetchUserPersonName(session.user_id);
  return {
    userId: session.user_id,
    username: session.username,
    firstName: name.firstName,
    lastName: name.lastName,
    appRoles: session.roles,
  };
}

function submissionStatus(docs: JudgeContestDocs, user: JudgingUserIdentity | null): JudgingFinalsSubmissionStatus {
  const records = [docs.item, docs.contestMore].filter((row): row is Record<string, unknown> => row !== null);
  const assigned = assignedContestJudgeIds({
    records,
    panelJudges: docs.panelJudges,
    staffJson: docs.staffJson,
  });
  const submitted = [
    ...readStoredJudgeIds(docs.results?.judge_submissions),
    ...readStoredJudgeIds(docs.item?.judge_submissions),
  ];
  const ballots = storedJudgeBallots(docs);
  const headJudgeId = findHeadJudgeId({
    assignedIds: assigned,
    records: [docs.item, docs.contestMore, ...judgeNameSources(docs)],
    ballots,
  });
  const progress = judgeSubmissionProgress(assigned, submitted, headJudgeId);
  const matches = user ? eventStaffPeople(docs.eventMore).filter((person) => staffPersonMatchesUser(person, user)) : [];
  const staffIds = matches.flatMap((person) => {
    const id = typeof person.id === 'string' ? person.id.trim() : '';
    return id === '' ? [] : [id];
  });
  const headIds = records.flatMap((row) => {
    const id = typeof row.head_judge_staff_id === 'string' ? row.head_judge_staff_id.trim() : '';
    return id === '' ? [] : [id];
  });
  const contestHeadJudge = user
    ? staffIds.some((id) => headIds.includes(id)) || staffJsonMatchesHeadJudge(docs.staffJson, user)
    : false;
  return {
    ...progress,
    judgeId: staffIds[0] || user?.username.trim() || '',
    contestHeadJudge,
    showBar: user
      ? seesJudgeSubmissionBar({
          appRoles: user.appRoles,
          eventHeadJudge: matches.some((person) => personIsHeadJudge(person)),
          contestHeadJudge,
        })
      : false,
  };
}

/** Assigned judges and ballots stored on the contest, for the head-judge progress bar. */
export async function fetchJudgingSubmissionProgress(
  contest: JudgeScoreContest,
): Promise<JudgingFinalsSubmissionStatus> {
  const [docs, user] = await Promise.all([loadJudgeContestDocs(contest), currentJudgingUser()]);
  await persistRelativePlacementIfReady(contest, docs);
  return submissionStatus(docs, user);
}

function storedBallot(
  submission: JudgeSubmission,
  judgeId: string,
  name: { firstName: string; lastName: string },
): Record<string, unknown> {
  const firstName = trimSavedText(name.firstName);
  const lastName = trimSavedText(name.lastName);
  return {
    judge_id: judgeId,
    ...(firstName === '' ? {} : { first_name: firstName }),
    ...(lastName === '' ? {} : { last_name: lastName }),
    submitted_at: formatReadableDateTime(new Date()),
    scores: submission.scores.map((score) => ({
      competitor_id: score.competitorId,
      score: score.score,
    })),
    placements: submission.placements.map((placement) => ({
      competitor_id: placement.competitorId,
      placement: placement.placement,
      score: placement.score,
    })),
  };
}

function upsertBallot(existing: unknown, ballot: Record<string, unknown>): unknown[] {
  const judgeId = ballot.judge_id;
  const kept = Array.isArray(existing)
    ? existing.filter((entry) => {
        const row = jsonRecord(entry);
        const id = typeof row?.judge_id === 'string' ? row.judge_id : typeof row?.judgeId === 'string' ? row.judgeId : '';
        return id !== judgeId;
      })
    : [];
  return [...kept, ballot];
}

/** Saves this judge's finals ballot on contest.results_json and, when present, the event contest item. */
export async function saveJudgingFinalsSubmission(
  contest: JudgeScoreContest,
  submission: JudgeSubmission,
): Promise<JudgingFinalsSubmissionStatus> {
  const user = await currentJudgingUser();
  if (!user) {
    throw new Error('Sign in to submit scores.');
  }
  const username = user.username.trim();
  const docs = await loadJudgeContestDocs(contest);
  const judgeId = submissionStatus(docs, user).judgeId || username;
  const ballot = storedBallot(submission, judgeId, user);
  let updated = false;

  if (
    contest.eventId !== null
    && docs.item
    && docs.contestsNode
    && docs.eventMore
    && docs.itemIndex >= 0
    && Array.isArray(docs.contestsNode.items)
  ) {
    const nextItems = [...docs.contestsNode.items];
    nextItems[docs.itemIndex] = {
      ...docs.item,
      judge_submissions: upsertBallot(docs.item.judge_submissions, ballot),
    };
    await patchTable(
      'event',
      `event_id=eq.${contest.eventId}`,
      {
        modified_by: username,
        more_json: {
          ...docs.eventMore,
          contests: {
            ...docs.contestsNode,
            items: nextItems,
          },
        },
      },
      'Unable to save judge scores.',
    );
    docs.item = jsonRecord(nextItems[docs.itemIndex]);
    updated = true;
  }

  if (contest.contestId !== null && docs.contestRow) {
    const today = new Date().toISOString().slice(0, 10);
    const results = {
      ...(docs.results ?? {}),
      judge_submissions: upsertBallot(docs.results?.judge_submissions, ballot),
    };
    await patchTable(
      'contest',
      `contest_id=eq.${contest.contestId}`,
      {
        results_json: results,
        modified_by: username,
        modified_date: today,
      },
      'Unable to save judge scores.',
    );
    docs.results = results;
    updated = true;
  }

  if (!updated) {
    throw new Error('Unable to save judge scores.');
  }
  try {
    await persistRelativePlacementIfReady(contest, docs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save contest results.';
    throw new Error(`Scores were saved, but relative placement could not be saved. ${message}`);
  }
  return submissionStatus(docs, user);
}

function directoryName(
  directory: Map<string, JudgeDirectoryEntry>,
  judgeId: string,
): { firstName: string; lastName: string } {
  const entry = directory.get(judgeId) ?? directory.get(judgeId.toLowerCase());
  return {
    firstName: entry?.firstName ?? '',
    lastName: entry?.lastName ?? '',
  };
}

/**
 * Admin-only: one submitted ballot per assigned judge, including the head judge,
 * then relative placement when that completes the panel.
 */
export async function fillAllJudgingFinalsScores(
  contest: RelativePlacementContestRef,
  bibs: readonly number[],
): Promise<void> {
  const user = await currentJudgingUser();
  if (!user) {
    throw new Error('Sign in to submit scores.');
  }
  const roles = new Set((user.appRoles ?? []).map((role) => role.trim().toUpperCase()));
  if (!roles.has('ADMIN')) {
    throw new Error('Only an admin can fill scores for every judge.');
  }
  const coupleBibs = [...new Set(bibs.filter((bib) => Number.isInteger(bib) && bib > 0))];
  if (coupleBibs.length === 0) {
    throw new Error('This contest has no couples to score.');
  }
  const username = user.username.trim();
  const docs = await loadJudgeContestDocs(contest);
  const judgeIds = assignedJudgeIds(docs);
  if (judgeIds.length === 0) {
    throw new Error('No judges are assigned to this contest.');
  }
  const directory = indexJudgeNames(judgeNameSources(docs));
  await fillJudgeDirectoryFromUsers(directory);
  let itemBallots: unknown = docs.item?.judge_submissions;
  let resultBallots: unknown = docs.results?.judge_submissions;
  for (const judgeId of judgeIds) {
    const scores = distinctFinalsRawScores(coupleBibs.length).map((score, index) => ({
      competitorId: coupleBibs[index],
      score,
    }));
    const ballot = storedBallot(
      {
        judgeId,
        submittedAt: '',
        scores,
        placements: scoresToPlacements(scores),
      },
      judgeId,
      directoryName(directory, judgeId),
    );
    itemBallots = upsertBallot(itemBallots, ballot);
    resultBallots = upsertBallot(resultBallots, ballot);
  }

  let updated = false;
  if (
    contest.eventId !== null
    && docs.item
    && docs.contestsNode
    && docs.eventMore
    && docs.itemIndex >= 0
    && Array.isArray(docs.contestsNode.items)
  ) {
    const nextItems = [...docs.contestsNode.items];
    nextItems[docs.itemIndex] = {
      ...docs.item,
      judge_submissions: itemBallots,
    };
    await patchTable(
      'event',
      `event_id=eq.${contest.eventId}`,
      {
        modified_by: username,
        more_json: {
          ...docs.eventMore,
          contests: {
            ...docs.contestsNode,
            items: nextItems,
          },
        },
      },
      'Unable to save judge scores.',
    );
    docs.item = jsonRecord(nextItems[docs.itemIndex]);
    updated = true;
  }

  if (contest.contestId !== null && docs.contestRow) {
    const results = {
      ...(docs.results ?? {}),
      judge_submissions: resultBallots,
    };
    await patchTable(
      'contest',
      `contest_id=eq.${contest.contestId}`,
      {
        results_json: results,
        modified_by: username,
        modified_date: new Date().toISOString().slice(0, 10),
      },
      'Unable to save judge scores.',
    );
    docs.results = results;
    updated = true;
  }

  if (!updated) {
    throw new Error('Unable to save judge scores.');
  }
  await persistRelativePlacementIfReady(contest, docs);
}

/** Admin-only: remove stored ballots and the saved relative placement. Couples and the contest stay. */
export async function clearJudgingContestScores(contest: JudgeScoreContest): Promise<void> {
  const user = await currentJudgingUser();
  if (!user) {
    throw new Error('Sign in to clear scores.');
  }
  const roles = new Set((user.appRoles ?? []).map((role) => role.trim().toUpperCase()));
  if (!roles.has('ADMIN')) {
    throw new Error('Only an admin can clear contest scores.');
  }
  const username = user.username.trim();
  const docs = await loadJudgeContestDocs(contest);
  let updated = false;

  if (
    contest.eventId !== null
    && docs.item
    && docs.contestsNode
    && docs.eventMore
    && docs.itemIndex >= 0
    && Array.isArray(docs.contestsNode.items)
  ) {
    const nextItems = [...docs.contestsNode.items];
    const clearedItem = withoutContestScores(docs.item);
    assertClearedScoresKeepRoster(docs.item, clearedItem);
    nextItems[docs.itemIndex] = clearedItem;
    await patchTable(
      'event',
      `event_id=eq.${contest.eventId}`,
      {
        modified_by: username,
        more_json: {
          ...docs.eventMore,
          contests: {
            ...docs.contestsNode,
            items: nextItems,
          },
        },
      },
      'Unable to clear contest scores.',
    );
    updated = true;
  }

  if (contest.contestId !== null && docs.contestRow) {
    const clearedResults = withoutContestScores(docs.results);
    assertClearedScoresKeepRoster(docs.results ?? {}, clearedResults);
    await patchTable(
      'contest',
      `contest_id=eq.${contest.contestId}`,
      {
        results_json: clearedResults,
        modified_by: username,
        modified_date: new Date().toISOString().slice(0, 10),
      },
      'Unable to clear contest scores.',
    );
    updated = true;
  }

  if (!updated) {
    throw new Error('Unable to clear contest scores.');
  }
}

type RelativePlacementContestRef = JudgeScoreContest & {
  eventName?: string;
  skillLevel?: string;
  division?: string;
};

function assignedJudgeIds(docs: JudgeContestDocs): string[] {
  const records = [docs.item, docs.contestMore].filter((row): row is Record<string, unknown> => row !== null);
  return assignedContestJudgeIds({
    records,
    panelJudges: docs.panelJudges,
    staffJson: docs.staffJson,
  });
}

function storedJudgeBallots(docs: JudgeContestDocs): unknown[] {
  const itemBallots = Array.isArray(docs.item?.judge_submissions) ? docs.item.judge_submissions : [];
  const resultBallots = Array.isArray(docs.results?.judge_submissions) ? docs.results.judge_submissions : [];
  return [...itemBallots, ...resultBallots];
}

function judgeNameSources(docs: JudgeContestDocs): unknown[] {
  return [
    ...eventStaffPeople(docs.eventMore),
    ...(Array.isArray(docs.staffJson) ? docs.staffJson : []),
    ...(Array.isArray(docs.panelJudges) ? docs.panelJudges : []),
  ];
}

function recordLabel(record: Record<string, unknown> | null, ...keys: string[]): string {
  if (!record) {
    return '';
  }
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
  }
  return '';
}

function couplesFromEntries(
  entries: ReturnType<typeof buildJudgingFinalsEntries>,
): Map<number, PlacementCouple> {
  return new Map(
    entries.map((entry) => [
      entry.number,
      {
        bib: entry.number,
        leaderBib: entry.leaderBib,
        followerBib: entry.followerBib,
        leaderFirst: entry.leader.first,
        leaderLast: entry.leader.last,
        followerFirst: entry.follower.first,
        followerLast: entry.follower.last,
      },
    ]),
  );
}

async function fetchEventName(eventId: number | null): Promise<string> {
  if (eventId === null || eventId <= 0) {
    return '';
  }
  try {
    const params = new URLSearchParams({ select: 'name' });
    params.append('event_id', `eq.${eventId}`);
    const rows = await fetchJson<Array<{ name: string | null }>>(
      `${POSTGREST_URL}/event?${params.toString()}`,
      'Unable to load contest results',
    );
    return rows[0]?.name?.trim() ?? '';
  } catch {
    return '';
  }
}

async function fillJudgeDirectoryFromUsers(
  directory: Map<string, JudgeDirectoryEntry>,
): Promise<void> {
  const userIds = [
    ...new Set(
      [...directory.values()]
        .filter((entry) => entry.userId !== null && userInitials(entry) === '')
        .map((entry) => entry.userId as number),
    ),
  ];
  if (userIds.length === 0) {
    return;
  }
  try {
    const params = new URLSearchParams({ select: 'user_id,name_json' });
    params.append('user_id', `in.(${userIds.join(',')})`);
    const rows = await fetchJson<
      Array<{ user_id: number; name_json: { first?: string | null; last?: string | null } | null }>
    >(`${POSTGREST_URL}/user?${params.toString()}`, 'Unable to load judge names');
    const byUser = new Map(
      rows.map((row) => [
        row.user_id,
        {
          firstName: row.name_json?.first?.trim() ?? '',
          lastName: row.name_json?.last?.trim() ?? '',
        },
      ]),
    );
    for (const [key, entry] of directory) {
      if (entry.userId === null || userInitials(entry) !== '') {
        continue;
      }
      const name = byUser.get(entry.userId);
      if (!name || userInitials(name) === '') {
        continue;
      }
      directory.set(key, { ...entry, firstName: name.firstName, lastName: name.lastName });
    }
  } catch {
    // A missing user row still leaves a short unique column label.
  }
}

async function loadPlacementCouples(contest: JudgeScoreContest): Promise<Map<number, PlacementCouple>> {
  const rosterContest: JudgingHomeContest = {
    id: `placement-${contest.eventId ?? 0}-${contest.contestId ?? 0}-${contest.contestItemId}`,
    eventId: contest.eventId ?? 0,
    eventName: '',
    skillLevelLabel: '',
    divisionLabel: '',
    contestId: contest.contestId,
    contestItemId: contest.contestItemId,
    skillLevelKey: '',
    divisionKey: '',
    leaderCount: 0,
    followerCount: 0,
    locked: false,
    canToggleLock: false,
  };
  let pairs: Awaited<ReturnType<typeof fetchJudgingContestPairs>> = [];
  try {
    pairs = await fetchJudgingContestPairs(rosterContest);
  } catch {
    pairs = [];
  }
  let people: ContestRosterPerson[] = [];
  try {
    if (pairs.length > 0) {
      people = await fetchJudgingContestRoster(rosterContest);
    }
  } catch {
    people = [];
  }
  return couplesFromEntries(buildJudgingFinalsEntries(pairs, people));
}

function canSavePlacementOnItem(contest: RelativePlacementContestRef, docs: JudgeContestDocs): boolean {
  return (
    contest.eventId !== null
    && contest.eventId > 0
    && docs.item !== null
    && docs.itemIndex >= 0
    && docs.contestsNode !== null
    && docs.eventMore !== null
    && Array.isArray(docs.contestsNode.items)
  );
}

async function persistRelativePlacementIfReady(
  contest: RelativePlacementContestRef,
  docs: JudgeContestDocs,
): Promise<void> {
  const saveOnRow = contest.contestId !== null && docs.contestRow;
  const saveOnItem = !saveOnRow && canSavePlacementOnItem(contest, docs);
  if (!saveOnRow && !saveOnItem) {
    return;
  }
  const assigned = assignedJudgeIds(docs);
  const ballots = storedJudgeBallots(docs);
  const headJudgeId = findHeadJudgeId({
    assignedIds: assigned,
    records: [docs.item, docs.contestMore, ...judgeNameSources(docs)],
    ballots,
  });
  const storageKey = relativePlacementStorageKey(assigned, ballots, headJudgeId);
  const stored = saveOnRow ? docs.results : docs.item;
  if (!storageKey || readSavedSubmissionKey(stored) === storageKey) {
    return;
  }
  const directory = indexJudgeNames(judgeNameSources(docs));
  await fillJudgeDirectoryFromUsers(directory);
  const couplesByBib = await loadPlacementCouples(contest);
  const eventName = (contest.eventName?.trim() ?? '') || (await fetchEventName(contest.eventId));
  const skillLevel =
    contest.skillLevel?.trim()
    || recordLabel(docs.item, 'skill_level_label', 'skillLevelLabel')
    || recordLabel(docs.contestMore, 'skill_level_label', 'skillLevelLabel');
  const division =
    contest.division?.trim()
    || recordLabel(docs.item, 'division_label', 'divisionLabel', 'name')
    || recordLabel(docs.contestMore, 'division_label', 'divisionLabel', 'name');
  const saved = resolveRelativePlacement({
    assignedIds: assigned,
    ballots,
    headJudgeId,
    directory,
    couplesByBib,
    eventName,
    skillLevel,
    division,
    computedAt: formatReadableDateTime(new Date()),
  });
  if (!saved) {
    return;
  }
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save contest results.');
  }
  const relativePlacement = relativePlacementJson(saved);
  if (saveOnRow && contest.contestId !== null) {
    const results = {
      ...(docs.results ?? {}),
      relative_placement: relativePlacement,
    };
    await patchTable(
      'contest',
      `contest_id=eq.${contest.contestId}`,
      {
        results_json: results,
        modified_by: username,
        modified_date: new Date().toISOString().slice(0, 10),
      },
      'Unable to save contest results.',
    );
    docs.results = results;
    return;
  }
  const itemList = docs.contestsNode?.items;
  if (
    !saveOnItem
    || contest.eventId === null
    || !docs.item
    || !docs.contestsNode
    || !docs.eventMore
    || !Array.isArray(itemList)
  ) {
    return;
  }
  const nextItems = [...itemList];
  nextItems[docs.itemIndex] = {
    ...docs.item,
    relative_placement: relativePlacement,
  };
  await patchTable(
    'event',
    `event_id=eq.${contest.eventId}`,
    {
      modified_by: username,
      more_json: {
        ...docs.eventMore,
        contests: {
          ...docs.contestsNode,
          items: nextItems,
        },
      },
    },
    'Unable to save contest results.',
  );
  docs.item = jsonRecord(nextItems[docs.itemIndex]);
}

/** Saves relative placement when every assigned judge has submitted and the ballots changed. */
export async function ensureContestRelativePlacement(contest: RelativePlacementContestRef): Promise<void> {
  const docs = await loadJudgeContestDocs(contest);
  await persistRelativePlacementIfReady(contest, docs);
}

export type ResolvedContestResult = {
  contestId: number | null;
  eventId: number | null;
  contestItemId: string;
  label: string;
};

/** Contests whose results_json already has a relative-placement result. */
export async function fetchResolvedContestResults(): Promise<ResolvedContestResult[]> {
  const params = new URLSearchParams({
    select: 'contest_id,event_id,more_json,results_json',
    order: 'contest_id.asc',
  });
  params.append('results_json->relative_placement', 'not.is.null');
  const rows = await fetchJson<
    Array<{ contest_id: number; event_id: number | null; more_json: unknown; results_json: unknown }>
  >(`${POSTGREST_URL}/contest?${params.toString()}`, 'Unable to load contest results');
  const savedRows = rows.flatMap((row) => {
    const saved = parseSavedRelativePlacement(jsonRecord(row.results_json)?.relative_placement);
    if (!saved || !Number.isInteger(row.contest_id)) {
      return [];
    }
    return [{ row, saved }];
  });
  const eventIds = [
    ...new Set(
      savedRows.flatMap(({ row }) =>
        row.event_id !== null && Number.isInteger(row.event_id) ? [row.event_id] : [],
      ),
    ),
  ];
  const eventNames = new Map<number, string>();
  if (eventIds.length > 0) {
    const eventParams = new URLSearchParams({ select: 'event_id,name' });
    eventParams.append('event_id', `in.(${eventIds.join(',')})`);
    const events = await fetchJson<Array<{ event_id: number; name: string | null }>>(
      `${POSTGREST_URL}/event?${eventParams.toString()}`,
      'Unable to load contest results',
    );
    for (const event of events) {
      eventNames.set(event.event_id, event.name?.trim() ?? '');
    }
  }
  const fromRows = savedRows
    .map(({ row, saved }) => {
      const more = jsonRecord(row.more_json);
      const eventName = row.event_id === null ? '' : (eventNames.get(row.event_id) ?? '');
      return {
        contestId: row.contest_id,
        eventId: row.event_id,
        contestItemId: recordLabel(more, 'id', 'contest_item_id', 'contestItemId'),
        label: contestResultsLabel({
          eventName: saved.eventName || eventName,
          skillLevel: saved.skillLevel || recordLabel(more, 'skill_level_label', 'skillLevelLabel'),
          division: saved.division || recordLabel(more, 'division_label', 'divisionLabel', 'name'),
        }),
      };
    });
  const coveredItems = new Set(
    fromRows.flatMap((row) =>
      row.eventId !== null && row.contestItemId !== '' ? [`${row.eventId}:${row.contestItemId}`] : [],
    ),
  );
  const fromItems = (await fetchResolvedEventItemResults()).filter(
    (row) => row.eventId === null || row.contestItemId === '' || !coveredItems.has(`${row.eventId}:${row.contestItemId}`),
  );
  return [...fromRows, ...fromItems].sort(
    (left, right) => left.label.localeCompare(right.label) || (left.contestId ?? 0) - (right.contestId ?? 0),
  );
}

async function fetchResolvedEventItemResults(): Promise<ResolvedContestResult[]> {
  const params = new URLSearchParams({ select: 'event_id,name,more_json' });
  params.append('more_json', 'cs.{"contests":{"items":[{"relative_placement":{}}]}}');
  const rows = await fetchJson<Array<{ event_id: number; name: string | null; more_json: unknown }>>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load contest results',
  );
  return rows.flatMap((row) => {
    const contests = jsonRecord(jsonRecord(row.more_json)?.contests);
    const items = Array.isArray(contests?.items) ? contests.items : [];
    return items.flatMap((entry) => {
      const item = jsonRecord(entry);
      const saved = parseSavedRelativePlacement(item?.relative_placement);
      const contestItemId = recordLabel(item, 'id', 'contest_item_id', 'contestItemId');
      if (!saved || contestItemId === '' || !Number.isInteger(row.event_id)) {
        return [];
      }
      return [
        {
          contestId: null,
          eventId: row.event_id,
          contestItemId,
          label: contestResultsLabel({
            eventName: saved.eventName || row.name?.trim() || '',
            skillLevel: saved.skillLevel || recordLabel(item, 'skill_level_label', 'skillLevelLabel'),
            division: saved.division || recordLabel(item, 'division_label', 'divisionLabel', 'name'),
          }),
        },
      ];
    });
  });
}

/** Saved relative placement on an event contest item when that contest has no contest row. */
export async function fetchSavedEventItemPlacement(
  eventId: number,
  contestItemId: string,
): Promise<SavedRelativePlacement | null> {
  const itemId = contestItemId.trim();
  if (!Number.isInteger(eventId) || eventId <= 0 || itemId === '') {
    return null;
  }
  await ensureContestRelativePlacement({
    eventId,
    contestId: null,
    contestItemId: itemId,
  });
  const moreJson = await fetchEventMoreJson(eventId);
  const contests = jsonRecord(moreJson.contests);
  const items = Array.isArray(contests?.items) ? contests.items : [];
  const item = items
    .map((entry) => jsonRecord(entry))
    .find((row) => recordLabel(row, 'id', 'contest_item_id', 'contestItemId') === itemId) ?? null;
  const saved = parseSavedRelativePlacement(item?.relative_placement);
  if (!saved) {
    return null;
  }
  if (saved.eventName !== '' && saved.skillLevel !== '' && saved.division !== '') {
    return saved;
  }
  return {
    ...saved,
    eventName: saved.eventName || (await fetchEventName(eventId)),
    skillLevel: saved.skillLevel || recordLabel(item, 'skill_level_label', 'skillLevelLabel'),
    division: saved.division || recordLabel(item, 'division_label', 'divisionLabel', 'name'),
  };
}

/** Saved relative placement for one contest. Null when the panel has not been resolved. */
export async function fetchSavedRelativePlacement(contestId: number): Promise<SavedRelativePlacement | null> {
  await ensureContestRelativePlacement({
    eventId: null,
    contestId,
    contestItemId: '',
  });
  const params = new URLSearchParams({ select: 'event_id,more_json,results_json' });
  params.append('contest_id', `eq.${contestId}`);
  const rows = await fetchJson<
    Array<{ event_id: number | null; more_json: unknown; results_json: unknown }>
  >(`${POSTGREST_URL}/contest?${params.toString()}`, 'Unable to load contest results');
  const row = rows[0];
  const saved = parseSavedRelativePlacement(jsonRecord(row?.results_json)?.relative_placement);
  if (!saved) {
    return null;
  }
  if (saved.eventName !== '' && saved.skillLevel !== '' && saved.division !== '') {
    return saved;
  }
  const more = jsonRecord(row?.more_json);
  const eventName = saved.eventName || (await fetchEventName(row?.event_id ?? null));
  return {
    ...saved,
    eventName,
    skillLevel: saved.skillLevel || recordLabel(more, 'skill_level_label', 'skillLevelLabel'),
    division: saved.division || recordLabel(more, 'division_label', 'divisionLabel', 'name'),
  };
}

/** Registration desk search by first and/or last name. Demo users are omitted. */
export async function searchRegistrationUsers(
  firstName: string,
  lastName: string,
): Promise<{ users: RegistrationSearchUser[]; truncated: boolean }> {
  const result = await callRpc<SearchRegistrationUsersResult>('search_registration_users', {
    p_first_name: firstName,
    p_last_name: lastName,
  });

  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to search users.');
  }

  return {
    truncated: result.truncated === true,
    users: (result.users ?? []).map((row) => ({
      username: row.username?.trim() ?? '',
      firstName: row.first_name?.trim() ?? '',
      lastName: row.last_name?.trim() ?? '',
      state: row.state?.trim() ?? '',
      email: row.email?.trim() ?? '',
    })),
  };
}

export type UpcomingRegistrationContest = {
  id: string;
  eventId: number;
  eventName: string;
  skillLevelLabel: string;
  divisionLabel: string;
  leaderCount: number;
  followerCount: number;
  source: 'json' | 'table';
  contestId: number | null;
  itemId: string;
  skillLevelKey: string;
  divisionKey: string;
  /** True after Create/Register Test Competitors. Cleared when those people are deleted. */
  competitorsGenerated: boolean;
  /** True when any Leader/Follower aaa–zzz roster id is already on this contest. */
  hasGeneratedCompetitors: boolean;
};

export type ContestRosterRole = 'leader' | 'follower';

export type ContestRosterOrigin =
  | { kind: 'event-json' }
  | { kind: 'contest-competitors' }
  | { kind: 'contest-more' }
  | { kind: 'contest-entry'; contestEntryId: number }
  | { kind: 'attendee'; attendeeId: number; entryIndex: number };

export type ContestRosterPerson = {
  id: string;
  firstName: string;
  lastName: string;
  role: ContestRosterRole;
  origin: ContestRosterOrigin;
  bib?: number;
};

type UpcomingEventContestRow = {
  event_id: number;
  name: string | null;
  start_date: string | null;
  end_date: string | null;
  more_json: unknown;
};

type UpcomingContestTableRow = {
  contest_id: number;
  event_id: number | null;
  event_type_code: string | null;
  competitors_json: unknown;
  more_json: unknown;
};

type UpcomingContestEntryRow = {
  contest_id: number;
  competitors_json: unknown;
  more_json: unknown;
  scratched: boolean | null;
};

type UpcomingAttendeeContestRow = {
  event_id: number;
  contests_json: unknown;
};

type ContestRoleCounts = {
  leaderCount: number;
  followerCount: number;
};

type BuiltUpcomingContest = UpcomingRegistrationContest;

type ContestRoleEnrollment = {
  contestId: number | null;
  itemId: string;
  skillLevelKey: string;
  divisionKey: string;
  role: 'leader' | 'follower';
};

const CONTEST_ROLE_KEYS = ['role', 'dance_role', 'contest_role', 'competitor_role', 'primary_role', 'primary-role'];
const CONTEST_ROSTER_KEYS = [
  'registrants',
  'registrations',
  'competitors',
  'competitors_json',
  'entries',
  'contest_entries',
  'roster',
];

function emptyContestRoleCounts(): ContestRoleCounts {
  return { leaderCount: 0, followerCount: 0 };
}

function addContestRoleCounts(left: ContestRoleCounts, right: ContestRoleCounts): ContestRoleCounts {
  return {
    leaderCount: left.leaderCount + right.leaderCount,
    followerCount: left.followerCount + right.followerCount,
  };
}

function danceRole(record: Record<string, unknown>): 'leader' | 'follower' | null {
  for (const key of CONTEST_ROLE_KEYS) {
    const value = record[key];
    if (typeof value !== 'string') {
      continue;
    }
    const role = value.trim().toLowerCase();
    if (role === 'leader' || role === 'lead') {
      return 'leader';
    }
    if (role === 'follower' || role === 'follow') {
      return 'follower';
    }
  }
  return null;
}

function jsonRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

/** Count persisted leader/follower registrants. People without a role are omitted. */
function countStoredRoleRoster(value: unknown): ContestRoleCounts {
  if (Array.isArray(value)) {
    return value.reduce(
      (totals, entry) => addContestRoleCounts(totals, countStoredRoleNode(entry)),
      emptyContestRoleCounts(),
    );
  }
  return countStoredRoleNode(value);
}

function countStoredRoleNode(value: unknown): ContestRoleCounts {
  const record = jsonRecord(value);
  if (!record) {
    return emptyContestRoleCounts();
  }

  const leaderIsPerson = jsonRecord(record.leader) !== null;
  const followerIsPerson = jsonRecord(record.follower) !== null;
  if (leaderIsPerson || followerIsPerson) {
    return {
      leaderCount: leaderIsPerson ? 1 : 0,
      followerCount: followerIsPerson ? 1 : 0,
    };
  }

  if (Array.isArray(record.leaders) || Array.isArray(record.followers)) {
    return {
      leaderCount: Array.isArray(record.leaders) ? record.leaders.length : 0,
      followerCount: Array.isArray(record.followers) ? record.followers.length : 0,
    };
  }

  const role = danceRole(record);
  if (role === 'leader') {
    return { leaderCount: 1, followerCount: 0 };
  }
  if (role === 'follower') {
    return { leaderCount: 0, followerCount: 1 };
  }

  return CONTEST_ROSTER_KEYS.reduce(
    (totals, key) =>
      record[key] === undefined ? totals : addContestRoleCounts(totals, countStoredRoleRoster(record[key])),
    emptyContestRoleCounts(),
  );
}

function countContestEntryRoles(row: UpcomingContestEntryRow): ContestRoleCounts {
  if (row.scratched === true) {
    return emptyContestRoleCounts();
  }

  const fromCompetitors = countStoredRoleRoster(row.competitors_json);
  if (fromCompetitors.leaderCount + fromCompetitors.followerCount > 0) {
    return fromCompetitors;
  }

  return countStoredRoleNode(row.more_json);
}

function textField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value.trim() : '';
}

function contestIdField(record: Record<string, unknown>): number | null {
  const value = record.contest_id;
  const contestId = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(contestId) && contestId > 0 ? contestId : null;
}

function parseContestRoleEnrollment(entry: unknown): ContestRoleEnrollment | null {
  const record = jsonRecord(entry);
  if (!record) {
    return null;
  }

  const role = danceRole(record);
  if (!role) {
    return null;
  }

  return {
    contestId: contestIdField(record),
    itemId: textField(record, 'contest_item_id') || textField(record, 'id'),
    skillLevelKey: textField(record, 'skill_level_key') || textField(record, 'skillLevelKey'),
    divisionKey: textField(record, 'division_key') || textField(record, 'divisionKey'),
    role,
  };
}

function enrollmentMatchesContest(
  contest: BuiltUpcomingContest,
  enrollment: ContestRoleEnrollment,
  contests: BuiltUpcomingContest[],
): boolean {
  if (contest.source === 'table') {
    return enrollment.contestId !== null && enrollment.contestId === contest.contestId;
  }

  if (enrollment.contestId !== null) {
    return false;
  }

  if (enrollment.itemId !== '' && enrollment.itemId === contest.itemId) {
    return true;
  }

  if (enrollment.skillLevelKey === '' || enrollment.divisionKey === '') {
    return false;
  }

  if (enrollment.skillLevelKey !== contest.skillLevelKey || enrollment.divisionKey !== contest.divisionKey) {
    return false;
  }

  const keyMatches = contests.filter(
    (candidate) =>
      candidate.source === 'json'
      && candidate.eventId === contest.eventId
      && candidate.skillLevelKey === enrollment.skillLevelKey
      && candidate.divisionKey === enrollment.divisionKey,
  );
  return keyMatches.length === 1;
}

function applyAttendeeRoleCounts(
  contests: BuiltUpcomingContest[],
  attendees: UpcomingAttendeeContestRow[],
): void {
  for (const attendee of attendees) {
    if (!Array.isArray(attendee.contests_json)) {
      continue;
    }

    for (const entry of attendee.contests_json) {
      const enrollment = parseContestRoleEnrollment(entry);
      if (!enrollment) {
        continue;
      }

      const contest = contests.find(
        (candidate) =>
          candidate.eventId === attendee.event_id
          && enrollmentMatchesContest(candidate, enrollment, contests),
      );
      if (!contest) {
        continue;
      }

      if (enrollment.role === 'leader') {
        contest.leaderCount += 1;
      } else {
        contest.followerCount += 1;
      }
    }
  }
}

function jsonText(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value.trim() : '';
}

/** Contests for events that are current or start within the next 24 hours. */
export async function fetchUpcomingRegistrationContests(
  now: Date = new Date(),
): Promise<UpcomingRegistrationContest[]> {
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();
  const params = new URLSearchParams({
    select: 'event_id,name,start_date,end_date,more_json',
    order: 'start_date.asc,event_id.asc',
  });
  params.append('start_date', `lte.${horizon}`);
  params.append('or', `(end_date.gte.${nowIso},end_date.is.null,start_date.gt.${nowIso})`);

  const rows = await fetchJson<UpcomingEventContestRow[]>(
    `${POSTGREST_URL}/event?${params.toString()}`,
    'Unable to load upcoming contests',
  );

  const events = rows.filter(
    (row) =>
      Number.isInteger(row.event_id)
      && eventInRegistrationWindow(row.start_date, row.end_date, now)
      && !eventIsCancelled(row.more_json),
  );

  const contests: BuiltUpcomingContest[] = [];
  for (const event of events) {
    const parsed = parseEventContests(event.more_json);
    if (!parsed.hasContests) {
      continue;
    }

    const eventName = event.name?.trim() ?? '';
    const contestsNode = jsonRecord(moreJsonObject(event.more_json).contests);
    const rawItems = Array.isArray(contestsNode?.items) ? contestsNode.items : [];

    for (const contest of parsed.contests) {
      const rawItem = rawItems.find((item) => jsonRecord(item)?.id === contest.id);
      const counts = countStoredRoleNode(rawItem);
      contests.push({
        id: `event-${event.event_id}-json-${contest.id}`,
        eventId: event.event_id,
        eventName,
        skillLevelLabel: contest.skillLevelLabel.trim(),
        divisionLabel: contest.divisionLabel.trim(),
        leaderCount: counts.leaderCount,
        followerCount: counts.followerCount,
        source: 'json',
        contestId: null,
        itemId: contest.id,
        skillLevelKey: contest.skillLevelKey.trim(),
        divisionKey: contest.divisionKey.trim(),
        competitorsGenerated: jsonRecord(rawItem)?.[COMPETITORS_GENERATED_FLAG] === true,
        hasGeneratedCompetitors: false,
      });
    }
  }

  const eventIds = events.map((event) => event.event_id);
  if (eventIds.length === 0) {
    return attachGeneratedCompetitorFlags(contests);
  }

  const eventNameById = new Map(events.map((event) => [event.event_id, event.name?.trim() ?? '']));
  const contestParams = new URLSearchParams({
    select: 'contest_id,event_id,event_type_code,competitors_json,more_json',
    order: 'contest_id.asc',
  });
  contestParams.append('event_id', `in.(${eventIds.join(',')})`);

  const tableRows = await fetchJson<UpcomingContestTableRow[]>(
    `${POSTGREST_URL}/contest?${contestParams.toString()}`,
    'Unable to load upcoming contests',
  );

  for (const row of tableRows) {
    if (row.event_id === null || !eventNameById.has(row.event_id)) {
      continue;
    }

    const more = moreJsonObject(row.more_json);
    const skillLevelLabel = jsonText(more, 'skill_level_label') || jsonText(more, 'skillLevelLabel');
    const divisionLabel =
      jsonText(more, 'division_label')
      || jsonText(more, 'divisionLabel')
      || jsonText(more, 'name')
      || (row.event_type_code?.trim() ?? '');
    if (skillLevelLabel === '' && divisionLabel === '') {
      continue;
    }

    const counts = addContestRoleCounts(
      countStoredRoleRoster(row.competitors_json),
      countStoredRoleNode(more),
    );
    contests.push({
      id: `event-${row.event_id}-contest-${row.contest_id}`,
      eventId: row.event_id,
      eventName: eventNameById.get(row.event_id) ?? '',
      skillLevelLabel,
      divisionLabel,
      leaderCount: counts.leaderCount,
      followerCount: counts.followerCount,
      source: 'table',
      contestId: row.contest_id,
      itemId: '',
      skillLevelKey: jsonText(more, 'skill_level_key') || jsonText(more, 'skillLevelKey'),
      divisionKey: jsonText(more, 'division_key') || jsonText(more, 'divisionKey'),
      competitorsGenerated: more[COMPETITORS_GENERATED_FLAG] === true,
      hasGeneratedCompetitors: false,
    });
  }

  const contestIds = contests.flatMap((contest) => (contest.contestId === null ? [] : [contest.contestId]));
  if (contestIds.length > 0) {
    const entryParams = new URLSearchParams({
      select: 'contest_id,competitors_json,more_json,scratched',
    });
    entryParams.append('contest_id', `in.(${contestIds.join(',')})`);
    const entryRows = await fetchJson<UpcomingContestEntryRow[]>(
      `${POSTGREST_URL}/contest_entry?${entryParams.toString()}`,
      'Unable to load upcoming contests',
    );
    for (const entry of entryRows) {
      const contest = contests.find((candidate) => candidate.contestId === entry.contest_id);
      if (!contest) {
        continue;
      }
      const counts = countContestEntryRoles(entry);
      contest.leaderCount += counts.leaderCount;
      contest.followerCount += counts.followerCount;
    }
  }

  const attendeeParams = new URLSearchParams({
    select: 'event_id,contests_json',
  });
  attendeeParams.append('event_id', `in.(${eventIds.join(',')})`);
  attendeeParams.append('contests_json', 'not.is.null');
  const attendeeRows = await fetchJson<UpcomingAttendeeContestRow[]>(
    `${POSTGREST_URL}/attendee?${attendeeParams.toString()}`,
    'Unable to load upcoming contests',
  );
  applyAttendeeRoleCounts(contests, attendeeRows);

  return attachGeneratedCompetitorFlags(
    contests.map((contest) => ({
      id: contest.id,
      eventId: contest.eventId,
      eventName: contest.eventName,
      skillLevelLabel: contest.skillLevelLabel,
      divisionLabel: contest.divisionLabel,
      leaderCount: contest.leaderCount,
      followerCount: contest.followerCount,
      source: contest.source,
      contestId: contest.contestId,
      itemId: contest.itemId,
      skillLevelKey: contest.skillLevelKey,
      divisionKey: contest.divisionKey,
      competitorsGenerated: contest.competitorsGenerated,
      hasGeneratedCompetitors: contest.hasGeneratedCompetitors,
    })),
  );
}

const ROSTER_REMOVE = Symbol('roster-remove');

type AttendeeRosterRow = {
  attendee_id: number;
  contests_json: unknown;
  user: {
    name_json: { first?: string | null; last?: string | null } | null;
  } | null;
};

function actingUsername(): string {
  const username = loadSession()?.username?.trim() ?? '';
  if (username === '') {
    throw new Error('Sign in to save the contest roster.');
  }
  return username;
}

async function patchTable(
  table: string,
  filter: string,
  body: Record<string, unknown>,
  fallback: string,
): Promise<void> {
  const response = await fetch(`${POSTGREST_URL}/${table}?${filter}`, {
    method: 'PATCH',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    }),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(await readApiErrorMessage(response, fallback));
  }
}

function rosterStorageId(record: Record<string, unknown>, fallback: string): string {
  const id = textField(record, 'id');
  if (id !== '') {
    return id;
  }
  const userId = record.user_id;
  if (typeof userId === 'number' && Number.isInteger(userId) && userId > 0) {
    return `user-${userId}`;
  }
  if (typeof userId === 'string' && userId.trim() !== '') {
    return `user-${userId.trim()}`;
  }
  return fallback;
}

function claimRosterId(used: Set<string>, base: string): string {
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let suffix = 2;
  let next = `${base}-${suffix}`;
  while (used.has(next)) {
    suffix += 1;
    next = `${base}-${suffix}`;
  }
  used.add(next);
  return next;
}

function rosterName(record: Record<string, unknown>): { firstName: string; lastName: string } {
  const firstName =
    textField(record, 'first_name')
    || textField(record, 'firstName')
    || textField(record, 'firstname');
  const lastName =
    textField(record, 'last_name')
    || textField(record, 'lastName')
    || textField(record, 'lastname');
  if (firstName !== '' || lastName !== '') {
    return { firstName, lastName };
  }

  const display =
    textField(record, 'display-name')
    || textField(record, 'display_name')
    || textField(record, 'name');
  const parts = display.split(/\s+/).filter((part) => part !== '');
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function pushRosterPerson(
  people: ContestRosterPerson[],
  used: Set<string>,
  record: Record<string, unknown>,
  role: ContestRosterRole,
  origin: ContestRosterOrigin,
  fallbackId: string,
): void {
  const id = claimRosterId(used, rosterStorageId(record, fallbackId));
  const name = rosterName(record);
  const bib = rosterBib(record);
  people.push({
    id,
    firstName: name.firstName,
    lastName: name.lastName,
    role,
    origin,
    ...(bib === undefined ? {} : { bib }),
  });
}

function collectRosterValue(
  value: unknown,
  origin: ContestRosterOrigin,
  people: ContestRosterPerson[],
  used: Set<string>,
  path: string,
): void {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      collectRosterValue(entry, origin, people, used, `${path}-${index}`);
    });
    return;
  }

  const record = jsonRecord(value);
  if (!record) {
    return;
  }

  const leaderRecord = jsonRecord(record.leader);
  const followerRecord = jsonRecord(record.follower);
  if (leaderRecord || followerRecord) {
    if (leaderRecord) {
      pushRosterPerson(people, used, leaderRecord, 'leader', origin, `${path}-leader`);
    }
    if (followerRecord) {
      pushRosterPerson(people, used, followerRecord, 'follower', origin, `${path}-follower`);
    }
    return;
  }

  if (Array.isArray(record.leaders) || Array.isArray(record.followers)) {
    (['leader', 'follower'] as const).forEach((role) => {
      const key = role === 'leader' ? 'leaders' : 'followers';
      const list = record[key];
      if (!Array.isArray(list)) {
        return;
      }
      list.forEach((entry, index) => {
        const personRecord = jsonRecord(entry);
        if (!personRecord) {
          return;
        }
        pushRosterPerson(people, used, personRecord, role, origin, `${path}-${role}-${index}`);
      });
    });
    return;
  }

  const role = danceRole(record);
  if (role) {
    pushRosterPerson(people, used, record, role, origin, path);
    return;
  }

  for (const key of CONTEST_ROSTER_KEYS) {
    if (record[key] !== undefined) {
      collectRosterValue(record[key], origin, people, used, `${path}-${key}`);
    }
  }
}

function jsonSiblingCount(moreJson: unknown, contest: UpcomingRegistrationContest): number {
  return parseEventContests(moreJson).contests.filter(
    (candidate) =>
      candidate.skillLevelKey === contest.skillLevelKey
      && candidate.divisionKey === contest.divisionKey,
  ).length;
}

function enrollmentMatchesUpcoming(
  contest: UpcomingRegistrationContest,
  enrollment: ContestRoleEnrollment,
  siblingJsonCount: number,
): boolean {
  if (contest.source === 'table') {
    return enrollment.contestId !== null && enrollment.contestId === contest.contestId;
  }

  if (enrollment.contestId !== null) {
    return false;
  }

  if (enrollment.itemId !== '' && enrollment.itemId === contest.itemId) {
    return true;
  }

  if (enrollment.skillLevelKey === '' || enrollment.divisionKey === '') {
    return false;
  }

  if (enrollment.skillLevelKey !== contest.skillLevelKey || enrollment.divisionKey !== contest.divisionKey) {
    return false;
  }

  return siblingJsonCount === 1;
}

function rosterBib(record: Record<string, unknown>): number | undefined {
  for (const key of ['bib', 'bib_number', 'bibNumber']) {
    const value = record[key];
    const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : Number.NaN;
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return undefined;
}

function storedEventRosterPerson(person: ContestRosterPerson): Record<string, unknown> {
  const stored: Record<string, unknown> = {
    id: person.id,
    first_name: person.firstName,
    last_name: person.lastName,
  };
  if (typeof person.bib === 'number' && Number.isInteger(person.bib) && person.bib > 0) {
    stored.bib = person.bib;
  }
  return stored;
}

function setDanceRole(record: Record<string, unknown>, role: ContestRosterRole): Record<string, unknown> {
  const next = { ...record };
  for (const key of CONTEST_ROLE_KEYS) {
    if (typeof next[key] === 'string') {
      next[key] = role;
      return next;
    }
  }
  next.role = role;
  return next;
}

function applyRosterEdits(
  value: unknown,
  edits: Map<string, ContestRosterRole>,
  used: Set<string>,
  path: string,
): unknown {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => {
      const updated = applyRosterEdits(entry, edits, used, `${path}-${index}`);
      return updated === ROSTER_REMOVE ? [] : [updated];
    });
  }

  const record = jsonRecord(value);
  if (!record) {
    return value;
  }

  const leaderRecord = jsonRecord(record.leader);
  const followerRecord = jsonRecord(record.follower);
  if (leaderRecord || followerRecord) {
    const next: Record<string, unknown> = { ...record };
    (['leader', 'follower'] as const).forEach((role) => {
      const personRecord = role === 'leader' ? leaderRecord : followerRecord;
      if (!personRecord) {
        return;
      }
      const id = claimRosterId(used, rosterStorageId(personRecord, `${path}-${role}`));
      if (!edits.has(id)) {
        delete next[role];
        return;
      }
      const nextRole = edits.get(id);
      if (nextRole === role) {
        return;
      }
      delete next[role];
      next[nextRole === 'leader' ? 'leader' : 'follower'] = personRecord;
    });
    return next;
  }

  if (Array.isArray(record.leaders) || Array.isArray(record.followers)) {
    const next: Record<string, unknown> = { ...record };
    const leaders: unknown[] = [];
    const followers: unknown[] = [];
    (['leader', 'follower'] as const).forEach((role) => {
      const key = role === 'leader' ? 'leaders' : 'followers';
      const list = record[key];
      if (!Array.isArray(list)) {
        return;
      }
      list.forEach((entry, index) => {
        const personRecord = jsonRecord(entry);
        if (!personRecord) {
          return;
        }
        const id = claimRosterId(used, rosterStorageId(personRecord, `${path}-${role}-${index}`));
        if (!edits.has(id)) {
          return;
        }
        const target = edits.get(id) === 'leader' ? leaders : followers;
        target.push(personRecord);
      });
    });
    if (leaders.length > 0) {
      next.leaders = leaders;
    } else {
      delete next.leaders;
    }
    if (followers.length > 0) {
      next.followers = followers;
    } else {
      delete next.followers;
    }
    return next;
  }

  const role = danceRole(record);
  if (role) {
    const id = claimRosterId(used, rosterStorageId(record, path));
    if (!edits.has(id)) {
      return ROSTER_REMOVE;
    }
    const nextRole = edits.get(id);
    if (!nextRole || nextRole === role) {
      return record;
    }
    return setDanceRole(record, nextRole);
  }

  let changed = false;
  const next: Record<string, unknown> = { ...record };
  for (const key of CONTEST_ROSTER_KEYS) {
    if (record[key] === undefined) {
      continue;
    }
    const updated = applyRosterEdits(record[key], edits, used, `${path}-${key}`);
    if (updated !== record[key]) {
      changed = true;
      next[key] = updated;
    }
  }
  return changed ? next : record;
}

async function fetchAttendeeRosterRows(eventId: number): Promise<AttendeeRosterRow[]> {
  const params = new URLSearchParams({
    select: 'attendee_id,contests_json,user(name_json)',
  });
  params.append('event_id', `eq.${eventId}`);
  params.append('contests_json', 'not.is.null');
  return fetchJson<AttendeeRosterRow[]>(
    `${POSTGREST_URL}/attendee?${params.toString()}`,
    'Unable to load contest roster',
  );
}

function appendAttendeeRoster(
  contest: UpcomingRegistrationContest,
  rows: AttendeeRosterRow[],
  siblingJsonCount: number,
  people: ContestRosterPerson[],
  used: Set<string>,
): void {
  for (const row of rows) {
    if (!Array.isArray(row.contests_json)) {
      continue;
    }
    const firstName = row.user?.name_json?.first?.trim() ?? '';
    const lastName = row.user?.name_json?.last?.trim() ?? '';
    row.contests_json.forEach((entry, index) => {
      const enrollment = parseContestRoleEnrollment(entry);
      if (!enrollment || !enrollmentMatchesUpcoming(contest, enrollment, siblingJsonCount)) {
        return;
      }
      const id = claimRosterId(used, `attendee-${row.attendee_id}-${index}`);
      people.push({
        id,
        firstName,
        lastName,
        role: enrollment.role,
        origin: { kind: 'attendee', attendeeId: row.attendee_id, entryIndex: index },
      });
    });
  }
}

/** Leaders and followers already stored for one upcoming contest. */
export async function fetchContestRoster(
  contest: UpcomingRegistrationContest,
): Promise<ContestRosterPerson[]> {
  const people: ContestRosterPerson[] = [];
  const used = new Set<string>();

  if (contest.source === 'json') {
    const moreJson = await fetchEventMoreJson(contest.eventId);
    const contestsNode = jsonRecord(moreJson.contests);
    const items = Array.isArray(contestsNode?.items) ? contestsNode.items : [];
    const item = items.map((entry) => jsonRecord(entry)).find((record) => record?.id === contest.itemId);
    if (item) {
      collectRosterValue(item, { kind: 'event-json' }, people, used, `item-${contest.itemId}`);
    }
    const rows = await fetchAttendeeRosterRows(contest.eventId);
    appendAttendeeRoster(contest, rows, jsonSiblingCount(moreJson, contest), people, used);
    return people;
  }

  if (contest.contestId === null) {
    return people;
  }

  const contestParams = new URLSearchParams({
    select: 'contest_id,competitors_json,more_json',
  });
  contestParams.append('contest_id', `eq.${contest.contestId}`);
  const contestRows = await fetchJson<Array<{ competitors_json: unknown; more_json: unknown }>>(
    `${POSTGREST_URL}/contest?${contestParams.toString()}`,
    'Unable to load contest roster',
  );
  const contestRow = contestRows[0];
  if (contestRow) {
    collectRosterValue(
      contestRow.competitors_json,
      { kind: 'contest-competitors' },
      people,
      used,
      'competitors',
    );
    collectRosterValue(contestRow.more_json, { kind: 'contest-more' }, people, used, 'more');
  }

  const entryParams = new URLSearchParams({
    select: 'contest_entry_id,competitors_json,more_json,scratched',
  });
  entryParams.append('contest_id', `eq.${contest.contestId}`);
  const entryRows = await fetchJson<
    Array<{ contest_entry_id: number; competitors_json: unknown; more_json: unknown; scratched: boolean | null }>
  >(
    `${POSTGREST_URL}/contest_entry?${entryParams.toString()}`,
    'Unable to load contest roster',
  );
  for (const entry of entryRows) {
    if (entry.scratched === true) {
      continue;
    }
    const origin: ContestRosterOrigin = { kind: 'contest-entry', contestEntryId: entry.contest_entry_id };
    collectRosterValue(entry.competitors_json, origin, people, used, `entry-${entry.contest_entry_id}-competitors`);
    collectRosterValue(entry.more_json, origin, people, used, `entry-${entry.contest_entry_id}-more`);
  }

  const attendeeRows = await fetchAttendeeRosterRows(contest.eventId);
  appendAttendeeRoster(contest, attendeeRows, 0, people, used);
  return people;
}

function judgingRosterContest(
  contest: JudgingHomeContest,
  source: 'json' | 'table',
): UpcomingRegistrationContest {
  return {
    id: contest.id,
    eventId: contest.eventId,
    eventName: contest.eventName,
    skillLevelLabel: contest.skillLevelLabel,
    divisionLabel: contest.divisionLabel,
    leaderCount: contest.leaderCount,
    followerCount: contest.followerCount,
    source,
    contestId: source === 'table' ? contest.contestId : null,
    itemId: contest.contestItemId,
    skillLevelKey: contest.skillLevelKey,
    divisionKey: contest.divisionKey,
    competitorsGenerated: false,
    hasGeneratedCompetitors: false,
  };
}

function mergeRosterPeople(groups: ContestRosterPerson[][]): ContestRosterPerson[] {
  const people: ContestRosterPerson[] = [];
  const seen = new Set<string>();
  for (const group of groups) {
    for (const person of group) {
      const bibKey =
        typeof person.bib === 'number' && Number.isInteger(person.bib) && person.bib > 0
          ? `${person.role}:bib:${person.bib}`
          : '';
      const idKey = `${person.role}:id:${person.id}`;
      if (seen.has(idKey) || (bibKey !== '' && seen.has(bibKey))) {
        continue;
      }
      seen.add(idKey);
      if (bibKey !== '') {
        seen.add(bibKey);
      }
      people.push(person);
    }
  }
  return people;
}

/** Leaders and followers for a Judging Home contest, from the event item and the contest row. */
export async function fetchJudgingContestRoster(
  contest: JudgingHomeContest,
): Promise<ContestRosterPerson[]> {
  const groups: ContestRosterPerson[][] = [];
  if (contest.contestItemId.trim() !== '') {
    groups.push(await fetchContestRoster(judgingRosterContest(contest, 'json')));
  }
  if (contest.contestId !== null) {
    groups.push(await fetchContestRoster(judgingRosterContest(contest, 'table')));
  }
  return mergeRosterPeople(groups);
}

async function attachGeneratedCompetitorFlags(
  contests: UpcomingRegistrationContest[],
): Promise<UpcomingRegistrationContest[]> {
  return Promise.all(
    contests.map(async (contest) => {
      const people = await fetchContestRoster(contest);
      return {
        ...contest,
        hasGeneratedCompetitors: rosterHasGeneratedCompetitors(people),
      };
    }),
  );
}

async function saveEventJsonRoster(
  contest: UpcomingRegistrationContest,
  people: ContestRosterPerson[],
): Promise<void> {
  const username = actingUsername();
  const moreJson = await fetchEventMoreJson(contest.eventId);
  const contestsNode = jsonRecord(moreJson.contests);
  if (!contestsNode || !Array.isArray(contestsNode.items)) {
    throw new Error('Unable to save contest roster.');
  }

  const index = contestsNode.items.findIndex((entry) => jsonRecord(entry)?.id === contest.itemId);
  const current = jsonRecord(contestsNode.items[index]);
  if (index < 0 || !current) {
    throw new Error('Unable to save contest roster.');
  }

  const eventPeople = people.filter((person) => person.origin.kind === 'event-json');
  const leaders = eventPeople
    .filter((person) => person.role === 'leader')
    .map(storedEventRosterPerson);
  const followers = eventPeople
    .filter((person) => person.role === 'follower')
    .map(storedEventRosterPerson);
  const nextItem: Record<string, unknown> = { ...current };
  if (leaders.length > 0) {
    nextItem.leaders = leaders;
  } else {
    delete nextItem.leaders;
  }
  if (followers.length > 0) {
    nextItem.followers = followers;
  } else {
    delete nextItem.followers;
  }

  const items = [...contestsNode.items];
  items[index] = nextItem;
  await patchTable(
    'event',
    `event_id=eq.${contest.eventId}`,
    {
      modified_by: username,
      more_json: {
        ...moreJson,
        contests: {
          ...contestsNode,
          items,
        },
      },
    },
    'Unable to save contest roster.',
  );
}

async function saveAttendeeRoster(
  contest: UpcomingRegistrationContest,
  people: ContestRosterPerson[],
): Promise<void> {
  const rows = await fetchAttendeeRosterRows(contest.eventId);
  const moreJson = contest.source === 'json' ? await fetchEventMoreJson(contest.eventId) : null;
  const siblingJsonCount = moreJson ? jsonSiblingCount(moreJson, contest) : 0;
  const username = actingUsername();

  for (const row of rows) {
    if (!Array.isArray(row.contests_json)) {
      continue;
    }

    let changed = false;
    const nextEntries: unknown[] = [];
    row.contests_json.forEach((entry, index) => {
      const enrollment = parseContestRoleEnrollment(entry);
      if (!enrollment || !enrollmentMatchesUpcoming(contest, enrollment, siblingJsonCount)) {
        nextEntries.push(entry);
        return;
      }

      const person = people.find(
        (candidate) =>
          candidate.origin.kind === 'attendee'
          && candidate.origin.attendeeId === row.attendee_id
          && candidate.origin.entryIndex === index,
      );
      if (!person) {
        changed = true;
        return;
      }
      if (person.role === enrollment.role) {
        nextEntries.push(entry);
        return;
      }

      const record = jsonRecord(entry);
      if (!record) {
        nextEntries.push(entry);
        return;
      }
      changed = true;
      nextEntries.push(setDanceRole(record, person.role));
    });

    if (!changed) {
      continue;
    }

    await patchTable(
      'attendee',
      `attendee_id=eq.${row.attendee_id}`,
      {
        modified_by: username,
        contests_json: nextEntries,
      },
      'Unable to save contest roster.',
    );
  }
}

async function savePublicContestRoster(
  contest: UpcomingRegistrationContest,
  people: ContestRosterPerson[],
): Promise<void> {
  if (contest.contestId === null) {
    return;
  }

  const username = actingUsername();
  const edits = new Map<string, ContestRosterRole>(
    people
      .filter((person) => person.origin.kind === 'contest-competitors' || person.origin.kind === 'contest-more')
      .map((person) => [person.id, person.role]),
  );

  const contestParams = new URLSearchParams({
    select: 'competitors_json,more_json',
  });
  contestParams.append('contest_id', `eq.${contest.contestId}`);
  const contestRows = await fetchJson<Array<{ competitors_json: unknown; more_json: unknown }>>(
    `${POSTGREST_URL}/contest?${contestParams.toString()}`,
    'Unable to save contest roster',
  );
  const contestRow = contestRows[0];
  if (contestRow) {
    const competitors = applyRosterEdits(contestRow.competitors_json, edits, new Set(), 'competitors');
    const more = applyRosterEdits(contestRow.more_json, edits, new Set(), 'more');
    const competitorsChanged = JSON.stringify(competitors) !== JSON.stringify(contestRow.competitors_json ?? null);
    const moreChanged = JSON.stringify(more) !== JSON.stringify(contestRow.more_json ?? null);
    if (competitorsChanged || moreChanged) {
      const today = new Date().toISOString().slice(0, 10);
      await patchTable(
        'contest',
        `contest_id=eq.${contest.contestId}`,
        {
          ...(competitorsChanged ? { competitors_json: competitors } : {}),
          ...(moreChanged ? { more_json: more } : {}),
          modified_by: username,
          modified_date: today,
        },
        'Unable to save contest roster.',
      );
    }
  }

  const entryParams = new URLSearchParams({
    select: 'contest_entry_id,competitors_json,more_json,scratched',
  });
  entryParams.append('contest_id', `eq.${contest.contestId}`);
  const entryRows = await fetchJson<
    Array<{ contest_entry_id: number; competitors_json: unknown; more_json: unknown; scratched: boolean | null }>
  >(
    `${POSTGREST_URL}/contest_entry?${entryParams.toString()}`,
    'Unable to save contest roster',
  );

  for (const entry of entryRows) {
    if (entry.scratched === true) {
      continue;
    }
    const entryEdits = new Map<string, ContestRosterRole>(
      people
        .filter(
          (person) =>
            person.origin.kind === 'contest-entry'
            && person.origin.contestEntryId === entry.contest_entry_id,
        )
        .map((person) => [person.id, person.role]),
    );
    const competitors = applyRosterEdits(
      entry.competitors_json,
      entryEdits,
      new Set(),
      `entry-${entry.contest_entry_id}-competitors`,
    );
    const more = applyRosterEdits(
      entry.more_json,
      entryEdits,
      new Set(),
      `entry-${entry.contest_entry_id}-more`,
    );
    const beforePeople: ContestRosterPerson[] = [];
    collectRosterValue(
      entry.competitors_json,
      { kind: 'contest-entry', contestEntryId: entry.contest_entry_id },
      beforePeople,
      new Set(),
      `entry-${entry.contest_entry_id}-competitors`,
    );
    collectRosterValue(
      entry.more_json,
      { kind: 'contest-entry', contestEntryId: entry.contest_entry_id },
      beforePeople,
      new Set(),
      `entry-${entry.contest_entry_id}-more`,
    );
    const remaining = beforePeople.filter((person) => entryEdits.has(person.id));
    const competitorsChanged = JSON.stringify(competitors) !== JSON.stringify(entry.competitors_json ?? null);
    const moreChanged = JSON.stringify(more) !== JSON.stringify(entry.more_json ?? null);
    if (!competitorsChanged && !moreChanged && remaining.length === beforePeople.length) {
      continue;
    }
    await patchTable(
      'contest_entry',
      `contest_entry_id=eq.${entry.contest_entry_id}`,
      {
        ...(competitorsChanged ? { competitors_json: competitors } : {}),
        ...(moreChanged ? { more_json: more } : {}),
        ...(remaining.length === 0 && beforePeople.length > 0 ? { scratched: true } : {}),
        modified_by: username,
      },
      'Unable to save contest roster.',
    );
  }
}

/** Persists scratch and leader/follower changes for one upcoming contest. */
export async function saveContestRoster(
  contest: UpcomingRegistrationContest,
  people: ContestRosterPerson[],
): Promise<void> {
  if (contest.source === 'json') {
    await saveEventJsonRoster(contest, people);
  } else {
    await savePublicContestRoster(contest, people);
  }
  await saveAttendeeRoster(contest, people);
}

export type ContestCompetitorRegistration = {
  contest: UpcomingRegistrationContest;
  role: ContestRosterRole;
  personId: string;
  firstName: string;
  lastName: string;
  bib: number;
};

const BIB_FIELD_KEYS = ['bib', 'bib_number', 'bibNumber'] as const;

function findExistingBibField(value: unknown): (typeof BIB_FIELD_KEYS)[number] | null {
  const seen = new Set<string>();
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const record = jsonRecord(node);
    if (!record) {
      return;
    }
    for (const key of BIB_FIELD_KEYS) {
      if (key in record) {
        seen.add(key);
      }
    }
    for (const nested of Object.values(record)) {
      if (nested && typeof nested === 'object') {
        visit(nested);
      }
    }
  };
  visit(value);
  return BIB_FIELD_KEYS.find((key) => seen.has(key)) ?? null;
}

function appendCompetitorValue(
  value: unknown,
  entry: Record<string, unknown>,
  role: ContestRosterRole,
): { value: unknown; changed: boolean } {
  const record = jsonRecord(value);
  if (record && (Array.isArray(record.leaders) || Array.isArray(record.followers))) {
    const key = role === 'leader' ? 'leaders' : 'followers';
    const list = Array.isArray(record[key]) ? [...record[key]] : [];
    const person = { ...entry };
    delete person.role;
    list.push(person);
    return { value: { ...record, [key]: list }, changed: true };
  }
  if (Array.isArray(value)) {
    return { value: [...value, entry], changed: true };
  }
  return { value, changed: false };
}

async function registerJsonContestCompetitor(registration: ContestCompetitorRegistration): Promise<void> {
  const people = await fetchContestRoster(registration.contest);
  if (people.some((person) => person.id === registration.personId && person.role === registration.role)) {
    return;
  }
  people.push({
    id: registration.personId,
    firstName: registration.firstName,
    lastName: registration.lastName,
    role: registration.role,
    origin: { kind: 'event-json' },
    bib: registration.bib,
  });
  await saveContestRoster(registration.contest, people);
}

async function registerTableContestCompetitor(registration: ContestCompetitorRegistration): Promise<void> {
  if (registration.contest.contestId === null) {
    throw new Error('Unable to register competitor.');
  }

  const people = await fetchContestRoster(registration.contest);
  if (people.some((person) => person.id === registration.personId && person.role === registration.role)) {
    return;
  }

  const params = new URLSearchParams({ select: 'competitors_json,more_json' });
  params.append('contest_id', `eq.${registration.contest.contestId}`);
  const rows = await fetchJson<Array<{ competitors_json: unknown; more_json: unknown }>>(
    `${POSTGREST_URL}/contest?${params.toString()}`,
    'Unable to register competitor',
  );
  const row = rows[0];
  if (!row) {
    throw new Error('Unable to register competitor.');
  }

  const bibKey = findExistingBibField(row.competitors_json) ?? findExistingBibField(row.more_json);
  const entry: Record<string, unknown> = {
    id: registration.personId,
    first_name: registration.firstName,
    last_name: registration.lastName,
    role: registration.role,
  };
  entry[bibKey ?? 'bib'] = registration.bib;

  const competitors = appendCompetitorValue(row.competitors_json, entry, registration.role);
  const more = competitors.changed
    ? { value: row.more_json, changed: false }
    : appendCompetitorValue(row.more_json, entry, registration.role);

  let nextCompetitors = competitors.value;
  let nextMore = more.value;
  if (!competitors.changed && !more.changed) {
    const current = jsonRecord(row.competitors_json);
    if (row.competitors_json == null || (current && Object.keys(current).length === 0)) {
      nextCompetitors = [entry];
    } else if (current && danceRole(current)) {
      nextCompetitors = [current, entry];
    } else {
      throw new Error('Unable to register competitor.');
    }
  }

  const username = actingUsername();
  const today = new Date().toISOString().slice(0, 10);
  await patchTable(
    'contest',
    `contest_id=eq.${registration.contest.contestId}`,
    {
      ...(nextCompetitors !== row.competitors_json ? { competitors_json: nextCompetitors } : {}),
      ...(nextMore !== row.more_json ? { more_json: nextMore } : {}),
      modified_by: username,
      modified_date: today,
    },
    'Unable to register competitor.',
  );
}

function rosterDisplayName(person: { firstName?: string; lastName?: string }, fallback: string): string {
  const name = [person.firstName, person.lastName]
    .map((part) => (part ?? '').trim())
    .filter((part) => part !== '')
    .join(' ');
  return name !== '' ? name : fallback;
}

/** Adds one registered person to each selected contest roster. Skips a contest and role they are already on. */
export async function registerContestCompetitors(
  registrations: ContestCompetitorRegistration[],
): Promise<void> {
  const rosters = await Promise.all(
    registrations.map((registration) => fetchContestRoster(registration.contest)),
  );
  const alreadyRegistered = registrations.flatMap((registration, index) => {
    const existing = rosterPersonById(rosters[index] ?? [], registration.personId);
    if (!existing) {
      return [];
    }
    const fallbackName = [registration.firstName, registration.lastName]
      .map((part) => part.trim())
      .filter((part) => part !== '')
      .join(' ');
    return [
      {
        name: rosterDisplayName(existing, fallbackName),
        bib: typeof existing.bib === 'number' ? existing.bib : null,
        contestLabel: contestSkillDivisionLabel(registration.contest),
      },
    ];
  });
  if (alreadyRegistered.length > 0) {
    throw new Error(alreadyRegisteredContestMessage(alreadyRegistered));
  }

  const conflicts = registrations.flatMap((registration, index) => {
    const roster = rosters[index] ?? [];
    if (!rosterHasBib(roster, registration.bib)) {
      return [];
    }
    const owners = bibOwnerNames(roster, registration.bib);
    return [
      {
        bib: registration.bib,
        owners,
        contestLabel: contestSkillDivisionLabel(registration.contest),
      },
    ];
  });
  if (conflicts.length > 0) {
    throw new Error(duplicateContestBibMessage(conflicts));
  }

  for (const registration of registrations) {
    if (registration.contest.source === 'json') {
      await registerJsonContestCompetitor(registration);
    } else {
      await registerTableContestCompetitor(registration);
    }
  }
}

async function writeContestCompetitorsGenerated(
  contest: UpcomingRegistrationContest,
  generated: boolean,
): Promise<void> {
  const username = actingUsername();
  if (contest.source === 'json') {
    const moreJson = await fetchEventMoreJson(contest.eventId);
    const contestsNode = jsonRecord(moreJson.contests);
    if (!contestsNode || !Array.isArray(contestsNode.items)) {
      throw new Error('Unable to update test competitors.');
    }
    const index = contestsNode.items.findIndex((entry) => jsonRecord(entry)?.id === contest.itemId);
    const current = jsonRecord(contestsNode.items[index]);
    if (index < 0 || !current) {
      throw new Error('Unable to update test competitors.');
    }
    if ((current[COMPETITORS_GENERATED_FLAG] === true) === generated) {
      return;
    }
    const items = [...contestsNode.items];
    items[index] = { ...current, [COMPETITORS_GENERATED_FLAG]: generated };
    await patchTable(
      'event',
      `event_id=eq.${contest.eventId}`,
      {
        modified_by: username,
        more_json: {
          ...moreJson,
          contests: {
            ...contestsNode,
            items,
          },
        },
      },
      'Unable to update test competitors.',
    );
    return;
  }

  if (contest.contestId === null) {
    throw new Error('Unable to update test competitors.');
  }

  const params = new URLSearchParams({ select: 'more_json' });
  params.append('contest_id', `eq.${contest.contestId}`);
  const rows = await fetchJson<Array<{ more_json: unknown }>>(
    `${POSTGREST_URL}/contest?${params.toString()}`,
    'Unable to update test competitors',
  );
  const more = moreJsonObject(rows[0]?.more_json);
  if ((more[COMPETITORS_GENERATED_FLAG] === true) === generated) {
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  await patchTable(
    'contest',
    `contest_id=eq.${contest.contestId}`,
    {
      more_json: { ...more, [COMPETITORS_GENERATED_FLAG]: generated },
      modified_by: username,
      modified_date: today,
    },
    'Unable to update test competitors.',
  );
}

async function ensureGeneratedCompetitorAccounts(
  leaderCount: number,
  followerCount: number,
): Promise<void> {
  const roster = assignTestCompetitorBibs(new Set(), leaderCount, followerCount);
  const matches = await lookupStaffRegistration(
    roster.map((person) => ({
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
    })),
  );
  const pending = accountsToCreate(
    roster,
    Object.fromEntries(roster.map((person) => [person.id, matches[person.id]?.status])),
  );
  for (const person of pending) {
    const result = await quickRegisterUser(person.firstName, person.lastName);
    if (result.ok) {
      continue;
    }
    const message = result.message?.trim() ?? '';
    if (message.toLowerCase().includes('already has an account')) {
      continue;
    }
    throw new Error(message || `Unable to register ${person.firstName} ${person.lastName}.`);
  }
}

export type GenerateContestCompetitorsResult = {
  status: 'added';
  leadersAdded: number;
  followersAdded: number;
};

/**
 * Scratches everyone on the contest, then adds the requested leaders and followers.
 * Bibs prefer 1–leaderCount and the next followerCount numbers, skipping any number still in use.
 * User accounts are Quick Registered only when that name does not already exist.
 */
export async function generateContestCompetitors(
  contest: UpcomingRegistrationContest,
  leaderCount: number,
  followerCount = leaderCount,
): Promise<GenerateContestCompetitorsResult> {
  await ensureGeneratedCompetitorAccounts(leaderCount, followerCount);

  const existing = await fetchContestRoster(contest);
  if (existing.length > 0) {
    await saveContestRoster(contest, []);
  }
  const remaining = (existing.length > 0 ? await fetchContestRoster(contest) : []).filter(
    (person) => !isGeneratedCompetitor(person),
  );
  const assigned = assignTestCompetitorBibs(usedContestBibNumbers(remaining), leaderCount, followerCount);

  if (contest.source === 'json') {
    await saveContestRoster(contest, [
      ...remaining,
      ...assigned.map((person) => ({
        id: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        role: person.role,
        origin: { kind: 'event-json' as const },
        bib: person.bib,
      })),
    ]);
  } else {
    await registerContestCompetitors(
      assigned.map((person) => ({
        contest,
        role: person.role,
        personId: person.id,
        firstName: person.firstName,
        lastName: person.lastName,
        bib: person.bib,
      })),
    );
  }

  await writeContestCompetitorsGenerated(contest, true);
  return {
    status: 'added',
    leadersAdded: assigned.filter((person) => person.role === 'leader').length,
    followersAdded: assigned.filter((person) => person.role === 'follower').length,
  };
}

export type DeleteGeneratedCompetitorsResult = {
  scratched: number;
};

/** Scratches Leader/Follower aaa–zzz only, and clears competitors_generated. */
export async function deleteGeneratedContestCompetitors(
  contest: UpcomingRegistrationContest,
): Promise<DeleteGeneratedCompetitorsResult> {
  const existing = await fetchContestRoster(contest);
  const remaining = existing.filter((person) => !isGeneratedCompetitor(person));
  const scratched = existing.length - remaining.length;
  if (scratched > 0) {
    await saveContestRoster(contest, remaining);
  }
  await writeContestCompetitorsGenerated(contest, false);
  return { scratched };
}

export type JudgeSearchUser = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  state: string;
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
    select: 'user_id,name_json,email,addresses_json',
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
    .map((row) => {
      const address = primaryAddress(row.addresses_json);
      return {
        userId: row.user_id,
        firstName: row.name_json?.first?.trim() ?? '',
        lastName: row.name_json?.last?.trim() ?? '',
        email: row.email?.trim() ?? '',
        city: address?.city?.trim() ?? '',
        state: address?.state_or_province?.trim() ?? '',
      };
    })
    .filter((user) => user.userId > 0);
}

export type EventJudgePoolMember = {
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  city: string;
  state: string;
};

type ApiEventJudgePoolMember = {
  user_id?: number | string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
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
      city: typeof entry.city === 'string' ? entry.city.trim() : '',
      state: typeof entry.state === 'string' ? entry.state.trim() : '',
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
      city: judge.city,
      state: judge.state,
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
    city: user.city,
    state: user.state,
  };
}

export type ContestCompetitorRef = {
  userId: number;
  username: string;
  displayName: string;
  firstName: string;
  lastName: string;
};

export type ContestListRow = {
  contestId: number;
  eventId: number;
  eventTypeCode: string;
  name: string;
  divisionKey: string;
  divisionLabel: string;
  stages: string[];
  participantCount: number;
  competitors: ContestCompetitorRef[];
};

type ApiContestRecord = {
  contest_id: number;
  event_id: number;
  event_type_code: string;
  competitors_json: unknown;
  results_json: unknown;
  more_json: unknown;
};

function parseContestCompetitor(value: unknown): ContestCompetitorRef | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const row = value as Record<string, unknown>;
  const userId = Number(row.user_id);
  const username = typeof row.username === 'string' ? row.username.trim() : '';
  if (!Number.isFinite(userId) || userId <= 0 || !username) {
    return null;
  }
  const firstName = typeof row.first_name === 'string' ? row.first_name.trim() : '';
  const lastName = typeof row.last_name === 'string' ? row.last_name.trim() : '';
  const displayName =
    typeof row['display-name'] === 'string' && row['display-name'].trim() !== ''
      ? row['display-name'].trim()
      : [firstName, lastName].filter(Boolean).join(' ') || username;

  return {
    userId,
    username,
    displayName,
    firstName,
    lastName,
  };
}

function parseContestStages(resultsJson: unknown): string[] {
  if (!resultsJson || typeof resultsJson !== 'object' || Array.isArray(resultsJson)) {
    return [];
  }
  const stages = (resultsJson as { stages?: unknown }).stages;
  if (!Array.isArray(stages)) {
    return [];
  }
  return stages
    .filter((stage): stage is string => typeof stage === 'string' && stage.trim() !== '')
    .map((stage) => stage.trim());
}

function mapContestListRow(row: ApiContestRecord): ContestListRow {
  const more =
    row.more_json && typeof row.more_json === 'object' && !Array.isArray(row.more_json)
      ? (row.more_json as Record<string, unknown>)
      : {};
  const competitors = Array.isArray(row.competitors_json)
    ? row.competitors_json
        .map(parseContestCompetitor)
        .filter((entry): entry is ContestCompetitorRef => entry !== null)
    : [];
  const divisionKey = typeof more.division_key === 'string' ? more.division_key.trim() : '';
  const divisionLabel =
    typeof more.division_label === 'string' ? more.division_label.trim() : '';
  const name =
    typeof more.name === 'string' && more.name.trim() !== ''
      ? more.name.trim()
      : divisionLabel || `Contest ${row.contest_id}`;
  const participantCount =
    typeof more.participant_count === 'number' && Number.isFinite(more.participant_count)
      ? more.participant_count
      : competitors.length;

  return {
    contestId: row.contest_id,
    eventId: row.event_id,
    eventTypeCode: row.event_type_code,
    name,
    divisionKey,
    divisionLabel,
    stages: parseContestStages(row.results_json),
    participantCount,
    competitors,
  };
}

export async function fetchContestsForEvent(eventId: number): Promise<ContestListRow[]> {
  const params = new URLSearchParams({
    select: 'contest_id,event_id,event_type_code,competitors_json,results_json,more_json',
    order: 'contest_id.asc',
  });
  params.append('event_id', `eq.${eventId}`);

  const rows = await fetchJson<ApiContestRecord[]>(
    `${POSTGREST_URL}/contest?${params.toString()}`,
    'Unable to load contests',
  );

  return rows.map(mapContestListRow);
}

export async function fetchContestById(contestId: number): Promise<ContestListRow | null> {
  const params = new URLSearchParams({
    select: 'contest_id,event_id,event_type_code,competitors_json,results_json,more_json',
  });
  params.append('contest_id', `eq.${contestId}`);

  const rows = await fetchJson<ApiContestRecord[]>(
    `${POSTGREST_URL}/contest?${params.toString()}`,
    'Unable to load contest',
  );

  const row = rows[0];
  return row ? mapContestListRow(row) : null;
}

async function allocateNextContestId(): Promise<number> {
  const params = new URLSearchParams({
    select: 'contest_id',
    order: 'contest_id.desc',
    limit: '1',
  });

  const rows = await fetchJson<Array<{ contest_id: number }>>(
    `${POSTGREST_URL}/contest?${params.toString()}`,
    'Unable to allocate contest id',
  );

  const maxId = rows[0]?.contest_id;
  if (typeof maxId === 'number' && Number.isFinite(maxId) && maxId > 0) {
    return Math.trunc(maxId) + 1;
  }
  return 1;
}

export type CreateTslDivisionContestInput = {
  eventId: number;
  eventCode: string;
  eventTypeCode: string;
  divisionKey: string;
  divisionLabel: string;
};

/** Insert a TSL division contest with empty pools + elimination stage documents. */
export async function createTslDivisionContest(
  input: CreateTslDivisionContestInput,
): Promise<ContestListRow> {
  const contestId = await allocateNextContestId();
  const today = new Date().toISOString().slice(0, 10);
  const actor = loadSession()?.username?.trim() || 'c-agent';

  const response = await fetch(`${POSTGREST_URL}/contest`, {
    method: 'POST',
    headers: buildAuthHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify({
      contest_id: contestId,
      event_id: input.eventId,
      competitors_json: [],
      results_json: { stages: ['pools', 'primary_elim'] },
      more_json: {
        demo: true,
        division_key: input.divisionKey,
        division_label: input.divisionLabel,
        name: input.divisionLabel,
        participant_count: 0,
      },
      event_type_code: input.eventTypeCode,
      is_active: 1,
      is_cancelled: 0,
      original_start_time: today,
      created_by: actor,
      created_date: today,
      modified_by: actor,
      modified_date: today,
    }),
  });

  if (!response.ok) {
    let message = `Unable to create contest (${response.status})`;
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

  const rows = (await response.json()) as ApiContestRecord[];
  const row = rows[0];
  if (!row) {
    throw new Error('Contest create returned no rows.');
  }

  const poolsJson = createEmptyContestStagePoolsJson({
    stage: 'pools',
    division_key: input.divisionKey,
    division_label: input.divisionLabel,
    event_code: input.eventCode,
    contest_id: contestId,
  });

  const bracketJson = createEmptyContestStageBracketJson({
    contestId,
    eventCode: input.eventCode,
    divisionKey: input.divisionKey,
    divisionLabel: input.divisionLabel,
    size: 8,
    stage: 'primary_elim',
  });

  await persistContestStagePool(contestId, 'pools', poolsJson);
  await persistContestStageBracket(contestId, 'primary_elim', bracketJson);

  return mapContestListRow(row);
}

export type ContestStagePoolRow = {
  contestStagePoolId: number;
  contestId: number;
  stage: string;
  pools: ContestStagePoolsJson;
  moreJson: Record<string, unknown> | null;
};

export type GetContestStagePoolResult = {
  ok: boolean;
  message?: string;
  contest_id?: number;
  stage?: string;
  found?: boolean;
  contest_stage_pool_id?: number;
  pools_json?: unknown;
  more_json?: unknown;
};

export type SaveContestStagePoolResult = {
  ok: boolean;
  message: string;
  contest_stage_pool_id?: number;
  contest_id?: number;
  stage?: string;
  pools_json?: unknown;
  more_json?: unknown;
};

export function getContestStagePool(contestId: number, stage: string) {
  return callRpc<GetContestStagePoolResult>('get_contest_stage_pool', {
    p_contest_id: contestId,
    p_stage: stage,
  });
}

export function saveContestStagePool(
  contestId: number,
  stage: string,
  poolsJson: ContestStagePoolsJson,
  moreJson: Record<string, unknown> | null = null,
) {
  return callRpc<SaveContestStagePoolResult>('save_contest_stage_pool', {
    p_contest_id: contestId,
    p_stage: stage,
    p_pools_json: poolsJson,
    p_more_json: moreJson,
  });
}

export async function fetchContestStagePool(
  contestId: number,
  stage: string,
): Promise<ContestStagePoolRow | null> {
  const result = await getContestStagePool(contestId, stage);
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load contest stage pool.');
  }

  if (!result.found) {
    return null;
  }

  return {
    contestStagePoolId: Number(result.contest_stage_pool_id),
    contestId: Number(result.contest_id ?? contestId),
    stage: typeof result.stage === 'string' ? result.stage : stage,
    pools: parseContestStagePoolsJson(result.pools_json),
    moreJson:
      result.more_json && typeof result.more_json === 'object' && !Array.isArray(result.more_json)
        ? (result.more_json as Record<string, unknown>)
        : null,
  };
}

export async function persistContestStagePool(
  contestId: number,
  stage: string,
  poolsJson: ContestStagePoolsJson,
  moreJson: Record<string, unknown> | null = null,
): Promise<SaveContestStagePoolResult> {
  return saveContestStagePool(contestId, stage, poolsJson, moreJson);
}

export type ContestStageBracketRow = {
  contestStageBracketId: number;
  contestId: number;
  stage: string;
  bracket: ContestStageBracketJson;
  moreJson: Record<string, unknown> | null;
};

export type GetContestStageBracketResult = {
  ok: boolean;
  message?: string;
  contest_id?: number;
  stage?: string;
  found?: boolean;
  contest_stage_bracket_id?: number;
  bracket_json?: unknown;
  more_json?: unknown;
};

export type SaveContestStageBracketResult = {
  ok: boolean;
  message: string;
  contest_stage_bracket_id?: number;
  contest_id?: number;
  stage?: string;
  bracket_json?: unknown;
  more_json?: unknown;
};

export function getContestStageBracket(contestId: number, stage: string) {
  return callRpc<GetContestStageBracketResult>('get_contest_stage_bracket', {
    p_contest_id: contestId,
    p_stage: stage,
  });
}

export function saveContestStageBracket(
  contestId: number,
  stage: string,
  bracketJson: ContestStageBracketJson,
  moreJson: Record<string, unknown> | null = null,
) {
  return callRpc<SaveContestStageBracketResult>('save_contest_stage_bracket', {
    p_contest_id: contestId,
    p_stage: stage,
    p_bracket_json: bracketJson,
    p_more_json: moreJson,
  });
}

export async function fetchContestStageBracket(
  contestId: number,
  stage: string,
): Promise<ContestStageBracketRow | null> {
  const result = await getContestStageBracket(contestId, stage);
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load contest stage bracket.');
  }

  if (!result.found) {
    return null;
  }

  return {
    contestStageBracketId: Number(result.contest_stage_bracket_id),
    contestId: Number(result.contest_id ?? contestId),
    stage: typeof result.stage === 'string' ? result.stage : stage,
    bracket: parseContestStageBracketJson(result.bracket_json),
    moreJson:
      result.more_json && typeof result.more_json === 'object' && !Array.isArray(result.more_json)
        ? (result.more_json as Record<string, unknown>)
        : null,
  };
}

export async function persistContestStageBracket(
  contestId: number,
  stage: string,
  bracketJson: ContestStageBracketJson,
  moreJson: Record<string, unknown> | null = null,
): Promise<SaveContestStageBracketResult> {
  return saveContestStageBracket(contestId, stage, bracketJson, moreJson);
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
  /** Present for inactivity_logout: idle window derived from schedule period. */
  idleTimeoutSeconds: number | null;
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
  idle_timeout_seconds?: number | null;
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
    idleTimeoutSeconds:
      typeof row.idle_timeout_seconds === 'number' ? row.idle_timeout_seconds : null,
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

export function setScheduledTaskInterval(
  jobName: string,
  intervalSeconds: number,
  staleAfterInterval?: string,
) {
  return callRpc<SetScheduledTaskScheduleResult>('set_scheduled_task_interval', {
    p_job_name: jobName,
    p_interval_seconds: intervalSeconds,
    p_stale_after_interval: staleAfterInterval ?? null,
  });
}

export type SchemaMigrationRow = {
  number: string;
  script: string;
  details: string;
  applied: boolean;
  appliedAt: string | null;
  appliedByName: string | null;
};

type ApiSchemaMigrationRow = {
  number?: string | null;
  script?: string | null;
  details?: string | null;
  applied?: boolean | null;
  applied_at?: string | null;
  applied_by_name?: string | null;
};

type ListSchemaMigrationsResult = {
  ok: boolean;
  message?: string;
  checked_at?: string | null;
  pending_count?: number;
  applied_count?: number;
  migrations?: ApiSchemaMigrationRow[];
};

export type SchemaMigrationList = {
  checkedAt: string | null;
  pendingCount: number;
  appliedCount: number;
  migrations: SchemaMigrationRow[];
};

type SchemaMigrationCheckResult = {
  ok?: boolean;
  pending_count?: number;
};

/** Runs the migration check and returns how many scripts are still needed. */
export async function fetchPendingMigrationCount(): Promise<number> {
  const result = await callRpc<SchemaMigrationCheckResult>('check_schema_migrations', {});
  return result.pending_count ?? 0;
}

type SchedulerHeartbeatStatusResult = {
  ok?: boolean;
  message?: string;
  healthy?: boolean;
  heartbeat_at?: string | null;
};

export type SchedulerHeartbeatStatus = {
  heartbeatAt: string | null;
  healthy: boolean;
};

export async function fetchSchedulerHeartbeat(nowMs = Date.now()): Promise<SchedulerHeartbeatStatus> {
  const result = await callRpc<SchedulerHeartbeatStatusResult>('scheduler_heartbeat_status', {});
  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load the scheduler heartbeat.');
  }

  const heartbeatAt = result.heartbeat_at ?? null;
  return {
    heartbeatAt,
    healthy: schedulerHeartbeatIsHealthy(heartbeatAt, nowMs),
  };
}

export async function fetchSchemaMigrations(): Promise<SchemaMigrationList> {
  const result = await callRpc<ListSchemaMigrationsResult>('list_schema_migrations', {});

  if (!result.ok) {
    throw new Error(result.message ?? 'Unable to load migration scripts.');
  }

  return {
    checkedAt: result.checked_at ?? null,
    pendingCount: result.pending_count ?? 0,
    appliedCount: result.applied_count ?? 0,
    migrations: (result.migrations ?? [])
      .map((row) => ({
        number: row.number?.trim() ?? '',
        script: row.script?.trim() ?? '',
        details: row.details?.trim() ?? '',
        applied: row.applied === true,
        appliedAt: row.applied_at ?? null,
        appliedByName: row.applied_by_name?.trim() ? row.applied_by_name.trim() : null,
      }))
      .sort(compareSchemaMigrationRowsDescending),
  };
}

export type ApplySchemaMigrationResult = {
  ok: boolean;
  message?: string;
  detail?: string | null;
  hint?: string | null;
  sqlstate?: string | null;
  applied_at?: string;
  applied_by_username?: string;
  applied_by_name?: string | null;
};

export function applySchemaMigration(filename: string) {
  return callRpc<ApplySchemaMigrationResult>('apply_schema_migration', {
    p_filename: filename,
  });
}

type ApiTrainingInstructionRow = {
  instruction_code: string;
  page_path: string;
  steps_json: unknown;
};

export async function fetchTrainingLesson(pagePath: string): Promise<TrainingLesson | null> {
  const params = new URLSearchParams({
    select: 'instruction_code,page_path,steps_json',
    order: 'training_instruction_id.asc',
    limit: '1',
  });
  params.append('page_path', `eq.${pagePath}`);

  const rows = await fetchJson<ApiTrainingInstructionRow[]>(
    `${POSTGREST_URL}/training_instructions?${params.toString()}`,
    'Unable to load training lesson',
  );
  const row = rows[0];
  if (!row) {
    return null;
  }

  return parseTrainingLesson(row.steps_json, row.instruction_code, row.page_path);
}

