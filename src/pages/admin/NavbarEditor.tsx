import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavbarContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const NavbarEditor = () => {
    const { data, isLoading } = useNavbarContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [navbarData, setNavbarData] = useState({
        logo_text: '',
        cta_button_text: '',
        cta_button_href: '',
    });

    useEffect(() => {
        if (data) {
            setNavbarData({
                logo_text: data.navbar.logo_text,
                cta_button_text: data.navbar.cta_button_text,
                cta_button_href: data.navbar.cta_button_href,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: async (updatedData: typeof navbarData) => {
            const { data: result, error } = await supabase
                .from('homepage_navbar')
                .update(updatedData)
                .eq('id', data!.navbar.id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'navbar'] });
            toast({
                title: 'Success',
                description: 'Navbar updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update navbar',
                variant: 'destructive',
            });
        },
    });

    const handleSave = () => {
        updateMutation.mutate(navbarData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Navbar Configuration</h1>
                <p className="text-muted-foreground mt-1">
                    Edit navigation bar settings
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="logo">Logo Text</Label>
                        <Input
                            id="logo"
                            value={navbarData.logo_text}
                            onChange={(e) => setNavbarData({ ...navbarData, logo_text: e.target.value })}
                            placeholder="AKM"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cta-text">CTA Button Text</Label>
                        <Input
                            id="cta-text"
                            value={navbarData.cta_button_text}
                            onChange={(e) => setNavbarData({ ...navbarData, cta_button_text: e.target.value })}
                            placeholder="Hire Me"
                        />
                    </div>

                    <div>
                        <Label htmlFor="cta-href">CTA Button Link</Label>
                        <Input
                            id="cta-href"
                            value={navbarData.cta_button_href}
                            onChange={(e) => setNavbarData({ ...navbarData, cta_button_href: e.target.value })}
                            placeholder="#contact"
                        />
                    </div>

                    <Button onClick={handleSave} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default NavbarEditor;
