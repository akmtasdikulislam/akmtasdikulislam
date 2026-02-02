-- Fix for existing section_visibility table
-- This script inserts/updates section visibility data and fixes RLS policies

-- Drop and recreate RLS policies with proper admin checks
DROP POLICY IF EXISTS "Public can view section visibility" ON public.section_visibility;
DROP POLICY IF EXISTS "Authenticated users can update section visibility" ON public.section_visibility;
DROP POLICY IF EXISTS "Authenticated users can insert section visibility" ON public.section_visibility;
DROP POLICY IF EXISTS "Admins can update section visibility" ON public.section_visibility;
DROP POLICY IF EXISTS "Admins can insert section visibility" ON public.section_visibility;

-- Create RLS policies
-- Public read access
CREATE POLICY "Public can view section visibility" 
ON public.section_visibility FOR SELECT 
USING (true);

-- Admins can update
CREATE POLICY "Admins can update section visibility" 
ON public.section_visibility FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admins can insert
CREATE POLICY "Admins can insert section visibility" 
ON public.section_visibility FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert/update section visibility data for all sections
INSERT INTO public.section_visibility (section_key, is_visible)
VALUES 
    ('certifications', TRUE),
    ('testimonials', TRUE),
    ('work_history', TRUE)
ON CONFLICT (section_key) DO UPDATE
SET is_visible = EXCLUDED.is_visible;

-- Verify the data (using only existing columns)
SELECT section_key, is_visible, updated_at 
FROM public.section_visibility 
ORDER BY section_key;
