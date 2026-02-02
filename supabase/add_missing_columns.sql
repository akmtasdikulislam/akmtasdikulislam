-- Comprehensive database fix for certifications, work_history, and testimonials tables
-- Run this in Supabase SQL Editor to add missing columns

DO $$ 
BEGIN
    -- Add is_visible column to certifications table if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'certifications' 
        AND column_name = 'is_visible'
    ) THEN
        ALTER TABLE public.certifications 
        ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;
    END IF;

    -- Add certificate_image column to certifications table if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'certifications' 
        AND column_name = 'certificate_image'
    ) THEN
        ALTER TABLE public.certifications 
        ADD COLUMN certificate_image TEXT;
    END IF;

    -- Add is_visible column to work_history table if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'work_history' 
        AND column_name = 'is_visible'
    ) THEN
        ALTER TABLE public.work_history 
        ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;
    END IF;

    -- Add is_visible column to testimonials table if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'testimonials' 
        AND column_name = 'is_visible'
    ) THEN
        ALTER TABLE public.testimonials 
        ADD COLUMN is_visible BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Update all existing rows to be visible by default
UPDATE public.certifications SET is_visible = TRUE WHERE is_visible IS NULL;
UPDATE public.work_history SET is_visible = TRUE WHERE is_visible IS NULL;
UPDATE public.testimonials SET is_visible = TRUE WHERE is_visible IS NULL;

-- Verify the changes
SELECT 'certifications' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'certifications' AND column_name IN ('is_visible', 'certificate_image')
UNION ALL
SELECT 'work_history' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'work_history' AND column_name = 'is_visible'
UNION ALL
SELECT 'testimonials' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'testimonials' AND column_name = 'is_visible';
