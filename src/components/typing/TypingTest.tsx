import React, { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTypingTest, TestDuration } from '@/hooks/useTypingTest';
import { useKeyboardSounds } from '@/hooks/useKeyboardSounds';
import { TypingArea } from './TypingArea';
import { LiveStats } from './LiveStats';
import { TestModeSelector } from './TestModeSelector';
import { ResultsDisplay } from './ResultsDisplay';

interface TypingTestProps {
  isLoggedIn?: boolean;
  onTestComplete?: (stats: {
    wpm: number;
    accuracy: number;
    rawWpm: number;
    errors: number;
    duration: TestDuration;
  }) => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  isLoggedIn = false,
  onTestComplete,
}) => {
  const [duration, setDuration] = useState<TestDuration>(30);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playKeySound } = useKeyboardSounds(soundEnabled);
  
  const {
    isActive,
    isFinished,
    timeLeft,
    handleKeyPress,
    resetTest,
    getCharacterStates,
    calculateStats,
    getLiveStats,
    cursorPosition,
    text,
    typedText,
  } = useTypingTest(duration);

  const liveStats = getLiveStats();
  const characters = getCharacterStates();

  // Wrapped key handler with sound
  const handleKeyPressWithSound = useCallback((key: string) => {
    if (key === 'Backspace' || key.length === 1) {
      const isError = key.length === 1 && typedText.length < text.length && key !== text[typedText.length];
      playKeySound(isError);
    }
    handleKeyPress(key);
  }, [handleKeyPress, playKeySound, text, typedText]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Escape') {
        e.preventDefault();
        resetTest();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetTest]);

  // Handle test completion
  useEffect(() => {
    if (isFinished && onTestComplete) {
      const stats = calculateStats();
      onTestComplete({
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        rawWpm: stats.rawWpm,
        errors: stats.errors,
        duration,
      });
    }
  }, [isFinished, onTestComplete, calculateStats, duration]);

  const handleDurationChange = useCallback((newDuration: TestDuration) => {
    setDuration(newDuration);
  }, []);

  // Reset test when duration changes
  useEffect(() => {
    resetTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <AnimatePresence mode="wait">
        {!isFinished ? (
          <motion.div
            key="test"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center gap-8"
          >
            {/* Mode Selector */}
            <TestModeSelector
              duration={duration}
              onDurationChange={handleDurationChange}
              disabled={isActive}
            />

            {/* Live Stats */}
            <LiveStats
              wpm={liveStats.wpm}
              accuracy={liveStats.accuracy}
              errors={liveStats.errors}
              timeLeft={timeLeft}
              isActive={isActive}
            />

            {/* Typing Area */}
            <TypingArea
              characters={characters}
              cursorPosition={cursorPosition}
              isActive={isActive}
              isFinished={isFinished}
              onKeyDown={handleKeyPressWithSound}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <ResultsDisplay
              stats={calculateStats()}
              duration={duration}
              onRestart={resetTest}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
