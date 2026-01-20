import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeLeft: number;
  isActive: boolean;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  wpm,
  accuracy,
  errors,
  timeLeft,
  isActive,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-8 md:gap-12 text-sm md:text-base"
    >
      {/* Timer */}
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={timeLeft}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`
              text-3xl md:text-4xl font-bold tabular-nums
              ${timeLeft <= 5 ? 'text-destructive' : 'text-primary'}
            `}
          >
            {timeLeft}
          </motion.span>
        </AnimatePresence>
        <span className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
          seconds
        </span>
      </div>

      {/* Divider */}
      <div className="h-12 w-px bg-border" />

      {/* WPM */}
      <div className="flex flex-col items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={wpm}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums"
          >
            {isActive ? wpm : '--'}
          </motion.span>
        </AnimatePresence>
        <span className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
          wpm
        </span>
      </div>

      {/* Accuracy */}
      <div className="flex flex-col items-center">
        <span className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
          {isActive ? `${accuracy}%` : '--%'}
        </span>
        <span className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
          accuracy
        </span>
      </div>

      {/* Errors */}
      <div className="flex flex-col items-center">
        <span className={`
          text-2xl md:text-3xl font-semibold tabular-nums
          ${errors > 0 ? 'text-destructive' : 'text-foreground'}
        `}>
          {isActive ? errors : '-'}
        </span>
        <span className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
          errors
        </span>
      </div>
    </motion.div>
  );
};
