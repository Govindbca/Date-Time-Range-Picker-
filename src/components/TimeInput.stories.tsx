import type { Meta, StoryObj } from '@storybook/react';
import { TimeInput } from './TimeInput';
import '../index.css';

const meta = {
  title: 'Components/TimeInput',
  component: TimeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic time input
 */
export const Basic: Story = {
  args: {
    value: '14:30',
    onChange: (time: string) => console.log('Time changed:', time),
  },
};

/**
 * Empty time input
 */
export const Empty: Story = {
  args: {
    value: null,
    onChange: (time: string) => console.log('Time changed:', time),
  },
};

/**
 * Disabled time input
 */
export const Disabled: Story = {
  args: {
    value: '09:00',
    onChange: (time: string) => console.log('Time changed:', time),
    disabled: true,
  },
};

/**
 * Time input with keyboard navigation
 * Arrow Up/Down: Change hours
 * Arrow Left/Right: Change minutes (15-min intervals)
 */
export const KeyboardNavigation: Story = {
  args: {
    value: '12:00',
    onChange: (time: string) => console.log('Time changed:', time),
  },
};

/**
 * Accessibility test
 */
export const A11y: Story = {
  args: {
    value: '10:30',
    onChange: (time: string) => console.log('Time changed:', time),
    'aria-label': 'Event start time',
    'aria-describedby': 'time-help',
  },
};
