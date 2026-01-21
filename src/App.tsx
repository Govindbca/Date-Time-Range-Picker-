import React from 'react';
import { DateTimeRangePicker } from './components/DateTimeRangePicker';
import { getRelativePresets } from './utils/presets';

function App(): React.ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-date-lg">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-date-xl">
          <h1 className="text-4xl font-bold text-date-text mb-date-md">
            Timezone-Aware Date & Time Range Picker
          </h1>
          <p className="text-date-text/70">
            DST-safe, accessible, keyboard-navigable picker with full TypeScript support
          </p>
        </header>

        <section className="bg-white rounded-date-lg shadow-lg p-date-xl">
          <DateTimeRangePicker
            timezone="America/New_York"
            constraints={{
              minDate: new Date(2025, 0, 1),
              maxDate: new Date(2025, 11, 31),
              minDuration: 60 * 60 * 1000, // 1 hour minimum
            }}
            presets={getRelativePresets().slice(0, 5).map((p) => ({
              label: p.label,
              getRange: () => {
                const range = p.getRange(new Date(), 'America/New_York');
                return {
                  start: range.start,
                  startTime: '00:00',
                  end: range.end,
                  endTime: '23:59',
                };
              },
            }))}
            onRangeChange={(range) => {
              console.log('Range selected:', range);
            }}
          />
        </section>

        <section className="mt-date-xl bg-white rounded-date-lg shadow-lg p-date-xl">
          <h2 className="text-2xl font-bold text-date-text mb-date-md">Features</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-date-md text-date-text/80">
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Timezone-aware with DST support</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Full keyboard navigation</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>ARIA screen reader support</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Min/max date constraints</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Duration constraints</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Blackout dates support</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Preset ranges (Today, Last 7 days, etc.)</span>
            </li>
            <li className="flex items-start gap-date-md">
              <span className="text-date-primary font-bold">✓</span>
              <span>Built with React 18 + TypeScript</span>
            </li>
          </ul>
        </section>

        <section className="mt-date-xl text-center text-date-text/70">
          <p className="text-sm">
            View Storybook: <code className="bg-gray-100 px-date-sm py-date-xs rounded">npm run storybook</code>
          </p>
          <p className="text-sm mt-date-sm">
            Run tests: <code className="bg-gray-100 px-date-sm py-date-xs rounded">npm run test</code>
          </p>
        </section>
      </div>
    </main>
  );
}

export default App;
