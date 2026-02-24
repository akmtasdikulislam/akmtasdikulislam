import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SectionVisibilityToggleProps {
  sectionKey: string;
  label?: string;
}

const SectionVisibilityToggle = ({ sectionKey, label }: SectionVisibilityToggleProps) => {
  const queryClient = useQueryClient();

  const { data: sectionVisible = true } = useQuery({
    queryKey: ['section_visibility', sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('section_visibility' as any)
        .select('is_visible')
        .eq('section_key', sectionKey)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? (data as any).is_visible : true;
    },
    staleTime: 0,
  });

  const toggleSectionVisibility = async (checked: boolean) => {
    try {
      const { error } = await supabase
        .from('section_visibility' as any)
        .upsert({ section_key: sectionKey, is_visible: checked }, { onConflict: 'section_key' });

      if (error) throw error;

      const displayLabel = label || 'Section';
      toast.success(`${displayLabel} ${checked ? 'visible' : 'hidden'}`);
      queryClient.invalidateQueries({ queryKey: ['section_visibility', sectionKey] });
    } catch (error) {
      console.error('Error updating section visibility:', error);
      toast.error('Failed to update section visibility');
    }
  };

  return (
    <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-lg border border-border">
      <Switch
        checked={sectionVisible}
        onCheckedChange={toggleSectionVisibility}
      />
      <span className="text-sm font-medium">
        {sectionVisible ? 'Section Visible' : 'Section Hidden'}
      </span>
    </div>
  );
};

export default SectionVisibilityToggle;
