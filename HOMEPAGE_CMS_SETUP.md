# Homepage CMS Setup Instructions

## ⚠️ IMPORTANT: Database Migration Required

Before you can use the Homepage Content editor in the CMS Panel, you need to run the database migration.

### Step 1: Run the Migration

**Option A - Supabase Dashboard (Recommended):**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open the file: `i:\akm-tasdikul-islam-s-portfolio-website-main\supabase\migrations\20260202000000_homepage_content_system.sql`
6. Copy ALL the SQL code from that file
7. Paste it into the Supabase SQL Editor
8. Click **Run** or press `Ctrl+Enter`
9. Wait for the query to complete (you should see "Success" message)

**Option B - Supabase CLI:**
```bash
cd i:\akm-tasdikul-islam-s-portfolio-website-main
supabase db push
```

### Step 2: Verify the Migration

After running the migration, verify that the tables were created:

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these new tables:
   - homepage_hero
   - homepage_hero_roles
   - homepage_hero_techs
   - homepage_hero_badges
   - homepage_hero_stats
   - homepage_social_links
   - homepage_navbar
   - homepage_nav_links
   - homepage_about
   - homepage_about_highlights
   - homepage_about_interests
   - homepage_about_values
   - homepage_footer
   - homepage_general

### Step 3: Access the CMS Panel

Once the migration is complete:

1. Go to your admin panel: http://localhost:5173/admin
2. Login with your admin credentials
3. Click on **"Homepage"** in the sidebar
4. You'll see cards for editing:
   - Hero Section
   - Navbar
   - About Section
   - Footer
   - General Settings

### What You Can Edit

**Hero Section:**
- Your name and greeting message
- Typewriter roles (Full Stack Developer, etc.)
- Profile photo
- Tech logos floating around photo
- Social media links
- Stats (years of experience, projects, etc.)

**Navbar:**
- Logo text and icon
- Navigation menu links
- CTA button text

**About Section:**
- All paragraph content
- Highlights (Education, Location, etc.)
- Interests tags
- Core values

**Footer:**
- Footer description
- Social links
- Copyright text

**General Settings:**
- Site title and description
- SEO metadata
- Favicon

## Current Status

✅ Database schema created
✅ Frontend components updated to use CMS data  
✅ Admin panel navigation added
⏳ Waiting for database migration
⏳ Individual section editors (Hero, Navbar, About, Footer, Settings) - Coming next

## Troubleshooting

**If you see errors on the homepage:**
- Make sure the database migration ran successfully
- Check browser console for any API errors
- Verify that all tables have data (the migration includes seed data)

**If the CMS panel doesn't show Homepage option:**
- Clear browser cache and refresh
- Make sure the dev server is running: `npm run dev`
