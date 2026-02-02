-- Fix for section_visibility RLS policies
-- This migration corrects the authentication check

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view section visibility" ON section_visibility;
DROP POLICY IF EXISTS "Authenticated users can update section visibility" ON section_visibility;
DROP POLICY IF EXISTS "Authenticated users can insert section visibility" ON section_visibility;

-- Create correct policies with proper authentication check
-- Public read access
CREATE POLICY "Public can view section visibility" 
ON section_visibility FOR SELECT 
USING (true);

-- Authenticated users can update (fixed syntax)
CREATE POLICY "Authenticated users can update section visibility" 
ON section_visibility FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert (fixed syntax)
CREATE POLICY "Authenticated users can insert section visibility" 
ON section_visibility FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Alternative: If you want to allow unauthenticated updates (for testing/development),
-- you can use this simpler approach by temporarily disabling RLS:
-- ALTER TABLE section_visibility DISABLE ROW LEVEL SECURITY;
