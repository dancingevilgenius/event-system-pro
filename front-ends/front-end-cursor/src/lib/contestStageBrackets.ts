/** Contest stage elimination bracket document (HEMA / TSL knockout). */

import { DEFAULT_TSL_STAGE_LABELS } from './contestStagePools';

export type ContestStageBracketFormat = 'single-elimination';

export type ContestStageBracketParticipant = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  'display-name': string;
};

export type ContestStageBracketMatch = {
  id: string;
  round_index: number;
  match_index: number;
  slot_a: ContestStageBracketParticipant | null;
  slot_b: ContestStageBracketParticipant | null;
  winner: ContestStageBracketParticipant | null;
  loser: ContestStageBracketParticipant | null;
};

export type ContestStageBracketRound = {
  name: string;
  matches: ContestStageBracketMatch[];
};

/**
 * Root document stored in `contest_stage_bracket.bracket_json`.
 * Labels at the root match the pools stage conventions.
 */
export type ContestStageBracketJson = {
  stage: string;
  score_a_label: string;
  score_b_label: string;
  mat_label: string;
  overtime_label: string;
  division_key: string;
  division_label: string;
  event_code: string;
  contest_id: number;
  format: ContestStageBracketFormat;
  size: number;
  updated_at: string | null;
  rounds: ContestStageBracketRound[];
  champion: ContestStageBracketParticipant | null;
};

const ROUND_LABELS_BY_SIZE: Record<number, string[]> = {
  2: ['Final'],
  4: ['Semifinals', 'Final'],
  8: ['Quarterfinals', 'Semifinals', 'Final'],
  16: ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'],
  32: ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'],
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

function parseParticipant(value: unknown): ContestStageBracketParticipant | null {
  const row = asRecord(value);
  if (!row) {
    return null;
  }

  const userId = asNumber(row.user_id, NaN);
  const username = asString(row.username);
  if (!Number.isFinite(userId) || !username) {
    return null;
  }

  const firstName = asString(row.first_name);
  const lastName = asString(row.last_name);
  const displayName =
    asString(row['display-name']) ||
    [firstName, lastName].filter(Boolean).join(' ') ||
    username;

  return {
    user_id: userId,
    username,
    first_name: firstName,
    last_name: lastName,
    'display-name': displayName,
  };
}

function parseMatch(value: unknown, roundIndex: number, matchIndex: number): ContestStageBracketMatch {
  const row = asRecord(value) ?? {};
  return {
    id: asString(row.id) || `r${roundIndex}-m${matchIndex}`,
    round_index: asNumber(row.round_index, roundIndex),
    match_index: asNumber(row.match_index, matchIndex),
    slot_a: parseParticipant(row.slot_a),
    slot_b: parseParticipant(row.slot_b),
    winner: parseParticipant(row.winner),
    loser: parseParticipant(row.loser),
  };
}

function roundLabelsForSize(size: number): string[] {
  if (ROUND_LABELS_BY_SIZE[size]) {
    return ROUND_LABELS_BY_SIZE[size];
  }

  const roundCount = Math.max(1, Math.round(Math.log2(size)));
  return Array.from({ length: roundCount }, (_, index) => {
    if (index === roundCount - 1) {
      return 'Final';
    }
    const remaining = 2 ** (roundCount - index);
    return `Round of ${remaining}`;
  });
}

/** Build an empty single-elimination bracket skeleton (slots unfilled). */
export function createEmptyContestStageBracketJson(options: {
  contestId: number;
  eventCode: string;
  divisionKey: string;
  divisionLabel: string;
  size?: number;
  stage?: string;
  labels?: Partial<typeof DEFAULT_TSL_STAGE_LABELS>;
}): ContestStageBracketJson {
  const size = options.size ?? 8;
  if (size < 2 || (size & (size - 1)) !== 0) {
    throw new Error(`Bracket size must be a power of 2 (received ${size}).`);
  }

  const labels = { ...DEFAULT_TSL_STAGE_LABELS, ...options.labels };
  const roundNames = roundLabelsForSize(size);
  const rounds: ContestStageBracketRound[] = roundNames.map((name, roundIndex) => {
    const matchCount = size / 2 ** (roundIndex + 1);
    return {
      name,
      matches: Array.from({ length: matchCount }, (_, matchIndex) => ({
        id: `r${roundIndex}-m${matchIndex}`,
        round_index: roundIndex,
        match_index: matchIndex,
        slot_a: null,
        slot_b: null,
        winner: null,
        loser: null,
      })),
    };
  });

  return {
    stage: options.stage ?? 'primary_elim',
    score_a_label: labels.score_a_label,
    score_b_label: labels.score_b_label,
    mat_label: labels.mat_label,
    overtime_label: labels.overtime_label,
    division_key: options.divisionKey,
    division_label: options.divisionLabel,
    event_code: options.eventCode,
    contest_id: options.contestId,
    format: 'single-elimination',
    size,
    updated_at: null,
    rounds,
    champion: null,
  };
}

/** Parse and normalize a `bracket_json` document from the database. */
export function parseContestStageBracketJson(value: unknown): ContestStageBracketJson {
  const row = asRecord(value);
  const size = Math.max(2, Math.trunc(asNumber(row?.size, 8)));

  const rounds: ContestStageBracketRound[] = [];
  if (row && Array.isArray(row.rounds)) {
    row.rounds.forEach((roundValue, roundIndex) => {
      const roundRow = asRecord(roundValue);
      const matchesRaw = roundRow && Array.isArray(roundRow.matches) ? roundRow.matches : [];
      rounds.push({
        name: asString(roundRow?.name) || roundLabelsForSize(size)[roundIndex] || `Round ${roundIndex + 1}`,
        matches: matchesRaw.map((match, matchIndex) => parseMatch(match, roundIndex, matchIndex)),
      });
    });
  }

  return {
    stage: asString(row?.stage, 'primary_elim') || 'primary_elim',
    score_a_label:
      asString(row?.score_a_label, DEFAULT_TSL_STAGE_LABELS.score_a_label) ||
      DEFAULT_TSL_STAGE_LABELS.score_a_label,
    score_b_label:
      asString(row?.score_b_label, DEFAULT_TSL_STAGE_LABELS.score_b_label) ||
      DEFAULT_TSL_STAGE_LABELS.score_b_label,
    mat_label:
      asString(row?.mat_label, DEFAULT_TSL_STAGE_LABELS.mat_label) ||
      DEFAULT_TSL_STAGE_LABELS.mat_label,
    overtime_label:
      asString(row?.overtime_label, DEFAULT_TSL_STAGE_LABELS.overtime_label) ||
      DEFAULT_TSL_STAGE_LABELS.overtime_label,
    division_key: asString(row?.division_key),
    division_label: asString(row?.division_label),
    event_code: asString(row?.event_code),
    contest_id: asNumber(row?.contest_id, 0),
    format: 'single-elimination',
    size,
    updated_at: asString(row?.updated_at) || null,
    rounds,
    champion: parseParticipant(row?.champion),
  };
}
