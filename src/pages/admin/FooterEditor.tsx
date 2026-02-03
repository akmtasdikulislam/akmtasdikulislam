import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFooterContent } from '@/hooks/useHomepageContent';
import {
    createFooterQuickLink,
    createFooterServiceLink,
    deleteFooterQuickLink,
    deleteFooterServiceLink,
    updateFooterContent,
    updateFooterQuickLink,
    updateFooterServiceLink
} from '@/integrations/supabase/homepageQueries';
import { HomepageFooterLink } from '@/types/homepage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
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
        connect_title: '',
        connect_text: '',
        connect_button_text: '',
    });

    useEffect(() => {
        if (data?.footer) {
            setFooterData({
                logo_text: data.footer.logo_text || '',
                description: data.footer.description || '',
                contact_email: data.footer.contact_email || '',
                copyright_text: data.footer.copyright_text || '',
                connect_title: data.footer.connect_title || '',
                connect_text: data.footer.connect_text || '',
                connect_button_text: data.footer.connect_button_text || '',
            });
        }
    }, [data]);

    // Mutations for Footer Content
    const updateFooterMutation = useMutation({
        mutationFn: (updatedData: typeof footerData) => updateFooterContent({ ...updatedData, id: data!.footer.id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({ title: 'Success', description: 'Footer info updated' });
        },
    });

    // Mutations for Quick Links
    const addQuickLinkMutation = useMutation({
        mutationFn: (link: { name: string; href: string; display_order: number }) => createFooterQuickLink(link),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({ title: 'Success', description: 'Quick link added' });
        },
    });

    const updateQuickLinkMutation = useMutation({
        mutationFn: (link: Partial<HomepageFooterLink>) => updateFooterQuickLink(link),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] }),
    });

    const deleteQuickLinkMutation = useMutation({
        mutationFn: (id: string) => deleteFooterQuickLink(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({ title: 'Success', description: 'Link deleted' });
        },
    });

    // Mutations for Service Links
    const addServiceLinkMutation = useMutation({
        mutationFn: (link: { name: string; href: string; display_order: number }) => createFooterServiceLink(link),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({ title: 'Success', description: 'Service link added' });
        },
    });

    const updateServiceLinkMutation = useMutation({
        mutationFn: (link: Partial<HomepageFooterLink>) => updateFooterServiceLink(link),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] }),
    });

    const deleteServiceLinkMutation = useMutation({
        mutationFn: (id: string) => deleteFooterServiceLink(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'footer'] });
            toast({ title: 'Success', description: 'Link deleted' });
        },
    });

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h1 className="text-3xl font-bold">Footer Management</h1>
                <p className="text-muted-foreground mt-1">Manage all footer elements including links and content.</p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4 space-y-8 mt-6">

                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Footer Information</CardTitle>
                        <CardDescription>Main branding and copyright info</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Logo Text</Label>
                                <Input
                                    value={footerData.logo_text}
                                    onChange={(e) => setFooterData({ ...footerData, logo_text: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Contact Email</Label>
                                <Input
                                    value={footerData.contact_email}
                                    onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={footerData.description}
                                onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Copyright Text</Label>
                            <Input
                                value={footerData.copyright_text}
                                onChange={(e) => setFooterData({ ...footerData, copyright_text: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={() => updateFooterMutation.mutate(footerData)} disabled={updateFooterMutation.isPending} variant="outline">
                                {updateFooterMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Basic Info
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Connect Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Connect CTA Section</CardTitle>
                        <CardDescription>Manage the "Let's Connect" section in the footer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>CTA Title</Label>
                            <Input
                                value={footerData.connect_title}
                                onChange={(e) => setFooterData({ ...footerData, connect_title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Text</Label>
                            <Textarea
                                value={footerData.connect_text}
                                onChange={(e) => setFooterData({ ...footerData, connect_text: e.target.value })}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Button Text</Label>
                            <Input
                                value={footerData.connect_button_text}
                                onChange={(e) => setFooterData({ ...footerData, connect_button_text: e.target.value })}
                            />
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                            <Button onClick={() => updateFooterMutation.mutate(footerData)} disabled={updateFooterMutation.isPending} variant="outline">
                                <Save className="w-4 h-4 mr-2" />
                                Save Connect Info
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Links */}
                <LinkManager
                    title="Quick Links"
                    links={data?.quickLinks || []}
                    onAdd={(name, href) => addQuickLinkMutation.mutate({ name, href, display_order: (data?.quickLinks?.length || 0) + 1 })}
                    onUpdate={(id, name, href) => updateQuickLinkMutation.mutate({ id, name, href })}
                    onDelete={(id) => deleteQuickLinkMutation.mutate(id)}
                    isPending={addQuickLinkMutation.isPending || updateQuickLinkMutation.isPending}
                />

                {/* Service Links */}
                <LinkManager
                    title="Service Links"
                    links={data?.serviceLinks || []}
                    onAdd={(name, href) => addServiceLinkMutation.mutate({ name, href, display_order: (data?.serviceLinks?.length || 0) + 1 })}
                    onUpdate={(id, name, href) => updateServiceLinkMutation.mutate({ id, name, href })}
                    onDelete={(id) => deleteServiceLinkMutation.mutate(id)}
                    isPending={addServiceLinkMutation.isPending || updateServiceLinkMutation.isPending}
                />
            </div>
        </div>
    );
};

interface LinkManagerProps {
    title: string;
    links: HomepageFooterLink[];
    onAdd: (name: string, href: string) => void;
    onUpdate: (id: string, name: string, href: string) => void;
    onDelete: (id: string) => void;
    isPending: boolean;
}

const LinkManager = ({ title, links, onAdd, onUpdate, onDelete, isPending }: LinkManagerProps) => {
    const [newName, setNewName] = useState('');
    const [newHref, setNewHref] = useState('');

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Manage individual links by name and destination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    {links.map((link) => (
                        <div key={link.id} className="flex gap-3 items-end border-b border-border pb-4 last:border-0">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                                    <Input
                                        value={link.name}
                                        onChange={(e) => onUpdate(link.id, e.target.value, link.href)}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Href (URL/ID)</Label>
                                    <Input
                                        value={link.href}
                                        onChange={(e) => onUpdate(link.id, link.name, e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} className="text-destructive hover:bg-destructive/10 transition-colors h-10 px-3">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <p className="text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Add New {title.slice(0, -1)}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input placeholder="Link Label" value={newName} onChange={e => setNewName(e.target.value)} />
                        <Input placeholder="Href (e.g. #about or https://...)" value={newHref} onChange={e => setNewHref(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            disabled={!newName || !newHref || isPending}
                            onClick={() => { onAdd(newName, newHref); setNewName(''); setNewHref(''); }}
                            variant="outline"
                            className="w-full sm:w-auto"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Link
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FooterEditor;
