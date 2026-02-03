import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavbarContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const NavbarEditor = () => {
    const { data, isLoading } = useNavbarContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [navbarData, setNavbarData] = useState({
        logo_text: '',
        logo_icon_name: '',
        cta_button_text: '',
        cta_button_href: '',
    });

    const [navLinks, setNavLinks] = useState<Array<{ id?: string; label: string; href: string; path: string; display_order: number }>>([]);

    useEffect(() => {
        if (data) {
            setNavbarData({
                logo_text: data.navbar.logo_text,
                logo_icon_name: data.navbar.logo_icon_name,
                cta_button_text: data.navbar.cta_button_text,
                cta_button_href: data.navbar.cta_button_href,
            });
            setNavLinks(data.navLinks);
        }
    }, [data]);

    const updateNavbarMutation = useMutation({
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

    const updateNavLinksMutation = useMutation({
        mutationFn: async (updatedLinks: typeof navLinks) => {
            await supabase.from('homepage_nav_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { error } = await supabase
                .from('homepage_nav_links')
                .insert(updatedLinks.map((link, index) => ({
                    label: link.label,
                    href: link.href,
                    path: link.path,
                    display_order: index,
                })));
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'navbar'] });
            toast({
                title: 'Success',
                description: 'Navigation links updated successfully',
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
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Navbar Configuration</h1>
                <p className="text-muted-foreground mt-1">
                    Edit navigation bar logo, links, and CTA button
                </p>
            </div>

            <Tabs defaultValue="branding" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="branding" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Logo & CTA</TabsTrigger>
                        <TabsTrigger value="links" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Navigation Links</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="branding" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding & CTA</CardTitle>
                            <CardDescription>Logo configuration and call-to-action button</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="logo">Logo Text *</Label>
                                    <Input
                                        id="logo"
                                        value={navbarData.logo_text}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_text: e.target.value })}
                                        placeholder="AKM"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Text displayed in the logo (e.g., "AKM")
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="logo-icon">Logo Icon Name *</Label>
                                    <Input
                                        id="logo-icon"
                                        value={navbarData.logo_icon_name}
                                        onChange={(e) => setNavbarData({ ...navbarData, logo_icon_name: e.target.value })}
                                        placeholder="Terminal"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Lucide icon name (e.g., "Terminal", "Code2")
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="cta-text">CTA Button Text *</Label>
                                    <Input
                                        id="cta-text"
                                        value={navbarData.cta_button_text}
                                        onChange={(e) => setNavbarData({ ...navbarData, cta_button_text: e.target.value })}
                                        placeholder="Hire Me"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cta-href">CTA Button Link *</Label>
                                    <Input
                                        id="cta-href"
                                        value={navbarData.cta_button_href}
                                        onChange={(e) => setNavbarData({ ...navbarData, cta_button_href: e.target.value })}
                                        placeholder="#contact"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Link for the CTA button (e.g., "#contact", "/hire")
                                    </p>
                                </div>
                            </div>

                            <Button onClick={() => updateNavbarMutation.mutate(navbarData)} disabled={updateNavbarMutation.isPending}>
                                {updateNavbarMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Branding
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="links" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Navigation Links</CardTitle>
                            <CardDescription>Menu items in the navigation bar</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {navLinks.map((link, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                        <div className="flex-1 grid gap-2 md:grid-cols-3">
                                            <Input
                                                value={link.label}
                                                onChange={(e) => {
                                                    const updated = [...navLinks];
                                                    updated[index].label = e.target.value;
                                                    setNavLinks(updated);
                                                }}
                                                placeholder="Label (e.g., Home)"
                                            />
                                            <Input
                                                value={link.href}
                                                onChange={(e) => {
                                                    const updated = [...navLinks];
                                                    updated[index].href = e.target.value;
                                                    setNavLinks(updated);
                                                }}
                                                placeholder="Anchor (e.g., #home)"
                                            />
                                            <Input
                                                value={link.path}
                                                onChange={(e) => {
                                                    const updated = [...navLinks];
                                                    updated[index].path = e.target.value;
                                                    setNavLinks(updated);
                                                }}
                                                placeholder="Path (e.g., /)"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setNavLinks(navLinks.filter((_, i) => i !== index))}
                                            disabled={navLinks.length === 1}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Link Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Label:</strong> Text shown in navbar (e.g., "Home")</li>
                                    <li>• <strong>Anchor:</strong> Link when on homepage (e.g., "#home")</li>
                                    <li>• <strong>Path:</strong> Link from other pages (e.g., "/")</li>
                                </ul>
                            </div>

                            <Button
                                onClick={() => setNavLinks([...navLinks, { label: '', href: '', path: '/', display_order: navLinks.length }])}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Navigation Link
                            </Button>

                            <Button onClick={() => updateNavLinksMutation.mutate(navLinks)} disabled={updateNavLinksMutation.isPending} className="w-full">
                                {updateNavLinksMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Navigation Links
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NavbarEditor;
