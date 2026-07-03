const ISO_TIMESTAMP_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

export function formatReadableDateTime(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

function formatAuditJsonValue(value: unknown): unknown {
  if (typeof value === 'string' && ISO_TIMESTAMP_PATTERN.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return formatReadableDateTime(parsed);
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
