import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

            <Tabs defaultValue="info" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="info" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Basic Info</TabsTrigger>
                        <TabsTrigger value="connect" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Connect CTA</TabsTrigger>
                        <TabsTrigger value="quick" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Quick Links</TabsTrigger>
                        <TabsTrigger value="services" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Service Links</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="info" className="mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Footer Information</CardTitle>
                            <CardDescription>Main branding and copyright info</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Logo Text</Label>
                                    <Input
                                        value={footerData.logo_text}
                                        onChange={(e) => setFooterData({ ...footerData, logo_text: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Contact Email</Label>
                                    <Input
                                        value={footerData.contact_email}
                                        onChange={(e) => setFooterData({ ...footerData, contact_email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                <Textarea
                                    value={footerData.description}
                                    onChange={(e) => setFooterData({ ...footerData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Copyright Text</Label>
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

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Basic Info Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Logo Text:</strong> Your brand name or logo text shown in the footer.</li>
                            <li>• <strong>Contact Email:</strong> The primary email for business inquiries.</li>
                            <li>• <strong>Description:</strong> A short professional summary or bio.</li>
                            <li>• <strong>Copyright:</strong> The year and credit line displayed at the very bottom.</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="connect" className="mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Connect Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Connect CTA Section</CardTitle>
                            <CardDescription>Manage the "Let's Connect" section in the footer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">CTA Title</Label>
                                <Input
                                    value={footerData.connect_title}
                                    onChange={(e) => setFooterData({ ...footerData, connect_title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">CTA Text</Label>
                                <Textarea
                                    value={footerData.connect_text}
                                    onChange={(e) => setFooterData({ ...footerData, connect_text: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Button Text</Label>
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

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Connect CTA Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>CTA Title:</strong> The attention-grabbing heading to start a conversation.</li>
                            <li>• <strong>CTA Text:</strong> Supporting copy that explains why users should reach out.</li>
                            <li>• <strong>Button Text:</strong> Clear call-to-action label (e.g., "Hire Me").</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="quick" className="mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Quick Links */}
                    <LinkManager
                        title="Quick Links"
                        links={data?.quickLinks || []}
                        onAdd={(name, href) => addQuickLinkMutation.mutate({ name, href, display_order: (data?.quickLinks?.length || 0) + 1 })}
                        onUpdate={(id, name, href) => updateQuickLinkMutation.mutate({ id, name, href })}
                        onDelete={(id) => deleteQuickLinkMutation.mutate(id)}
                        isPending={addQuickLinkMutation.isPending || updateQuickLinkMutation.isPending}
                    />

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Quick Links Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Label:</strong> The clickable text shown to the user (e.g., "About").</li>
                            <li>• <strong>Href:</strong> Use "#about" for section anchors or "https://..." for external links.</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="services" className="mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Service Links */}
                    <LinkManager
                        title="Service Links"
                        links={data?.serviceLinks || []}
                        onAdd={(name, href) => addServiceLinkMutation.mutate({ name, href, display_order: (data?.serviceLinks?.length || 0) + 1 })}
                        onUpdate={(id, name, href) => updateServiceLinkMutation.mutate({ id, name, href })}
                        onDelete={(id) => deleteServiceLinkMutation.mutate(id)}
                        isPending={addServiceLinkMutation.isPending || updateServiceLinkMutation.isPending}
                    />

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Service Links Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Label:</strong> The service name shown to the user (e.g., "Web Design").</li>
                            <li>• <strong>Href:</strong> Destination URL or anchor for the service detail.</li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
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
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Link Label</Label>
                            <Input placeholder="Label" value={newName} onChange={e => setNewName(e.target.value)} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Href (e.g. #about or https://...)</Label>
                            <Input placeholder="Href" value={newHref} onChange={e => setNewHref(e.target.value)} />
                        </div>
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
