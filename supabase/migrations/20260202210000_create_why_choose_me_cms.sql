-- Migration: Why Choose Me CMS System
-- Creates tables for managing "Why Choose Me" section content

-- 1. Main section table
CREATE TABLE IF NOT EXISTS public.homepage_why_choose (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    section_badge text DEFAULT 'Why Me',
    section_title text DEFAULT 'Why Choose',
    section_highlight text DEFAULT 'Me?',
    section_description text DEFAULT 'What sets me apart from the rest',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_why_choose ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Why Choose" ON public.homepage_why_choose
    FOR SELECT USING (true);

CREATE POLICY "Admin All Why Choose" ON public.homepage_why_choose
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 2. Reasons/Cards table
CREATE TABLE IF NOT EXISTS public.homepage_why_choose_reasons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    icon_name text NOT NULL, -- Lucide icon name (e.g. "Zap", "Code2")
    title text NOT NULL,
    description text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_why_choose_reasons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Why Choose Reasons" ON public.homepage_why_choose_reasons
    FOR SELECT USING (true);

CREATE POLICY "Admin All Why Choose Reasons" ON public.homepage_why_choose_reasons
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 3. Stats table
CREATE TABLE IF NOT EXISTS public.homepage_why_choose_stats (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_value integer NOT NULL,
    stat_suffix text DEFAULT '+', -- "%" or "+"
    stat_label text NOT NULL,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_why_choose_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Why Choose Stats" ON public.homepage_why_choose_stats
    FOR SELECT USING (true);

CREATE POLICY "Admin All Why Choose Stats" ON public.homepage_why_choose_stats
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Seed data with current hardcoded values
DO $$
BEGIN
    -- Seed main section if empty
    IF NOT EXISTS (SELECT 1 FROM public.homepage_why_choose) THEN
        INSERT INTO public.homepage_why_choose (section_badge, section_title, section_highlight, section_description)
        VALUES ('Why Me', 'Why Choose', 'Me?', 'What sets me apart from the rest');
    END IF;

    -- Seed reasons if empty
    IF NOT EXISTS (SELECT 1 FROM public.homepage_why_choose_reasons) THEN
        INSERT INTO public.homepage_why_choose_reasons (icon_name, title, description, display_order)
        VALUES
            ('Zap', 'Fast & Efficient', 'I deliver high-quality work quickly without compromising on standards. Time is valuable - yours and mine.', 1),
            ('Code2', 'Clean Code', 'I write maintainable, well-documented code following best practices and industry standards.', 2),
            ('Shield', 'Reliable & Trustworthy', 'Committed to deadlines and transparency. You''ll always know the status of your project.', 3),
            ('MessageSquare', 'Clear Communication', 'Regular updates, responsive communication, and collaborative approach throughout the project.', 4),
            ('Lightbulb', 'Problem Solver', 'I don''t just code - I think. Creative solutions to complex challenges are my forte.', 5),
            ('Target', 'Goal-Oriented', 'Focused on delivering results that align with your business objectives and user needs.', 6);
    END IF;

    -- Seed stats if empty
    IF NOT EXISTS (SELECT 1 FROM public.homepage_why_choose_stats) THEN
        INSERT INTO public.homepage_why_choose_stats (stat_value, stat_suffix, stat_label, display_order)
        VALUES
            (100, '%', 'Client Satisfaction', 1),
            (20, '+', 'Projects Delivered', 2),
            (15, '+', 'Happy Clients', 3),
            (2, '+', 'Years Experience', 4);
    END IF;
END $$;
