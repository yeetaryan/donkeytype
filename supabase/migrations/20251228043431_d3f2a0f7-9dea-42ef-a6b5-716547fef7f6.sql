-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create typing_tests table to store all test results
CREATE TABLE public.typing_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  raw_wpm INTEGER NOT NULL,
  errors INTEGER NOT NULL,
  consistency NUMERIC(5,2),
  duration INTEGER NOT NULL CHECK (duration IN (15, 30, 60)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on typing_tests
ALTER TABLE public.typing_tests ENABLE ROW LEVEL SECURITY;

-- Typing tests policies
CREATE POLICY "Users can view their own tests"
ON public.typing_tests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tests"
ON public.typing_tests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create leaderboard_entries table for best scores per user per duration
CREATE TABLE public.leaderboard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  duration INTEGER NOT NULL CHECK (duration IN (15, 30, 60)),
  wpm INTEGER NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, duration)
);

-- Enable RLS on leaderboard_entries
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Leaderboard policies - everyone can view
CREATE POLICY "Leaderboard is viewable by everyone"
ON public.leaderboard_entries FOR SELECT
USING (true);

-- Only authenticated users can insert/update their own entries
CREATE POLICY "Users can insert their own leaderboard entry"
ON public.leaderboard_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leaderboard entry"
ON public.leaderboard_entries FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles timestamp
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)));
  RETURN new;
END;
$$;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();