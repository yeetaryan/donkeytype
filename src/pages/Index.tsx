import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TypingTest } from '@/components/typing/TypingTest';
import { useAuth } from '@/hooks/useAuth';
import { useTypingStats } from '@/hooks/useTypingStats';
import { useToast } from '@/hooks/use-toast';
import { TestDuration } from '@/hooks/useTypingTest';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, profile, signOut } = useAuth();
  const { saveTestResult } = useTypingStats();
  const { toast } = useToast();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'Come back soon!',
    });
  };

  const handleTestComplete = async (stats: {
    wpm: number;
    accuracy: number;
    rawWpm: number;
    errors: number;
    duration: TestDuration;
  }) => {
    if (isLoggedIn && user) {
      const { error } = await saveTestResult(user.id, {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        rawWpm: stats.rawWpm,
        errors: stats.errors,
        duration: stats.duration,
      });

      if (error) {
        toast({
          title: 'Error saving result',
          description: 'Your score could not be saved.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Result saved!',
          description: `${stats.wpm} WPM with ${stats.accuracy}% accuracy`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        username={profile?.username}
        onAuthClick={handleAuthClick}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-16 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto"
        >
          {/* Hero Text */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            >
              Test your <span className="text-primary">typing speed</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg"
            >
              A minimal, keyboard-focused typing test. No distractions.
            </motion.p>
          </div>

          {/* Typing Test */}
          <TypingTest
            isLoggedIn={isLoggedIn}
            onTestComplete={handleTestComplete}
          />
        </motion.div>
      </main>

      <Footer />

      {/* Background Glow Effect */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};

export default Index;
