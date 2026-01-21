import type { Meta, StoryObj } from '@storybook/react';
import { CalendarGrid } from './CalendarGrid';
import '../index.css';

const meta = {
  title: 'Components/CalendarGrid',
  component: CalendarGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CalendarGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic calendar grid
 */
export const Basic: Story = {
  args: {
    year: 2025,
    month: 0,
    selectedDate: new Date(2025, 0, 15),
    onDateSelect: (date: Date) => console.log('Selected:', date),
    timezone: 'UTC',
  },
};

/**
 * Calendar with disabled weekends
 */
export const DisabledWeekends: Story = {
  args: {
    year: 2025,
    month: 0,
    selectedDate: null,
    disabledDays: [0, 6],
    onDateSelect: (date: Date) => console.log('Selected:', date),
    timezone: 'UTC',
  },
};

/**
 * Calendar with min/max dates
 */
export const WithConstraints: Story = {
  args: {
    year: 2025,
    month: 0,
    selectedDate: null,
    minDate: new Date(2025, 0, 10),
    maxDate: new Date(2025, 0, 20),
    onDateSelect: (date: Date) => console.log('Selected:', date),
    timezone: 'UTC',
  },
};

/**
 * Calendar with blackout dates
 */
export const WithBlackoutDates: Story = {
  args: {
    year: 2025,
    month: 0,
    selectedDate: null,
    blackoutDates: [
      new Date(2025, 0, 1),
      new Date(2025, 0, 5),
      new Date(2025, 0, 15),
    ],
    onDateSelect: (date: Date) => console.log('Selected:', date),
    timezone: 'UTC',
  },
};

/**
 * Full keyboard navigation demonstration
 */
export const KeyboardNavigation: Story = {
  args: {
    year: 2025,
    month: 0,
    selectedDate: new Date(2025, 0, 15),
    onDateSelect: (date: Date) => console.log('Selected:', date),
    onPreviousMonth: () => console.log('Previous month'),
    onNextMonth: () => console.log('Next month'),
    timezone: 'UTC',
  },
};
