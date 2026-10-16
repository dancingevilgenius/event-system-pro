/** Remove leading and trailing whitespace from a text field before it is stored. */
export function trimSavedText(value: string): string {
  return value.trim();
}

// @todo Trim saved text fields with trimSavedText on every page besides create-event.
