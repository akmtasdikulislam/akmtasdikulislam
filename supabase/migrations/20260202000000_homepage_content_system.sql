-- Homepage Content Management System Migration
-- Creates all tables needed for managing homepage content through CMS

-- ============================================================================
-- HERO SECTION TABLES
-- ============================================================================

-- Main hero section content
CREATE TABLE IF NOT EXISTS public.homepage_hero (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'Akm Tasdikul Islam',
    greeting_badge TEXT NOT NULL DEFAULT 'Available for Freelance & Remote Work',
    description TEXT NOT NULL DEFAULT 'CSE undergraduate at Bangladesh University of Professionals with 2+ years of experience building modern web applications. Passionate about clean code, automation, and creating exceptional digital experiences.',
    profile_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero typewriter roles
CREATE TABLE IF NOT EXISTS public.homepage_hero_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero tech logos (floating around profile photo)
CREATE TABLE IF NOT EXISTS public.homepage_hero_techs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    position_class TEXT NOT NULL,
    animation_class TEXT NOT NULL,
    delay DECIMAL NOT NULL DEFAULT 0,
    invert BOOLEAN DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero floating badges
CREATE TABLE IF NOT EXISTS public.homepage_hero_badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_text TEXT NOT NULL,
    position_class TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Hero stats
CREATE TABLE IF NOT EXISTS public.homepage_hero_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    stat_label TEXT NOT NULL,
    stat_value INTEGER NOT NULL,
    stat_suffix TEXT NOT NULL DEFAULT '+',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- SOCIAL LINKS (Shared by Hero and Footer)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.homepage_social_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT, -- lucide icon name (Github, Linkedin, Mail)
    icon_url TEXT, -- For custom icons (Upwork, Fiverr)
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- NAVBAR TABLES
-- ============================================================================

-- Navbar configuration
CREATE TABLE IF NOT EXISTS public.homepage_navbar (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    logo_text TEXT NOT NULL DEFAULT 'AKM',
    logo_icon_name TEXT NOT NULL DEFAULT 'Terminal',
    cta_button_text TEXT NOT NULL DEFAULT 'Hire Me',
    cta_button_href TEXT NOT NULL DEFAULT '#contact',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Navigation links
CREATE TABLE IF NOT EXISTS public.homepage_nav_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    path TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- ABOUT SECTION TABLES
-- ============================================================================

-- About section main content
CREATE TABLE IF NOT EXISTS public.homepage_about (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section_badge TEXT NOT NULL DEFAULT 'About Me',
    section_title TEXT NOT NULL DEFAULT 'Who I',
    section_highlight TEXT NOT NULL DEFAULT 'Am?',
    section_description TEXT NOT NULL DEFAULT 'A passionate developer who loves turning ideas into reality through code',
    paragraph_1 TEXT NOT NULL,
    paragraph_2 TEXT NOT NULL,
    paragraph_3 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About highlights cards
CREATE TABLE IF NOT EXISTS public.homepage_about_highlights (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    icon_name TEXT NOT NULL, -- lucide icon name
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    detail TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About interests
CREATE TABLE IF NOT EXISTS public.homepage_about_interests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    icon_name TEXT NOT NULL,
    label TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About core values
CREATE TABLE IF NOT EXISTS public.homepage_about_values (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    icon_name TEXT NOT NULL,
    value_text TEXT NOT NULL,
    description TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FOOTER TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.homepage_footer (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    logo_text TEXT NOT NULL DEFAULT 'AKM',
    description TEXT NOT NULL DEFAULT 'Building digital experiences with modern technologies',
    contact_email TEXT NOT NULL DEFAULT 'akmtasdikulislam@gmail.com',
    copyright_text TEXT NOT NULL DEFAULT '© 2026 Akm Tasdikul Islam. All rights reserved.',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- GENERAL SETTINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.homepage_general (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_title TEXT NOT NULL DEFAULT 'Akm Tasdikul Islam - Full Stack Developer',
    site_description TEXT NOT NULL DEFAULT 'Portfolio of Akm Tasdikul Islam - Full Stack Developer specializing in MERN stack and n8n automation',
    site_keywords TEXT[] DEFAULT ARRAY['Full Stack Developer', 'MERN Stack', 'React', 'Node.js', 'Web Development'],
    favicon_url TEXT,
    og_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.homepage_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_hero_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_hero_techs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_hero_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_hero_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_navbar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_about ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_about_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_about_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_about_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_footer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_general ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Public Read, Admin Write
-- ============================================================================

-- Hero
CREATE POLICY "Public can view hero" ON public.homepage_hero FOR SELECT USING (true);
CREATE POLICY "Admins can update hero" ON public.homepage_hero FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert hero" ON public.homepage_hero FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Hero Roles
CREATE POLICY "Public can view hero roles" ON public.homepage_hero_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero roles" ON public.homepage_hero_roles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Hero Techs
CREATE POLICY "Public can view hero techs" ON public.homepage_hero_techs FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero techs" ON public.homepage_hero_techs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Hero Badges
CREATE POLICY "Public can view hero badges" ON public.homepage_hero_badges FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero badges" ON public.homepage_hero_badges FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Hero Stats
CREATE POLICY "Public can view hero stats" ON public.homepage_hero_stats FOR SELECT USING (true);
CREATE POLICY "Admins can manage hero stats" ON public.homepage_hero_stats FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Social Links
CREATE POLICY "Public can view social links" ON public.homepage_social_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage social links" ON public.homepage_social_links FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Navbar
CREATE POLICY "Public can view navbar" ON public.homepage_navbar FOR SELECT USING (true);
CREATE POLICY "Admins can update navbar" ON public.homepage_navbar FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert navbar" ON public.homepage_navbar FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Nav Links
CREATE POLICY "Public can view nav links" ON public.homepage_nav_links FOR SELECT USING (true);
CREATE POLICY "Admins can manage nav links" ON public.homepage_nav_links FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- About
CREATE POLICY "Public can view about" ON public.homepage_about FOR SELECT USING (true);
CREATE POLICY "Admins can update about" ON public.homepage_about FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert about" ON public.homepage_about FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- About Highlights
CREATE POLICY "Public can view about highlights" ON public.homepage_about_highlights FOR SELECT USING (true);
CREATE POLICY "Admins can manage about highlights" ON public.homepage_about_highlights FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- About Interests
CREATE POLICY "Public can view about interests" ON public.homepage_about_interests FOR SELECT USING (true);
CREATE POLICY "Admins can manage about interests" ON public.homepage_about_interests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- About Values
CREATE POLICY "Public can view about values" ON public.homepage_about_values FOR SELECT USING (true);
CREATE POLICY "Admins can manage about values" ON public.homepage_about_values FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Footer
CREATE POLICY "Public can view footer" ON public.homepage_footer FOR SELECT USING (true);
CREATE POLICY "Admins can update footer" ON public.homepage_footer FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert footer" ON public.homepage_footer FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- General Settings
CREATE POLICY "Public can view general settings" ON public.homepage_general FOR SELECT USING (true);
CREATE POLICY "Admins can update general settings" ON public.homepage_general FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can insert general settings" ON public.homepage_general FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- ============================================================================
-- SEED DATA - From Current Hardcoded Values
-- ============================================================================

-- Hero Section
INSERT INTO public.homepage_hero (name, greeting_badge, description) VALUES (
    'Akm Tasdikul Islam',
    'Available for Freelance & Remote Work',
    'CSE undergraduate at Bangladesh University of Professionals with 2+ years of experience building modern web applications. Passionate about clean code, automation, and creating exceptional digital experiences.'
);

-- Hero Roles (Typewriter)
INSERT INTO public.homepage_hero_roles (role_text, display_order) VALUES
    ('Full Stack Developer', 0),
    ('MERN Stack Expert', 1),
    ('n8n Automation Specialist', 2),
    ('AI Agent & Chatbot Builder', 3),
    ('Problem Solver', 4);

-- Hero Tech Logos
INSERT INTO public.homepage_hero_techs (name, icon_url, position_class, animation_class, delay, invert, display_order) VALUES
    ('MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 'left-1/2 -translate-x-1/2 -top-20 md:-top-24', 'animate-float-1', 0, false, 0),
    ('Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 'right-0 -top-14 md:-top-16 translate-x-8 md:translate-x-12', 'animate-float-2', 0.5, true, 1),
    ('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', '-right-16 md:-right-20 top-8 md:top-10', 'animate-float-3', 1, false, 2),
    ('Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', '-right-18 md:-right-24 top-1/2 -translate-y-1/2', 'animate-float-1', 1.5, false, 3),
    ('n8n', 'https://avatars.githubusercontent.com/u/45487711?s=200&v=4', '-right-16 md:-right-20 bottom-8 md:bottom-10', 'animate-float-2', 2, false, 4),
    ('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'right-0 -bottom-14 md:-bottom-16 translate-x-8 md:translate-x-12', 'animate-float-3', 0.8, false, 5),
    ('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-24', 'animate-float-1', 1.2, true, 6),
    ('JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'left-0 -bottom-14 md:-bottom-16 -translate-x-8 md:-translate-x-12', 'animate-float-2', 0.3, false, 7),
    ('Tailwind', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', '-left-16 md:-left-20 bottom-8 md:bottom-10', 'animate-float-1', 0.6, false, 8),
    ('Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', '-left-18 md:-left-24 top-1/2 -translate-y-1/2', 'animate-float-3', 1.8, false, 9),
    ('Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', '-left-16 md:-left-20 top-8 md:top-10', 'animate-float-2', 1.4, false, 10),
    ('Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'left-0 -top-14 md:-top-16 -translate-x-8 md:-translate-x-12', 'animate-float-3', 0.9, false, 11);

-- Hero Badges
INSERT INTO public.homepage_hero_badges (badge_text, position_class, display_order) VALUES
    ('System Builder', 'absolute -top-8 -right-32 md:-right-44', 0),
    ('MERN Expert', 'absolute top-1/3 -left-36 md:-left-48', 1),
    ('Workflow Expert', 'absolute bottom-1/3 -right-32 md:-right-44', 2),
    ('SaaS Builder', 'absolute -bottom-8 -left-32 md:-left-44', 3);

-- Hero Stats
INSERT INTO public.homepage_hero_stats (stat_label, stat_value, stat_suffix, display_order) VALUES
    ('Client Satisfaction', 100, '%', 0),
    ('Projects Completed', 20, '+', 1),
    ('Technologies', 15, '+', 2),
    ('Years Experience', 2, '+', 3);

-- Social Links
INSERT INTO public.homepage_social_links (platform, url, icon_name, icon_url, display_order) VALUES
    ('GitHub', 'https://github.com/akmtasdikulislam', 'Github', NULL, 0),
    ('LinkedIn', 'https://www.linkedin.com/in/akmtasdikulislam', 'Linkedin', NULL, 1),
    ('Upwork', 'https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2', NULL, 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/upwork.svg', 2),
    ('Fiverr', '#', NULL, 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fiverr.svg', 3),
    ('Email', 'mailto:akmtasdikulislam@gmail.com', 'Mail', NULL, 4);

-- Navbar
INSERT INTO public.homepage_navbar (logo_text, logo_icon_name, cta_button_text, cta_button_href) VALUES
    ('AKM', 'Terminal', 'Hire Me', '#contact');

-- Nav Links
INSERT INTO public.homepage_nav_links (label, href, path, display_order) VALUES
    ('Home', '#home', '/', 0),
    ('About', '#about', '/#about', 1),
    ('Expertise', '#expertise', '/#expertise', 2),
    ('Services', '#services', '/#services', 3),
    ('Projects', '#projects', '/#projects', 4),
    ('Blog', '#blog', '/#blog', 5),
    ('Contact', '#contact', '/#contact', 6);

-- About Section
INSERT INTO public.homepage_about (
    section_badge, section_title, section_highlight, section_description,
    paragraph_1, paragraph_2, paragraph_3
) VALUES (
    'About Me',
    'Who I',
    'Am?',
    'A passionate developer who loves turning ideas into reality through code',
    'I''m Akm Tasdikul Islam, a Computer Science & Engineering undergraduate at Bangladesh University of Professionals. With over 2 years of hands-on experience in web development, I specialize in building modern, responsive, and user-centric applications.',
    'My expertise spans the entire MERN stack (MongoDB, Express.js, React, Node.js), and I''m also proficient in n8n automation workflows. I believe in writing clean, maintainable code and creating seamless user experiences.',
    'I achieved GPA 5.00 in both SSC and HSC board examinations, demonstrating my commitment to excellence. When I''m not coding, you''ll find me exploring new technologies, participating in competitive programming, or building innovative side projects.'
);

-- About Highlights
INSERT INTO public.homepage_about_highlights (icon_name, title, description, detail, display_order) VALUES
    ('GraduationCap', 'Education', 'CSE at Bangladesh University of Professionals', '3rd Semester | 2025 Batch', 0),
    ('MapPin', 'Location', 'Dhaka, Bangladesh', 'Available for remote work', 1),
    ('Code2', 'Specialization', 'Full Stack Development', 'MERN Stack & n8n Automation', 2),
    ('Zap', 'Experience', '2+ Years', 'Web Development & Automation', 3);

-- About Interests
INSERT INTO public.homepage_about_interests (icon_name, label, display_order) VALUES
    ('Code2', 'Programming', 0),
    ('Bot', 'Automation', 1),
    ('Palette', 'UI/UX Design', 2),
    ('Trophy', 'Competitive Coding', 3),
    ('BookOpen', 'Learning', 4),
    ('Wrench', 'Building Products', 5),
    ('Target', 'Problem Solving', 6),
    ('Zap', 'Web Development', 7),
    ('Lightbulb', 'Tech Innovation', 8),
    ('Clock', 'Productivity', 9);

-- About Core Values
INSERT INTO public.homepage_about_values (icon_name, value_text, description, display_order) VALUES
    ('Target', 'Goal-Driven', 'Focused on delivering results', 0),
    ('Zap', 'Disciplined', 'Consistent and structured approach', 1),
    ('Users', 'Professional', 'Client-focused communication', 2),
    ('Sparkles', 'Growth-Minded', 'Always learning and improving', 3);

-- Footer
INSERT INTO public.homepage_footer (logo_text, description, contact_email, copyright_text) VALUES
    ('AKM', 'Building digital experiences with modern technologies', 'akmtasdikulislam@gmail.com', '© 2026 Akm Tasdikul Islam. All rights reserved.');

-- General Settings
INSERT INTO public.homepage_general (site_title, site_description) VALUES
    ('Akm Tasdikul Islam - Full Stack Developer', 'Portfolio of Akm Tasdikul Islam - Full Stack Developer specializing in MERN stack and n8n automation');

-- ============================================================================
-- UPDATE TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_homepage_hero_updated_at BEFORE UPDATE ON public.homepage_hero FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_hero_roles_updated_at BEFORE UPDATE ON public.homepage_hero_roles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_hero_techs_updated_at BEFORE UPDATE ON public.homepage_hero_techs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_hero_badges_updated_at BEFORE UPDATE ON public.homepage_hero_badges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_hero_stats_updated_at BEFORE UPDATE ON public.homepage_hero_stats FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_social_links_updated_at BEFORE UPDATE ON public.homepage_social_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_navbar_updated_at BEFORE UPDATE ON public.homepage_navbar FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_nav_links_updated_at BEFORE UPDATE ON public.homepage_nav_links FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_about_updated_at BEFORE UPDATE ON public.homepage_about FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_about_highlights_updated_at BEFORE UPDATE ON public.homepage_about_highlights FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_about_interests_updated_at BEFORE UPDATE ON public.homepage_about_interests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_about_values_updated_at BEFORE UPDATE ON public.homepage_about_values FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_footer_updated_at BEFORE UPDATE ON public.homepage_footer FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_homepage_general_updated_at BEFORE UPDATE ON public.homepage_general FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
