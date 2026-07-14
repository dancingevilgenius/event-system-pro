import type { AuditLogRow } from '../api/postgrest';
import { parseDateTimeLocalValue } from './eventDuration';

export function formatAuditLogActor(row: Pick<
  AuditLogRow,
  'actorUsername' | 'actorFirstName' | 'actorLastName'
>): string {
  const name = [row.actorFirstName, row.actorLastName]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(' ');

  if (name && row.actorUsername.trim()) {
    return `${name} (${row.actorUsername.trim()})`;
  }

  return name || row.actorUsername.trim() || '—';
}

export function isAuditLogDateRangeValid(fromDateTime: string, toDateTime: string): boolean {
  const from = parseDateTimeLocalValue(fromDateTime);
  const to = parseDateTimeLocalValue(toDateTime);

  if (!from || !to) {
    return true;
  }

  return to.getTime() >= from.getTime();
}
