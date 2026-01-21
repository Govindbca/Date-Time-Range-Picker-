# Date-Time-Range-Picker-
# Timezone-Aware Date & Time Range Picker

A production-ready, accessible, and keyboard-navigable date and time range picker with comprehensive timezone and DST support.

## Features

- **Timezone Support**: Works with all IANA timezone definitions
- **DST Safety**: Correctly handles daylight saving time transitions without silent coercion
- **Full Keyboard Navigation**: Complete keyboard-only workflow support
- **Accessibility**: ARIA labels, grid semantics, screen reader support
- **Constraints**: Min/max dates, duration limits, blackout dates, disabled days
- **Presets**: Relative date presets (Today, Last 7 Days, etc.) with deterministic rounding
- **Type-Safe**: Full TypeScript with strict mode enabled
- **No Dependencies**: Built from scratch, no third-party UI libraries

## Tech Stack

- React 18+
- TypeScript (strict mode)
- Vite
- Tailwind CSS with CSS variables
- Storybook for component documentation
- Vitest for unit tests
- ESLint + TypeScript ESLint
- Prettier for code formatting

## Installation & Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the picker in action.

## Quick Start

### View Storybook (Component Documentation)

```bash
npm run storybook
```

Opens at `http://localhost:6006` with interactive component demos including:
- Basic usage
- Date constraints
- Duration constraints
- Disabled weekends
- Blackout dates
- DST transitions
- Keyboard navigation
- Accessibility tests
- Multiple timezone comparison

### Run Tests

```bash
npm run test
```

Runs comprehensive tests for:
- Date validation logic
- Range constraints enforcement
- Timezone conversions and DST handling
- Presets and duration calculations

### View Test UI

```bash
npm run test:ui
```

Interactive test visualization at `http://localhost:51204`

## Usage Example

```tsx
import { DateTimeRangePicker, getRelativePresets } from './index';

export default function App() {
  return (
    <DateTimeRangePicker
      timezone="America/New_York"
      constraints={{
        minDate: new Date(2025, 0, 1),
        maxDate: new Date(2025, 11, 31),
        minDuration: 60 * 60 * 1000, // 1 hour minimum
      }}
      presets={getRelativePresets()}
      onRangeChange={(range) => {
        console.log('Selected:', range);
      }}
    />
  );
}
```

## Component API

### DateTimeRangePicker

Main component with full date/time range selection, timezone switching, and constraint enforcement.

**Props:**
- `startDate?: Date | null`
- `startTime?: string | null` (HH:MM format)
- `endDate?: Date | null`
- `endTime?: string | null` (HH:MM format)
- `timezone?: string` (default: "UTC")
- `constraints?: PickerConstraints`
- `onRangeChange?: (range) => void`
- `presets?: RangePreset[]`

### CalendarGrid

Keyboard-navigable calendar with ARIA grid semantics.

**Keyboard Controls:**
- Arrow keys: Navigate dates
- PageUp/PageDown: Previous/Next month
- Home/End: First/Last day
- Enter/Space: Select date

### TimeInput

Time input with arrow key support for hour/minute adjustment.

**Keyboard Controls:**
- Arrow Up/Down: Change hours
- Arrow Left/Right: Change minutes (15-min intervals)

## Hooks

### useDateTimeRangeState

```tsx
const {
  state,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
  setTimezone,
  validate,
  reset,
} = useDateTimeRangeState('UTC', constraints);
```

### useCalendarNavigation

```tsx
const {
  currentDate,
  selectedDate,
  goToPreviousMonth,
  selectDate,
} = useCalendarNavigation();
```

### useTimeInput

```tsx
const {
  time,
  updateTime,
  incrementHour,
  decrementMinute,
} = useTimeInput('12:00');
```

## Utilities

### Timezone Functions

```tsx
import {
  getAllTimezones,
  utcToTimezone,
  timezoneToUtc,
  isDaylightSavings,
  getTimezoneInfo,
  formatInTimezone,
} from './index';
```

### Date Validation

```tsx
import {
  isDateValid,
  isRangeValid,
  isSameDay,
  getDateRange,
} from './index';
```

### Presets

```tsx
import {
  getRelativePresets,
  getPresetById,
} from './index';
```

## Accessibility Features

✓ **ARIA Labels** - All interactive elements properly labeled
✓ **ARIA Grid** - Calendar uses proper grid semantics
✓ **Focus Management** - Logical tab order with visible indicators
✓ **Screen Reader Support** - Announces dates, times, errors
✓ **Keyboard Only** - Complete workflows without mouse
✓ **Color Contrast** - WCAG AA compliant

## DST Handling

The picker correctly handles daylight saving time:

- **Spring Forward**: Skipped times are validated correctly
- **Fall Back**: Ambiguous times are resolved consistently
- **Semantic Preservation**: UTC instant preserved across timezone changes
- **No Silent Coercion**: Invalid times produce clear error messages

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run storybook    # View component stories
npm run test         # Run tests
npm run test:ui      # View tests in UI
npm run lint         # Lint and fix code
npm run format       # Format with Prettier
```

## Project Structure

```
src/
├── components/
│   ├── DateTimeRangePicker.tsx    # Main component
│   ├── CalendarGrid.tsx            # Calendar grid
│   ├── TimeInput.tsx               # Time input
│   └── *.stories.tsx               # Storybook stories
├── hooks/
│   └── useDateTimeRange.ts         # Custom hooks
├── utils/
│   ├── timezone.ts                 # Timezone utilities
│   ├── dateState.ts                # State and validation
│   ├── presets.ts                  # Date presets
│   └── *.test.ts                   # Unit tests
├── test/
│   └── setup.ts                    # Test configuration
└── index.ts                        # Public API

.storybook/
├── main.ts                         # Storybook config
└── preview.ts                      # Global settings

```

## TypeScript Support

Full TypeScript strict mode enabled:
- `noImplicitAny` ✓
- `strictNullChecks` ✓
- `noUncheckedIndexedAccess` ✓
- `noUnusedLocals` ✓
- `noUnusedParameters` ✓
- `noImplicitReturns` ✓

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized re-renders (React hooks)
- Efficient calendar rendering
- No external date library
- Memoized timezone calculations
- Debounced validation

## License

MIT

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
