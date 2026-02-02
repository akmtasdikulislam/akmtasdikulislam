-- Add coordinate-based positioning columns to hero tables

ALTER TABLE public.homepage_hero_techs
ADD COLUMN IF NOT EXISTS top_position NUMERIC DEFAULT 50,
ADD COLUMN IF NOT EXISTS left_position NUMERIC DEFAULT 50;

ALTER TABLE public.homepage_hero_badges
ADD COLUMN IF NOT EXISTS top_position NUMERIC DEFAULT 50,
ADD COLUMN IF NOT EXISTS left_position NUMERIC DEFAULT 50;

-- Optional: Migrate existing class-based positions to approximate coordinates (best effort)
-- This is manual work if not done programmatically, so we set defaults to center (50%)
