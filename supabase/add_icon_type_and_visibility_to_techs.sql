-- Add icon_type and is_visible columns to homepage_hero_techs
ALTER TABLE homepage_hero_techs 
ADD COLUMN IF NOT EXISTS icon_type TEXT DEFAULT 'upload',
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
