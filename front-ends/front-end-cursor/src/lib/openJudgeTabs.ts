import { assignedContestJudgeIds } from './judgingFinalsEntries';
import { parseRoles, type UserSession } from './session';

export type OpenJudgeContestChoice = {
  key: string;
  label: string;
  judgeStaffIds: string[];
};

export type OpenJudgeTableContest = {
  contestId: number;
  moreJson: unknown;
  staffJson: unknown;
};

export type OpenJudgePanel = {
  contestId: number;
  judgesJson: unknown;
};

const HANDOFF_PREFIX = 'esp_judge_tab_handoff:';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function text(record: Record<string, unknown> | null, ...keys: string[]): string {
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

function contestItems(moreJson: unknown): Record<string, unknown>[] {
  const contests = asRecord(asRecord(moreJson)?.contests);
  const items = contests?.items;
  if (!Array.isArray(items)) {
    return [];
  }
  return items.flatMap((entry) => {
    const item = asRecord(entry);
    return item ? [item] : [];
  });
}

function contestLabel(record: Record<string, unknown>, fallback: string): string {
  const division = text(record, 'division_label', 'divisionLabel', 'name');
  const skill = text(record, 'skill_level_label', 'skillLevelLabel');
  const label = [division, skill].filter((part) => part !== '').join(' · ');
  return label === '' ? fallback : label;
}

function uniqueIds(groups: string[][]): string[] {
  const ids: string[] = [];
  for (const group of groups) {
    for (const id of group) {
      const trimmed = id.trim();
      if (trimmed !== '' && !ids.includes(trimmed)) {
        ids.push(trimmed);
      }
    }
  }
  return ids;
}

function judgeIds(records: unknown[], staffJson?: unknown, panelJudges?: unknown): string[] {
  return uniqueIds([
    assignedContestJudgeIds({ records, staffJson }),
    assignedContestJudgeIds({ panelJudges }),
  ]);
}

/** Event-json contests, then contest-table rows that are not the same item. */
export function openJudgeContestChoices(input: {
  moreJson: unknown;
  tableContests?: readonly OpenJudgeTableContest[];
  panels?: readonly OpenJudgePanel[];
}): OpenJudgeContestChoice[] {
  const itemIds = new Set<string>();
  const choices: OpenJudgeContestChoice[] = [];

  contestItems(input.moreJson).forEach((item, index) => {
    const id = text(item, 'id');
    const key = id === '' ? `json:${index}` : id;
    if (id !== '') {
      itemIds.add(id);
    }
    choices.push({
      key,
      label: contestLabel(item, `Contest ${index + 1}`),
      judgeStaffIds: judgeIds([item]),
    });
  });

  const panelsByContest = new Map<number, unknown>();
  for (const panel of input.panels ?? []) {
    const current = panelsByContest.get(panel.contestId);
    const next = Array.isArray(panel.judgesJson) ? panel.judgesJson : [];
    panelsByContest.set(
      panel.contestId,
      Array.isArray(current) ? [...current, ...next] : next,
    );
  }

  for (const row of input.tableContests ?? []) {
    const more = asRecord(row.moreJson);
    const itemId = text(more, 'id', 'contest_item_id', 'contestItemId');
    if (itemId !== '' && itemIds.has(itemId)) {
      continue;
    }
    choices.push({
      key: `table:${row.contestId}`,
      label: contestLabel(more ?? {}, `Contest ${row.contestId}`),
      judgeStaffIds: judgeIds(
        more ? [more] : [],
        row.staffJson,
        panelsByContest.get(row.contestId),
      ),
    });
  }

  return choices;
}

export function filterEventGroupOptions<T extends { fullName: string; eventGroupCode: string }>(
  groups: readonly T[],
  filter: string,
): T[] {
  const query = filter.trim().toLowerCase();
  if (query === '') {
    return [...groups];
  }
  return groups.filter((group) => {
    const name = group.fullName.toLowerCase();
    const code = group.eventGroupCode.toLowerCase();
    return name.includes(query) || code.includes(query);
  });
}

export function sessionFromJudgeHandoff(raw: string): UserSession | null {
  try {
    const parsed = JSON.parse(raw) as Partial<UserSession>;
    if (
      typeof parsed.user_id !== 'number'
      || !Number.isInteger(parsed.user_id)
      || parsed.user_id <= 0
      || typeof parsed.username !== 'string'
      || parsed.username.trim() === ''
    ) {
      return null;
    }

    return {
      user_id: parsed.user_id,
      username: parsed.username.trim(),
      email: typeof parsed.email === 'string' ? parsed.email.trim() : '',
      roles: parseRoles(parsed.roles),
      token: typeof parsed.token === 'string' ? parsed.token : null,
    };
  } catch {
    return null;
  }
}

export function storeJudgeTabHandoff(session: UserSession): string {
  const key = `${HANDOFF_PREFIX}${crypto.randomUUID()}`;
  localStorage.setItem(key, JSON.stringify(session));
  return key;
}

export function publishJudgeTabHandoff(slotId: string, session: UserSession): void {
  localStorage.setItem(`${HANDOFF_PREFIX}${slotId}`, JSON.stringify(session));
}

export function takeJudgeTabHandoff(key: string): UserSession | null {
  const storageKey = key.startsWith(HANDOFF_PREFIX) ? key : `${HANDOFF_PREFIX}${key}`;
  if (!storageKey.startsWith(HANDOFF_PREFIX) || storageKey === HANDOFF_PREFIX) {
    return null;
  }
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }
  localStorage.removeItem(storageKey);
  return sessionFromJudgeHandoff(raw);
}

export function judgeTabHandoffPath(key: string): string {
  return `/judge-tab?handoff=${encodeURIComponent(key)}`;
}

/** Open this during the click, then publish the session under the same slot id. */
export function pendingJudgeTabPath(slotId: string): string {
  return `/judge-tab?pending=${encodeURIComponent(slotId)}`;
}
