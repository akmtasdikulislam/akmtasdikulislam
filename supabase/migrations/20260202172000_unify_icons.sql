-- Unify Social Icons to use SVG URLs
-- Populates icon_url for GitHub, LinkedIn, and Email to ensure consistency and visibility

UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg' 
WHERE platform = 'GitHub';

UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg' 
WHERE platform = 'LinkedIn';

UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg' 
WHERE platform = 'Email';

-- Fixing potential casing issues if platform stored as 'Github' etc.
UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg' 
WHERE platform ILIKE 'github';
