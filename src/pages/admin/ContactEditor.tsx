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
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
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
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Contact & Profiles</h2>
            <SectionHeadingEditor sectionKey="contact" />

            <Tabs defaultValue="messages">
                <TabsList>
                    <TabsTrigger value="messages" className="relative">
                        Messages
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-primary-foreground rounded-full flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="info">Contact Info</TabsTrigger>
                    <TabsTrigger value="profiles">Coding Profiles</TabsTrigger>
                    <TabsTrigger value="freelance">Freelance Profiles</TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="info">
                    <Card>
                        <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Email</Label>
                                    <Input value={contact.email || ''} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Location</Label>
                                    <Input value={contact.location || ''} onChange={(e) => setContact({ ...contact, location: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <Label>Location Maps Link</Label>
                                    <Input value={contact.location_url || ''} onChange={(e) => setContact({ ...contact, location_url: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Upwork Profile URL</Label>
                                    <Input 
                                      value={contact.upwork_url || ''} 
                                      onChange={(e) => setContact({ ...contact, upwork_url: e.target.value })} 
                                      placeholder="https://www.upwork.com/freelancers/..."
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>LinkedIn Profile URL</Label>
                                    <Input 
                                      value={contact.linkedin_url || ''} 
                                      onChange={(e) => setContact({ ...contact, linkedin_url: e.target.value })} 
                                      placeholder="https://www.linkedin.com/in/..."
                                    />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Upwork Button Text</Label>
                                    <Input 
                                      value={contact.upwork_label || ''} 
                                      onChange={(e) => setContact({ ...contact, upwork_label: e.target.value })} 
                                      placeholder="Hire me on Upwork"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>LinkedIn Button Text</Label>
                                    <Input 
                                      value={contact.linkedin_label || ''} 
                                      onChange={(e) => setContact({ ...contact, linkedin_label: e.target.value })} 
                                      placeholder="Connect on LinkedIn"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 pt-4 border-t">
                                <Switch checked={contact.available_for_work} onCheckedChange={(c) => setContact({ ...contact, available_for_work: c })} />
                                <Label>Available For Work Status</Label>
                                <Input className="w-64" value={contact.available_text || ''} onChange={(e) => setContact({ ...contact, available_text: e.target.value })} placeholder="Status Text" />
                            </div>
                            <Button onClick={() => updateContactMutation.mutate(contact)}><Save className="mr-2 h-4 w-4" /> Save General Info</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="profiles" className="space-y-4">
                    <Button onClick={addNewProfile}><Plus className="mr-2 h-4 w-4" /> Add Profile</Button>
                    <div className="grid gap-4">
                        {profiles.map((profile) => (
                            <Card key={profile.id} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                                <CardContent className="p-0">
                                    {/* Premium Header */}
                                    <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-secondary/5">
                                        {/* Integrated Icon Picker */}
                                        <div className="relative group shrink-0">
                                            <div className="w-14 h-14 border border-border/50 rounded-xl flex items-center justify-center bg-background shadow-inner overflow-hidden relative">
                                                {profile.icon_url ? (
                                                    <img src={profile.icon_url} alt={profile.platform} className="w-10 h-10 object-contain" />
                                                ) : (
                                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                )}
                                                {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                                    <label className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                        <Upload className="h-5 w-5 text-primary" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, profile.id, 'coding')} />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-2 -left-2 z-10">
                                                <Tabs 
                                                    value={profile.icon_type || 'upload'} 
                                                    onValueChange={(v) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, icon_type: v } : p))}
                                                    className="w-20"
                                                >
                                                    <TabsList className="h-6 p-0.5 bg-background border border-border">
                                                        <TabsTrigger value="upload" className="text-[9px] px-2 h-5">File</TabsTrigger>
                                                        <TabsTrigger value="url" className="text-[9px] px-2 h-5">URL</TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
                                            </div>
                                        </div>

                                        {/* Platform & Actions */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Platform</Label>
                                                    <Input 
                                                        value={profile.platform} 
                                                        className="h-9 font-semibold text-lg bg-transparent border-none p-0 focus-visible:ring-0"
                                                        onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))} 
                                                    />
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                                        onClick={() => updateProfileMutation.mutate(profile)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => deleteProfileMutation.mutate(profile.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Area */}
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/50">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Profile URL</Label>
                                            <Input 
                                                value={profile.url} 
                                                className="bg-background/50 h-9 text-sm"
                                                placeholder="https://platform.com/username"
                                                onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, url: e.target.value } : p))} 
                                            />
                                        </div>
                                        
                                        {profile.icon_type === 'url' && (
                                            <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                                                <Label className="text-xs italic text-primary">Direct Icon/Logo URL</Label>
                                                <Input 
                                                    value={profile.icon_url || ''} 
                                                    placeholder="https://cdn.example.com/logo.svg" 
                                                    className="bg-background/50 border-primary/20 h-9 text-sm focus-visible:ring-primary/20"
                                                    onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, icon_url: e.target.value } : p))} 
                                                />
                                            </div>
                                        )}
                                        {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                            <div className="flex items-end text-[11px] text-muted-foreground italic pb-2">
                                                Using uploaded image from storage
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="freelance" className="space-y-4">
                    <Button onClick={addNewFreelance}><Plus className="mr-2 h-4 w-4" /> Add Freelance Profile</Button>
                    <div className="grid gap-4">
                        {freelanceProfiles.map((profile) => (
                            <Card key={profile.id} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                                <CardContent className="p-0">
                                    {/* Premium Header */}
                                    <div className="flex items-center gap-4 p-4 border-b border-border/50 bg-secondary/5">
                                        {/* Integrated Icon Picker */}
                                        <div className="relative group shrink-0">
                                            <div className="w-14 h-14 border border-border/50 rounded-xl flex items-center justify-center bg-background shadow-inner overflow-hidden relative">
                                                {profile.icon_url ? (
                                                    <img src={profile.icon_url} alt={profile.platform} className="w-10 h-10 object-contain" />
                                                ) : (
                                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                )}
                                                {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                                    <label className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                        <Upload className="h-5 w-5 text-primary" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, profile.id, 'freelance')} />
                                                    </label>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-2 -left-2 z-10">
                                                <Tabs 
                                                    value={profile.icon_type || 'upload'} 
                                                    onValueChange={(v) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, icon_type: v } : p))}
                                                    className="w-20"
                                                >
                                                    <TabsList className="h-6 p-0.5 bg-background border border-border">
                                                        <TabsTrigger value="upload" className="text-[9px] px-2 h-5">File</TabsTrigger>
                                                        <TabsTrigger value="url" className="text-[9px] px-2 h-5">URL</TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
                                            </div>
                                        </div>

                                        {/* Platform & Actions */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Platform</Label>
                                                    <Input 
                                                        value={profile.platform} 
                                                        className="h-9 font-semibold text-lg bg-transparent border-none p-0 focus-visible:ring-0"
                                                        onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))} 
                                                    />
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                                                        onClick={() => updateFreelanceMutation.mutate(profile)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => deleteFreelanceMutation.mutate(profile.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details Area */}
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/50">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Profile URL</Label>
                                            <Input 
                                                value={profile.url} 
                                                className="bg-background/50 h-9 text-sm"
                                                placeholder="https://platform.com/username"
                                                onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, url: e.target.value } : p))} 
                                            />
                                        </div>
                                        
                                        {profile.icon_type === 'url' && (
                                            <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200">
                                                <Label className="text-xs italic text-primary">Direct Icon/Logo URL</Label>
                                                <Input 
                                                    value={profile.icon_url || ''} 
                                                    placeholder="https://cdn.example.com/logo.svg" 
                                                    className="bg-background/50 border-primary/20 h-9 text-sm focus-visible:ring-primary/20"
                                                    onChange={(e) => setFreelanceProfiles(freelanceProfiles.map(p => p.id === profile.id ? { ...p, icon_url: e.target.value } : p))} 
                                                />
                                            </div>
                                        )}
                                        {(profile.icon_type === 'upload' || !profile.icon_type) && (
                                            <div className="flex items-end text-[11px] text-muted-foreground italic pb-2">
                                                Using uploaded image from storage
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ContactEditor;
