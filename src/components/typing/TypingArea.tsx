import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CharacterState } from '@/hooks/useTypingTest';

interface TypingAreaProps {
  characters: CharacterState[];
  cursorPosition: number;
  isActive: boolean;
  isFinished: boolean;
  onKeyDown: (key: string) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  characters,
  cursorPosition,
  isActive,
  isFinished,
  onKeyDown,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Focus container on mount and keep focus
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Scroll to keep cursor visible
  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      if (cursorRect.top < containerRect.top || cursorRect.bottom > containerRect.bottom) {
        cursor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [cursorPosition]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      return;
    }
    
    if (isFinished) return;
    
    e.preventDefault();
    onKeyDown(e.key);
  };

  const getCharClassName = (state: CharacterState['state']) => {
    switch (state) {
      case 'correct':
        return 'text-typing-correct';
      case 'incorrect':
        return 'text-typing-incorrect';
      case 'extra':
        return 'text-typing-extra bg-typing-extra/20';
      case 'unreached':
      default:
        return 'text-typing-unreached';
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`
        relative w-full max-w-4xl mx-auto p-8 rounded-lg
        focus:outline-none cursor-text
        ${isActive ? 'typing-active' : ''}
      `}
      style={{ minHeight: '200px' }}
    >

      <div className="text-2xl md:text-3xl leading-relaxed tracking-wide font-mono relative">
        {characters.map((char, index) => (
          <span key={index} className="relative inline">
            {/* Cursor */}
            {index === cursorPosition && !isFinished && (
              <motion.span
                ref={cursorRef}
                layoutId="cursor"
                className={`
                  absolute -left-0.5 top-0 w-0.5 h-[1.2em]
                  bg-typing-caret rounded-full
                  ${isActive ? 'caret-pulse' : 'caret-blink'}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
            )}
            
            {/* Character */}
            <span
              className={`
                char-transition relative
                ${getCharClassName(char.state)}
                ${char.state === 'incorrect' ? 'border-b-2 border-typing-incorrect' : ''}
              `}
            >
              {char.char}
            </span>
          </span>
        ))}
        
        {/* Cursor at end */}
        {cursorPosition >= characters.length && !isFinished && (
          <motion.span
            ref={cursorRef}
            layoutId="cursor"
            className={`
              inline-block w-0.5 h-[1.2em] ml-0.5
              bg-typing-caret rounded-full align-middle
              ${isActive ? 'caret-pulse' : 'caret-blink'}
            `}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </div>

      {/* Focus hint */}
      {!isActive && !isFinished && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
          <kbd className="px-2 py-1 bg-secondary rounded text-xs mr-1">Tab</kbd>
          or
          <kbd className="px-2 py-1 bg-secondary rounded text-xs ml-1">Esc</kbd>
          to restart
        </div>
      )}
    </div>
  );
};
