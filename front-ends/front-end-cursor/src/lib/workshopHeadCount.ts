export const HEAD_COUNT_MAX = 300;

export const ALL_WORKSHOP_DAYS = 'all';

export type WorkshopHeadCountRow = {
  id: string;
  workshop: string;
  instructors: string;
  room: string;
  /** Weekday, full month, day, year. Example: Saturday October 31, 2026 */
  dayLabel: string;
  /** 12-hour time without seconds. Example: 10:00 AM */
  timeLabel: string;
};

export const MOCK_WORKSHOPS: WorkshopHeadCountRow[] = [
  {
    id: 'wcs-foundations',
    workshop: 'West Coast Swing Foundations',
    instructors: 'Maria Lopez',
    room: 'Ballroom A',
    dayLabel: 'Friday October 30, 2026',
    timeLabel: '4:00 PM',
  },
  {
    id: 'musicality-lab',
    workshop: 'Musicality Lab',
    instructors: 'James Chen, Priya Shah',
    room: 'Studio 2',
    dayLabel: 'Saturday October 31, 2026',
    timeLabel: '10:00 AM',
  },
  {
    id: 'connection-frame',
    workshop: 'Connection and Frame',
    instructors: 'Maria Lopez',
    room: 'Ballroom B',
    dayLabel: 'Saturday October 31, 2026',
    timeLabel: '1:30 PM',
  },
  {
    id: 'advanced-patterns',
    workshop: 'Advanced Patterns',
    instructors: 'Jordan Hale',
    room: 'Studio 1',
    dayLabel: 'Sunday November 1, 2026',
    timeLabel: '11:00 AM',
  },
];

export function workshopDayOptions(rows: WorkshopHeadCountRow[]): string[] {
  const days: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.dayLabel)) {
      continue;
    }
    seen.add(row.dayLabel);
    days.push(row.dayLabel);
  }
  return days;
}

export function filterWorkshops(
  rows: WorkshopHeadCountRow[],
  instructorQuery: string,
  dayLabel: string,
): WorkshopHeadCountRow[] {
  const query = instructorQuery.trim().toLowerCase();
  return rows.filter((row) => {
    const instructorMatch =
      query === '' || row.instructors.toLowerCase().includes(query);
    const dayMatch = dayLabel === ALL_WORKSHOP_DAYS || row.dayLabel === dayLabel;
    return instructorMatch && dayMatch;
  });
}

/** Whole numbers from 1 through 300. Blank stays blank. Anything else is rejected or clamped. */
export function sanitizeHeadCountInput(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return '';
  }
  if (!/^\d+$/.test(trimmed)) {
    return '';
  }
  const value = Number(trimmed);
  if (!Number.isSafeInteger(value) || value < 1) {
    return '';
  }
  if (value > HEAD_COUNT_MAX) {
    return String(HEAD_COUNT_MAX);
  }
  return String(value);
}
