-- Create storage bucket for portfolio
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for storage
DO $$
BEGIN
    -- Drop existing policies to avoid conflicts during repair/rerun
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;

    -- Create new policies
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT
    USING ( bucket_id = 'portfolio' );

    CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

    CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE
    USING ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

    CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE
    USING ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );
END $$;

-- Update Profile Photo URL in Hero
UPDATE public.homepage_hero
SET profile_photo_url = 'https://pyuowvpelpvfusvvirus.supabase.co/storage/v1/object/public/portfolio/profile-photo.png'
WHERE profile_photo_url IS NULL OR profile_photo_url = '';

-- Update Social Link URLs (ensure they are populated)
UPDATE public.homepage_social_links SET url = 'https://github.com/akmtasdikulislam' WHERE platform = 'GitHub';
UPDATE public.homepage_social_links SET url = 'https://www.linkedin.com/in/akmtasdikulislam' WHERE platform = 'LinkedIn';
UPDATE public.homepage_social_links SET url = 'https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2' WHERE platform = 'Upwork';
UPDATE public.homepage_social_links SET url = 'mailto:akmtasdikulislam@gmail.com' WHERE platform = 'Email';
UPDATE public.homepage_social_links SET url = '#' WHERE platform = 'Fiverr' AND (url IS NULL OR url = '');
