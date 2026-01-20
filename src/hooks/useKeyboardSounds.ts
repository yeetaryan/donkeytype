import { useCallback, useRef, useEffect } from 'react';

export const useKeyboardSounds = (enabled: boolean = true) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  const playKeySound = useCallback((isError: boolean = false) => {
    if (!enabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    
    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (isError) {
      // Error sound - lower frequency, slightly longer
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } else {
      // Normal key click - short, crisp sound
      oscillator.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    }
  }, [enabled]);

  return { playKeySound };
};
