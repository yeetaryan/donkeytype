import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Medal, Crown, Clock, Target, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { TestDuration } from '@/hooks/useTypingTest';
import { useAuth } from '@/hooks/useAuth';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const durations: TestDuration[] = [15, 30, 60];

const RankIcon: React.FC<{ rank: number }> = ({ rank }) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-muted-foreground font-mono">{rank}</span>;
};

const Leaderboard: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<TestDuration>(30);
  const navigate = useNavigate();
  
  const { isLoggedIn, profile, signOut } = useAuth();
  const { entries, loading, error } = useLeaderboard(selectedDuration);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onAuthClick={() => navigate('/auth')} />
        
        <main className="flex-1 flex flex-col items-center justify-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Leaderboard Access
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to view the global leaderboard and compete with typists worldwide.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/auth')} size="lg">
                Sign In to View
              </Button>
              <Link to="/">
                <Button variant="ghost" size="lg" className="w-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Typing Test
                </Button>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isLoggedIn={isLoggedIn} 
        username={profile?.username}
        onSignOut={handleSignOut}
      />
      
      <main className="flex-1 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">
              Top performers across all time modes
            </p>
          </motion.div>

          {/* Duration Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`
                    relative px-6 py-2.5 text-sm font-medium rounded-md
                    transition-colors duration-200 flex items-center gap-2
                    ${selectedDuration === d ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}
                  `}
                >
                  {selectedDuration === d && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-md"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Clock className="relative z-10 w-4 h-4" />
                  <span className="relative z-10">{d}s</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Leaderboard Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-muted-foreground">
              {error}
            </div>
          ) : entries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to set a record!</p>
              <Link to="/">
                <Button>Start Typing Test</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-secondary/30 text-sm text-muted-foreground font-medium border-b border-border">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">WPM</div>
                <div className="col-span-2 text-center">Accuracy</div>
                <div className="col-span-3 text-right">Date</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`
                      grid grid-cols-12 gap-4 px-6 py-4 items-center
                      ${entry.rank <= 3 ? 'bg-primary/5' : 'hover:bg-secondary/30'}
                      transition-colors
                    `}
                  >
                    <div className="col-span-1 flex justify-center">
                      <RankIcon rank={entry.rank} />
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{entry.username}</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className={`
                        font-bold tabular-nums
                        ${entry.rank === 1 ? 'text-primary text-lg' : 'text-foreground'}
                      `}>
                        {entry.wpm}
                      </span>
                    </div>
                    <div className="col-span-2 text-center flex items-center justify-center gap-1">
                      <Target className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground tabular-nums">{entry.accuracy}%</span>
                    </div>
                    <div className="col-span-3 text-right text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Typing Test
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
