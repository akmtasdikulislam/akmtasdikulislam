import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCodingProfilesContent, useContactContent, useFreelanceProfilesContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const ContactEditor = () => {
    const { data: contactData, isLoading: contactLoading } = useContactContent();
    const { data: profilesData, isLoading: profilesLoading } = useCodingProfilesContent();
    const { data: freelanceData, isLoading: freelanceLoading } = useFreelanceProfilesContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [contact, setContact] = useState<any>({
        email: '',
        location: '',
        location_url: '',
        available_for_work: true,
        available_text: 'Available for Work',
        linkedin_url: '',
        upwork_url: '',
        linkedin_label: 'Connect on LinkedIn',
        upwork_label: 'Hire me on Upwork'
    });
    const [profiles, setProfiles] = useState<any[]>([]);
    const [freelanceProfiles, setFreelanceProfiles] = useState<any[]>([]);

    useEffect(() => {
        if (contactData) setContact(contactData);
        if (profilesData) setProfiles(profilesData);
        if (freelanceData) setFreelanceProfiles(freelanceData);
    }, [contactData, profilesData, freelanceData]);

    const updateContactMutation = useMutation({
        mutationFn: async (data: any) => {
            await supabase.from('homepage_contact_info').update(data).eq('id', data.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'contact'] });
            toast({ title: 'Contact Info updated' });
        }
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (item: any) => {
            if (item.id.startsWith('temp-')) {
                const { ...newItem } = item;
                delete newItem.id;
                await supabase.from('homepage_coding_profiles').insert(newItem);
            } else {
                const { ...updateItem } = item;
                delete updateItem.created_at;
                delete updateItem.updated_at;
                await supabase.from('homepage_coding_profiles').update(updateItem).eq('id', item.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'coding_profiles'] });
            toast({ title: 'Profile updated' });
        }
    });

    const updateFreelanceMutation = useMutation({
        mutationFn: async (item: any) => {
            if (item.id.startsWith('temp-')) {
                const { ...newItem } = item;
                delete newItem.id;
                await supabase.from('homepage_freelance_profiles').insert(newItem);
            } else {
                const { ...updateItem } = item;
                delete updateItem.created_at;
                delete updateItem.updated_at;
                await supabase.from('homepage_freelance_profiles').update(updateItem).eq('id', item.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'freelance_profiles'] });
            toast({ title: 'Freelance Profile updated' });
        }
    });

    const deleteProfileMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_coding_profiles').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'coding_profiles'] });
            toast({ title: 'Profile deleted' });
        }
    });

    const deleteFreelanceMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_freelance_profiles').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'freelance_profiles'] });
            toast({ title: 'Freelance Profile deleted' });
        }
    });

    const addNewProfile = () => {
        setProfiles([...profiles, {
            id: `temp-${Date.now()}`,
            platform: 'New Platform',
            url: '',
            icon_url: '',
            icon_type: 'upload',
            display_order: profiles.length + 1
        }]);
    };

    const addNewFreelance = () => {
        setFreelanceProfiles([...freelanceProfiles, {
            id: `temp-${Date.now()}`,
            platform: 'New Platform',
            url: '',
            icon_url: '',
            icon_type: 'upload',
            display_order: freelanceProfiles.length + 1
        }]);
    };

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'coding' | 'freelance') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const filePath = `profile-icon-${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) { toast({ title: 'Upload failed' }); return; }
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

        if (type === 'coding') {
            setProfiles(profiles.map(p => p.id === id ? { ...p, icon_url: publicUrl, icon_type: 'upload' } : p));
        } else {
            setFreelanceProfiles(freelanceProfiles.map(p => p.id === id ? { ...p, icon_url: publicUrl, icon_type: 'upload' } : p));
        }
    };

    const { data: messagesData, isLoading: messagesLoading } = useQuery({
        queryKey: ['contact_messages'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        }
    });

    const updateMessageMutation = useMutation({
        mutationFn: async ({ id, is_read }: { id: string, is_read: boolean }) => {
            await supabase.from('contact_messages').update({ is_read }).eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
        }
    });

    const deleteMessageMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('contact_messages').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contact_messages'] });
            toast({ title: 'Message deleted' });
        }
    });

    if (contactLoading || profilesLoading || messagesLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    const unreadCount = messagesData?.filter(m => !m.is_read).length || 0;

    return (
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h2 className="text-3xl font-bold tracking-tight">Contact & Profiles</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your contact information, social links, and messages
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4">
                <SectionHeadingEditor sectionKey="contact" />
            </div>

            <Tabs defaultValue="messages" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="messages" className="relative px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                            Messages
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="info" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Contact Info</TabsTrigger>
                        <TabsTrigger value="profiles" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Coding Profiles</TabsTrigger>
                        <TabsTrigger value="freelance" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Freelance Profiles</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="messages" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inbound Messages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {messagesData?.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No messages yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {messagesData?.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`p-4 rounded-lg border transition-all ${msg.is_read ? 'bg-muted/30 opacity-70' : 'bg-card border-primary/20 shadow-sm'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{msg.subject}</h3>
                                                    <p className="text-sm text-muted-foreground">From: <span className="text-foreground">{msg.name}</span> ({msg.email})</p>
                                                    <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString()}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateMessageMutation.mutate({ id: msg.id, is_read: !msg.is_read })}
                                                    >
                                                        {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        onClick={() => deleteMessageMutation.mutate(msg.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-4 text-sm whitespace-pre-wrap text-foreground/90 bg-muted/50 p-3 rounded border">
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Messages Management:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Inbound Messages:</strong> View and manage inquiries sent via your website's contact form.</li>
                            <li>• <strong>Status Control:</strong> Use "Mark Read/Unread" to track your responses and keep the inbox organized.</li>
                            <li>• <strong>Deletion:</strong> Permanently remove messages that are no longer needed.</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="info" className="mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Email</Label>
                                    <Input value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Location</Label>
                                    <Input value={contact.location || ''} onChange={(e) => setContact({ ...contact, location: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Location Maps Link</Label>
                                    <Input value={contact.location_url || ''} onChange={(e) => setContact({ ...contact, location_url: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Upwork Profile URL</Label>
                                    <Input
                                        value={contact.upwork_url || ''}
                                        onChange={(e) => setContact({ ...contact, upwork_url: e.target.value })}
                                        placeholder="https://www.upwork.com/freelancers/..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">LinkedIn Profile URL</Label>
                                    <Input
                                        value={contact.linkedin_url || ''}
                                        onChange={(e) => setContact({ ...contact, linkedin_url: e.target.value })}
                                        placeholder="https://www.linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Upwork Button Text</Label>
                                    <Input
                                        value={contact.upwork_label || ''}
                                        onChange={(e) => setContact({ ...contact, upwork_label: e.target.value })}
                                        placeholder="Hire me on Upwork"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">LinkedIn Button Text</Label>
                                    <Input
                                        value={contact.linkedin_label || ''}
                                        onChange={(e) => setContact({ ...contact, linkedin_label: e.target.value })}
                                        placeholder="Connect on LinkedIn"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t">
                                <div className="flex flex-col gap-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Availability Status</Label>
                                    <div className="flex items-center gap-4">
                                        <Switch checked={contact.available_for_work} onCheckedChange={(c) => setContact({ ...contact, available_for_work: c })} />
                                        <span className="text-sm font-medium">Available For Work</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status Text</Label>
                                    <Input className="max-w-xs" value={contact.available_text || ''} onChange={(e) => setContact({ ...contact, available_text: e.target.value })} placeholder="Status Text" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4 border-t">
                                <Button onClick={() => updateContactMutation.mutate(contact)} variant="outline">
                                    <Save className="mr-2 h-4 w-4" /> Save General Info
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-6">
                        <p className="font-medium mb-1">Contact Info Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>General Info:</strong> Manage your primary contact email and office/home location with a maps link.</li>
                            <li>• <strong>Platform Links:</strong> Set your professional profile URLs and customize the button text for calls-to-action.</li>
                            <li>• <strong>Availability Status:</strong> Toggle your "Available for Work" badge and set the accompanying display text.</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="profiles" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold opacity-80">Coding Profiles</h3>
                        <Button onClick={addNewProfile} className="shadow-glow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Profile
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {profiles.map((profile) => (
                            <Card key={profile.id} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
                                {/* Decorative Gradient Backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="p-5 flex flex-col flex-1 relative z-10">
                                    {/* Tile Header: Icon & Actions */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border border-border/50 rounded-2xl flex items-center justify-center bg-background/80 shadow-2xl overflow-hidden relative group/icon">
                                                {profile.icon_url ? (
                                                    <img src={profile.icon_url} alt={profile.platform} className="w-10 h-10 object-contain group-hover/icon:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                )}
                                                {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                                    <label className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover/icon:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                        <Upload className="h-6 w-6 text-white drop-shadow-md" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, profile.id, 'coding')} />
                                                    </label>
                                                )}
                                            </div>
                                            {/* Discreet Switcher */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                                                <Tabs
                                                    value={profile.icon_type || 'upload'}
                                                    onValueChange={(v) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, icon_type: v } : p))}
                                                    className="w-[52px] shadow-2xl"
                                                >
                                                    <TabsList className="grid grid-cols-2 h-[20px] p-[2px] bg-background border border-border/50 backdrop-blur-sm rounded-md gap-0">
                                                        <TabsTrigger value="upload" className="h-[16px] w-full flex items-center justify-center rounded-sm data-[state=active]:bg-primary/20 transition-all p-0">
                                                            <Upload className="h-2.5 w-2.5" />
                                                        </TabsTrigger>
                                                        <TabsTrigger value="url" className="h-[16px] w-full flex items-center justify-center rounded-sm data-[state=active]:bg-primary/20 transition-all p-0">
                                                            <Link className="h-2.5 w-2.5" />
                                                        </TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-colors"
                                                onClick={() => updateProfileMutation.mutate(profile)}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive transition-colors"
                                                onClick={() => deleteProfileMutation.mutate(profile.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Tile Body: Title & Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Platform Name</Label>
                                            <Input
                                                value={profile.platform}
                                                className="h-auto font-bold text-lg bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-50"
                                                placeholder="Platform Name"
                                                onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))}
                                            />
                                            <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full transition-all duration-500" />
                                        </div>

                                        <div className="space-y-2.5 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Profile Link</Label>
                                                <Input
                                                    value={profile.url}
                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                    placeholder="URL..."
                                                    onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, url: e.target.value } : p))}
                                                />
                                            </div>

                                            {profile.icon_type === 'url' && (
                                                <div className="space-y-1 animate-in fade-in duration-300">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon URL</Label>
                                                    <Input
                                                        value={profile.icon_url || ''}
                                                        placeholder="Custom URL..."
                                                        className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                        onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, icon_url: e.target.value } : p))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Visibility & Status */}
                                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${profile.is_visible !== false ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                            <span className={`text-[10px] uppercase tracking-tighter font-bold transition-colors ${profile.is_visible !== false ? 'text-foreground opacity-60' : 'text-muted-foreground opacity-40'}`}>
                                                {profile.is_visible !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`visible-${profile.id}`} className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer">Visible</Label>
                                            <Switch
                                                id={`visible-${profile.id}`}
                                                checked={profile.is_visible !== false}
                                                onCheckedChange={(checked) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, is_visible: checked } : p))}
                                                className="scale-75 data-[state=checked]:bg-primary/60"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-8">
                        <p className="font-medium mb-1">Coding Profile Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Platform Name:</strong> The site where your profile is hosted (e.g., "LeetCode", "GitHub").</li>
                            <li>• <strong>Profile Link:</strong> The direct URL to your public profile page.</li>
                            <li>• <strong>Icon:</strong> Upload a platform logo or use a direct image/SVG URL.</li>
                            <li>• <strong>Visibility:</strong> Use the "Active" toggle to control whether this profile appears on your public portfolio.</li>
                        </ul>
                    </div>
                </TabsContent>

                <TabsContent value="freelance" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold opacity-80">Freelance Profiles</h3>
                        <Button onClick={addNewFreelance} className="shadow-glow-sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Freelance Profile
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {freelanceProfiles.map((profile) => (
                            <Card key={profile.id} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
                                {/* Decorative Gradient Backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="p-5 flex flex-col flex-1 relative z-10">
                                    {/* Tile Header: Icon & Actions */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border border-border/50 rounded-2xl flex items-center justify-center bg-background/80 shadow-2xl overflow-hidden relative group/icon">
                                                {profile.icon_url ? (
                                                    <img src={profile.icon_url} alt={profile.platform} className="w-10 h-10 object-contain group-hover/icon:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                )}
                                                {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                                    <label className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover/icon:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                        <Upload className="h-6 w-6 text-white drop-shadow-md" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, profile.id, 'freelance')} />
                                                    </label>
                                                )}
                                            </div>
                                            {/* Discreet Switcher */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                                                <Tabs
                                                    value={profile.icon_type || 'upload'}
                                                    onValueChange={(v) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, icon_type: v } : p))}
                                                    className="w-[52px] shadow-2xl"
                                                >
                                                    <TabsList className="grid grid-cols-2 h-[20px] p-[2px] bg-background border border-border/50 backdrop-blur-sm rounded-md gap-0">
                                                        <TabsTrigger value="upload" className="h-[16px] w-full flex items-center justify-center rounded-sm data-[state=active]:bg-primary/20 transition-all p-0">
                                                            <Upload className="h-2.5 w-2.5" />
                                                        </TabsTrigger>
                                                        <TabsTrigger value="url" className="h-[16px] w-full flex items-center justify-center rounded-sm data-[state=active]:bg-primary/20 transition-all p-0">
                                                            <Link className="h-2.5 w-2.5" />
                                                        </TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-primary/20 hover:text-primary transition-colors"
                                                onClick={() => updateFreelanceMutation.mutate(profile)}
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive transition-colors"
                                                onClick={() => deleteFreelanceMutation.mutate(profile.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Tile Body: Title & Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Platform Name</Label>
                                            <Input
                                                value={profile.platform}
                                                className="h-auto font-bold text-lg bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-50"
                                                placeholder="Platform Name"
                                                onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))}
                                            />
                                            <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full transition-all duration-500" />
                                        </div>

                                        <div className="space-y-2.5 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Profile Link</Label>
                                                <Input
                                                    value={profile.url}
                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                    placeholder="URL..."
                                                    onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, url: e.target.value } : p))}
                                                />
                                            </div>

                                            {profile.icon_type === 'url' && (
                                                <div className="space-y-1 animate-in fade-in duration-300">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon URL</Label>
                                                    <Input
                                                        value={profile.icon_url || ''}
                                                        placeholder="Custom URL..."
                                                        className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                        onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, icon_url: e.target.value } : p))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Visibility & Status */}
                                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${profile.is_visible !== false ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                            <span className={`text-[10px] uppercase tracking-tighter font-bold transition-colors ${profile.is_visible !== false ? 'text-foreground opacity-60' : 'text-muted-foreground opacity-40'}`}>
                                                {profile.is_visible !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`v-freelance-${profile.id}`} className="text-[10px] uppercase font-bold text-muted-foreground cursor-pointer">Visible</Label>
                                            <Switch
                                                id={`v-freelance-${profile.id}`}
                                                checked={profile.is_visible !== false}
                                                onCheckedChange={(checked) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, is_visible: checked } : p))}
                                                className="scale-75 data-[state=checked]:bg-primary/60"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm mt-8">
                        <p className="font-medium mb-1">Freelance Profile Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Platform Name:</strong> The marketplace where you are active (e.g., "Upwork", "Fiverr").</li>
                            <li>• <strong>Profile Link:</strong> Your public profile or portfolio URL on that platform.</li>
                            <li>• <strong>Icon:</strong> Visual branding for the platform (Upload or URL).</li>
                            <li>• <strong>Visibility:</strong> Control the display status of this freelance profile on your portfolio.</li>
                        </ul>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ContactEditor;
