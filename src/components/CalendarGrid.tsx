import React, { useCallback, useRef } from 'react';
import { getMonthInfo, isSameDay } from '../utils/dateState';

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  disabledDays?: number[];
  blackoutDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  onPreviousMonth?: () => void;
  onNextMonth?: () => void;
  timezone: string;
}

/**
 * Calendar grid component with full keyboard navigation
 * ARIA grid semantics for screen reader accessibility
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  selectedDate,
  onDateSelect,
  disabledDays = [],
  blackoutDates = [],
  minDate,
  maxDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const monthInfo = getMonthInfo(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate all dates for the calendar grid
  const dates: (Date | null)[] = [];

  // Add empty cells before first day
  for (let i = 0; i < monthInfo.startingDayOfWeek; i++) {
    dates.push(null);
  }

  // Add actual days
  for (let day = 1; day <= monthInfo.daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }

  // Pad remaining cells
  while (dates.length % 7 !== 0) {
    dates.push(null);
  }

  const isDateDisabled = useCallback(
    (date: Date | null): boolean => {
      if (!date) return true;

      if (disabledDays.includes(date.getDay())) return true;
      if (blackoutDates.some((bd) => isSameDay(bd, date))) return true;
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;

      return false;
    },
    [disabledDays, blackoutDates, minDate, maxDate]
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      if (!isDateDisabled(date)) {
        onDateSelect(date);
      }
    },
    [isDateDisabled, onDateSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, date: Date) => {
      let handled = false;
      let targetDate: Date | null = null;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          targetDate = new Date(date);
          targetDate.setDate(targetDate.getDate() - 7);
          handled = true;
          break;
        case 'ArrowDown':
          e.preventDefault();
          targetDate = new Date(date);
          targetDate.setDate(targetDate.getDate() + 7);
          handled = true;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          targetDate = new Date(date);
          targetDate.setDate(targetDate.getDate() - 1);
          handled = true;
          break;
        case 'ArrowRight':
          e.preventDefault();
          targetDate = new Date(date);
          targetDate.setDate(targetDate.getDate() + 1);
          handled = true;
          break;
        case 'PageUp':
          e.preventDefault();
          onPreviousMonth?.();
          handled = true;
          break;
        case 'PageDown':
          e.preventDefault();
          onNextMonth?.();
          handled = true;
          break;
        case 'Home':
          e.preventDefault();
          // First day of month
          targetDate = new Date(year, month, 1);
          handled = true;
          break;
        case 'End':
          e.preventDefault();
          // Last day of month
          targetDate = new Date(year, month + 1, 0);
          handled = true;
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleDateClick(date);
          handled = true;
          break;
      }

      if (handled && targetDate && !isDateDisabled(targetDate)) {
        handleDateClick(targetDate);
        // Move focus to the new date after a brief delay
        setTimeout(() => {
          const key = `${targetDate.getFullYear()}-${targetDate.getMonth()}-${targetDate.getDate()}`;
          cellRefs.current.get(key)?.focus();
        }, 0);
      }
    },
    [year, month, handleDateClick, isDateDisabled, onPreviousMonth, onNextMonth]
  );

  const getDateKey = (date: Date | null): string => {
    if (!date) return '';
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  return (
    <div className="flex flex-col gap-date-md">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-date-md">
        <button
          onClick={onPreviousMonth}
          className="p-date-sm rounded-date-md hover:bg-date-hover focus:outline-none focus:ring-2 focus:ring-date-primary"
          aria-label={`Previous month`}
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">{monthInfo.monthName} {year}</h2>
        <button
          onClick={onNextMonth}
          className="p-date-sm rounded-date-md hover:bg-date-hover focus:outline-none focus:ring-2 focus:ring-date-primary"
          aria-label={`Next month`}
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label={`Calendar for ${monthInfo.monthName} ${year}`}
        className="grid grid-cols-7 gap-1"
      >
        {/* Day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            role="columnheader"
            className="text-center font-semibold text-sm p-date-sm text-date-text"
          >
            {day}
          </div>
        ))}

        {/* Calendar dates */}
        {dates.map((date, idx) => {
          const dateKey = getDateKey(date);
          const isDisabled = isDateDisabled(date);
          const isSelected =
            date && selectedDate && isSameDay(date, selectedDate);
          const isToday = date && isSameDay(date, new Date());

          return (
            <div
              key={idx}
              role="gridcell"
              className="aspect-square"
            >
              {date ? (
                <button
                  ref={(el) => {
                    if (el) cellRefs.current.set(dateKey, el);
                  }}
                  onClick={() => handleDateClick(date)}
                  onKeyDown={(e) => handleKeyDown(e, date)}
                  disabled={isDisabled}
                  className={`
                    w-full h-full rounded-date-md font-medium text-sm
                    transition-colors duration-150
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-date-primary
                    ${
                      isDisabled
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-date-hover cursor-pointer'
                    }
                    ${isSelected ? 'bg-date-selected text-date-primary font-bold' : ''}
                    ${isToday && !isSelected ? 'border-2 border-date-primary' : ''}
                  `}
                  aria-pressed={isSelected || undefined}
                  aria-disabled={isDisabled}
                  aria-label={`${date.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}${isToday ? ', today' : ''}${isDisabled ? ', unavailable' : ''}`}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div className="aspect-square" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

CalendarGrid.displayName = 'CalendarGrid';
