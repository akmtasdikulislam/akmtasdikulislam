-- ===================================================================
-- AUTHOR PROFILE TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.author_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Akm Tasdikul Islam',
    title TEXT NOT NULL DEFAULT 'Full Stack Developer',
    bio TEXT,
    avatar_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.author_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Author profile is viewable by everyone" ON public.author_profile;
DROP POLICY IF EXISTS "Admins can update author profile" ON public.author_profile;
DROP POLICY IF EXISTS "Admins can insert author profile" ON public.author_profile;

CREATE POLICY "Author profile is viewable by everyone"
ON public.author_profile FOR SELECT USING (true);

CREATE POLICY "Admins can update author profile"
ON public.author_profile FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert author profile"
ON public.author_profile FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_author_profile_updated_at ON public.author_profile;
CREATE TRIGGER update_author_profile_updated_at
    BEFORE UPDATE ON public.author_profile
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.author_profile (
    id,
    name,
    title,
    bio,
    avatar_url,
    github_url,
    linkedin_url,
    email
)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Akm Tasdikul Islam',
    'Full Stack Developer',
    'Passionate about building beautiful and functional web applications.',
    NULL,
    'https://github.com/akmtasdikulislam',
    'https://linkedin.com/in/akmtasdikulislam',
    'akmtasdikulislam@gmail.com'
)
ON CONFLICT (id) DO NOTHING;
