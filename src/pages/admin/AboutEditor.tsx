import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAboutContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const AboutEditor = () => {
    const { data, isLoading } = useAboutContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [aboutData, setAboutData] = useState({
        paragraph_1: '',
        paragraph_2: '',
        paragraph_3: '',
    });

    useEffect(() => {
        if (data) {
            setAboutData({
                paragraph_1: data.about.paragraph_1,
                paragraph_2: data.about.paragraph_2,
                paragraph_3: data.about.paragraph_3,
            });
        }
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: async (updatedData: typeof aboutData) => {
            const { data: result, error } = await supabase
                .from('homepage_about')
                .update(updatedData)
                .eq('id', data!.about.id)
                .select()
                .single();

            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'about'] });
            toast({
                title: 'Success',
                description: 'About section updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update about section',
                variant: 'destructive',
            });
        },
    });

    const handleSave = () => {
        updateMutation.mutate(aboutData);
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
                <h1 className="text-2xl sm:text-3xl font-bold">About Section</h1>
                <p className="text-muted-foreground mt-1">
                    Edit your about section content
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
            >
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="p1">Paragraph 1</Label>
                        <Textarea
                            id="p1"
                            value={aboutData.paragraph_1}
                            onChange={(e) => setAboutData({ ...aboutData, paragraph_1: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="p2">Paragraph 2</Label>
                        <Textarea
                            id="p2"
                            value={aboutData.paragraph_2}
                            onChange={(e) => setAboutData({ ...aboutData, paragraph_2: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="p3">Paragraph 3</Label>
                        <Textarea
                            id="p3"
                            value={aboutData.paragraph_3}
                            onChange={(e) => setAboutData({ ...aboutData, paragraph_3: e.target.value })}
                            rows={3}
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

export default AboutEditor;
