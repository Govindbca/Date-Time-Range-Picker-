/**
 * Timezone-aware date utilities with DST handling
 * All operations maintain the semantic meaning of the selected instant
 * DST transitions do not shift the selected UTC instant
 */

export interface TimezoneInfo {
  name: string;
  offset: number; // minutes from UTC
  abbreviation: string;
  isDST: boolean;
}

/**
 * Get all IANA timezone names
 */
export function getAllTimezones(): string[] {
  // Core list of common timezones
  return [
    // UTC
    'UTC',
    'GMT',
    // Americas
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Toronto',
    'America/Mexico_City',
    'America/Buenos_Aires',
    'America/Sao_Paulo',
    // Europe
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Prague',
    'Europe/Warsaw',
    'Europe/Moscow',
    'Europe/Istanbul',
    // Asia
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Bangkok',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Asia/Jakarta',
    'Asia/Manila',
    // Australia
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Australia/Adelaide',
    // Pacific
    'Pacific/Auckland',
    'Pacific/Fiji',
  ];
}

/**
 * Convert UTC date to local timezone
 * Maintains semantic meaning: the instant represented stays the same
 */
export function utcToTimezone(utcDate: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(utcDate);
  const values = parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>
  );

  // Create local date representing the timezone-adjusted time
  const localDate = new Date(
    parseInt(values.year),
    parseInt(values.month) - 1,
    parseInt(values.day),
    parseInt(values.hour),
    parseInt(values.minute),
    parseInt(values.second)
  );

  return localDate;
}

/**
 * Convert timezone-local date to UTC
 * Handles DST transitions without silent coercion
 */
export function timezoneToUtc(localDate: Date, timezone: string): Date {
  // Use native formatter to get the offset for this specific instant
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'shortOffset',
  });

  // Create a test UTC date
  const parts = formatter.formatToParts(localDate);
  let offset = 0;

  // Extract offset from timeZoneName part (e.g., "GMT-5", "GMT+2")
  const tzPart = parts.find((p) => p.type === 'timeZoneName');
  if (tzPart) {
    const match = tzPart.value.match(/GMT([+-]\d+)/);
    if (match) {
      offset = parseInt(match[1]) * 60; // Convert hours to minutes
    }
  }

  // Calculate UTC time by subtracting the offset
  const utcTime = localDate.getTime() - offset * 60 * 1000;
  return new Date(utcTime);
}

/**
 * Get timezone offset info at a specific instant
 */
export function getTimezoneInfo(date: Date, timezone: string): TimezoneInfo {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'long',
  });

  const parts = formatter.formatToParts(date);
  const tzNamePart = parts.find((p) => p.type === 'timeZoneName');
  const tzName = tzNamePart?.value || timezone;

  // Get offset
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));

  const offsetMs = utcDate.getTime() - tzDate.getTime();
  const offsetMinutes = offsetMs / (1000 * 60);

  return {
    name: timezone,
    offset: offsetMinutes,
    abbreviation: tzName.substring(0, 4),
    isDST: isDaylightSavings(date, timezone),
  };
}

/**
 * Check if a date is in DST for a given timezone
 */
export function isDaylightSavings(date: Date, timezone: string): boolean {
  // Create dates 6 months apart
  const d1 = new Date(date);
  const d2 = new Date(date);
  d2.setMonth(d2.getMonth() + 6);

  // Get offsets at both times
  const offset1 = getOffsetMinutes(d1, timezone);
  const offset2 = getOffsetMinutes(d2, timezone);

  // If current date has larger offset (closer to UTC), it's in DST
  return offset1 > offset2;
}

/**
 * Get timezone offset in minutes for a specific date
 */
export function getOffsetMinutes(date: Date, timezone: string): number {
  const utcFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const utcParts = utcFormatter.formatToParts(date);
  const tzParts = tzFormatter.formatToParts(date);

  const getValues = (
    parts: Intl.DateTimeFormatPart[]
  ): { hours: number; minutes: number } => {
    const values = parts.reduce(
      (acc, part) => {
        acc[part.type] = part.value;
        return acc;
      },
      {} as Record<string, string>
    );
    return {
      hours: parseInt(values.hour || '0'),
      minutes: parseInt(values.minute || '0'),
    };
  };

  const utcTime = getValues(utcParts);
  const tzTime = getValues(tzParts);

  const utcTotalMinutes = utcTime.hours * 60 + utcTime.minutes;
  const tzTotalMinutes = tzTime.hours * 60 + tzTime.minutes;

  return tzTotalMinutes - utcTotalMinutes;
}

/**
 * Format date for display in a specific timezone
 */
export function formatInTimezone(
  date: Date,
  timezone: string,
  format: 'short' | 'long' = 'short'
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: format === 'short' ? '2-digit' : 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Calculate days between two dates (accounting for timezone)
 */
export function daysBetween(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get the start of day in a timezone
 */
export function getStartOfDay(date: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const values = parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>
  );

  const startDate = new Date(
    parseInt(values.year),
    parseInt(values.month) - 1,
    parseInt(values.day),
    0,
    0,
    0
  );

  return timezoneToUtc(startDate, timezone);
}

/**
 * Get the end of day in a timezone
 */
export function getEndOfDay(date: Date, timezone: string): Date {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(date);
  const values = parts.reduce(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {} as Record<string, string>
  );

  const endDate = new Date(
    parseInt(values.year),
    parseInt(values.month) - 1,
    parseInt(values.day),
    23,
    59,
    59,
    999
  );

  return timezoneToUtc(endDate, timezone);
}
