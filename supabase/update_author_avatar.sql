-- Standalone script to create author_profile table and set avatar
-- This script can be run directly in Supabase SQL Editor

-- Create author_profile table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.author_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Akm Tasdikul Islam',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  bio TEXT DEFAULT 'Passionate about building beautiful and functional web applications.',
  avatar_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE public.author_profile ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Author profile is viewable by everyone" ON public.author_profile;
DROP POLICY IF EXISTS "Admins can update author profile" ON public.author_profile;
DROP POLICY IF EXISTS "Admins can insert author profile" ON public.author_profile;

-- Create RLS policies
CREATE POLICY "Author profile is viewable by everyone" 
ON public.author_profile FOR SELECT USING (true);

CREATE POLICY "Admins can update author profile" 
ON public.author_profile FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can insert author profile" 
ON public.author_profile FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert or update author profile with avatar URL
INSERT INTO public.author_profile (name, title, bio, avatar_url)
VALUES (
  'Akm Tasdikul Islam',
  'Full Stack Developer',
  'Passionate about building beautiful and functional web applications.',
  'https://pyuowvpelpvfusvvirus.supabase.co/storage/v1/object/public/cms-uploads/avatars/author-photo.png'
)
ON CONFLICT (id) DO UPDATE
SET avatar_url = EXCLUDED.avatar_url;

-- If there's already a profile without conflict, update it
UPDATE public.author_profile
SET avatar_url = 'https://pyuowvpelpvfusvvirus.supabase.co/storage/v1/object/public/cms-uploads/avatars/author-photo.png'
WHERE avatar_url IS NULL OR avatar_url = '';

-- Verify the profile
SELECT id, name, title, avatar_url FROM public.author_profile LIMIT 1;
