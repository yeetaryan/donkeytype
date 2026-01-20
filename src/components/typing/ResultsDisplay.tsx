import React from 'react';
import { motion } from 'framer-motion';
import { TypingStats, TestDuration } from '@/hooks/useTypingTest';
import { RotateCcw, Trophy, Target, Zap, AlertCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsDisplayProps {
  stats: TypingStats;
  duration: TestDuration;
  onRestart: () => void;
  isLoggedIn?: boolean;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
  delay?: number;
}> = ({ icon, label, value, subValue, highlight = false, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className={`
      flex flex-col items-center p-6 rounded-xl
      ${highlight ? 'bg-primary/10 border border-primary/30' : 'bg-secondary/50'}
    `}
  >
    <div className={`mb-2 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
      {icon}
    </div>
    <span className={`
      text-3xl md:text-4xl font-bold tabular-nums
      ${highlight ? 'text-primary' : 'text-foreground'}
    `}>
      {value}
    </span>
    <span className="text-sm text-muted-foreground uppercase tracking-wider mt-1">
      {label}
    </span>
    {subValue && (
      <span className="text-xs text-muted-foreground mt-1">{subValue}</span>
    )}
  </motion.div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  stats,
  duration,
  onRestart,
  isLoggedIn = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Main WPM Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-primary" />
          <span className="text-6xl md:text-8xl font-bold text-primary tabular-nums">
            {stats.wpm}
          </span>
          <span className="text-2xl text-muted-foreground self-end mb-2">wpm</span>
        </div>
        <p className="text-muted-foreground">
          {duration} second test completed
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Target className="w-5 h-5" />}
          label="Accuracy"
          value={`${stats.accuracy}%`}
          delay={0.2}
        />
        <StatCard
          icon={<Zap className="w-5 h-5" />}
          label="Raw WPM"
          value={stats.rawWpm}
          delay={0.3}
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          label="Errors"
          value={stats.errors}
          delay={0.4}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Consistency"
          value={`${stats.consistency}%`}
          delay={0.5}
        />
      </div>

      {/* Character Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center gap-8 text-sm text-muted-foreground mb-8"
      >
        <span>
          <span className="text-typing-correct font-semibold">{stats.correctChars}</span> correct
        </span>
        <span>
          <span className="text-typing-incorrect font-semibold">{stats.incorrectChars}</span> incorrect
        </span>
        <span>
          <span className="font-semibold">{stats.totalChars}</span> total
        </span>
      </motion.div>

      {/* Save status */}
      {isLoggedIn ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-primary mb-6"
        >
          ✓ Result saved to leaderboard
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-muted-foreground mb-6"
        >
          Log in to save your results and compete on the leaderboard
        </motion.p>
      )}

      {/* Restart Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          onClick={onRestart}
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        <p className="text-xs text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 bg-secondary rounded">Tab</kbd> or{' '}
          <kbd className="px-1.5 py-0.5 bg-secondary rounded">Esc</kbd> to restart
        </p>
      </motion.div>
    </motion.div>
  );
};
