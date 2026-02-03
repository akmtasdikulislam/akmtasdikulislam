// TypeScript types for homepage content tables

export interface HomepageHero {
  id: string;
  name: string;
  greeting_badge: string;
  description: string;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomepageHeroRole {
  id: string;
  role_text: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageHeroTech {
  id: string;
  name: string;
  icon_url: string;
  position_class: string;
  top_position: number;
  left_position: number;
  animation_class: string;
  delay: number;
  invert: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageHeroBadge {
  id: string;
  badge_text: string;
  position_class: string;
  top_position: number;
  left_position: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageHeroStat {
  id: string;
  stat_label: string;
  stat_value: number;
  stat_suffix: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageSocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string | null;
  icon_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageNavbar {
  id: string;
  logo_text: string;
  logo_icon_name: string;
  cta_button_text: string;
  cta_button_href: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageNavLink {
  id: string;
  label: string;
  href: string;
  path: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface HomepageAbout {
  id: string;
  section_badge: string;
  section_title: string;
  section_highlight: string;
  section_description: string;
  main_content: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageAboutHighlight {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  detail: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageAboutInterest {
  id: string;
  icon_name: string;
  label: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageAboutValue {
  id: string;
  icon_name: string;
  value_text: string;
  description: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageFooter {
  id: string;
  logo_text: string;
  description: string;
  contact_email: string;
  quick_links: { name: string; href: string }[];
  service_links: { name: string; href: string }[];
  connect_title: string;
  connect_text: string;
  connect_button_text: string;
  copyright_text: string;
  created_at: string;
  updated_at: string;
}

export interface HomepageFooterLink {
  id: string;
  name: string;
  href: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface HomepageGeneral {
  id: string;
  site_title: string;
  site_description: string;
  site_keywords: string[];
  favicon_url: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomepageExpertiseTech {
  id: string;
  name: string;
  icon_url: string;
  category: string;
  is_marquee: boolean;
  in_expertise_grid: boolean;
  display_order: number;
  invert_icon: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HomepageExpertiseCard {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface HomepageService {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  features: string[];
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface HomepageTestimonial {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HomepageCodingProfile {
  id: string;
  platform: string;
  url: string;
  icon_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HomepageContactInfo {
  id: string;
  email: string | null;
  location: string | null;
  location_url: string | null;
  available_for_work: boolean;
  available_text: string | null;
  linkedin_url: string | null;
  upwork_url: string | null;
  linkedin_label: string | null;
  upwork_label: string | null;
  created_at: string;
  updated_at?: string;
}

export interface HomepageFreelanceProfile {
  id: string;
  platform: string;
  url: string;
  icon_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
