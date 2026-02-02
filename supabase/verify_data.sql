-- Quick verification query
-- Run this to check if your data was seeded correctly

-- Check hero data
SELECT 'Hero Data' as table_name, count(*) as row_count FROM homepage_hero
UNION ALL
SELECT 'Hero Roles', count(*) FROM homepage_hero_roles
UNION ALL
SELECT 'Hero Techs', count(*) FROM homepage_hero_techs
UNION ALL
SELECT 'Hero Badges', count(*) FROM homepage_hero_badges
UNION ALL
SELECT 'Hero Stats', count(*) FROM homepage_hero_stats
UNION ALL
SELECT 'Social Links', count(*) FROM homepage_social_links
UNION ALL
SELECT 'Navbar', count(*) FROM homepage_navbar
UNION ALL
SELECT 'Nav Links', count(*) FROM homepage_nav_links
UNION ALL
SELECT 'About', count(*) FROM homepage_about
UNION ALL
SELECT 'About Highlights', count(*) FROM homepage_about_highlights
UNION ALL
SELECT 'About Interests', count(*) FROM homepage_about_interests
UNION ALL
SELECT 'About Values', count(*) FROM homepage_about_values
UNION ALL
SELECT 'Footer', count(*) FROM homepage_footer
UNION ALL
SELECT 'General', count(*) FROM homepage_general;

-- Expected results:
-- Hero Data: 1
-- Hero Roles: 3+
-- Hero Techs: 5+
-- Hero Badges: 3+
-- Hero Stats: 4
-- Social Links: 4+
-- Navbar: 1
-- Nav Links: 5
-- About: 1
-- About Highlights: 4
-- About Interests: 6+
-- About Values: 4
-- Footer: 1
-- General: 1
