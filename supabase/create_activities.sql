-- ===================================================================
-- ACTIVITIES TABLE
-- For showcasing physical participations, events, conferences, etc.
-- ===================================================================

-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    location TEXT,
    event_date DATE NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL DEFAULT 'event',
    cover_image TEXT,
    photos TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Public can view activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can update activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can delete activities" ON public.activities;

CREATE POLICY "Public can view activities" ON public.activities FOR SELECT USING (true);

CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add section visibility (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'section_visibility') THEN
        INSERT INTO public.section_visibility (section_key, is_visible) 
        VALUES ('activities', true)
        ON CONFLICT (section_key) DO NOTHING;
    END IF;
END $$;

-- Add section heading (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'homepage_section_headings') THEN
        INSERT INTO public.homepage_section_headings (section_key, section_badge, section_title, section_highlight, section_description)
        VALUES ('activities', 'Latest', 'Activities', 'What I''m Up To', 'Conferences, events, and adventures')
        ON CONFLICT (section_key) DO NOTHING;
    END IF;
END $$;
