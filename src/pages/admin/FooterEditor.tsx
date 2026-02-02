import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFooterContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const FooterEditor = () => {
    const { data, isLoading } = useFooterContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [footerData, setFooterData] = useState({
        logo_text: '',
        description: '',
        copyright_text: '',
    });

    useEffect(() => {
        if (data) {
            setFooterData({
                logo_text: data.footer.logo_text,
                description: data.footer.description,
                copyright_text: data.footer.copyright_text,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: async (updatedData: typeof footerData) => {
            const { data: result, error } = await supabase
                .from('homepage_footer')
                .update(updatedData)
                .eq('id', data!.footer.id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({
                title: 'Success',
                description: 'Footer updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update footer',
                variant: 'destructive',
            });
        },
    });

    const handleSave = () => {
        updateMutation.mutate(footerData);
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
                <h1 className="text-2xl sm:text-3xl font-bold">Footer Configuration</h1>
                <p className="text-muted-foreground mt-1">
                    Edit footer content and settings
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
                            value={footerData.logo_text}
                            onChange={(e) => setFooterData({ ...footerData, logo_text: e.target.value })}
                            placeholder="AKM"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={footerData.description}
                            onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                            placeholder="Building digital experiences..."
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="copyright">Copyright Text</Label>
                        <Input
                            id="copyright"
                            value={footerData.copyright_text}
                            onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                            placeholder="© 2026 Your Name. All rights reserved."
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

export default FooterEditor;
