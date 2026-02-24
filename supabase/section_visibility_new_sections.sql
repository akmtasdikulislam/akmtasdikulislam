-- Add section_visibility rows for all homepage sections
-- Safe to run multiple times (ON CONFLICT DO NOTHING)

INSERT INTO public.section_visibility (section_key, is_visible)
VALUES
  ('hero', TRUE),
  ('about', TRUE),
  ('navbar', TRUE),
  ('footer', TRUE),
  ('contact', TRUE),
  ('projects', TRUE),
  ('services', TRUE),
  ('why-choose-me', TRUE),
  ('blogs', TRUE)
ON CONFLICT (section_key) DO NOTHING;

-- Verify
SELECT section_key, is_visible FROM public.section_visibility ORDER BY section_key;
