import {
    getAllAboutData,
    getAllExpertiseData,
    getAllFooterData,
    getAllHeroData,
    getAllNavbarData,
    getAllServicesData,
    getAllTestimonialsData,
    getCodingProfiles,
    getContactInfo,
    getFreelanceProfiles,
    getGeneralSettings
} from '@/integrations/supabase/homepageQueries';
import { getSectionHeading } from '@/integrations/supabase/sectionHeadingQueries';
import { getAllWhyChooseData } from '@/integrations/supabase/whyChooseMeQueries';
import { useQuery } from '@tanstack/react-query';

// ... (existing code)

// Hook for Section Headings
export const useSectionHeading = (sectionKey: string) => {
    return useQuery({
        queryKey: ['homepage', 'section_heading', sectionKey],
        queryFn: () => getSectionHeading(sectionKey),
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Why Choose Me section
export const useWhyChooseMeContent = () => {
    return useQuery({
        queryKey: ['homepage', 'why-choose-me'],
        queryFn: getAllWhyChooseData,
        staleTime: 1000 * 60 * 5,
    });
};

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

// Hook for Expertise data
export const useExpertiseContent = () => {
  return useQuery({
    queryKey: ['homepage', 'expertise'],
    queryFn: getAllExpertiseData,
    staleTime: 1000 * 60 * 5,
  });
};

// Hook for Services data
export const useServicesContent = () => {
    return useQuery({
        queryKey: ['homepage', 'services'],
        queryFn: getAllServicesData,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Testimonials
export const useTestimonialsContent = () => {
    return useQuery({
        queryKey: ['homepage', 'testimonials'],
        queryFn: getAllTestimonialsData,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Coding Profiles
export const useCodingProfilesContent = () => {
    return useQuery({
        queryKey: ['homepage', 'coding_profiles'],
        queryFn: getCodingProfiles,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Contact Info
export const useContactContent = () => {
    return useQuery({
        queryKey: ['homepage', 'contact'],
        queryFn: getContactInfo,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Freelance Profiles
export const useFreelanceProfilesContent = () => {
    return useQuery({
        queryKey: ['homepage', 'freelance_profiles'],
        queryFn: getFreelanceProfiles,
        staleTime: 1000 * 60 * 5,
    });
};

// Hook for Why Choose Me section

