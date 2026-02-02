import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useGeneralSettings } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const GeneralSettings = () => {
    const { data: settings, isLoading } = useGeneralSettings();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        site_title: '',
        site_description: '',
        site_keywords: '',
        favicon_url: '',
        og_image_url: '',
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                site_title: settings.site_title,
                site_description: settings.site_description,
                site_keywords: settings.site_keywords ? settings.site_keywords.join(', ') : '',
                favicon_url: settings.favicon_url || '',
                og_image_url: settings.og_image_url || '',
            });
        }
    }, [settings]);

    const updateSettingsMutation = useMutation({
        mutationFn: async (updatedData: typeof formData) => {
            const keywordsArray = updatedData.site_keywords.split(',').map(k => k.trim()).filter(k => k);

            const payload = {
                site_title: updatedData.site_title,
                site_description: updatedData.site_description,
                site_keywords: keywordsArray,
                favicon_url: updatedData.favicon_url || null,
                og_image_url: updatedData.og_image_url || null,
            };

            const { data, error } = await supabase
                .from('homepage_general')
                .update(payload)
                .eq('id', settings!.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'general'] });
            toast({
                title: 'Success',
                description: 'General settings updated successfully',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update settings',
                variant: 'destructive',
            });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl pb-20">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">General Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage global site settings, SEO, and metadata
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>SEO & Metadata</CardTitle>
                    <CardDescription>
                        These settings affect how your site appears in search engines and social shares
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Site Title</Label>
                        <Input
                            id="title"
                            value={formData.site_title}
                            onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                            placeholder="My Portfolio"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Meta Description</Label>
                        <Textarea
                            id="desc"
                            value={formData.site_description}
                            onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                            placeholder="A brief description of your portfolio website..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                            id="keywords"
                            value={formData.site_keywords}
                            onChange={(e) => setFormData({ ...formData, site_keywords: e.target.value })}
                            placeholder="portfolio, developer, react, etc. (comma separated)"
                        />
                        <p className="text-xs text-muted-foreground">Separate keywords with commas</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="favicon">Favicon URL</Label>
                            <Input
                                id="favicon"
                                value={formData.favicon_url}
                                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                                placeholder="https://example.com/favicon.ico"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="og_image">OG Image URL</Label>
                            <Input
                                id="og_image"
                                value={formData.og_image_url}
                                onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                                placeholder="https://example.com/og-image.jpg"
                            />
                        </div>
                    </div>

                    <Button onClick={() => updateSettingsMutation.mutate(formData)} disabled={updateSettingsMutation.isPending} className="mt-4">
                        {updateSettingsMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Settings
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default GeneralSettings;
