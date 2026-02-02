import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFooterContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

const FooterEditor = () => {
    const { data, isLoading } = useFooterContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [footerData, setFooterData] = useState({
        logo_text: '',
        description: '',
        contact_email: '',
        copyright_text: '',
    });

    useEffect(() => {
        if (data) {
            setFooterData({
                logo_text: data.footer.logo_text,
                description: data.footer.description,
                contact_email: data.footer.contact_email,
                copyright_text: data.footer.copyright_text,
            });
        }
    }, [data]);

    const updateFooterMutation = useMutation({
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
                <h1 className="text-2xl sm:text-3xl font-bold">Footer Configuration</h1>
                <p className="text-muted-foreground mt-1">
                    Edit the footer content, copyright, and contact info
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Footer Information</CardTitle>
                    <CardDescription>Main content displayed in the footer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label htmlFor="logo">Logo Text *</Label>
                            <Input
                                id="logo"
                                value={footerData.logo_text}
                                onChange={(e) => setFooterData({ ...footerData, logo_text: e.target.value })}
                                placeholder="AKM"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Contact Email *</Label>
                            <Input
                                id="email"
                                value={footerData.contact_email}
                                onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="desc">Description *</Label>
                        <Textarea
                            id="desc"
                            value={footerData.description}
                            onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                            placeholder="Brief description aimed at site visitors"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="copyright">Copyright Text *</Label>
                        <Input
                            id="copyright"
                            value={footerData.copyright_text}
                            onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                            placeholder="© 2026 Akm Tasdikul Islam. All rights reserved."
                        />
                    </div>

                    <Button onClick={() => updateFooterMutation.mutate(footerData)} disabled={updateFooterMutation.isPending}>
                        {updateFooterMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Footer
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Social links are managed in the Hero Editor as they are shared across the site.
                    Vertical navigation links and Service links are currently hardcoded or derived from the main navigation.
                </p>
            </div>
        </div>
    );
};

export default FooterEditor;
