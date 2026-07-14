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
 * Returns display lines for `sourceData`, with `changed` true when that line
 * differs from the formatted `compareData` JSON (and is content, not braces).
 */
export function getHighlightedJsonLines(
  sourceData: Record<string, unknown> | null | undefined,
  compareData: Record<string, unknown> | null | undefined,
): Array<{ text: string; changed: boolean }> {
  const sourceText = formatAuditJsonForDisplay(sourceData ?? null);
  if (!sourceText) {
    return [];
  }

  const lines = sourceText.split('\n');
  const compareText = formatAuditJsonForDisplay(compareData ?? null);
  if (!compareText) {
    return lines.map((text) => ({ text, changed: false }));
  }

  const compareLines = new Set(compareText.split('\n').map((line) => line.trimEnd()));

  return lines.map((text) => {
    const normalized = text.trimEnd();
    const changed =
      !isStructuralJsonLine(normalized) && !compareLines.has(normalized);
    return { text, changed };
  });
}
