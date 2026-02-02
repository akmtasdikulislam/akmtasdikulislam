import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    const [techs, setTechs] = useState<Array<{ id?: string; name: string; icon_url: string; position_class: string; animation_class: string; delay: number; invert: boolean; display_order: number }>>([]);
    const [badges, setBadges] = useState<Array<{ id?: string; badge_text: string; position_class: string; display_order: number }>>([]);

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
                position_class: t.position_class || '',
                animation_class: t.animation_class || '',
                delay: t.delay || 0,
                invert: t.invert || false
            })));
            setBadges((data.badges || []).map((b: any) => ({
                ...b,
                position_class: b.position_class || ''
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
            await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except dummy if exists

            const toInsert = items.map((item, idx) => {
                // exclude system fields
                const { id, created_at, updated_at, ...rest } = item;
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

    const TECH_POSITION_PRESETS = [
        { label: "Top Center", value: "left-1/2 -translate-x-1/2 -top-20 md:-top-24" },
        { label: "Top Right (Upper)", value: "right-0 -top-14 md:-top-16 translate-x-8 md:translate-x-12" },
        { label: "Top Right (Lower)", value: "-right-16 md:-right-20 top-8 md:top-10" },
        { label: "Right Center", value: "-right-18 md:-right-24 top-1/2 -translate-y-1/2" },
        { label: "Bottom Right (Upper)", value: "-right-16 md:-right-20 bottom-8 md:bottom-10" },
        { label: "Bottom Right (Lower)", value: "right-0 -bottom-14 md:-bottom-16 translate-x-8 md:translate-x-12" },
        { label: "Bottom Center", value: "left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-24" },
        { label: "Bottom Left (Lower)", value: "left-0 -bottom-14 md:-bottom-16 -translate-x-8 md:-translate-x-12" },
        { label: "Bottom Left (Upper)", value: "-left-16 md:-left-20 bottom-8 md:bottom-10" },
        { label: "Left Center", value: "-left-18 md:-left-24 top-1/2 -translate-y-1/2" },
        { label: "Top Left (Lower)", value: "-left-16 md:-left-20 top-8 md:top-10" },
        { label: "Top Left (Upper)", value: "left-0 -top-14 md:-top-16 -translate-x-8 md:-translate-x-12" },
    ];

    const BADGE_POSITION_PRESETS = [
        { label: "Top Right", value: "absolute -top-8 -right-32 md:-right-44" },
        { label: "Top Left", value: "absolute top-1/3 -left-36 md:-left-48" },
        { label: "Bottom Right", value: "absolute bottom-1/3 -right-32 md:-right-44" },
        { label: "Bottom Left", value: "absolute -bottom-8 -left-32 md:-left-44" },
    ];

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

                {/* SOCIAL */}
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
                            <CardDescription>Floating icons position control. Use presets for standard orbit positions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {techs.map((tech, index) => {
                                const matchedPreset = TECH_POSITION_PRESETS.find(p => p.value === tech.position_class);
                                const isCustom = !matchedPreset;

                                return (
                                    <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                                        <div className="flex gap-4 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-4">
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

                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label>Position Preset</Label>
                                                        <Select
                                                            value={isCustom ? "custom" : tech.position_class}
                                                            onValueChange={(val) => {
                                                                const u = [...techs];
                                                                if (val !== "custom") {
                                                                    u[index].position_class = val;
                                                                }
                                                                setTechs(u);
                                                            }}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Position" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {TECH_POSITION_PRESETS.map((preset) => (
                                                                    <SelectItem key={preset.label} value={preset.value}>{preset.label}</SelectItem>
                                                                ))}
                                                                <SelectItem value="custom">Custom (Advanced)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Animation Class</Label>
                                                        <Input
                                                            value={tech.animation_class}
                                                            onChange={(e) => { const u = [...techs]; u[index].animation_class = e.target.value; setTechs(u); }}
                                                            placeholder="animate-float-1"
                                                        />
                                                    </div>
                                                </div>

                                                {isCustom && (
                                                    <div className="border-l-2 border-primary/20 pl-4 py-2">
                                                        <Label className="text-xs mb-1 block">Custom Tailwind Classes</Label>
                                                        <Input
                                                            value={tech.position_class}
                                                            onChange={(e) => { const u = [...techs]; u[index].position_class = e.target.value; setTechs(u); }}
                                                            placeholder="absolute ..."
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex gap-4">
                                                    <div className="w-32 space-y-2">
                                                        <Label>Delay (s)</Label>
                                                        <Input type="number" step="0.1" value={tech.delay} onChange={(e) => { const u = [...techs]; u[index].delay = parseFloat(e.target.value); setTechs(u); }} />
                                                    </div>
                                                    <div className="flex items-center space-x-2 pt-8">
                                                        <input type="checkbox" id={`invert-${index}`} checked={tech.invert} onChange={(e) => { const u = [...techs]; u[index].invert = e.target.checked; setTechs(u); }} className="h-4 w-4" />
                                                        <Label htmlFor={`invert-${index}`}>Invert Dark Mode</Label>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setTechs(techs.filter((_, i) => i !== index))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                            <Button onClick={() => setTechs([...techs, { name: '', icon_url: '', position_class: 'absolute', animation_class: 'animate-float-1', delay: 0, invert: false, display_order: techs.length }])} variant="outline" className="w-full mb-4">
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
                            <CardDescription>Position control for text badges (Use Presets)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {badges.map((badge, index) => {
                                const matchedPreset = BADGE_POSITION_PRESETS.find(p => p.value === badge.position_class);
                                const isCustom = !matchedPreset;
                                return (
                                    <div key={index} className="bg-muted/30 p-4 rounded-lg border border-border">
                                        <div className="flex gap-4 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Badge Text</Label>
                                                    <Input value={badge.badge_text} onChange={(e) => { const u = [...badges]; u[index].badge_text = e.target.value; setBadges(u); }} placeholder="Badge Text" />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Position Preset</Label>
                                                    <Select
                                                        value={isCustom ? "custom" : badge.position_class}
                                                        onValueChange={(val) => {
                                                            const u = [...badges];
                                                            if (val !== "custom") {
                                                                u[index].position_class = val;
                                                            }
                                                            setBadges(u);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Position" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {BADGE_POSITION_PRESETS.map((preset) => (
                                                                <SelectItem key={preset.label} value={preset.value}>{preset.label}</SelectItem>
                                                            ))}
                                                            <SelectItem value="custom">Custom (Advanced)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {isCustom && (
                                                    <div className="space-y-2">
                                                        <Label>Custom Tailwind Classes</Label>
                                                        <Input
                                                            value={badge.position_class}
                                                            onChange={(e) => { const u = [...badges]; u[index].position_class = e.target.value; setBadges(u); }}
                                                            placeholder="absolute top-0 right-0 ..."
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => setBadges(badges.filter((_, i) => i !== index))}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                            <Button onClick={() => setBadges([...badges, { badge_text: '', position_class: 'absolute', display_order: badges.length }])} variant="outline" className="w-full mb-4">
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
