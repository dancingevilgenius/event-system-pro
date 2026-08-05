/** "Back to Home" → "Back to Home page" */
export function formatBackTooltip(backLabel: string): string {
  const trimmed = backLabel.trim();
  if (/ page$/i.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed} page`;
}
