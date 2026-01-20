import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Keyboard, Trophy, User, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  onAuthClick?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = false,
  username,
  onAuthClick,
  onSignOut,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Keyboard className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-xl font-bold text-foreground">
            donkey<span className="text-primary">type</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link to="/leaderboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Button>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {username || 'Profile'}
                </span>
              </div>
              <Button onClick={onSignOut} variant="ghost" size="sm" className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button onClick={onAuthClick} size="sm" className="gap-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </nav>
      </div>
    </motion.header>
  );
};
