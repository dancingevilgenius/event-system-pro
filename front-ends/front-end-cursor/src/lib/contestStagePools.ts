/** Contest stage pools document (HEMA / TSL-style fight pools). */

export type ContestStagePoolStatus = 'pending' | 'in_progress' | 'completed';

export type ContestStageBoutStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type ContestStagePoolRules = {
  points_to_win: number;
  double_limit: number;
};

export type ContestStageFighterRef = {
  user_id: number;
  username: string;
  'display-name': string;
};

export type ContestStageBoutFighter = ContestStageFighterRef & {
  yellow_card: boolean;
  red_card: boolean;
  withdrawal: boolean;
};

export type ContestStageBout = {
  bout_id: string;
  mat: number;
  status: ContestStageBoutStatus;
  overtime: boolean;
  simultaneous_hits: number;
  fighter_a: ContestStageBoutFighter;
  fighter_b: ContestStageBoutFighter;
  score_a: number;
  score_b: number;
  winner_username: string | null;
};

export type ContestStageStanding = {
  rank: number;
  user_id: number;
  username: string;
  'display-name': string;
  bouts_fought: number;
  wins: number;
  losses: number;
  points_for: number;
  points_against: number;
  point_diff: number;
  simultaneous_hits: number;
  yellow_cards: number;
  red_cards: number;
  withdrawal: boolean;
  advanced: boolean;
};

export type ContestStagePool = {
  pool_id: string;
  mat: number;
  status: ContestStagePoolStatus;
  fighters: ContestStageFighterRef[];
  bouts: ContestStageBout[];
  standings: ContestStageStanding[];
};

/**
 * Root document stored in `contest_stage_pool.pools_json`.
 * Labels at the root apply to every pool/bout in the stage.
 */
export type ContestStagePoolsJson = {
  stage: string;
  score_a_label: string;
  score_b_label: string;
  mat_label: string;
  overtime_label: string;
  division_key: string;
  division_label: string;
  event_code: string;
  contest_id: number;
  rules: ContestStagePoolRules;
  pools: ContestStagePool[];
};

export const DEFAULT_TSL_STAGE_LABELS = {
  score_a_label: 'Red',
  score_b_label: 'Blue',
  mat_label: 'Mat',
  overtime_label: 'Sudden Death',
} as const;

export const DEFAULT_TSL_POOL_RULES: ContestStagePoolRules = {
  points_to_win: 10,
  double_limit: 3,
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function parseFighterRef(value: unknown): ContestStageFighterRef | null {
  const row = asRecord(value);
  if (!row) {
    return null;
  }

  const userId = asNumber(row.user_id, NaN);
  const username = asString(row.username);
  const displayName = asString(row['display-name']);

  if (!Number.isFinite(userId) || !username) {
    return null;
  }

  return {
    user_id: userId,
    username,
    'display-name': displayName || username,
  };
}

function parseBoutFighter(value: unknown): ContestStageBoutFighter | null {
  const base = parseFighterRef(value);
  if (!base) {
    return null;
  }

  const row = asRecord(value) ?? {};
  return {
    ...base,
    yellow_card: asBoolean(row.yellow_card, false),
    red_card: asBoolean(row.red_card, false),
    withdrawal: asBoolean(row.withdrawal, false),
  };
}

function parseBoutStatus(value: unknown): ContestStageBoutStatus {
  const status = asString(value);
  if (
    status === 'pending' ||
    status === 'in_progress' ||
    status === 'completed' ||
    status === 'cancelled'
  ) {
    return status;
  }
  return 'pending';
}

function parsePoolStatus(value: unknown): ContestStagePoolStatus {
  const status = asString(value);
  if (status === 'pending' || status === 'in_progress' || status === 'completed') {
    return status;
  }
  return 'pending';
}

function parseBout(value: unknown): ContestStageBout | null {
  const row = asRecord(value);
  if (!row) {
    return null;
  }

  const fighterA = parseBoutFighter(row.fighter_a);
  const fighterB = parseBoutFighter(row.fighter_b);
  if (!fighterA || !fighterB) {
    return null;
  }

  const boutId = asString(row.bout_id);
  if (!boutId) {
    return null;
  }

  const winnerUsername = asString(row.winner_username);
  return {
    bout_id: boutId,
    mat: asNumber(row.mat, 0),
    status: parseBoutStatus(row.status),
    overtime: asBoolean(row.overtime, false),
    simultaneous_hits: Math.max(0, Math.trunc(asNumber(row.simultaneous_hits, 0))),
    fighter_a: fighterA,
    fighter_b: fighterB,
    score_a: asNumber(row.score_a, 0),
    score_b: asNumber(row.score_b, 0),
    winner_username: winnerUsername || null,
  };
}

function parseStanding(value: unknown): ContestStageStanding | null {
  const row = asRecord(value);
  if (!row) {
    return null;
  }

  const userId = asNumber(row.user_id, NaN);
  const username = asString(row.username);
  if (!Number.isFinite(userId) || !username) {
    return null;
  }

  return {
    rank: Math.max(1, Math.trunc(asNumber(row.rank, 1))),
    user_id: userId,
    username,
    'display-name': asString(row['display-name']) || username,
    bouts_fought: Math.max(0, Math.trunc(asNumber(row.bouts_fought, 0))),
    wins: Math.max(0, Math.trunc(asNumber(row.wins, 0))),
    losses: Math.max(0, Math.trunc(asNumber(row.losses, 0))),
    points_for: asNumber(row.points_for, 0),
    points_against: asNumber(row.points_against, 0),
    point_diff: asNumber(row.point_diff, 0),
    simultaneous_hits: Math.max(0, Math.trunc(asNumber(row.simultaneous_hits, 0))),
    yellow_cards: Math.max(0, Math.trunc(asNumber(row.yellow_cards, 0))),
    red_cards: Math.max(0, Math.trunc(asNumber(row.red_cards, 0))),
    withdrawal: asBoolean(row.withdrawal, false),
    advanced: asBoolean(row.advanced, false),
  };
}

function parsePool(value: unknown): ContestStagePool | null {
  const row = asRecord(value);
  if (!row) {
    return null;
  }

  const poolId = asString(row.pool_id);
  if (!poolId) {
    return null;
  }

  const fighters = Array.isArray(row.fighters)
    ? row.fighters.map(parseFighterRef).filter((f): f is ContestStageFighterRef => f !== null)
    : [];

  const bouts = Array.isArray(row.bouts)
    ? row.bouts.map(parseBout).filter((b): b is ContestStageBout => b !== null)
    : [];

  const standings = Array.isArray(row.standings)
    ? row.standings.map(parseStanding).filter((s): s is ContestStageStanding => s !== null)
    : [];

  return {
    pool_id: poolId,
    mat: asNumber(row.mat, 0),
    status: parsePoolStatus(row.status),
    fighters,
    bouts,
    standings,
  };
}

function parseRules(value: unknown): ContestStagePoolRules {
  const row = asRecord(value);
  if (!row) {
    return { ...DEFAULT_TSL_POOL_RULES };
  }

  return {
    points_to_win: Math.max(1, Math.trunc(asNumber(row.points_to_win, DEFAULT_TSL_POOL_RULES.points_to_win))),
    double_limit: Math.max(0, Math.trunc(asNumber(row.double_limit, DEFAULT_TSL_POOL_RULES.double_limit))),
  };
}

/** Parse and normalize a `pools_json` document from the database. */
export function parseContestStagePoolsJson(value: unknown): ContestStagePoolsJson {
  const row = asRecord(value);

  const pools = row && Array.isArray(row.pools)
    ? row.pools.map(parsePool).filter((p): p is ContestStagePool => p !== null)
    : [];

  return {
    stage: asString(row?.stage, 'pools') || 'pools',
    score_a_label: asString(row?.score_a_label, DEFAULT_TSL_STAGE_LABELS.score_a_label)
      || DEFAULT_TSL_STAGE_LABELS.score_a_label,
    score_b_label: asString(row?.score_b_label, DEFAULT_TSL_STAGE_LABELS.score_b_label)
      || DEFAULT_TSL_STAGE_LABELS.score_b_label,
    mat_label: asString(row?.mat_label, DEFAULT_TSL_STAGE_LABELS.mat_label)
      || DEFAULT_TSL_STAGE_LABELS.mat_label,
    overtime_label: asString(row?.overtime_label, DEFAULT_TSL_STAGE_LABELS.overtime_label)
      || DEFAULT_TSL_STAGE_LABELS.overtime_label,
    division_key: asString(row?.division_key),
    division_label: asString(row?.division_label),
    event_code: asString(row?.event_code),
    contest_id: asNumber(row?.contest_id, 0),
    rules: parseRules(row?.rules),
    pools,
  };
}

export function createEmptyContestStagePoolsJson(
  overrides: Partial<ContestStagePoolsJson> = {},
): ContestStagePoolsJson {
  return {
    stage: 'pools',
    ...DEFAULT_TSL_STAGE_LABELS,
    division_key: '',
    division_label: '',
    event_code: '',
    contest_id: 0,
    rules: { ...DEFAULT_TSL_POOL_RULES },
    pools: [],
    ...overrides,
  };
}

export function createEmptyBoutFighter(
  overrides: Partial<ContestStageBoutFighter> = {},
): ContestStageBoutFighter {
  return {
    user_id: 0,
    username: '',
    'display-name': '',
    yellow_card: false,
    red_card: false,
    withdrawal: false,
    ...overrides,
  };
}
