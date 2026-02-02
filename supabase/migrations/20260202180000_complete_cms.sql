-- Complete CMS Schema Migration
-- Adds tables for Expertise, Services, Testimonials, Coding Profiles, and Contact Info

-- 1. Expertise Techs (Languages, Frameworks, Tools)
CREATE TABLE IF NOT EXISTS public.homepage_expertise_techs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    icon_url text, -- URL to SVG/Image
    category text NOT NULL, -- 'Frontend', 'Backend', 'Framework', 'Tools', 'Language'
    is_marquee boolean DEFAULT false, -- Show in top marquee
    in_expertise_grid boolean DEFAULT true, -- Show in the category grid
    display_order integer DEFAULT 0,
    invert_icon boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_expertise_techs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Expertise Techs" ON public.homepage_expertise_techs
    FOR SELECT USING (true);

CREATE POLICY "Admin All Expertise Techs" ON public.homepage_expertise_techs
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 2. Expertise Cards (Special highlights like MERN, UI/UX)
CREATE TABLE IF NOT EXISTS public.homepage_expertise_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    icon_url text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_expertise_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Expertise Cards" ON public.homepage_expertise_cards
    FOR SELECT USING (true);

CREATE POLICY "Admin All Expertise Cards" ON public.homepage_expertise_cards
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 3. Services
CREATE TABLE IF NOT EXISTS public.homepage_services (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    icon_name text, -- Lucide icon name
    features text[] DEFAULT '{}', -- Array of feature strings
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Services" ON public.homepage_services
    FOR SELECT USING (true);

CREATE POLICY "Admin All Services" ON public.homepage_services
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 4. Testimonials
CREATE TABLE IF NOT EXISTS public.homepage_testimonials (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    role text, -- e.g. "CEO, TechCorp"
    content text NOT NULL,
    avatar_url text,
    rating integer DEFAULT 5,
    display_order integer DEFAULT 0,
    is_visible boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Testimonials" ON public.homepage_testimonials
    FOR SELECT USING (true);

CREATE POLICY "Admin All Testimonials" ON public.homepage_testimonials
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 5. Coding Profiles
CREATE TABLE IF NOT EXISTS public.homepage_coding_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    platform text NOT NULL, -- CodeForces, LeetCode etc.
    url text NOT NULL,
    icon_url text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_coding_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Coding Profiles" ON public.homepage_coding_profiles
    FOR SELECT USING (true);

CREATE POLICY "Admin All Coding Profiles" ON public.homepage_coding_profiles
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- 6. Contact Info
CREATE TABLE IF NOT EXISTS public.homepage_contact_info (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text,
    location text,
    location_url text,
    available_for_work boolean DEFAULT true,
    available_text text DEFAULT 'Available for Work',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homepage_contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Contact Info" ON public.homepage_contact_info
    FOR SELECT USING (true);

CREATE POLICY "Admin All Contact Info" ON public.homepage_contact_info
    FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


-- SEED DATA (Populate from existing hardcoded values)

-- Contact Info Seed
INSERT INTO public.homepage_contact_info (email, location, available_for_work)
SELECT 'akmtasdikulislam@gmail.com', 'Dhaka, Bangladesh', true
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_contact_info);

-- Coding Profiles Seed (CodeForces, LeetCode, HackerRank, CodeChef)
INSERT INTO public.homepage_coding_profiles (platform, url, icon_url, display_order)
VALUES 
    ('CodeForces', 'https://codeforces.com/profile/akmtasdikulislam', 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png', 1),
    ('LeetCode', 'https://leetcode.com/u/akmtasdikulislam/', 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png', 2),
    ('HackerRank', 'https://www.hackerrank.com/profile/akmtasdikulislam', 'https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png', 3),
    ('CodeChef', 'https://www.codechef.com/users/akmtasdikul', 'https://img.icons8.com/fluency/48/codechef.png', 4)
ON CONFLICT DO NOTHING; -- No constraint, but assuming run once or check exists logic handled by app usually. For migration, we use INSERT SELECT WHERE NOT EXISTS pattern usually.

-- Refined Seed Logic for Arrays/Sets using DO block

DO $$
BEGIN
    -- Seed Coding Profiles if empty
    IF NOT EXISTS (SELECT 1 FROM public.homepage_coding_profiles) THEN
        INSERT INTO public.homepage_coding_profiles (platform, url, icon_url, display_order)
        VALUES 
            ('CodeForces', 'https://codeforces.com/profile/akmtasdikulislam', 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-color-tal-revivo.png', 1),
            ('LeetCode', 'https://leetcode.com/u/akmtasdikulislam/', 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png', 2),
            ('HackerRank', 'https://www.hackerrank.com/profile/akmtasdikulislam', 'https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png', 3),
            ('CodeChef', 'https://www.codechef.com/users/akmtasdikul', 'https://img.icons8.com/fluency/48/codechef.png', 4);
    END IF;

    -- Seed Services if empty
    IF NOT EXISTS (SELECT 1 FROM public.homepage_services) THEN
        INSERT INTO public.homepage_services (title, description, icon_name, features, display_order)
        VALUES
            ('Full Stack Web Development', 'End-to-end web application development using modern technologies like React, Node.js, and databases.', 'Globe', ARRAY['Custom Web Apps', 'REST APIs', 'Database Design', 'Cloud Deployment'], 1),
            ('Responsive Web Design', 'Beautiful, mobile-first websites that look stunning on all devices.', 'Smartphone', ARRAY['Mobile-First', 'Cross-Browser', 'Performance Optimized', 'SEO Ready'], 2),
            ('n8n Automation', 'Build powerful AI-driven workflows and automate repetitive tasks.', 'Workflow', ARRAY['Workflow Design', 'AI Integration', 'API Connections', 'Process Automation'], 3),
            ('E-commerce Solutions', 'Custom online stores with secure payment integration.', 'ShoppingCart', ARRAY['Custom Storefronts', 'Payment Integration', 'Inventory System', 'Order Management'], 4),
            ('Backend Development', 'Robust server-side solutions with secure APIs.', 'Database', ARRAY['API Development', 'Authentication', 'Database Design', 'Security'], 5),
            ('UI/UX Implementation', 'Transform Figma/Adobe XD into pixel-perfect code.', 'Palette', ARRAY['Design to Code', 'Interactive UI', 'Animations', 'Accessibility'], 6);
    END IF;

    -- Seed Expertise Cards
    IF NOT EXISTS (SELECT 1 FROM public.homepage_expertise_cards) THEN
        INSERT INTO public.homepage_expertise_cards (title, description, icon_url, display_order)
        VALUES
            ('MERN Stack', 'Full-stack development with MongoDB, Express, React, and Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 1),
            ('n8n Automation', 'Building AI-powered workflows and business process automation', 'https://avatars.githubusercontent.com/u/45487711?s=200&v=4', 2),
            ('UI/UX Design', 'Creating beautiful, user-centric interfaces with modern tools', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', 3);
    END IF;

    -- Seed Expertise Techs (Sample - Populating a few key ones)
    IF NOT EXISTS (SELECT 1 FROM public.homepage_expertise_techs) THEN
        -- Frontend
        INSERT INTO public.homepage_expertise_techs (name, icon_url, category, in_expertise_grid, display_order) VALUES
        ('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'Frontend', true, 1),
        ('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'Frontend', true, 2),
        ('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'Frontend', true, 3);
        
        -- Language
        INSERT INTO public.homepage_expertise_techs (name, icon_url, category, in_expertise_grid, display_order) VALUES
        ('C', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', 'Language', false, 1),
        ('Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 'Language', false, 2);
    END IF;
END $$;
