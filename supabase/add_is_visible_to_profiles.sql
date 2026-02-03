-- Add is_visible column to homepage_coding_profiles
ALTER TABLE homepage_coding_profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Add is_visible column to homepage_freelance_profiles
ALTER TABLE homepage_freelance_profiles ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
