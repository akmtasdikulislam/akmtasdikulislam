import type {
    HomepageAbout,
    HomepageAboutHighlight,
    HomepageAboutInterest,
    HomepageAboutValue,
    HomepageCodingProfile,
    HomepageContactInfo,
    HomepageExpertiseCard,
    HomepageExpertiseTech,
    HomepageFooter,
    HomepageFooterLink,
    HomepageFreelanceProfile,
    HomepageGeneral,
    HomepageHero,
    HomepageHeroBadge,
    HomepageHeroRole,
    HomepageHeroStat,
    HomepageHeroTech,
    HomepageNavbar,
    HomepageNavLink,
    HomepageService,
    HomepageSocialLink,
    HomepageTestimonial
} from '@/types/homepage';
import { supabase } from './client';
export { getAllWhyChooseData } from './whyChooseMeQueries';

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
// FOOTER LINKS QUERIES
// ============================================================================

export const getFooterQuickLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_footer_quick_links')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as HomepageFooterLink[];
};

export const updateFooterQuickLink = async (link: Partial<HomepageFooterLink>) => {
  const { data, error } = await supabase
    .from('homepage_footer_quick_links')
    .update(link)
    .eq('id', link.id!)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createFooterQuickLink = async (link: Omit<HomepageFooterLink, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('homepage_footer_quick_links')
    .insert(link)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFooterQuickLink = async (id: string) => {
  const { error } = await supabase
    .from('homepage_footer_quick_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getFooterServiceLinks = async () => {
  const { data, error } = await supabase
    .from('homepage_footer_service_links')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data as HomepageFooterLink[];
};

export const updateFooterServiceLink = async (link: Partial<HomepageFooterLink>) => {
  const { data, error } = await supabase
    .from('homepage_footer_service_links')
    .update(link)
    .eq('id', link.id!)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const createFooterServiceLink = async (link: Omit<HomepageFooterLink, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('homepage_footer_service_links')
    .insert(link)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFooterServiceLink = async (id: string) => {
  const { error } = await supabase
    .from('homepage_footer_service_links')
    .delete()
    .eq('id', id);

  if (error) throw error;
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
  const [footer, socialLinks, quickLinks, serviceLinks] = await Promise.all([
    getFooterContent(),
    getSocialLinks(),
    getFooterQuickLinks(),
    getFooterServiceLinks(),
  ]);

  return { footer, socialLinks, quickLinks, serviceLinks };
};

// ============================================================================
// EXPERTISE QUERIES
// ============================================================================

export const getExpertiseTechs = async () => {
  const { data, error } = await supabase
    .from('homepage_expertise_techs')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data as HomepageExpertiseTech[];
};

export const updateExpertiseTech = async (tech: Partial<HomepageExpertiseTech>) => {
  const { data, error } = await supabase
    .from('homepage_expertise_techs')
    .update(tech)
    .eq('id', tech.id!)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createExpertiseTech = async (tech: Omit<HomepageExpertiseTech, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('homepage_expertise_techs')
    .insert(tech)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteExpertiseTech = async (id: string) => {
  const { error } = await supabase
    .from('homepage_expertise_techs')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getExpertiseCards = async () => {
    const { data, error } = await supabase
      .from('homepage_expertise_cards')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as HomepageExpertiseCard[];
  };

export const updateExpertiseCard = async (card: Partial<HomepageExpertiseCard>) => {
    const { data, error } = await supabase
      .from('homepage_expertise_cards')
      .update(card)
      .eq('id', card.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const createExpertiseCard = async (card: Omit<HomepageExpertiseCard, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('homepage_expertise_cards')
      .insert(card)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const deleteExpertiseCard = async (id: string) => {
    const { error } = await supabase
      .from('homepage_expertise_cards')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
};

// ============================================================================
// SERVICES QUERIES
// ============================================================================

export const getServices = async () => {
    const { data, error } = await supabase
      .from('homepage_services')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as HomepageService[];
};

export const updateService = async (service: Partial<HomepageService>) => {
    const { data, error } = await supabase
      .from('homepage_services')
      .update(service)
      .eq('id', service.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const createService = async (service: Omit<HomepageService, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('homepage_services')
      .insert(service)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const deleteService = async (id: string) => {
    const { error } = await supabase
      .from('homepage_services')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
};

// ============================================================================
// TESTIMONIALS QUERIES
// ============================================================================

export const getTestimonials = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return (data || []).map(t => ({
      ...t,
      is_visible: t.is_visible ?? true,
      is_featured: t.is_featured ?? false,
      display_order: t.display_order ?? 0
    })) as HomepageTestimonial[];
};

export const updateTestimonial = async (item: Partial<HomepageTestimonial>) => {
    const { data, error } = await supabase
      .from('testimonials')
      .update(item)
      .eq('id', item.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const createTestimonial = async (item: Omit<HomepageTestimonial, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const deleteTestimonial = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
};

// ============================================================================
// CODING PROFILES & CONTACT
// ============================================================================

export const getCodingProfiles = async () => {
    const { data, error } = await supabase
      .from('homepage_coding_profiles')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as HomepageCodingProfile[];
};

export const updateCodingProfile = async (item: Partial<HomepageCodingProfile>) => {
    const { data, error } = await supabase
      .from('homepage_coding_profiles')
      .update(item)
      .eq('id', item.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const createCodingProfile = async (item: Omit<HomepageCodingProfile, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('homepage_coding_profiles')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const deleteCodingProfile = async (id: string) => {
    const { error } = await supabase
      .from('homepage_coding_profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
};

export const getContactInfo = async () => {
    const { data, error } = await supabase
      .from('homepage_contact_info')
      .select('*')
      .single();
    
    if (error) throw error;
    return data as HomepageContactInfo;
};

export const updateContactInfo = async (info: Partial<HomepageContactInfo>) => {
    const { data, error } = await supabase
      .from('homepage_contact_info')
      .update(info)
      .eq('id', info.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

// ============================================================================
// FREELANCE PROFILES QUERIES
// ============================================================================

export const getFreelanceProfiles = async () => {
    const { data, error } = await supabase
      .from('homepage_freelance_profiles')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as HomepageFreelanceProfile[];
};

export const updateFreelanceProfile = async (item: Partial<HomepageFreelanceProfile>) => {
    const { data, error } = await supabase
      .from('homepage_freelance_profiles')
      .update(item)
      .eq('id', item.id!)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const createFreelanceProfile = async (item: Omit<HomepageFreelanceProfile, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('homepage_freelance_profiles')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data;
};

export const deleteFreelanceProfile = async (id: string) => {
    const { error } = await supabase
      .from('homepage_freelance_profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
};
