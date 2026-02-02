import {
    getAllAboutData,
    getAllFooterData,
    getAllHeroData,
    getAllNavbarData,
    getGeneralSettings,
} from '@/integrations/supabase/homepageQueries';
import { useQuery } from '@tanstack/react-query';

// Hook for Hero section data
export const useHeroContent = () => {
  return useQuery({
    queryKey: ['homepage', 'hero'],
    queryFn: getAllHeroData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook for Navbar data
export const useNavbarContent = () => {
  return useQuery({
    queryKey: ['homepage', 'navbar'],
    queryFn: getAllNavbarData,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for About section data
export const useAboutContent = () => {
  return useQuery({
    queryKey: ['homepage', 'about'],
    queryFn: getAllAboutData,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for Footer data
export const useFooterContent = () => {
  return useQuery({
    queryKey: ['homepage', 'footer'],
    queryFn: getAllFooterData,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for General settings
export const useGeneralSettings = () => {
  return useQuery({
    queryKey: ['homepage', 'general'],
    queryFn: getGeneralSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes (changes less frequently)
  });
};

// Combined hook for all homepage content (use sparingly)
export const useAllHomepageContent = () => {
  const hero = useHeroContent();
  const navbar = useNavbarContent();
  const about = useAboutContent();
  const footer = useFooterContent();
  const general = useGeneralSettings();

  return {
    hero,
    navbar,
    about,
    footer,
    general,
    isLoading: hero.isLoading || navbar.isLoading || about.isLoading || footer.isLoading || general.isLoading,
    isError: hero.isError || navbar.isError || about.isError || footer.isError || general.isError,
  };
};
