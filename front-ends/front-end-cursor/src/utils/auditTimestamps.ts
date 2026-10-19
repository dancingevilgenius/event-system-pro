const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
const DISPLAYED_SECONDS_PATTERN = /(\d{1,2}:\d{2}):\d{2}(?=\s*[AP]M\b)/;

/** Drop `:ss` from a readable clock such as `5:42:28 AM`. */
export function hideDisplayedSeconds(value: string): string {
  return value.replace(new RegExp(DISPLAYED_SECONDS_PATTERN.source, 'g'), '$1');
}

const READABLE_DATE_TIME_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZoneName: 'short',
} as const;

export function formatReadableDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? hideDisplayedSeconds(value) : '';
  }

  return date.toLocaleString('en-US', READABLE_DATE_TIME_OPTIONS);
}

/** Audit Trail timestamps keep seconds so a recorded change can be told apart from the next one. */
export function formatAuditDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  return date.toLocaleString('en-US', {
    ...READABLE_DATE_TIME_OPTIONS,
    second: '2-digit',
  });
}

function formatAuditJsonValue(value: unknown): unknown {
  if (typeof value === 'string' && ISO_TIMESTAMP_PATTERN.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return formatAuditDateTime(parsed);
    }
  }

  if (Array.isArray(value)) {
    return value.map((entry) => formatAuditJsonValue(entry));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
        key,
        formatAuditJsonValue(entry),
      ]),
    );
  }

  return value;
}

export function formatAuditJsonForDisplay(value: Record<string, unknown> | null): string {
  if (!value || Object.keys(value).length === 0) {
    return '';
  }

  return JSON.stringify(formatAuditJsonValue(value), null, 2);
}
