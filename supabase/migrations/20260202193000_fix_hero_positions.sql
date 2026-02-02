-- Fix Hero Techs and Badges Positioning
TRUNCATE TABLE public.homepage_hero_techs;
TRUNCATE TABLE public.homepage_hero_badges;

INSERT INTO public.homepage_hero_techs (name, icon_url, position_class, animation_class, delay, invert, display_order)
VALUES
('MongoDB', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', 'left-1/2 -translate-x-1/2 -top-20 md:-top-24', 'animate-float-1', 0, false, 1),
('Express', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', 'right-0 -top-14 md:-top-16 translate-x-8 md:translate-x-12', 'animate-float-2', 0.5, true, 2),
('React', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', '-right-16 md:-right-20 top-8 md:top-10', 'animate-float-3', 1, false, 3),
('Node.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', '-right-18 md:-right-24 top-1/2 -translate-y-1/2', 'animate-float-1', 1.5, false, 4),
('n8n', 'https://avatars.githubusercontent.com/u/45487711?s=200&v=4', '-right-16 md:-right-20 bottom-8 md:bottom-10', 'animate-float-2', 2, false, 5),
('TypeScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', 'right-0 -bottom-14 md:-bottom-16 translate-x-8 md:translate-x-12', 'animate-float-3', 0.8, false, 6),
('Next.js', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', 'left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-24', 'animate-float-1', 1.2, true, 7),
('JavaScript', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', 'left-0 -bottom-14 md:-bottom-16 -translate-x-8 md:-translate-x-12', 'animate-float-2', 0.3, false, 8),
('Tailwind CSS', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', '-left-16 md:-left-20 bottom-8 md:bottom-10', 'animate-float-1', 0.6, false, 9),
('Git', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', '-left-18 md:-left-24 top-1/2 -translate-y-1/2', 'animate-float-3', 1.8, false, 10),
('Python', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', '-left-16 md:-left-20 top-8 md:top-10', 'animate-float-2', 1.4, false, 11),
('Docker', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', 'left-0 -top-14 md:-top-16 -translate-x-8 md:-translate-x-12', 'animate-float-3', 0.9, false, 12);

INSERT INTO public.homepage_hero_badges (badge_text, position_class, display_order)
VALUES
('System Builder', 'absolute -top-8 -right-32 md:-right-44', 1),
('MERN Expert', 'absolute top-1/3 -left-36 md:-left-48', 2),
('Workflow Expert', 'absolute bottom-1/3 -right-32 md:-right-44', 3),
('SaaS Builder', 'absolute -bottom-8 -left-32 md:-left-44', 4);
