export const SCHEDULE_FREQUENCIES = [
  'once_every_30_seconds',
  'once_a_minute',
  'once_every_10_minutes',
  'once_every_30_minutes',
  'once_an_hour',
  'once_a_day',
  'once_a_week',
  'once_a_year',
] as const;

export type ScheduleFrequency = (typeof SCHEDULE_FREQUENCIES)[number];

export type SchedulePeriod = 'AM' | 'PM';

export type ScheduleTimeOfDay = {
  hour12: number;
  minute: number;
  period: SchedulePeriod;
};

export type ParsedSchedulePreset = {
  frequency: ScheduleFrequency | 'custom';
  time: ScheduleTimeOfDay;
  dayOfWeek: number;
  dayOfMonth: number;
  month: number;
};

export type BuiltSchedule =
  | { kind: 'cron'; cron: string }
  | { kind: 'interval'; intervalSeconds: number };

export const SCHEDULE_FREQUENCY_OPTIONS: Array<{
  value: ScheduleFrequency;
  label: string;
}> = [
  { value: 'once_every_30_seconds', label: 'Once every 30 seconds' },
  { value: 'once_a_minute', label: 'Once a minute' },
  { value: 'once_every_10_minutes', label: 'Once every 10 minutes' },
  { value: 'once_every_30_minutes', label: 'Once every 30 minutes' },
  { value: 'once_an_hour', label: 'Once an hour' },
  { value: 'once_a_day', label: 'Once a day' },
  { value: 'once_a_week', label: 'Once a week' },
  { value: 'once_a_year', label: 'Once a year' },
];

export function scheduleFrequencyLabel(options: {
  scheduleCron: string | null;
  intervalSeconds: number | null;
}): string {
  const { frequency } = parseSchedulePreset(options);
  if (frequency === 'custom') {
    return 'Custom schedule';
  }

  return (
    SCHEDULE_FREQUENCY_OPTIONS.find((option) => option.value === frequency)?.label ??
    'Custom schedule'
  );
}

export function needsTimeOfDay(frequency: ScheduleFrequency | 'custom'): boolean {
  return (
    frequency === 'once_a_day' ||
    frequency === 'once_a_week' ||
    frequency === 'once_a_year'
  );
}

export function toHour24(hour12: number, period: SchedulePeriod): number {
  const hour = ((hour12 - 1) % 12) + 1;
  if (period === 'AM') {
    return hour === 12 ? 0 : hour;
  }
  return hour === 12 ? 12 : hour + 12;
}

export function fromHour24(hour24: number): Omit<ScheduleTimeOfDay, 'minute'> {
  const period: SchedulePeriod = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

const DEFAULT_TIME: ScheduleTimeOfDay = {
  hour12: 12,
  minute: 0,
  period: 'AM',
};

function defaultParsed(): ParsedSchedulePreset {
  return {
    frequency: 'custom',
    time: { ...DEFAULT_TIME },
    dayOfWeek: 0,
    dayOfMonth: 1,
    month: 1,
  };
}

export function parseSchedulePreset(options: {
  scheduleCron: string | null;
  intervalSeconds: number | null;
}): ParsedSchedulePreset {
  if (options.intervalSeconds != null) {
    const parsed = defaultParsed();
    if (options.intervalSeconds === 30) {
      return { ...parsed, frequency: 'once_every_30_seconds' };
    }
    return parsed;
  }

  const cron = options.scheduleCron?.trim();
  if (!cron) {
    return defaultParsed();
  }

  const parts = cron.split(/\s+/);
  if (parts.length !== 5) {
    return defaultParsed();
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const parsed = defaultParsed();

  // Once a minute: * * * * *
  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    return { ...parsed, frequency: 'once_a_minute' };
  }

  // Every 10 minutes: */10 * * * *
  if (
    minute === '*/10' &&
    hour === '*' &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    return { ...parsed, frequency: 'once_every_10_minutes' };
  }

  // Every 30 minutes: */30 * * * *
  if (
    minute === '*/30' &&
    hour === '*' &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    return { ...parsed, frequency: 'once_every_30_minutes' };
  }

  // Once an hour: M * * * *
  if (
    /^\d+$/.test(minute) &&
    hour === '*' &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    return {
      ...parsed,
      frequency: 'once_an_hour',
      time: { ...DEFAULT_TIME, minute: Number(minute) },
    };
  }

  // Once a day: M H * * *
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    dayOfMonth === '*' &&
    month === '*' &&
    dayOfWeek === '*'
  ) {
    return {
      ...parsed,
      frequency: 'once_a_day',
      time: {
        ...fromHour24(Number(hour)),
        minute: Number(minute),
      },
    };
  }

  // Once a week: M H * * D
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    dayOfMonth === '*' &&
    month === '*' &&
    /^\d+$/.test(dayOfWeek)
  ) {
    return {
      ...parsed,
      frequency: 'once_a_week',
      dayOfWeek: Number(dayOfWeek),
      time: {
        ...fromHour24(Number(hour)),
        minute: Number(minute),
      },
    };
  }

  // Once a year: M H D Mo *
  if (
    /^\d+$/.test(minute) &&
    /^\d+$/.test(hour) &&
    /^\d+$/.test(dayOfMonth) &&
    /^\d+$/.test(month) &&
    dayOfWeek === '*'
  ) {
    return {
      ...parsed,
      frequency: 'once_a_year',
      dayOfMonth: Number(dayOfMonth),
      month: Number(month),
      time: {
        ...fromHour24(Number(hour)),
        minute: Number(minute),
      },
    };
  }

  return parsed;
}

export function buildScheduleFromPreset(
  frequency: ScheduleFrequency,
  time: ScheduleTimeOfDay,
  options?: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    month?: number;
  },
): BuiltSchedule {
  if (frequency === 'once_every_30_seconds') {
    return { kind: 'interval', intervalSeconds: 30 };
  }

  return {
    kind: 'cron',
    cron: buildCronFromPreset(frequency, time, options),
  };
}

export function buildCronFromPreset(
  frequency: ScheduleFrequency,
  time: ScheduleTimeOfDay,
  options?: {
    dayOfWeek?: number;
    dayOfMonth?: number;
    month?: number;
  },
): string {
  const minute = Math.min(59, Math.max(0, Math.trunc(time.minute)));
  const hour24 = toHour24(time.hour12, time.period);
  const dayOfWeek = options?.dayOfWeek ?? 0;
  const dayOfMonth = options?.dayOfMonth ?? 1;
  const month = options?.month ?? 1;

  switch (frequency) {
    case 'once_every_30_seconds':
      throw new Error('once_every_30_seconds uses interval_seconds, not cron');
    case 'once_a_minute':
      return '* * * * *';
    case 'once_every_10_minutes':
      return '*/10 * * * *';
    case 'once_every_30_minutes':
      return '*/30 * * * *';
    case 'once_an_hour':
      return '0 * * * *';
    case 'once_a_day':
      return `${minute} ${hour24} * * *`;
    case 'once_a_week':
      return `${minute} ${hour24} * * ${dayOfWeek}`;
    case 'once_a_year':
      return `${minute} ${hour24} ${dayOfMonth} ${month} *`;
    default: {
      const _exhaustive: never = frequency;
      return _exhaustive;
    }
  }
}

/** Suggested stale_after_interval text for PostgreSQL interval literals. */
export function staleAfterForFrequency(frequency: ScheduleFrequency): string {
  switch (frequency) {
    case 'once_every_30_seconds':
      return '2 minutes';
    case 'once_a_minute':
      return '5 minutes';
    case 'once_every_10_minutes':
      return '45 minutes';
    case 'once_every_30_minutes':
      return '2 hours';
    case 'once_an_hour':
      return '3 hours';
    case 'once_a_day':
      return '25 hours';
    case 'once_a_week':
      return '8 days';
    case 'once_a_year':
      return '400 days';
    default: {
      const _exhaustive: never = frequency;
      return _exhaustive;
    }
  }
}
