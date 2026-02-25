-- ===================================================================
-- FIX ACTIVITIES TABLE RLS POLICIES
-- Run this to fix the RLS policies for activities table
-- ===================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can update activities" ON public.activities;
DROP POLICY IF EXISTS "Admins can delete activities" ON public.activities;

-- Create new policies with correct syntax
CREATE POLICY "Admins can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update activities" ON public.activities FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete activities" ON public.activities FOR DELETE USING (public.has_role(auth.uid(), 'admin'::app_role));
