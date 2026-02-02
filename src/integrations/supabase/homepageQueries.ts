import type {
    HomepageAbout,
    HomepageAboutHighlight,
    HomepageAboutInterest,
    HomepageAboutValue,
    HomepageFooter,
    HomepageGeneral,
    HomepageHero,
    HomepageHeroBadge,
    HomepageHeroRole,
    HomepageHeroStat,
    HomepageHeroTech,
    HomepageNavbar,
    HomepageNavLink,
    HomepageSocialLink,
} from '@/types/homepage';
import { supabase } from './client';

// ============================================================================
// HERO SECTION QUERIES
// ============================================================================

export const getHeroContent = async () => {
  const { data, error } = await supabase
    .from('homepage_hero')
    .select('*')
    .single();
  
  if (error) throw error;
  return data as HomepageHero;
};

export const getHeroRoles = async () => {
  const { data, error } = await supabase
    .from('homepage_hero_roles')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageHeroRole[];
};

export const getHeroTechs = async () => {
  const { data, error } = await supabase
    .from('homepage_hero_techs')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageHeroTech[];
};

export const getHeroBadges = async () => {
  const { data, error } = await supabase
    .from('homepage_hero_badges')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageHeroBadge[];
};

export const getHeroStats = async () => {
  const { data, error } = await supabase
    .from('homepage_hero_stats')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageHeroStat[];
};

export const updateHeroContent = async (hero: Partial<HomepageHero>) => {
  const { data, error } = await supabase
    .from('homepage_hero')
    .update(hero)
    .eq('id', hero.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// SOCIAL LINKS QUERIES
// ============================================================================

export const getSocialLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_social_links')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageSocialLink[];
};

export const getAllSocialLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_social_links')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageSocialLink[];
};

export const updateSocialLink = async (link: Partial<HomepageSocialLink>) => {
  const { data, error } = await supabase
    .from('homepage_social_links')
    .update(link)
    .eq('id', link.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createSocialLink = async (link: Omit<HomepageSocialLink, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('homepage_social_links')
    .insert(link)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteSocialLink = async (id: string) => {
  const { error } = await supabase
    .from('homepage_social_links')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// ============================================================================
// NAVBAR QUERIES
// ============================================================================

export const getNavbarConfig = async () => {
  const { data, error } = await supabase
    .from('homepage_navbar')
    .select('*')
    .single();
  
  if (error) throw error;
  return data as HomepageNavbar;
};

export const getNavLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_nav_links')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageNavLink[];
};

export const getAllNavLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_nav_links')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageNavLink[];
};

export const updateNavbarConfig = async (navbar: Partial<HomepageNavbar>) => {
  const { data, error } = await supabase
    .from('homepage_navbar')
    .update(navbar)
    .eq('id', navbar.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// ABOUT SECTION QUERIES
// ============================================================================

export const getAboutContent = async () => {
  const { data, error } = await supabase
    .from('homepage_about')
    .select('*')
    .single();
  
  if (error) throw error;
  return data as HomepageAbout;
};

export const getAboutHighlights = async () => {
  const { data, error } = await supabase
    .from('homepage_about_highlights')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageAboutHighlight[];
};

export const getAboutInterests = async () => {
  const { data, error } = await supabase
    .from('homepage_about_interests')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageAboutInterest[];
};

export const getAboutValues = async () => {
  const { data, error } = await supabase
    .from('homepage_about_values')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageAboutValue[];
};

export const updateAboutContent = async (about: Partial<HomepageAbout>) => {
  const { data, error } = await supabase
    .from('homepage_about')
    .update(about)
    .eq('id', about.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// FOOTER QUERIES
// ============================================================================

export const getFooterContent = async () => {
  const { data, error } = await supabase
    .from('homepage_footer')
    .select('*')
    .single();
  
  if (error) throw error;
  return data as HomepageFooter;
};

export const updateFooterContent = async (footer: Partial<HomepageFooter>) => {
  const { data, error } = await supabase
    .from('homepage_footer')
    .update(footer)
    .eq('id', footer.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// GENERAL SETTINGS QUERIES
// ============================================================================

export const getGeneralSettings = async () => {
  const { data, error } = await supabase
    .from('homepage_general')
    .select('*')
    .single();
  
  if (error) throw error;
  return data as HomepageGeneral;
};

export const updateGeneralSettings = async (settings: Partial<HomepageGeneral>) => {
  const { data, error } = await supabase
    .from('homepage_general')
    .update(settings)
    .eq('id', settings.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// COMBINED QUERIES FOR EFFICIENCY
// ============================================================================

export const getAllHeroData = async () => {
  const [hero, roles, techs, badges, stats, socialLinks] = await Promise.all([
    getHeroContent(),
    getHeroRoles(),
    getHeroTechs(),
    getHeroBadges(),
    getHeroStats(),
    getSocialLinks(),
  ]);

  return { hero, roles, techs, badges, stats, socialLinks };
};

export const getAllNavbarData = async () => {
  const [navbar, navLinks] = await Promise.all([
    getNavbarConfig(),
    getNavLinks(),
  ]);

  return { navbar, navLinks };
};

export const getAllAboutData = async () => {
  const [about, highlights, interests, values] = await Promise.all([
    getAboutContent(),
    getAboutHighlights(),
    getAboutInterests(),
    getAboutValues(),
  ]);

  return { about, highlights, interests, values };
};

export const getAllFooterData = async () => {
  const [footer, socialLinks] = await Promise.all([
    getFooterContent(),
    getSocialLinks(),
  ]);

  return { footer, socialLinks };
};
