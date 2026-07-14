/** Compact schedule code shown on the Schedule button. */
export function scheduleCode(options: {
  scheduleCron: string | null;
  intervalSeconds: number | null;
  scheduleLabel?: string | null;
}): string {
  const cron = options.scheduleCron?.trim();
  if (cron) {
    return cron;
  }

  if (options.intervalSeconds != null && options.intervalSeconds > 0) {
    return `every ${options.intervalSeconds}s`;
  }

  const label = options.scheduleLabel?.trim();
  return label || '—';
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

function formatClockTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function describeCronField(
  value: string,
  unitSingular: string,
  unitPlural: string,
  namedValue?: (n: number) => string | null,
): string {
  if (value === '*') {
    return `every ${unitSingular}`;
  }

  const stepMatch = value.match(/^\*\/(\d+)$/);
  if (stepMatch) {
    const step = Number(stepMatch[1]);
    return `every ${step} ${pluralize(step, unitSingular, unitPlural)}`;
  }

  if (/^\d+$/.test(value)) {
    const n = Number(value);
    const named = namedValue?.(n);
    if (named) {
      return named;
    }
    return String(n);
  }

  return value;
}

function describeCronExpression(cron: string): string | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return null;
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  // Every N minutes: */N * * * *
  if (/^\*\/\d+$/.test(minute) && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const n = Number(minute.slice(2));
    return `This task runs every ${n} ${pluralize(n, 'minute')}.`;
  }

  // Every minute: * * * * *
  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return 'This task runs every minute.';
  }

  // Every hour at minute M: M * * * *
  if (/^\d+$/.test(minute) && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    const m = Number(minute);
    if (m === 0) {
      return 'This task runs once every hour, on the hour.';
    }
    return `This task runs once every hour, at ${m} minute${m === 1 ? '' : 's'} past the hour.`;
  }

  // Every N hours at minute M: M */N * * *
  if (
    /^\d+$/.test(minute) &&
    /^\*\/\d+$/.test(hour) &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    const m = Number(minute);
    const n = Number(hour.slice(2));
    const timePart =
      m === 0 ? 'on the hour' : `at ${m} minute${m === 1 ? '' : 's'} past the hour`;
    return `This task runs every ${n} ${pluralize(n, 'hour')}, ${timePart}.`;
  }

  // Daily at H:M: M H * * *
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    const time = formatClockTime(Number(hour), Number(minute));
    if (Number(hour) === 0 && Number(minute) === 0) {
      return `This task runs once every day at midnight (${time}).`;
    }
    return `This task runs once every day at ${time}.`;
  }

  // Weekly at H:M on weekday D: M H * * D
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    dayOfMonth === '*' &&
    month === '*' &&
    /^\d+$/.test(dayOfWeek)
  ) {
    const dow = Number(dayOfWeek);
    const weekday = WEEKDAY_NAMES[dow] ?? `day ${dayOfWeek}`;
    const time = formatClockTime(Number(hour), Number(minute));
    return `This task runs once every week on ${weekday} at ${time}.`;
  }

  // Monthly on day D at H:M: M H D * *
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    /^\d+$/.test(dayOfMonth) &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    const time = formatClockTime(Number(hour), Number(minute));
    return `This task runs once every month on day ${Number(dayOfMonth)} at ${time}.`;
  }

  // Fallback: describe each field.
  const minuteText = describeCronField(minute, 'minute', 'minutes');
  const hourText = describeCronField(hour, 'hour', 'hours');
  const dayText = describeCronField(dayOfMonth, 'day of the month', 'days of the month');
  const monthText = describeCronField(month, 'month', 'months', (n) =>
    MONTH_NAMES[n - 1] ? `in ${MONTH_NAMES[n - 1]}` : null,
  );
  const weekdayText = describeCronField(dayOfWeek, 'day of the week', 'days of the week', (n) =>
    WEEKDAY_NAMES[n] ?? null,
  );

  return (
    `This task follows the schedule code “${cron}”. ` +
    `In plain terms: minute ${minuteText}; hour ${hourText}; ${dayText}; ${monthText}; ${weekdayText}.`
  );
}

/**
 * Plain-English schedule explanation for non-technical readers.
 * Times use the scheduler timezone (America/Chicago).
 */
export function describeScheduleInPlainEnglish(options: {
  scheduleCron: string | null;
  intervalSeconds: number | null;
  scheduleLabel?: string | null;
}): string {
  if (options.intervalSeconds != null && options.intervalSeconds > 0) {
    const seconds = options.intervalSeconds;
    if (seconds % 3600 === 0) {
      const hours = seconds / 3600;
      return `This task runs every ${hours} ${pluralize(hours, 'hour')}.`;
    }
    if (seconds % 60 === 0) {
      const minutes = seconds / 60;
      return `This task runs every ${minutes} ${pluralize(minutes, 'minute')}.`;
    }
    return `This task runs every ${seconds} ${pluralize(seconds, 'second')}.`;
  }

  const cron = options.scheduleCron?.trim();
  if (cron) {
    const described = describeCronExpression(cron);
    if (described) {
      return `${described} Times use Central Time (America/Chicago).`;
    }
    return (
      `This task is scheduled with the code “${cron}”. ` +
      'Times use Central Time (America/Chicago).'
    );
  }

  const label = options.scheduleLabel?.trim();
  if (label) {
    return `This task runs on this schedule: ${label}.`;
  }

  return 'No schedule is configured for this task.';
}
