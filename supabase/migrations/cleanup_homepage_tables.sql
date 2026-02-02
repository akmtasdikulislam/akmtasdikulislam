-- ============================================
-- CLEANUP SCRIPT FOR HOMEPAGE TABLES
-- Run this FIRST if you need to start fresh
-- ============================================

-- This will remove all homepage tables and allow you to run the migration again

-- Drop all homepage tables (in reverse order of dependencies)
DROP TABLE IF EXISTS public.homepage_general CASCADE;
DROP TABLE IF EXISTS public.homepage_footer CASCADE;
DROP TABLE IF EXISTS public.homepage_about_values CASCADE;
DROP TABLE IF EXISTS public.homepage_about_interests CASCADE;
DROP TABLE IF EXISTS public.homepage_about_highlights CASCADE;
DROP TABLE IF EXISTS public.homepage_about CASCADE;
DROP TABLE IF EXISTS public.homepage_nav_links CASCADE;
DROP TABLE IF EXISTS public.homepage_navbar CASCADE;
DROP TABLE IF EXISTS public.homepage_social_links CASCADE;
DROP TABLE IF EXISTS public.homepage_hero_stats CASCADE;
DROP TABLE IF EXISTS public.homepage_hero_badges CASCADE;
DROP TABLE IF EXISTS public.homepage_hero_techs CASCADE;
DROP TABLE IF EXISTS public.homepage_hero_roles CASCADE;
DROP TABLE IF EXISTS public.homepage_hero CASCADE;

-- Note: After running this, run the main migration file again:
-- 20260202000000_homepage_content_system.sql
