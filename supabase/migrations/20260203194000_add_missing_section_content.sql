-- Migration: Add Missing Section Content Tables
-- This provides dynamic fallbacks for headings, making them consistent with the "About" section.

-- 1. Expertise Content Table
CREATE TABLE IF NOT EXISTS public.homepage_expertise_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    section_badge text,
    section_title text,
    section_highlight text,
    section_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_expertise_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Expertise Content" ON public.homepage_expertise_content FOR SELECT USING (true);
CREATE POLICY "Admin Update Expertise Content" ON public.homepage_expertise_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 2. Services Content Table
CREATE TABLE IF NOT EXISTS public.homepage_services_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    section_badge text,
    section_title text,
    section_highlight text,
    section_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_services_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Services Content" ON public.homepage_services_content FOR SELECT USING (true);
CREATE POLICY "Admin Update Services Content" ON public.homepage_services_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 3. Testimonials Content Table
CREATE TABLE IF NOT EXISTS public.homepage_testimonials_content (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    section_badge text,
    section_title text,
    section_highlight text,
    section_description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_testimonials_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Testimonials Content" ON public.homepage_testimonials_content FOR SELECT USING (true);
CREATE POLICY "Admin Update Testimonials Content" ON public.homepage_testimonials_content FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- SEED DATA
INSERT INTO public.homepage_expertise_content (section_badge, section_title, section_highlight, section_description)
VALUES ('My Skills', 'Tech', 'Expertise', 'Technologies and tools I work with to bring ideas to life');

INSERT INTO public.homepage_services_content (section_badge, section_title, section_highlight, section_description)
VALUES ('Services', 'How Can I', 'Help You?', 'Comprehensive solutions tailored to your needs');

INSERT INTO public.homepage_testimonials_content (section_badge, section_title, section_highlight, section_description)
VALUES ('Testimonials', 'Client', 'Stories', 'What others say about working with me');
