import { supabase } from '@/integrations/supabase/client';
import { TestDuration } from './useTypingTest';

interface TestResult {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  errors: number;
  consistency?: number;
  duration: TestDuration;
}

export const useTypingStats = () => {
  const saveTestResult = async (userId: string, result: TestResult) => {
    // Save to typing_tests table
    const { error: testError } = await supabase
      .from('typing_tests')
      .insert({
        user_id: userId,
        wpm: result.wpm,
        accuracy: result.accuracy,
        raw_wpm: result.rawWpm,
        errors: result.errors,
        consistency: result.consistency,
        duration: result.duration,
      });

    if (testError) {
      console.error('Error saving test result:', testError);
      return { error: testError };
    }

    // Check if this is a new best for the leaderboard
    const { data: existingEntry } = await supabase
      .from('leaderboard_entries')
      .select('wpm')
      .eq('user_id', userId)
      .eq('duration', result.duration)
      .maybeSingle();

    // Only update leaderboard if this is a new best
    if (!existingEntry || result.wpm > existingEntry.wpm) {
      const { error: leaderboardError } = await supabase
        .from('leaderboard_entries')
        .upsert({
          user_id: userId,
          duration: result.duration,
          wpm: result.wpm,
          accuracy: result.accuracy,
        }, {
          onConflict: 'user_id,duration',
        });

      if (leaderboardError) {
        console.error('Error updating leaderboard:', leaderboardError);
        return { error: leaderboardError };
      }
    }

    return { error: null };
  };

  return { saveTestResult };
};
