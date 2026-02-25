-- Add slideshow timing control for activities
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS slideshow_interval_seconds double precision DEFAULT 3.5;
