const EVENT_DISPLAY_TIME_ZONE = 'America/Chicago';

export function formatEventMonthYear(startDate: string | null | undefined): string {
  if (!startDate) {
    return 'Unknown date';
  }

  const date = new Date(startDate);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: EVENT_DISPLAY_TIME_ZONE,
  }).format(date);
}
