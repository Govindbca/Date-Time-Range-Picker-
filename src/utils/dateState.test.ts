import { describe, it, expect } from 'vitest';
import { isDateValid, isRangeValid, isSameDay, getDateRange } from '../utils/dateState';
import type { PickerConstraints, DateTimeRange } from '../utils/dateState';

describe('Date Validation', () => {
  it('should validate dates within constraints', () => {
    const date = new Date(2025, 0, 15);
    const constraints: PickerConstraints = {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
    };

    const result = isDateValid(date, constraints);
    expect(result.valid).toBe(true);
  });

  it('should reject dates before minDate', () => {
    const date = new Date(2024, 11, 31);
    const constraints: PickerConstraints = {
      minDate: new Date(2025, 0, 1),
    };

    const result = isDateValid(date, constraints);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('before minimum');
  });

  it('should reject dates after maxDate', () => {
    const date = new Date(2026, 0, 1);
    const constraints: PickerConstraints = {
      maxDate: new Date(2025, 11, 31),
    };

    const result = isDateValid(date, constraints);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('after maximum');
  });

  it('should reject blackout dates', () => {
    const date = new Date(2025, 0, 15);
    const constraints: PickerConstraints = {
      blackoutDates: [new Date(2025, 0, 15)],
    };

    const result = isDateValid(date, constraints);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('not available');
  });

  it('should reject disabled days', () => {
    const sundayDate = new Date(2025, 0, 5); // Sunday
    const constraints: PickerConstraints = {
      disabledDays: [0], // Sunday
    };

    const result = isDateValid(sundayDate, constraints);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('disabled');
  });
});

describe('Range Validation', () => {
  it('should validate complete ranges', () => {
    const range: DateTimeRange = {
      start: { date: new Date(2025, 0, 15), time: '09:00' },
      end: { date: new Date(2025, 0, 16), time: '17:00' },
    };
    const constraints: PickerConstraints = {};

    const result = isRangeValid(range, constraints);
    expect(result.valid).toBe(true);
  });

  it('should reject incomplete ranges', () => {
    const range: DateTimeRange = {
      start: { date: new Date(2025, 0, 15), time: null },
      end: { date: new Date(2025, 0, 16), time: '17:00' },
    };
    const constraints: PickerConstraints = {};

    const result = isRangeValid(range, constraints);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject ranges where start is after end', () => {
    const range: DateTimeRange = {
      start: { date: new Date(2025, 0, 16), time: '17:00' },
      end: { date: new Date(2025, 0, 15), time: '09:00' },
    };
    const constraints: PickerConstraints = {};

    const result = isRangeValid(range, constraints);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Start must be before end'))).toBe(true);
  });

  it('should enforce minimum duration', () => {
    const range: DateTimeRange = {
      start: { date: new Date(2025, 0, 15), time: '09:00' },
      end: { date: new Date(2025, 0, 15), time: '10:00' }, // 1 hour
    };
    const constraints: PickerConstraints = {
      minDuration: 2 * 60 * 60 * 1000, // 2 hours
    };

    const result = isRangeValid(range, constraints);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('at least'))).toBe(true);
  });

  it('should enforce maximum duration', () => {
    const range: DateTimeRange = {
      start: { date: new Date(2025, 0, 15), time: '09:00' },
      end: { date: new Date(2025, 0, 20), time: '17:00' }, // ~5 days
    };
    const constraints: PickerConstraints = {
      maxDuration: 3 * 24 * 60 * 60 * 1000, // 3 days
    };

    const result = isRangeValid(range, constraints);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('must not exceed'))).toBe(true);
  });
});

describe('Date Utilities', () => {
  it('should correctly identify same day', () => {
    const date1 = new Date(2025, 0, 15, 9, 0, 0);
    const date2 = new Date(2025, 0, 15, 17, 0, 0);
    expect(isSameDay(date1, date2)).toBe(true);
  });

  it('should identify different days', () => {
    const date1 = new Date(2025, 0, 15);
    const date2 = new Date(2025, 0, 16);
    expect(isSameDay(date1, date2)).toBe(false);
  });

  it('should generate correct date range', () => {
    const start = new Date(2025, 0, 15);
    const end = new Date(2025, 0, 20);
    const range = getDateRange(start, end);

    expect(range.length).toBe(6); // 15, 16, 17, 18, 19, 20
    expect(isSameDay(range[0], start)).toBe(true);
    expect(isSameDay(range[range.length - 1], end)).toBe(true);
  });
});
