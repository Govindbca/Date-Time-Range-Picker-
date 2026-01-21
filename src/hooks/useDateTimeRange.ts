import { useState, useCallback } from 'react';
import type { DateTimeRange, PickerConstraints, PickerState } from '../utils/dateState';
import { isDateValid, isRangeValid } from '../utils/dateState';

/**
 * Custom hook for managing date/time range picker state
 * Handles validation, constraint checking, and user interactions
 */
export function useDateTimeRangeState(
  initialTimezone: string = 'UTC',
  initialConstraints: PickerConstraints = {}
) {
  const [state, setState] = useState<PickerState>({
    range: {
      start: { date: null, time: null },
      end: { date: null, time: null },
    },
    activeField: null,
    timezone: initialTimezone,
    constraints: initialConstraints,
    error: null,
  });

  const setStartDate = useCallback((date: Date | null) => {
    setState((prev) => {
      const newRange = {
        ...prev.range,
        start: { ...prev.range.start, date },
      };

      let error: string | null = null;
      if (date) {
        const validation = isDateValid(date, prev.constraints);
        if (!validation.valid) {
          error = validation.error || null;
        }
      }

      return { ...prev, range: newRange, error };
    });
  }, []);

  const setStartTime = useCallback((time: string | null) => {
    setState((prev) => {
      const newRange = {
        ...prev.range,
        start: { ...prev.range.start, time },
      };
      return { ...prev, range: newRange };
    });
  }, []);

  const setEndDate = useCallback((date: Date | null) => {
    setState((prev) => {
      const newRange = {
        ...prev.range,
        end: { ...prev.range.end, date },
      };

      let error: string | null = null;
      if (date) {
        const validation = isDateValid(date, prev.constraints);
        if (!validation.valid) {
          error = validation.error || null;
        }
      }

      return { ...prev, range: newRange, error };
    });
  }, []);

  const setEndTime = useCallback((time: string | null) => {
    setState((prev) => {
      const newRange = {
        ...prev.range,
        end: { ...prev.range.end, time },
      };
      return { ...prev, range: newRange };
    });
  }, []);

  const setRange = useCallback((range: DateTimeRange) => {
    setState((prev) => {
      const validation = isRangeValid(range, prev.constraints);
      return {
        ...prev,
        range,
        error: validation.errors[0] || null,
      };
    });
  }, []);

  const setTimezone = useCallback((timezone: string) => {
    setState((prev) => ({ ...prev, timezone }));
  }, []);

  const setActiveField = useCallback(
    (field: 'startDate' | 'startTime' | 'endDate' | 'endTime' | null) => {
      setState((prev) => ({ ...prev, activeField: field }));
    },
    []
  );

  const setConstraints = useCallback((constraints: PickerConstraints) => {
    setState((prev) => ({ ...prev, constraints }));
  }, []);

  const validate = useCallback((): boolean => {
    const validation = isRangeValid(state.range, state.constraints);
    setState((prev) => ({
      ...prev,
      error: validation.errors[0] || null,
    }));
    return validation.valid;
  }, [state.range, state.constraints]);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      range: {
        start: { date: null, time: null },
        end: { date: null, time: null },
      },
      activeField: null,
      error: null,
    }));
  }, []);

  return {
    state,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setRange,
    setTimezone,
    setActiveField,
    setConstraints,
    validate,
    reset,
  };
}

/**
 * Custom hook for calendar grid navigation with keyboard support
 */
export function useCalendarNavigation(
  initialDate: Date = new Date(),
  onDateSelect?: (date: Date) => void
) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToPreviousMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  }, []);

  const goToToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onDateSelect?.(today);
  }, [onDateSelect]);

  const selectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    },
    [onDateSelect]
  );

  const selectDateRelative = useCallback(
    (offset: number) => {
      const newDate = new Date(selectedDate || currentDate);
      newDate.setDate(newDate.getDate() + offset);
      selectDate(newDate);
    },
    [selectedDate, currentDate, selectDate]
  );

  return {
    currentDate,
    selectedDate,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    selectDateRelative,
  };
}

/**
 * Custom hook for time input management
 */
export function useTimeInput(initialTime: string = '00:00') {
  const [time, setTime] = useState(initialTime);
  const [error, setError] = useState<string | null>(null);

  const updateTime = useCallback((newTime: string) => {
    // Validate HH:MM format
    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(newTime)) {
      setError('Invalid time format (HH:MM)');
      return false;
    }
    setTime(newTime);
    setError(null);
    return true;
  }, []);

  const incrementHour = useCallback(() => {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    const newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    setTime(newTime);
  }, [time]);

  const decrementHour = useCallback(() => {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = hours === 0 ? 23 : hours - 1;
    const newTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    setTime(newTime);
  }, [time]);

  const incrementMinute = useCallback(() => {
    const [hours, minutes] = time.split(':').map(Number);
    const newTotalMinutes = (hours * 60 + minutes + 15) % (24 * 60);
    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    setTime(newTime);
  }, [time]);

  const decrementMinute = useCallback(() => {
    const [hours, minutes] = time.split(':').map(Number);
    let newTotalMinutes = hours * 60 + minutes - 15;
    if (newTotalMinutes < 0) newTotalMinutes += 24 * 60;
    const newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    const newTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    setTime(newTime);
  }, [time]);

  return {
    time,
    setTime,
    error,
    updateTime,
    incrementHour,
    decrementHour,
    incrementMinute,
    decrementMinute,
  };
}
