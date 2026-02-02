-- Update Social Link Icon URLs
-- Ensure Upwork and Fiverr have their SVG icon URLs populated

UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/upwork.svg' 
WHERE platform = 'Upwork';

UPDATE public.homepage_social_links 
SET icon_url = 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fiverr.svg' 
WHERE platform = 'Fiverr';

-- Ensure standard platforms have NULL icon_url to prefer icon_name
UPDATE public.homepage_social_links 
SET icon_url = NULL 
WHERE platform IN ('GitHub', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Email', 'YouTube');
