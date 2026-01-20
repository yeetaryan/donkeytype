import React from 'react';
import { motion } from 'framer-motion';
import { TestDuration } from '@/hooks/useTypingTest';

interface TestModeSelectorProps {
  duration: TestDuration;
  onDurationChange: (duration: TestDuration) => void;
  disabled?: boolean;
}

const durations: TestDuration[] = [15, 30, 60];

export const TestModeSelector: React.FC<TestModeSelectorProps> = ({
  duration,
  onDurationChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 p-1 bg-secondary/50 rounded-lg">
      {durations.map((d) => (
        <button
          key={d}
          onClick={() => !disabled && onDurationChange(d)}
          disabled={disabled}
          className={`
            relative px-4 py-2 text-sm font-medium rounded-md
            transition-colors duration-200
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${duration === d ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
          `}
        >
          {duration === d && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">{d}s</span>
        </button>
      ))}
    </div>
  );
};
