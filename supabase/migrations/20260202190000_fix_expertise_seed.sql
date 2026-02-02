-- Fix Expertise Seed Data
-- Truncate to ensure no duplicates from previous partial seeds
TRUNCATE TABLE public.homepage_expertise_techs;

INSERT INTO public.homepage_expertise_techs (name, icon_url, category, is_marquee, in_expertise_grid, display_order, invert_icon)
VALUES
-- Frontend
('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 'Frontend', true, true, 1, false),
('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'Frontend', true, true, 2, true),
('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'Frontend', true, true, 3, false),
('JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'Frontend', false, true, 4, false),
('Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', 'Frontend', true, true, 5, false),
('Bootstrap', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg', 'Frontend', false, true, 6, false),
('Sass', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', 'Frontend', false, true, 7, false),
('PHP', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 'Frontend', false, true, 8, false),

-- Frameworks & Integrations
('Material UI', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg', 'Framework', false, true, 1, false),
('Shadcn UI', 'https://avatars.githubusercontent.com/u/139895814?s=200&v=4', 'Framework', false, true, 2, true),
('DaisyUI', 'https://img.daisyui.com/images/daisyui-logo/daisyui-logomark.svg', 'Framework', false, true, 3, false),
('Three.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', 'Framework', false, true, 4, true),
('Mapbox', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mapbox_logo_2019.svg/3840px-Mapbox_logo_2019.svg.png', 'Framework', false, true, 5, true),
('Radar', 'https://cdn.prod.website-files.com/6750910fb09989bf4799d719/678fd15ea9602bbb73d63c25_Radar.svg', 'Framework', false, true, 6, true),
('Stripe', 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', 'Framework', false, true, 7, false),
('SSLCommerz', 'https://sslcommerz.com/wp-content/uploads/2021/11/logo.png', 'Framework', false, true, 8, false),

-- Backend & Database
('Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', 'Backend', true, true, 1, false),
('Express.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 'Backend', false, true, 2, true),
('Django', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', 'Backend', false, true, 3, true),
('MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 'Backend', true, true, 4, false),
('PostgreSQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', 'Backend', true, true, 5, false),
('MySQL', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', 'Backend', false, true, 6, false),
('Firebase', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', 'Backend', true, true, 7, false),
('Supabase', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg', 'Backend', false, true, 8, false),

-- Tools & Platforms
('Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'Tools', true, true, 1, false),
('Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'Tools', true, true, 2, false),
('Figma', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', 'Tools', true, true, 3, false),
('n8n', 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/n8n-color.png', 'Tools', false, true, 4, false),
('Wordpress', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg', 'Tools', false, true, 5, true),
('Arduino', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg', 'Tools', false, true, 6, false),
('Photoshop', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg', 'Tools', false, true, 7, false),
('Illustrator', 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg', 'Tools', false, true, 8, false),

-- Programming Languages (Separate section)
('C', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', 'Language', false, false, 1, false),
('C++', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 'Language', false, false, 2, false),
('Java', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', 'Language', false, false, 3, false),
('Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 'Language', true, false, 4, false),
('JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'Language', false, false, 5, false),
('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'Language', false, false, 6, false),
('PHP', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', 'Language', false, false, 7, false),
('HTML5', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', 'Language', false, false, 8, false),
('CSS3', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', 'Language', false, false, 9, false);
