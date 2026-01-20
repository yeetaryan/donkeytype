import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Keyboard, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

type AuthMode = 'login' | 'signup';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, isLoggedIn } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!username.trim()) {
          toast({
            title: 'Username required',
            description: 'Please enter a username.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, username);
        if (error) {
          let message = error.message;
          if (error.message.includes('already registered')) {
            message = 'This email is already registered. Please sign in instead.';
          }
          toast({
            title: 'Sign up failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Account created!',
            description: 'Welcome to DonkeyType!',
          });
          navigate('/');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          let message = error.message;
          if (error.message.includes('Invalid login credentials')) {
            message = 'Invalid email or password. Please try again.';
          }
          toast({
            title: 'Sign in failed',
            description: message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'Successfully signed in.',
          });
          navigate('/');
        }
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Back to Home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4"
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Keyboard className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              donkey<span className="text-primary">type</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Sign in to save your scores'
              : 'Sign up to compete on the leaderboard'}
          </p>
        </div>

        {/* Auth Form */}
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="typingmaster"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? 'Loading...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>

      {/* Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(var(--primary) / 0.2) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};

export default Auth;
