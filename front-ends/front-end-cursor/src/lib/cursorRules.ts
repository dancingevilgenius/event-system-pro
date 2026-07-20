export type CursorRule = {
  id: string;
  title: string;
  description: string;
  alwaysApply: boolean;
  globs: string | null;
  body: string;
};

import { CURSOR_RULE_RAW } from './cursorRules.generated';

function parseFrontmatterValue(raw: string): string {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function parseMdc(raw: string, id: string): CursorRule {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  let description = '';
  let alwaysApply = false;
  let globs: string | null = null;
  let body = raw;

  if (match) {
    body = match[2];
    for (const line of match[1].split('\n')) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) {
        continue;
      }

      const key = line.slice(0, colonIndex).trim();
      const value = parseFrontmatterValue(line.slice(colonIndex + 1));

      if (key === 'description') {
        description = value;
      } else if (key === 'alwaysApply') {
        alwaysApply = value === 'true';
      } else if (key === 'globs') {
        globs = value || null;
      }
    }
  }

  const titleMatch = body.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() || id;

  return {
    id,
    title,
    description,
    alwaysApply,
    globs,
    body: body.trim(),
  };
}

export function loadCursorRules(): CursorRule[] {
  return Object.entries(CURSOR_RULE_RAW)
    .map(([id, raw]) => parseMdc(raw, id))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function sortCursorRules(rules: CursorRule[], starredIds: string[]): CursorRule[] {
  if (starredIds.length === 0) {
    return [...rules];
  }

  const byId = new Map(rules.map((rule) => [rule.id, rule]));
  const starred: CursorRule[] = [];
  const seen = new Set<string>();

  for (const id of starredIds) {
    const rule = byId.get(id);
    if (rule) {
      starred.push(rule);
      seen.add(id);
    }
  }

  const rest = rules.filter((rule) => !seen.has(rule.id));
  return [...starred, ...rest];
}
