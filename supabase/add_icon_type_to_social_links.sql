-- Add icon_type column to homepage_social_links
ALTER TABLE homepage_social_links ADD COLUMN IF NOT EXISTS icon_type TEXT DEFAULT 'upload';
