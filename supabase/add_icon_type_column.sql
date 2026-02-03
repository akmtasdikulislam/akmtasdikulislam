-- SQL script to add icon_type column to profile tables
-- This is necessary to support switching between uploaded icons and direct URLs

DO $$ 
BEGIN
    -- Add icon_type to homepage_coding_profiles if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'homepage_coding_profiles' 
        AND column_name = 'icon_type'
    ) THEN
        ALTER TABLE public.homepage_coding_profiles 
        ADD COLUMN icon_type TEXT DEFAULT 'upload';
    END IF;

    -- Add icon_type to homepage_freelance_profiles if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'homepage_freelance_profiles' 
        AND column_name = 'icon_type'
    ) THEN
        ALTER TABLE public.homepage_freelance_profiles 
        ADD COLUMN icon_type TEXT DEFAULT 'upload';
    END IF;
END $$;

-- Update existing rows to have 'upload' as default if they were null (though DEFAULT should handle it)
UPDATE public.homepage_coding_profiles SET icon_type = 'upload' WHERE icon_type IS NULL;
UPDATE public.homepage_freelance_profiles SET icon_type = 'upload' WHERE icon_type IS NULL;

-- Verification
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('homepage_coding_profiles', 'homepage_freelance_profiles') 
AND column_name = 'icon_type';
