import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCodingProfilesContent, useContactContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const ContactEditor = () => {
    const { data: contactData, isLoading: contactLoading } = useContactContent();
    const { data: profilesData, isLoading: profilesLoading } = useCodingProfilesContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [contact, setContact] = useState<any>({
        email: '',
        location: '',
        location_url: '',
        available_for_work: true,
        available_text: 'Available for Work'
    });
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        if (contactData) setContact(contactData);
        if (profilesData) setProfiles(profilesData);
    }, [contactData, profilesData]);

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
                await supabase.from('homepage_coding_profiles').update(item).eq('id', item.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'coding_profiles'] });
            toast({ title: 'Profile updated' });
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

    const addNewProfile = () => {
        setProfiles([...profiles, {
            id: `temp-${Date.now()}`,
            platform: 'New Platform',
            url: '',
            icon_url: '',
            display_order: profiles.length + 1
        }]);
    };

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const filePath = `profile-icon-${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) { toast({ title: 'Upload failed' }); return; }
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        setProfiles(profiles.map(p => p.id === id ? { ...p, icon_url: publicUrl } : p));
    };

    if (contactLoading || profilesLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Contact & Profiles</h2>

            <Tabs defaultValue="info">
                <TabsList>
                    <TabsTrigger value="info">Contact Info</TabsTrigger>
                    <TabsTrigger value="profiles">Coding Profiles</TabsTrigger>
                </TabsList>

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
                            <Card key={profile.id}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 border rounded flex items-center justify-center bg-secondary/20 relative group">
                                        {profile.icon_url ? <img src={profile.icon_url} className="w-8 h-8 object-contain" /> : <span className="text-xs">No Icon</span>}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-white text-xs rounded">
                                            <Upload className="h-4 w-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, profile.id)} />
                                        </label>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label>Platform Name</Label>
                                            <Input value={profile.platform} onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, platform: e.target.value } : p))} />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <Label>Profile URL</Label>
                                            <Input value={profile.url} onChange={(e) => setProfiles(profiles.map(p => p.id === profile.id ? { ...p, url: e.target.value } : p))} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => updateProfileMutation.mutate(profile)}><Save className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => deleteProfileMutation.mutate(profile.id)}><Trash2 className="h-4 w-4" /></Button>
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
