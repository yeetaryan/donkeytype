import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TestDuration } from './useTypingTest';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  date: string;
  userId: string;
}

export const useLeaderboard = (duration: TestDuration) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('leaderboard_entries')
      .select(`
        id,
        user_id,
        wpm,
        accuracy,
        created_at,
        profiles!inner(username)
      `)
      .eq('duration', duration)
      .order('wpm', { ascending: false })
      .limit(50);

    if (fetchError) {
      console.error('Error fetching leaderboard:', fetchError);
      setError('Failed to load leaderboard');
      setLoading(false);
      return;
    }

    const formattedEntries: LeaderboardEntry[] = (data || []).map((entry, index) => ({
      rank: index + 1,
      username: (entry.profiles as unknown as { username: string })?.username || 'Unknown',
      wpm: entry.wpm,
      accuracy: Number(entry.accuracy),
      date: entry.created_at,
      userId: entry.user_id,
    }));

    setEntries(formattedEntries);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [duration]);

  return { entries, loading, error, refetch: fetchLeaderboard };
};
