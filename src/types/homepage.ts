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
  paragraph_1: string;
  paragraph_2: string;
  paragraph_3: string;
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
  copyright_text: string;
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
