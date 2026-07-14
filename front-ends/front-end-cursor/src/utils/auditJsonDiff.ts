import { formatAuditJsonForDisplay } from './auditTimestamps';

function isStructuralJsonLine(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed === '' ||
    trimmed === '{' ||
    trimmed === '}' ||
    trimmed === '},' ||
    trimmed === '[' ||
    trimmed === ']' ||
    trimmed === '],'
  );
}

/**
 * Returns display lines for `newData`, with `changed` true when that line
 * differs from the formatted previous-data JSON (and is content, not braces).
 */
export function getHighlightedNewDataLines(
  oldData: Record<string, unknown> | null | undefined,
  newData: Record<string, unknown> | null | undefined,
): Array<{ text: string; changed: boolean }> {
  const newText = formatAuditJsonForDisplay(newData ?? null);
  if (!newText) {
    return [];
  }

  const lines = newText.split('\n');
  const oldText = formatAuditJsonForDisplay(oldData ?? null);
  if (!oldText) {
    return lines.map((text) => ({ text, changed: false }));
  }

  const oldLines = new Set(oldText.split('\n').map((line) => line.trimEnd()));

  return lines.map((text) => {
    const normalized = text.trimEnd();
    const changed =
      !isStructuralJsonLine(normalized) && !oldLines.has(normalized);
    return { text, changed };
  });
}
