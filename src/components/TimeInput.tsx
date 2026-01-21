import React, { useCallback, useState } from 'react';

interface TimeInputProps {
  value: string | null;
  onChange: (time: string) => void;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

/**
 * Time input component with keyboard navigation
 * Supports arrow keys for hour/minute adjustment
 */
export const TimeInput: React.FC<TimeInputProps> = ({
  value = '00:00',
  onChange,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeValue = value || '00:00';

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value.replace(/\D/g, '');

      if (val.length > 4) {
        val = val.slice(0, 4);
      }

      // Format as HH:MM
      if (val.length >= 2) {
        const hours = val.slice(0, 2);
        const minutes = val.slice(2, 4);

        if (parseInt(hours) > 23) {
          setError('Hours must be 00-23');
          return;
        }

        if (minutes && parseInt(minutes) > 59) {
          setError('Minutes must be 00-59');
          return;
        }

        setError(null);

        if (minutes.length === 2) {
          onChange(`${hours}:${minutes}`);
        }
      }
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const [hours, minutes] = timeValue.split(':').map(Number);

      switch (e.key) {
        case 'ArrowUp': {
          e.preventDefault();
          const newHours = (hours + 1) % 24;
          onChange(`${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          const prevHours = hours === 0 ? 23 : hours - 1;
          onChange(`${String(prevHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          const newMinutes = (minutes + 15) % 60;
          const hoursAdjust = minutes + 15 >= 60 ? 1 : 0;
          const adjustedHours = (hours + hoursAdjust) % 24;
          onChange(
            `${String(adjustedHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
          );
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          let leftMinutes = minutes - 15;
          let leftHours = hours;
          if (leftMinutes < 0) {
            leftMinutes += 60;
            leftHours = leftHours === 0 ? 23 : leftHours - 1;
          }
          onChange(
            `${String(leftHours).padStart(2, '0')}:${String(leftMinutes).padStart(2, '0')}`
          );
          break;
        }
      }
    },
    [timeValue, onChange]
  );

  return (
    <div className="flex flex-col gap-date-sm">
      <input
        type="text"
        value={timeValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        placeholder="HH:MM"
        maxLength={5}
        className={`
          w-full px-date-md py-date-sm rounded-date-md border-2
          font-mono text-sm
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-date-primary
          ${
            error
              ? 'border-date-error text-date-error'
              : isFocused
                ? 'border-date-primary'
                : 'border-date-border'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={ariaLabel || 'Time input'}
        aria-describedby={ariaDescribedBy}
        aria-invalid={!!error}
      />
      {error && (
        <span className="text-sm text-date-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

TimeInput.displayName = 'TimeInput';
