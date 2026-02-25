-- ===================================================================
-- STORAGE BUCKETS SETUP
-- Run this in Supabase SQL Editor to create all required storage buckets
-- ===================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('portfolio', 'portfolio', true),
  ('cms-uploads', 'cms-uploads', true),
  ('hero-assets', 'hero-assets', true)
ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- STORAGE POLICIES
-- ===================================================================

-- Portfolio bucket policies
DROP POLICY IF EXISTS "Public Access portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete portfolio" ON storage.objects;

CREATE POLICY "Public Access portfolio" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
CREATE POLICY "Auth Upload portfolio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
CREATE POLICY "Auth Update portfolio" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio');
CREATE POLICY "Auth Delete portfolio" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio');

-- CMS Uploads bucket policies
DROP POLICY IF EXISTS "Public can view cms-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload to CMS" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update CMS uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete CMS uploads" ON storage.objects;

CREATE POLICY "Public can view cms-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'cms-uploads');
CREATE POLICY "Admins can upload to CMS" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-uploads');
CREATE POLICY "Admins can update CMS uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-uploads');
CREATE POLICY "Admins can delete CMS uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-uploads');

-- Hero Assets bucket policies
DROP POLICY IF EXISTS "Public can view hero-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload hero-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update hero-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete hero-assets" ON storage.objects;

CREATE POLICY "Public can view hero-assets" ON storage.objects FOR SELECT USING (bucket_id = 'hero-assets');
CREATE POLICY "Authenticated can upload hero-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-assets');
CREATE POLICY "Authenticated can update hero-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero-assets');
CREATE POLICY "Authenticated can delete hero-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero-assets');

-- ===================================================================
-- ADD MISSING COLUMNS TO HOMEPAGE_HERO
-- ===================================================================

-- Add cv_url column if it doesn't exist
ALTER TABLE homepage_hero ADD COLUMN IF NOT EXISTS cv_url TEXT;
