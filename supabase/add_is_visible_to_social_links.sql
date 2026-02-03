-- Add is_visible column to homepage_social_links
ALTER TABLE homepage_social_links ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
