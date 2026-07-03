import type { Match as BracketUiMatch } from 'react-bracket-ui';

export type BracketCompetitor = {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  'display-name': string;
  label: string;
};

export type BracketMatch = {
  id: string;
  roundIndex: number;
  matchIndex: number;
  slotA: BracketCompetitor | null;
  slotB: BracketCompetitor | null;
  winnerId: number | null;
  loserId: number | null;
};

export type BracketState = {
  rounds: BracketMatch[][];
};

export type BracketParticipantJson = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  'display-name': string;
};

export type BracketMatchJson = {
  id: string;
  round_index: number;
  match_index: number;
  slot_a: BracketParticipantJson | null;
  slot_b: BracketParticipantJson | null;
  winner: BracketParticipantJson | null;
  loser: BracketParticipantJson | null;
};

export type BracketStateJson = {
  format: 'single-elimination';
  size: 16;
  updated_at: string;
  rounds: {
    name: string;
    matches: BracketMatchJson[];
  }[];
  champion: BracketParticipantJson | null;
};

const ROUND_LABELS = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'] as const;

export function roundLabel(roundIndex: number): string {
  return ROUND_LABELS[roundIndex] ?? `Round ${roundIndex + 1}`;
}

function matchId(roundIndex: number, matchIndex: number): string {
  return `r${roundIndex}-m${matchIndex}`;
}

function cloneState(state: BracketState): BracketState {
  return {
    rounds: state.rounds.map((round) =>
      round.map((match) => ({
        ...match,
        slotA: match.slotA ? { ...match.slotA } : null,
        slotB: match.slotB ? { ...match.slotB } : null,
      })),
    ),
  };
}

export function buildInitialBracket(competitors: BracketCompetitor[]): BracketState {
  if (competitors.length !== 16) {
    throw new Error(`Tournament bracket demo requires exactly 16 competitors (received ${competitors.length}).`);
  }

  const roundOf16: BracketMatch[] = Array.from({ length: 8 }, (_, matchIndex) => ({
    id: matchId(0, matchIndex),
    roundIndex: 0,
    matchIndex,
    slotA: competitors[matchIndex * 2] ?? null,
    slotB: competitors[matchIndex * 2 + 1] ?? null,
    winnerId: null,
    loserId: null,
  }));

  const quarterfinals = createEmptyRound(1, 4);
  const semifinals = createEmptyRound(2, 2);
  const finalRound = createEmptyRound(3, 1);

  return {
    rounds: [roundOf16, quarterfinals, semifinals, finalRound],
  };
}

function createEmptyRound(roundIndex: number, matchCount: number): BracketMatch[] {
  return Array.from({ length: matchCount }, (_, matchIndex) => ({
    id: matchId(roundIndex, matchIndex),
    roundIndex,
    matchIndex,
    slotA: null,
    slotB: null,
    winnerId: null,
    loserId: null,
  }));
}

function competitorById(match: BracketMatch, userId: number): BracketCompetitor | null {
  if (match.slotA?.userId === userId) {
    return match.slotA;
  }

  if (match.slotB?.userId === userId) {
    return match.slotB;
  }

  return null;
}

function clearRoundFrom(state: BracketState, roundIndex: number) {
  for (let round = roundIndex; round < state.rounds.length; round += 1) {
    for (const match of state.rounds[round]) {
      if (round === roundIndex) {
        match.winnerId = null;
        match.loserId = null;
      } else {
        match.slotA = null;
        match.slotB = null;
        match.winnerId = null;
        match.loserId = null;
      }
    }
  }
}

function advanceWinner(state: BracketState, roundIndex: number, matchIndex: number) {
  const match = state.rounds[roundIndex][matchIndex];
  if (!match.winnerId) {
    return;
  }

  const winner = competitorById(match, match.winnerId);
  if (!winner) {
    return;
  }

  const nextRound = state.rounds[roundIndex + 1];
  if (!nextRound) {
    return;
  }

  const nextMatch = nextRound[Math.floor(matchIndex / 2)];
  if (!nextMatch) {
    return;
  }

  if (matchIndex % 2 === 0) {
    nextMatch.slotA = winner;
  } else {
    nextMatch.slotB = winner;
  }
}

export function setMatchOutcome(
  state: BracketState,
  matchIdValue: string,
  winnerId: number,
): BracketState {
  const next = cloneState(state);

  let roundIndex = -1;
  let matchIndex = -1;
  let match: BracketMatch | undefined;

  for (let round = 0; round < next.rounds.length; round += 1) {
    const foundIndex = next.rounds[round].findIndex((entry) => entry.id === matchIdValue);
    if (foundIndex >= 0) {
      roundIndex = round;
      matchIndex = foundIndex;
      match = next.rounds[round][foundIndex];
      break;
    }
  }

  if (!match || roundIndex < 0) {
    return state;
  }

  const winner = competitorById(match, winnerId);
  if (!winner) {
    return state;
  }

  const loser = match.slotA?.userId === winnerId ? match.slotB : match.slotA;

  if (!match.slotA || !match.slotB || !loser) {
    return state;
  }

  clearRoundFrom(next, roundIndex + 1);
  match.winnerId = winnerId;
  match.loserId = loser.userId;
  advanceWinner(next, roundIndex, matchIndex);

  return next;
}

export function formatCompetitorName(firstName: string, lastName: string): string {
  const first = firstName.trim();
  const last = lastName.trim();
  const full = [first, last].filter(Boolean).join(' ');
  return full || 'Unnamed user';
}

export function toBracketParticipantJson(
  competitor: BracketCompetitor | null,
): BracketParticipantJson | null {
  if (!competitor) {
    return null;
  }

  return {
    user_id: competitor.userId,
    username: competitor.username,
    first_name: competitor.firstName,
    last_name: competitor.lastName,
    'display-name': competitor['display-name'],
  };
}

export function serializeBracketState(
  state: BracketState,
  updatedAt = new Date(),
): BracketStateJson {
  const finalMatch = state.rounds[3]?.[0];
  const championCompetitor =
    finalMatch?.winnerId != null ? competitorById(finalMatch, finalMatch.winnerId) : null;

  return {
    format: 'single-elimination',
    size: 16,
    updated_at: updatedAt.toISOString(),
    rounds: state.rounds.map((round, roundIndex) => ({
      name: roundLabel(roundIndex),
      matches: round.map((match) => ({
        id: match.id,
        round_index: match.roundIndex,
        match_index: match.matchIndex,
        slot_a: toBracketParticipantJson(match.slotA),
        slot_b: toBracketParticipantJson(match.slotB),
        winner:
          match.winnerId != null ? toBracketParticipantJson(competitorById(match, match.winnerId)) : null,
        loser:
          match.loserId != null ? toBracketParticipantJson(competitorById(match, match.loserId)) : null,
      })),
    })),
    champion: toBracketParticipantJson(championCompetitor),
  };
}

function nextMatchId(roundIndex: number, matchIndex: number): string | null {
  if (roundIndex >= 3) {
    return null;
  }

  return matchId(roundIndex + 1, Math.floor(matchIndex / 2));
}

export function bracketStateToUiMatches(state: BracketState): BracketUiMatch[] {
  const matches: BracketUiMatch[] = [];

  for (const round of state.rounds) {
    for (const match of round) {
      const participant1 = match.slotA
        ? { id: match.slotA.userId, name: match.slotA['display-name'] }
        : null;
      const participant2 = match.slotB
        ? { id: match.slotB.userId, name: match.slotB['display-name'] }
        : null;

      matches.push({
        id: match.id,
        round: match.roundIndex + 1,
        matchNumber: match.matchIndex + 1,
        participant1,
        participant2,
        winner: match.winnerId,
        nextMatchId: nextMatchId(match.roundIndex, match.matchIndex),
      });
    }
  }

  return matches;
}
