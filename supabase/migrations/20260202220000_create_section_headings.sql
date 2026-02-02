-- Create table for section headings
CREATE TABLE IF NOT EXISTS public.homepage_section_headings (
    section_key text PRIMARY KEY,
    section_badge text,
    section_title text,
    section_highlight text,
    section_description text
);

-- Enable RLS
ALTER TABLE public.homepage_section_headings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON public.homepage_section_headings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated update access" ON public.homepage_section_headings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated insert access" ON public.homepage_section_headings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Seed data for all sections
INSERT INTO public.homepage_section_headings (section_key, section_badge, section_title, section_highlight, section_description)
VALUES
    ('expertise', 'My Skills', 'Tech', 'Expertise', 'I work with modern technologies to build scalable and efficient solutions'),
    ('work_history', 'Work History', 'Professional', 'Experience', 'My journey across different companies and roles'),
    ('certifications', 'Credentials', 'My', 'Certifications', 'Continuous learning and professional development'),
    ('services', 'Services', 'How Can I', 'Help You?', 'I offer a range of services to help you build your next project'),
    ('projects', 'Portfolio', 'Featured', 'Projects', 'Check out some of my recent work and side projects'),
    ('blog', 'Blog', 'Blog &', 'Insights', 'Thoughts, tutorials, and insights on software development'),
    ('testimonials', 'Testimonials', 'Client', 'Stories', 'What others say about working with me'),
    ('contact', 'Contact', 'Get In', 'Touch', 'Have a project in mind? Let''s discuss how we can work together');
