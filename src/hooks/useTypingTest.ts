import { useState, useCallback, useEffect, useRef } from 'react';
import { generateTestText } from '@/data/words';

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  consistency: number;
}

export interface CharacterState {
  char: string;
  state: 'correct' | 'incorrect' | 'extra' | 'unreached';
  typed?: string;
}

export type TestDuration = 15 | 30 | 60;

export const useTypingTest = (duration: TestDuration = 30) => {
  const [text, setText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate new test text
  const generateNewTest = useCallback(() => {
    setText(generateTestText(150));
    setTypedText('');
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setStartTime(null);
    setWpmHistory([]);
  }, [duration]);

  // Initialize on mount and duration change
  useEffect(() => {
    generateNewTest();
  }, [generateNewTest]);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsActive(false);
            setIsFinished(true);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Track WPM history for consistency calculation
  useEffect(() => {
    if (isActive && startTime) {
      const elapsed = (Date.now() - startTime) / 1000 / 60;
      if (elapsed > 0) {
        const correctChars = typedText.split('').filter((char, i) => char === text[i]).length;
        const currentWpm = Math.round((correctChars / 5) / elapsed);
        setWpmHistory((prev) => [...prev, currentWpm]);
      }
    }
  }, [typedText, isActive, startTime, text]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (isFinished) return;

    // Start test on first keypress
    if (!isActive && key.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    if (key === 'Backspace') {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (key.length === 1) {
      setTypedText((prev) => prev + key);
    }
  }, [isActive, isFinished]);

  // Reset test
  const resetTest = useCallback(() => {
    generateNewTest();
  }, [generateNewTest]);

  // Calculate character states for rendering
  const getCharacterStates = useCallback((): CharacterState[] => {
    const chars: CharacterState[] = [];
    
    for (let i = 0; i < text.length; i++) {
      if (i < typedText.length) {
        chars.push({
          char: text[i],
          state: typedText[i] === text[i] ? 'correct' : 'incorrect',
          typed: typedText[i],
        });
      } else {
        chars.push({
          char: text[i],
          state: 'unreached',
        });
      }
    }

    // Handle extra characters beyond the text
    if (typedText.length > text.length) {
      for (let i = text.length; i < typedText.length; i++) {
        chars.push({
          char: typedText[i],
          state: 'extra',
          typed: typedText[i],
        });
      }
    }

    return chars;
  }, [text, typedText]);

  // Calculate final stats
  const calculateStats = useCallback((): TypingStats => {
    const correctChars = typedText.split('').filter((char, i) => char === text[i]).length;
    const incorrectChars = typedText.split('').filter((char, i) => char !== text[i]).length;
    const totalChars = typedText.length;
    
    const timeElapsed = (duration - timeLeft) / 60 || 1/60; // in minutes
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    const rawWpm = Math.round((totalChars / 5) / timeElapsed);
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    // Calculate consistency (standard deviation of WPM history)
    let consistency = 100;
    if (wpmHistory.length > 1) {
      const mean = wpmHistory.reduce((a, b) => a + b, 0) / wpmHistory.length;
      const variance = wpmHistory.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmHistory.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(0, Math.round(100 - (stdDev / mean) * 100));
    }

    return {
      wpm,
      rawWpm,
      accuracy,
      errors: incorrectChars,
      correctChars,
      incorrectChars,
      totalChars,
      consistency,
    };
  }, [typedText, text, duration, timeLeft, wpmHistory]);

  // Live stats (during test)
  const getLiveStats = useCallback((): { wpm: number; accuracy: number; errors: number } => {
    const correctChars = typedText.split('').filter((char, i) => char === text[i]).length;
    const incorrectChars = typedText.split('').filter((char, i) => char !== text[i]).length;
    const totalChars = typedText.length;
    
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0;
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    return { wpm, accuracy, errors: incorrectChars };
  }, [typedText, text, startTime]);

  return {
    text,
    typedText,
    isActive,
    isFinished,
    timeLeft,
    duration,
    handleKeyPress,
    resetTest,
    getCharacterStates,
    calculateStats,
    getLiveStats,
    cursorPosition: typedText.length,
  };
};
