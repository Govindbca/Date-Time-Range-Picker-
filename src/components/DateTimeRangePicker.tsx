import React, { useState, useCallback } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { TimeInput } from './TimeInput';
import { getAllTimezones, formatInTimezone } from '../utils/timezone';
import type { PickerConstraints } from '../utils/dateState';
import { isRangeValid } from '../utils/dateState';

interface DateTimeRangePickerProps {
  startDate?: Date | null;
  startTime?: string | null;
  endDate?: Date | null;
  endTime?: string | null;
  timezone?: string;
  constraints?: PickerConstraints;
  onRangeChange?: (range: {
    startDate: Date | null;
    startTime: string | null;
    endDate: Date | null;
    endTime: string | null;
  }) => void;
  presets?: Array<{
    label: string;
    getRange: () => { start: Date; startTime: string; end: Date; endTime: string };
  }>;
}

/**
 * Main DateTimeRangePicker component
 * Timezone-aware, accessible, DST-safe date/time range picker
 * Full keyboard navigation and screen reader support
 */
export const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  startDate: initialStartDate = null,
  startTime: initialStartTime = null,
  endDate: initialEndDate = null,
  endTime: initialEndTime = null,
  timezone: initialTimezone = 'UTC',
  constraints = {},
  onRangeChange,
  presets = [],
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [startTime, setStartTime] = useState<string | null>(initialStartTime);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [endTime, setEndTime] = useState<string | null>(initialEndTime);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [errors, setErrors] = useState<string[]>([]);

  const handleRangeChange = useCallback(() => {
    const range = {
      startDate,
      startTime,
      endDate,
      endTime,
    };

    const validation = isRangeValid(
      {
        start: { date: startDate, time: startTime },
        end: { date: endDate, time: endTime },
      },
      constraints
    );

    setErrors(validation.errors);
    if (validation.valid) {
      onRangeChange?.(range);
    }
  }, [startDate, startTime, endDate, endTime, constraints, onRangeChange]);

  const handleStartDateSelect = useCallback((date: Date) => {
    setStartDate(date);
    // Auto-advance to end date if start is set
    if (!endDate) {
      // Calendar will stay visible for end date selection
    }
  }, [endDate]);

  const handleEndDateSelect = useCallback((date: Date) => {
    setEndDate(date);
  }, []);

  const handlePresetClick = useCallback(
    (preset: (typeof presets)[0]) => {
      const range = preset.getRange();
      setStartDate(range.start);
      setStartTime(range.startTime);
      setEndDate(range.end);
      setEndTime(range.endTime);
      onRangeChange?.({
        startDate: range.start,
        startTime: range.startTime,
        endDate: range.end,
        endTime: range.endTime,
      });
    },
    [onRangeChange]
  );

  return (
    <div className="w-full max-w-2xl bg-white rounded-date-lg border-2 border-date-border p-date-lg shadow-lg">
      {/* Header */}
      <div className="mb-date-lg">
        <h2 className="text-2xl font-bold text-date-text mb-date-md">
          Select Date & Time Range
        </h2>
      </div>

      {/* Timezone Selector */}
      <div className="mb-date-lg">
        <label htmlFor="tz-select" className="block text-sm font-semibold mb-date-sm">
          Timezone
        </label>
        <select
          id="tz-select"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full px-date-md py-date-sm rounded-date-md border-2 border-date-border focus:outline-none focus:ring-2 focus:ring-date-primary"
          aria-label="Select timezone"
        >
          {getAllTimezones().map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      {/* Presets */}
      {presets.length > 0 && (
        <div className="mb-date-lg">
          <p className="text-sm font-semibold mb-date-sm">Quick Selection</p>
          <div className="flex flex-wrap gap-date-sm">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(preset)}
                className="px-date-md py-date-sm rounded-date-md bg-date-primary text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-date-primary"
                aria-label={`Select preset: ${preset.label}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div
          role="alert"
          className="mb-date-md p-date-md bg-red-50 border-2 border-date-error rounded-date-md"
        >
          {errors.map((error, idx) => (
            <p key={idx} className="text-date-error text-sm">
              • {error}
            </p>
          ))}
        </div>
      )}

      {/* Start & End Date/Time Pickers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-date-lg mb-date-lg">
        {/* Start Date/Time */}
        <fieldset className="p-date-md border-2 border-date-border rounded-date-md">
          <legend className="font-semibold text-date-text mb-date-md">
            Start Date & Time
          </legend>

          <label htmlFor="start-time" className="block text-sm font-medium mb-date-sm">
            Time
          </label>
          <TimeInput
            value={startTime}
            onChange={(time) => {
              setStartTime(time);
            }}
            aria-label="Start time"
          />

          <div className="mt-date-md">
            <label className="block text-sm font-medium mb-date-sm">Date</label>
            <div className="border-2 border-date-border rounded-date-md p-date-md">
              <CalendarGrid
                year={currentCalendarDate.getFullYear()}
                month={currentCalendarDate.getMonth()}
                selectedDate={startDate}
                onDateSelect={handleStartDateSelect}
                disabledDays={constraints.disabledDays}
                blackoutDates={constraints.blackoutDates}
                minDate={constraints.minDate}
                maxDate={constraints.maxDate}
                onPreviousMonth={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentCalendarDate(newDate);
                }}
                onNextMonth={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentCalendarDate(newDate);
                }}
                timezone={timezone}
              />
            </div>
          </div>

          {startDate && startTime && (
            <div className="mt-date-md p-date-sm bg-date-selected rounded-date-md">
              <p className="text-sm font-semibold">
                {formatInTimezone(new Date(`${startDate.toISOString().split('T')[0]}T${startTime}`), timezone)}
              </p>
            </div>
          )}
        </fieldset>

        {/* End Date/Time */}
        <fieldset className="p-date-md border-2 border-date-border rounded-date-md">
          <legend className="font-semibold text-date-text mb-date-md">
            End Date & Time
          </legend>

          <label htmlFor="end-time" className="block text-sm font-medium mb-date-sm">
            Time
          </label>
          <TimeInput
            value={endTime}
            onChange={(time) => {
              setEndTime(time);
            }}
            aria-label="End time"
          />

          <div className="mt-date-md">
            <label className="block text-sm font-medium mb-date-sm">Date</label>
            <div className="border-2 border-date-border rounded-date-md p-date-md">
              <CalendarGrid
                year={currentCalendarDate.getFullYear()}
                month={currentCalendarDate.getMonth()}
                selectedDate={endDate}
                onDateSelect={handleEndDateSelect}
                disabledDays={constraints.disabledDays}
                blackoutDates={constraints.blackoutDates}
                minDate={constraints.minDate}
                maxDate={constraints.maxDate}
                onPreviousMonth={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentCalendarDate(newDate);
                }}
                onNextMonth={() => {
                  const newDate = new Date(currentCalendarDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentCalendarDate(newDate);
                }}
                timezone={timezone}
              />
            </div>
          </div>

          {endDate && endTime && (
            <div className="mt-date-md p-date-sm bg-date-selected rounded-date-md">
              <p className="text-sm font-semibold">
                {formatInTimezone(new Date(`${endDate.toISOString().split('T')[0]}T${endTime}`), timezone)}
              </p>
            </div>
          )}
        </fieldset>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-date-md">
        <button
          onClick={handleRangeChange}
          className="flex-1 px-date-lg py-date-md rounded-date-md bg-date-primary text-white font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-date-primary"
          aria-label="Apply selected date and time range"
        >
          Apply
        </button>
        <button
          onClick={() => {
            setStartDate(null);
            setStartTime(null);
            setEndDate(null);
            setEndTime(null);
            setErrors([]);
          }}
          className="px-date-lg py-date-md rounded-date-md border-2 border-date-border text-date-text font-semibold hover:bg-date-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-date-primary"
          aria-label="Clear all selections"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

DateTimeRangePicker.displayName = 'DateTimeRangePicker';
