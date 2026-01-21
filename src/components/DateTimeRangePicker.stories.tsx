import type { Meta, StoryObj } from '@storybook/react';
import { DateTimeRangePicker } from './DateTimeRangePicker';
import { getRelativePresets } from '../utils/presets';
import '../index.css';

const meta = {
  title: 'Components/DateTimeRangePicker',
  component: DateTimeRangePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
} satisfies Meta<typeof DateTimeRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic usage with no constraints
 */
export const Basic: Story = {
  args: {
    timezone: 'UTC',
    presets: getRelativePresets().slice(0, 3),
  },
};

/**
 * With minimum and maximum date constraints
 */
export const WithDateConstraints: Story = {
  args: {
    timezone: 'America/New_York',
    constraints: {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
    },
    presets: getRelativePresets().slice(0, 5),
  },
};

/**
 * With duration constraints (minimum 1 hour, maximum 7 days)
 */
export const WithDurationConstraints: Story = {
  args: {
    timezone: 'Europe/London',
    constraints: {
      minDuration: 60 * 60 * 1000, // 1 hour
      maxDuration: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    presets: getRelativePresets(),
  },
};

/**
 * With disabled weekends
 */
export const BusinessDaysOnly: Story = {
  args: {
    timezone: 'America/Chicago',
    constraints: {
      disabledDays: [0, 6], // Sunday and Saturday
    },
    presets: getRelativePresets().slice(0, 4),
  },
};

/**
 * With blackout dates (e.g., holidays)
 */
export const WithBlackoutDates: Story = {
  args: {
    timezone: 'Asia/Tokyo',
    constraints: {
      blackoutDates: [
        new Date(2025, 0, 1), // New Year
        new Date(2025, 1, 11), // Foundation Day (Japan)
        new Date(2025, 2, 21), // Spring Equinox (Japan)
      ],
    },
    presets: getRelativePresets().slice(0, 3),
  },
};

/**
 * Multiple timezone support
 */
export const MultipleTimezones: Story = {
  args: {
    timezone: 'Australia/Sydney',
    constraints: {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
    },
    presets: getRelativePresets(),
  },
};

/**
 * Edge case: DST transition dates (US Spring Forward)
 * March 9, 2025 - clocks spring forward at 2:00 AM
 */
export const DSTTransitionSpringForward: Story = {
  args: {
    timezone: 'America/New_York',
    startDate: new Date(2025, 2, 8),
    startTime: '23:00',
    endDate: new Date(2025, 2, 10),
    endTime: '12:00',
    constraints: {
      minDate: new Date(2025, 2, 1),
      maxDate: new Date(2025, 2, 31),
    },
  },
};

/**
 * Edge case: DST transition dates (US Fall Back)
 * November 2, 2025 - clocks fall back at 2:00 AM
 */
export const DSTTransitionFallBack: Story = {
  args: {
    timezone: 'America/Los_Angeles',
    startDate: new Date(2025, 10, 1),
    startTime: '23:00',
    endDate: new Date(2025, 10, 3),
    endTime: '12:00',
    constraints: {
      minDate: new Date(2025, 10, 1),
      maxDate: new Date(2025, 10, 30),
    },
  },
};

/**
 * Keyboard-only navigation test
 * Instructions: Use Tab to navigate, arrow keys in calendar, Enter to select
 */
export const KeyboardOnlyNavigation: Story = {
  args: {
    timezone: 'UTC',
    constraints: {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
          **Keyboard Navigation:**
          - Tab: Move between fields
          - Arrow keys: Navigate calendar dates (↑ week up, ↓ week down, ← day back, → day forward)
          - PageUp/PageDown: Previous/Next month
          - Home/End: First/Last day of month
          - Enter/Space: Select date
          - Up/Down arrows in time: Adjust hours
          - Left/Right arrows in time: Adjust minutes (15-min intervals)
        `,
      },
    },
  },
};

/**
 * Pre-filled range
 */
export const PrefilledRange: Story = {
  args: {
    startDate: new Date(2025, 0, 15),
    startTime: '09:00',
    endDate: new Date(2025, 0, 20),
    endTime: '17:00',
    timezone: 'America/New_York',
    presets: getRelativePresets().slice(0, 3),
  },
};

/**
 * High contrast mode support
 */
export const HighContrastMode: Story = {
  args: {
    timezone: 'UTC',
    constraints: {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
    },
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * Accessibility test: Screen reader compatibility
 * Should announce all dates, error messages, and state changes
 */
export const AccessibilityTest: Story = {
  args: {
    timezone: 'Europe/Berlin',
    constraints: {
      minDate: new Date(2025, 0, 1),
      maxDate: new Date(2025, 11, 31),
      minDuration: 2 * 60 * 60 * 1000,
    },
    presets: getRelativePresets().slice(0, 3),
  },
  parameters: {
    docs: {
      description: {
        story: `
          **Accessibility Features:**
          - ARIA labels on all interactive elements
          - ARIA grid for calendar
          - Role announcements for state changes
          - Error messages announced as alerts
          - Focus management and visible focus indicators
          - Semantic HTML structure
        `,
      },
    },
  },
};

/**
 * Multiple timezone comparison
 */
export const TimezoneComparison: Story = {
  render: () => {
    const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
    return (
      <div className="flex flex-col gap-8">
        {timezones.map((tz) => (
          <div key={tz}>
            <h3 className="text-lg font-bold mb-4">{tz}</h3>
            <DateTimeRangePicker
              timezone={tz}
              presets={getRelativePresets().slice(0, 3).map((p) => ({
                label: p.label,
                getRange: () => {
                  const range = p.getRange(new Date(), tz);
                  return {
                    start: range.start,
                    startTime: '00:00',
                    end: range.end,
                    endTime: '23:59',
                  };
                },
              }))}
            />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Loading and empty states
 */
export const EmptyState: Story = {
  args: {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    timezone: 'UTC',
  },
};
