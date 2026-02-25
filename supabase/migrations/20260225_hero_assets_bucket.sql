-- Create storage bucket for hero assets (CV, profile photo, icons)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-assets', 'hero-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for hero-assets storage
-- Public can view all hero assets
CREATE POLICY "Public can view hero assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-assets');

-- Authenticated users can upload to hero assets
CREATE POLICY "Authenticated can upload hero assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-assets');

-- Authenticated users can update hero assets
CREATE POLICY "Authenticated can update hero assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-assets');

-- Authenticated users can delete hero assets
CREATE POLICY "Authenticated can delete hero assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-assets');
