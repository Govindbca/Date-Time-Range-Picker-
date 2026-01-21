/**
 * Preset configurations for quick range selection
 * Deterministic rounding rules ensure consistency
 */

export interface RangePreset {
  id: string;
  label: string;
  getRange: (baseDate?: Date, timezone?: string) => { start: Date; startTime: string; end: Date; endTime: string };
  category: 'relative' | 'absolute';
}

/**
 * Get relative presets (e.g., last 7 days, today, tomorrow)
 */
export function getRelativePresets(): RangePreset[] {
  return [
    {
      id: 'today',
      label: 'Today',
      category: 'relative',
      getRange: () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        return {
          start: startDate,
          startTime: '00:00',
          end: endDate,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'yesterday',
      label: 'Yesterday',
      category: 'relative',
      getRange: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startDate = new Date(yesterday);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
        return {
          start: startDate,
          startTime: '00:00',
          end: endDate,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'tomorrow',
      label: 'Tomorrow',
      category: 'relative',
      getRange: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const startDate = new Date(tomorrow);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(tomorrow);
        endDate.setHours(23, 59, 59, 999);
        return {
          start: startDate,
          startTime: '00:00',
          end: endDate,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'last7days',
      label: 'Last 7 Days',
      category: 'relative',
      getRange: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return {
          start,
          startTime: '00:00',
          end,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'last30days',
      label: 'Last 30 Days',
      category: 'relative',
      getRange: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 29);
        start.setHours(0, 0, 0, 0);
        return {
          start,
          startTime: '00:00',
          end,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'thisMonth',
      label: 'This Month',
      category: 'relative',
      getRange: () => {
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        return {
          start,
          startTime: '00:00',
          end,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'lastMonth',
      label: 'Last Month',
      category: 'relative',
      getRange: () => {
        const start = new Date();
        start.setMonth(start.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        return {
          start,
          startTime: '00:00',
          end,
          endTime: '23:59',
        };
      },
    },
    {
      id: 'lastQuarter',
      label: 'Last 90 Days',
      category: 'relative',
      getRange: () => {
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        const start = new Date();
        start.setDate(start.getDate() - 89);
        start.setHours(0, 0, 0, 0);
        return {
          start,
          startTime: '00:00',
          end,
          endTime: '23:59',
        };
      },
    },
  ];
}

/**
 * Get a preset by ID
 */
export function getPresetById(id: string): RangePreset | null {
  const presets = getRelativePresets();
  return presets.find((p) => p.id === id) || null;
}
