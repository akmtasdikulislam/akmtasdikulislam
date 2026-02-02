import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useHeroContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroEditor = () => {
    const { data, isLoading } = useHeroContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [heroData, setHeroData] = useState({
        name: '',
        greeting_badge: '',
        description: '',
        profile_photo_url: '',
    });

    const [roles, setRoles] = useState<Array<{ id?: string; role_text: string; display_order: number }>>([]);
    const [stats, setStats] = useState<Array<{ id?: string; stat_label: string; stat_value: number; stat_suffix: string; display_order: number }>>([]);
    const [socialLinks, setSocialLinks] = useState<Array<{ id?: string; platform: string; url: string; icon_name: string; icon_url: string | null; display_order: number }>>([]);
    const [techs, setTechs] = useState<Array<{ id?: string; name: string; icon_url: string; top_position: number; left_position: number; animation_class: string; display_order: number }>>([]);
    const [badges, setBadges] = useState<Array<{ id?: string; badge_text: string; top_position: number; left_position: number; display_order: number }>>([]);

    useEffect(() => {
        if (data) {
            setHeroData({
                name: data.hero.name,
                greeting_badge: data.hero.greeting_badge,
                description: data.hero.description,
                profile_photo_url: data.hero.profile_photo_url || '',
            });
            setRoles(data.roles || []);
            setStats(data.stats || []);
            setSocialLinks(data.socialLinks || []);

            setTechs((data.techs || []).map((t: any) => ({
                ...t,
                top_position: t.top_position ?? 50,
                left_position: t.left_position ?? 50
            })));
            setBadges((data.badges || []).map((b: any) => ({
                ...b,
                top_position: b.top_position ?? 50,
                left_position: b.left_position ?? 50
            })));
        }
    }, [data]);

    const updateHeroMutation = useMutation({
        mutationFn: async (updatedData: typeof heroData) => {
            const { data: result, error } = await supabase
                .from('homepage_hero')
                .update(updatedData)
                .eq('id', data!.hero.id)
                .select()
                .single();
            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'hero'] });
            toast({ title: 'Success', description: 'Hero section updated successfully' });
        },
    });

    // Helper for array updates
    const updateArrayMutation = (table: string, key: string) => useMutation({
        mutationFn: async (items: any[]) => {
            // @ts-ignore
            await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');

            const toInsert = items.map((item, idx) => {
                const { id, created_at, updated_at, position_class, ...rest } = item;
                // We ensure display_order is set
                return { ...rest, display_order: idx };
            });

            // @ts-ignore
            const { error } = await supabase.from(table).insert(toInsert);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'hero'] });
            toast({ title: 'Success', description: `${key} updated successfully` });
        },
        onError: (err: any) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
    });

    const updateRolesMutation = updateArrayMutation('homepage_hero_roles', 'Roles');
    const updateStatsMutation = updateArrayMutation('homepage_hero_stats', 'Stats');
    const updateSocialLinksMutation = updateArrayMutation('homepage_social_links', 'Social Links');
    const updateTechsMutation = updateArrayMutation('homepage_hero_techs', 'Tech Stack');
    const updateBadgesMutation = updateArrayMutation('homepage_hero_badges', 'Badges');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const platformOptions = ["GitHub", "LinkedIn", "Twitter", "Facebook", "Instagram", "Upwork", "Fiverr", "Email", "Custom"];

    return (
        <div className="space-y-6 max-w-6xl pb-20">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Hero Section Editor</h1>
                <p className="text-muted-foreground mt-1">
                    Edit all content in the main hero/banner section
                </p>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-6 h-auto p-1">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="stats">Stats</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="techs">Tech Stack</TabsTrigger>
                    <TabsTrigger value="badges">Badges</TabsTrigger>
                </TabsList>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Your name, greeting, and intro text</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="name">Your Name *</Label>
                                    <Input
                                        id="name"
                                        value={heroData.name}
                                        onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="greeting">Greeting Badge *</Label>
                                    <Input
                                        id="greeting"
                                        value={heroData.greeting_badge}
                                        onChange={(e) => setHeroData({ ...heroData, greeting_badge: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={heroData.description}
                                    onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <div>
                                <Label htmlFor="photo">Profile Photo URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="photo"
                                        value={heroData.profile_photo_url}
                                        onChange={(e) => setHeroData({ ...heroData, profile_photo_url: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon">
                                        <Upload className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <Button onClick={() => updateHeroMutation.mutate(heroData)} disabled={updateHeroMutation.isPending}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Basic Info
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROLES */}
                <TabsContent value="roles" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Typewriter Roles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {roles.map((role, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                        <Input
                                            value={role.role_text}
                                            onChange={(e) => {
                                                const updated = [...roles];
                                                updated[index].role_text = e.target.value;
                                                setRoles(updated);
                                            }}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" size="icon" onClick={() => setRoles(roles.filter((_, i) => i !== index))}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={() => setRoles([...roles, { role_text: '', display_order: roles.length }])} variant="outline" className="w-full">
                                <Plus className="w-4 h-4 mr-2" /> Add Role
                            </Button>
                            <Button onClick={() => updateRolesMutation.mutate(roles)} disabled={updateRolesMutation.isPending} className="w-full">
                                <Save className="w-4 h-4 mr-2" /> Save Roles
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* STATS */}
                <TabsContent value="stats" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex gap-2 items-center mb-2">
                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                    <Input value={stat.stat_label} onChange={(e) => {
                                        const updated = [...stats]; updated[index].stat_label = e.target.value; setStats(updated);
                                    }} placeholder="Label" />
                                    <Input type="number" value={stat.stat_value} onChange={(e) => {
                                        const updated = [...stats]; updated[index].stat_value = parseInt(e.target.value) || 0; setStats(updated);
                                    }} placeholder="Value" />
                                    <Input value={stat.stat_suffix} onChange={(e) => {
                                        const updated = [...stats]; updated[index].stat_suffix = e.target.value; setStats(updated);
                                    }} placeholder="Suffix" className="w-20" />
                                    <Button variant="outline" size="icon" onClick={() => setStats(stats.filter((_, i) => i !== index))}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            <Button onClick={() => setStats([...stats, { stat_label: '', stat_value: 0, stat_suffix: '+', display_order: stats.length }])} variant="outline" className="w-full mb-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Stat
                            </Button>
                            <Button onClick={() => updateStatsMutation.mutate(stats)} className="w-full">
                                <Save className="w-4 h-4 mr-2" /> Save Stats
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SOCIAL LINKS */}
                <TabsContent value="social" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                            <CardDescription>Manage your social media profiles</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {socialLinks.map((link, index) => {
                                const isCustom = !platformOptions.includes(link.platform) || link.platform === "Custom";
                                return (
                                    <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                                        <div className="flex gap-4 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-4">
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div>
                                                        <Label className="text-xs mb-1 block">Platform</Label>
                                                        <div className="flex gap-2">
                                                            <Select
                                                                value={platformOptions.includes(link.platform) ? link.platform : "Custom"}
                                                                onValueChange={(val) => {
                                                                    const u = [...socialLinks];
                                                                    u[index].platform = val === "Custom" ? "" : val;
                                                                    if (val !== "Custom" && val !== "Upwork" && val !== "Fiverr") {
                                                                        u[index].icon_name = val;
                                                                    }
                                                                    setSocialLinks(u);
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Platform" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {platformOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs mb-1 block">URL</Label>
                                                        <Input value={link.url} onChange={(e) => { const u = [...socialLinks]; u[index].url = e.target.value; setSocialLinks(u); }} placeholder="https://..." />
                                                    </div>
                                                </div>

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    {(isCustom || link.platform === "") && (
                                                        <div>
                                                            <Label className="text-xs mb-1 block">Platform Name</Label>
                                                            <Input value={link.platform} onChange={(e) => { const u = [...socialLinks]; u[index].platform = e.target.value; setSocialLinks(u); }} placeholder="e.g. MySite" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <Label className="text-xs mb-1 block">Icon URL (SVG)</Label>
                                                        <Input value={link.icon_url || ''} onChange={(e) => { const u = [...socialLinks]; u[index].icon_url = e.target.value; setSocialLinks(u); }} placeholder="https://... (Overrides standard icon)" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setSocialLinks(socialLinks.filter((_, i) => i !== index))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                            <Button onClick={() => setSocialLinks([...socialLinks, { platform: 'GitHub', url: '', icon_name: 'GitHub', icon_url: null, display_order: socialLinks.length }])} variant="outline" className="w-full mb-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Social Link
                            </Button>
                            <Button onClick={() => updateSocialLinksMutation.mutate(socialLinks)} className="w-full">
                                <Save className="w-4 h-4 mr-2" /> Save Social Links
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TECH STACK */}
                <TabsContent value="techs" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tech Stack Icons</CardTitle>
                            <CardDescription>Floating icons position control</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {techs.map((tech, index) => (
                                <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                                    <div className="flex gap-4 items-start">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                        <div className="flex-1 space-y-6">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Tech Name</Label>
                                                    <Input value={tech.name} onChange={(e) => { const u = [...techs]; u[index].name = e.target.value; setTechs(u); }} placeholder="Name" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Icon URL</Label>
                                                    <Input value={tech.icon_url} onChange={(e) => { const u = [...techs]; u[index].icon_url = e.target.value; setTechs(u); }} placeholder="Icon URL" />
                                                </div>
                                            </div>

                                            <div className="grid gap-8 md:grid-cols-2 p-2 bg-background border rounded-md">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Label>Horizontal (Left %)</Label>
                                                        <span className="text-xs text-muted-foreground">{tech.left_position}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[tech.left_position]}
                                                        min={-20}
                                                        max={120}
                                                        step={1}
                                                        onValueChange={(val) => { const u = [...techs]; u[index].left_position = val[0]; setTechs(u); }}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Label>Vertical (Top %)</Label>
                                                        <span className="text-xs text-muted-foreground">{tech.top_position}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[tech.top_position]}
                                                        min={-20}
                                                        max={120}
                                                        step={1}
                                                        onValueChange={(val) => { const u = [...techs]; u[index].top_position = val[0]; setTechs(u); }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setTechs(techs.filter((_, i) => i !== index))}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={() => setTechs([...techs, { name: '', icon_url: '', top_position: 50, left_position: 50, animation_class: 'animate-float-1', display_order: techs.length }])} variant="outline" className="w-full mb-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Tech Icon
                            </Button>
                            <Button onClick={() => updateTechsMutation.mutate(techs)} className="w-full">
                                <Save className="w-4 h-4 mr-2" /> Save Tech Stack
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BADGES */}
                <TabsContent value="badges" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Floating Badges</CardTitle>
                            <CardDescription>Position control for text badges</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {badges.map((badge, index) => (
                                <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                                    <div className="flex gap-4 items-start">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-2">
                                                <Label>Badge Text</Label>
                                                <Input value={badge.badge_text} onChange={(e) => { const u = [...badges]; u[index].badge_text = e.target.value; setBadges(u); }} placeholder="Badge Text" />
                                            </div>

                                            <div className="grid gap-8 md:grid-cols-2 p-2 bg-background border rounded-md">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Label>Horizontal (Left %)</Label>
                                                        <span className="text-xs text-muted-foreground">{badge.left_position}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[badge.left_position]}
                                                        min={-20}
                                                        max={120}
                                                        step={1}
                                                        onValueChange={(val) => { const u = [...badges]; u[index].left_position = val[0]; setBadges(u); }}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Label>Vertical (Top %)</Label>
                                                        <span className="text-xs text-muted-foreground">{badge.top_position}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[badge.top_position]}
                                                        min={-20}
                                                        max={120}
                                                        step={1}
                                                        onValueChange={(val) => { const u = [...badges]; u[index].top_position = val[0]; setBadges(u); }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setBadges(badges.filter((_, i) => i !== index))}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button onClick={() => setBadges([...badges, { badge_text: '', top_position: 50, left_position: 50, display_order: badges.length }])} variant="outline" className="w-full mb-4">
                                <Plus className="w-4 h-4 mr-2" /> Add Badge
                            </Button>
                            <Button onClick={() => updateBadgesMutation.mutate(badges)} className="w-full">
                                <Save className="w-4 h-4 mr-2" /> Save Badges
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HeroEditor;
