import { describe, it, expect } from 'vitest';
import {
  utcToTimezone,
  timezoneToUtc,
  isDaylightSavings,
  getOffsetMinutes,
  getTimezoneInfo,
  getAllTimezones,
} from '../utils/timezone';

describe('Timezone Conversion', () => {
  it('should convert UTC to timezone', () => {
    const utcDate = new Date('2025-01-15T12:00:00Z');
    const nyDate = utcToTimezone(utcDate, 'America/New_York');

    // NYC is UTC-5 in January (EST)
    expect(nyDate.getHours()).toBe(7); // 12 - 5
  });

  it('should convert timezone to UTC', () => {
    // Create a local date representing 9:00 AM
    const localDate = new Date(2025, 0, 15, 9, 0, 0);
    const utcDate = timezoneToUtc(localDate, 'America/New_York');

    // Should convert back to UTC time
    expect(utcDate).toBeInstanceOf(Date);
  });

  it('should get all timezones', () => {
    const timezones = getAllTimezones();
    expect(timezones.length).toBeGreaterThan(0);
    expect(timezones).toContain('UTC');
    expect(timezones).toContain('America/New_York');
    expect(timezones).toContain('Europe/London');
    expect(timezones).toContain('Asia/Tokyo');
  });
});

describe('DST Detection', () => {
  it('should detect DST in summer', () => {
    // July in Northern Hemisphere is DST for US
    const summerDate = new Date(2025, 6, 15);
    const isDST = isDaylightSavings(summerDate, 'America/New_York');
    expect(isDST).toBe(true);
  });

  it('should detect non-DST in winter', () => {
    // January is standard time for US
    const winterDate = new Date(2025, 0, 15);
    const isDST = isDaylightSavings(winterDate, 'America/New_York');
    expect(isDST).toBe(false);
  });

  it('should get timezone info', () => {
    const date = new Date(2025, 0, 15, 12, 0, 0);
    const info = getTimezoneInfo(date, 'America/New_York');

    expect(info.name).toBe('America/New_York');
    expect(Math.abs(info.offset)).toBe(300); // EST is UTC-5 (300 minutes)
    expect(info.isDST).toBe(false);
  });
});

describe('Offset Calculation', () => {
  it('should calculate correct offset for EST', () => {
    const winterDate = new Date(2025, 0, 15);
    const offset = getOffsetMinutes(winterDate, 'America/New_York');
    expect(offset).toBe(-300); // EST is UTC-5 = -300 minutes
  });

  it('should calculate correct offset for EDT', () => {
    const summerDate = new Date(2025, 6, 15);
    const offset = getOffsetMinutes(summerDate, 'America/New_York');
    expect(offset).toBe(-240); // EDT is UTC-4 = -240 minutes
  });

  it('should get UTC offset as 0', () => {
    const date = new Date(2025, 0, 15);
    const offset = getOffsetMinutes(date, 'UTC');
    expect(offset).toBe(0);
  });
});
