import { supabase } from './client';

export const getAllSectionVisibilities = async () => {
    const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('section_key, is_visible');
    
    if (error) {
        console.error('Error fetching section visibilities:', error);
        return {} as Record<string, boolean>;
    }
    
    const visibilityMap: Record<string, boolean> = {};
    data?.forEach((item: any) => {
        visibilityMap[item.section_key] = item.is_visible;
    });
    
    return visibilityMap;
};
