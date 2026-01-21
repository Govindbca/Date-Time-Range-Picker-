/**
 * Date range picker state model and validators
 * Handles partial selections, constraints, and validation
 */

export interface DateTimeValue {
  date: Date | null;
  time: string | null; // HH:MM format
}

export interface DateTimeRange {
  start: DateTimeValue;
  end: DateTimeValue;
}

export interface PickerConstraints {
  minDate?: Date;
  maxDate?: Date;
  blackoutDates?: Date[];
  minDuration?: number; // milliseconds
  maxDuration?: number; // milliseconds
  disabledDays?: number[]; // 0-6 (Sunday-Saturday)
}

export interface PickerState {
  range: DateTimeRange;
  activeField: 'startDate' | 'startTime' | 'endDate' | 'endTime' | null;
  timezone: string;
  constraints: PickerConstraints;
  error: string | null;
}

/**
 * Validate if a date is within constraints
 */
export function isDateValid(
  date: Date,
  constraints: PickerConstraints
): { valid: boolean; error?: string } {
  if (constraints.minDate && date < constraints.minDate) {
    return { valid: false, error: 'Date is before minimum allowed' };
  }

  if (constraints.maxDate && date > constraints.maxDate) {
    return { valid: false, error: 'Date is after maximum allowed' };
  }

  if (constraints.blackoutDates?.some((bd) => isSameDay(bd, date))) {
    return { valid: false, error: 'This date is not available' };
  }

  if (constraints.disabledDays?.includes(date.getDay())) {
    return { valid: false, error: 'This day is disabled' };
  }

  return { valid: true };
}

/**
 * Validate a complete date/time range
 */
export function isRangeValid(
  range: DateTimeRange,
  constraints: PickerConstraints
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if range is complete
  if (!range.start.date || !range.start.time) {
    errors.push('Start date and time are required');
  }

  if (!range.end.date || !range.end.time) {
    errors.push('End date and time are required');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Validate individual dates
  if (range.start.date) {
    const startValidation = isDateValid(range.start.date, constraints);
    if (!startValidation.valid) {
      errors.push(`Start: ${startValidation.error}`);
    }
  }

  if (range.end.date) {
    const endValidation = isDateValid(range.end.date, constraints);
    if (!endValidation.valid) {
      errors.push(`End: ${endValidation.error}`);
    }
  }

  // Check order
  if (range.start.date && range.end.date) {
    const startTime = combineDateTime(range.start.date, range.start.time || '00:00');
    const endTime = combineDateTime(range.end.date, range.end.time || '00:00');

    if (startTime >= endTime) {
      errors.push('Start must be before end');
    }

    // Check duration constraints
    const duration = endTime.getTime() - startTime.getTime();

    if (constraints.minDuration && duration < constraints.minDuration) {
      errors.push(
        `Duration must be at least ${formatDuration(constraints.minDuration)}`
      );
    }

    if (constraints.maxDuration && duration > constraints.maxDuration) {
      errors.push(
        `Duration must not exceed ${formatDuration(constraints.maxDuration)}`
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Combine date and time string into Date object
 */
export function combineDateTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
}

/**
 * Format duration in milliseconds to readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
}

/**
 * Check if two dates are on the same day
 */
export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Get all dates in a range
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get month and year info
 */
export function getMonthInfo(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  return {
    year,
    month,
    daysInMonth,
    startingDayOfWeek,
    monthName: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      firstDay
    ),
  };
}
