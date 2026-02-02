-- Add is_visible column to certifications
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Add is_visible column to testimonials
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Add is_visible column to work_history
ALTER TABLE work_history ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;
