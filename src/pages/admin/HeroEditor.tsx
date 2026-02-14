import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useHeroContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contrast, GripVertical, Link, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
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
    const [socialLinks, setSocialLinks] = useState<Array<{ id?: string; platform: string; url: string; icon_name?: string; icon_url: string | null; icon_type?: string; is_visible?: boolean; display_order: number }>>([]);
    const [techs, setTechs] = useState<Array<{ id?: string; name: string; icon_url: string; position_class: string; animation_class: string; delay: number; invert: boolean; icon_type?: string; is_visible?: boolean; display_order: number }>>([]);
    const [badges, setBadges] = useState<Array<{ id?: string; badge_text: string; position_class: string; display_order: number }>>([]);

    const [focusedRole, setFocusedRole] = useState<number | null>(null);
    const [focusedStat, setFocusedStat] = useState<number | null>(null);
    const [focusedSocial, setFocusedSocial] = useState<number | null>(null);
    const [focusedTech, setFocusedTech] = useState<number | null>(null);
    const [focusedBadge, setFocusedBadge] = useState<number | null>(null);

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

    const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'social' | 'tech', index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const folder = type === 'social' ? 'social-icons' : 'tech-icons';
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('hero-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('hero-assets')
                .getPublicUrl(filePath);

            if (type === 'social') {
                const updated = [...socialLinks];
                updated[index] = { ...updated[index], icon_url: publicUrl };
                setSocialLinks(updated);
            } else {
                const updated = [...techs];
                updated[index] = { ...updated[index], icon_url: publicUrl };
                setTechs(updated);
            }

            toast({ title: 'Icon uploaded successfully' });
        } catch (error: any) {
            toast({ title: 'Error uploading icon', description: error.message, variant: 'destructive' });
        }
    };

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
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h1 className="text-2xl sm:text-3xl font-bold">Hero Section Editor</h1>
                <p className="text-muted-foreground mt-1">
                    Edit all content in the main hero/banner section
                </p>
            </div>

            <Tabs defaultValue="basic" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="basic" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Basic Info</TabsTrigger>
                        <TabsTrigger value="roles" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Roles</TabsTrigger>
                        <TabsTrigger value="stats" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Stats</TabsTrigger>
                        <TabsTrigger value="social" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Social</TabsTrigger>
                        <TabsTrigger value="techs" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Tech Stack</TabsTrigger>
                        <TabsTrigger value="badges" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Badges</TabsTrigger>
                    </TabsList>
                </div>

                {/* BASIC INFO */}
                <TabsContent value="basic" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Your name, greeting, and intro text</CardDescription>
                            </div>
                            <Button onClick={() => updateHeroMutation.mutate(heroData)} disabled={updateHeroMutation.isPending} className="w-full sm:w-auto">
                                {updateHeroMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Basic Info
                                    </>
                                )}
                            </Button>
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

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Hero Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Your Name:</strong> Main title displayed in the hero section.</li>
                                    <li>• <strong>Greeting Badge:</strong> Small highlighted text above your name.</li>
                                    <li>• <strong>Description:</strong> Introduction text explaining what you do.</li>
                                    <li>• <strong>Profile Photo:</strong> Your main avatar image.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ROLES */}
                <TabsContent value="roles" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Typewriter Roles</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={() => {
                                    setRoles([...roles, { role_text: '', display_order: roles.length }]);
                                    setFocusedRole(roles.length);
                                    setTimeout(() => document.getElementById(`role-${roles.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                }} variant="outline" className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Role
                                </Button>
                                <Button onClick={() => updateRolesMutation.mutate(roles)} disabled={updateRolesMutation.isPending} className="w-full sm:w-auto">
                                    {updateRolesMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Roles
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {roles.map((role, index) => (
                                    <div
                                        key={index}
                                        id={`role-${index}`}
                                        onClick={() => setFocusedRole(index)}
                                        className={`relative flex gap-4 items-start p-4 rounded-lg border transition-all duration-300 ${focusedRole === index
                                            ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                                            : 'border-border bg-muted/30'
                                            }`}
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                        <div className="flex-1 space-y-1 pr-8">
                                            <Label>Role Text</Label>
                                            <Input
                                                value={role.role_text}
                                                onChange={(e) => {
                                                    const updated = [...roles];
                                                    updated[index].role_text = e.target.value;
                                                    setRoles(updated);
                                                }}
                                                className="w-full"
                                                placeholder="e.g. Full Stack Developer"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setRoles(roles.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Roles Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Typewriter Roles:</strong> List of titles that rotate in the hero animation.</li>
                                    <li>• <strong>Order:</strong> Use the drag handle (left) to reorder how roles appear.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                {/* STATS */}
                <TabsContent value="stats" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Statistics</CardTitle>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={() => {
                                    setStats([...stats, { stat_label: '', stat_value: 0, stat_suffix: '+', display_order: stats.length }]);
                                    setFocusedStat(stats.length);
                                    setTimeout(() => document.getElementById(`stat-${stats.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                }} variant="outline" className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Stat
                                </Button>
                                <Button onClick={() => updateStatsMutation.mutate(stats)} disabled={updateStatsMutation.isPending} className="w-full sm:w-auto">
                                    {updateStatsMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Stats
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    id={`stat-${index}`}
                                    onClick={() => setFocusedStat(index)}
                                    className={`relative flex gap-2 items-start mb-4 p-4 rounded-lg border transition-all duration-300 ${focusedStat === index
                                        ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                                        : 'bg-muted/20 border-border/50'
                                        }`}
                                >
                                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                    <div className="flex-1 grid grid-cols-3 gap-2 pr-8">
                                        <div className="space-y-1">
                                            <Label>Label</Label>
                                            <Input value={stat.stat_label} onChange={(e) => {
                                                const updated = [...stats]; updated[index].stat_label = e.target.value; setStats(updated);
                                            }} placeholder="Label" className="w-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Value</Label>
                                            <Input type="number" value={stat.stat_value} onChange={(e) => {
                                                const updated = [...stats]; updated[index].stat_value = parseInt(e.target.value) || 0; setStats(updated);
                                            }} placeholder="Value" className="w-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Suffix</Label>
                                            <Input value={stat.stat_suffix} onChange={(e) => {
                                                const updated = [...stats]; updated[index].stat_suffix = e.target.value; setStats(updated);
                                            }} placeholder="Suffix" className="w-full" />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setStats(stats.filter((_, i) => i !== index));
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Stats Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Label:</strong> Explanation of the number (e.g. "Projects Completed").</li>
                                    <li>• <strong>Value:</strong> The numeric data to display.</li>
                                    <li>• <strong>Suffix:</strong> Character shown after the number (e.g. "+", "%").</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SOCIAL */}
                <TabsContent value="social" className="space-y-4 mt-10 w-full px-4 md:px-8">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Social Links</CardTitle>
                                <CardDescription>Manage your social media profiles</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={() => {
                                    setSocialLinks([...socialLinks, { platform: 'GitHub', url: '', icon_name: 'GitHub', icon_url: null, is_visible: true, display_order: socialLinks.length }]);
                                    setFocusedSocial(socialLinks.length);
                                    setTimeout(() => document.getElementById(`social-${socialLinks.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                }} variant="outline" className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Social Link
                                </Button>
                                <Button onClick={() => updateSocialLinksMutation.mutate(socialLinks)} disabled={updateSocialLinksMutation.isPending} className="w-full sm:w-auto">
                                    {updateSocialLinksMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Social Links
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {socialLinks.map((link, index) => {
                                    const isCustom = !platformOptions.includes(link.platform) || link.platform === "Custom";
                                    return (
                                        <Card
                                            key={index}
                                            id={`social-${index}`}
                                            onClick={() => setFocusedSocial(index)}
                                            className={`group relative overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col h-full cursor-pointer ${focusedSocial === index
                                                ? 'border-primary ring-2 ring-primary/10 bg-primary/5 shadow-lg shadow-primary/5'
                                                : 'border-border/50 bg-card/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10'
                                                } `}
                                        >
                                            {/* Decorative Gradient Backdrop */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <CardContent className="p-5 flex flex-col flex-1 relative z-10">
                                                {/* Tile Header: Icon & Actions */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 border border-border/50 rounded-2xl flex items-center justify-center bg-background/80 shadow-2xl overflow-hidden relative group/icon">
                                                            {link.icon_url ? (
                                                                <img src={link.icon_url} alt={link.platform} className="w-10 h-10 object-contain group-hover/icon:scale-110 transition-transform duration-300" />
                                                            ) : (
                                                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                                            )}
                                                            {(link.icon_type === 'upload' || !link.icon_type) && (
                                                                <label className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover/icon:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                                    <Upload className="h-6 w-6 text-white drop-shadow-md" />
                                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, 'social', index)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                        {/* Discreet Switcher */}
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                                                            <Tabs
                                                                value={link.icon_type || 'upload'}
                                                                onValueChange={(v) => {
                                                                    const u = [...socialLinks];
                                                                    u[index].icon_type = v;
                                                                    setSocialLinks(u);
                                                                }}
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

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors duration-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSocialLinks(socialLinks.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Tile Body: Title & Info */}
                                                <div className="flex-1 space-y-3">
                                                    <div>
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
                                                            <SelectTrigger className="h-auto font-bold text-lg bg-transparent border-none p-0 focus:ring-0 shadow-none">
                                                                <SelectValue placeholder="Platform" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {platformOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                        <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full transition-all duration-500" />
                                                    </div>

                                                    {(isCustom || link.platform === "") && (
                                                        <div className="pt-1 animate-in slide-in-from-top-2 duration-300">
                                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Custom Name</Label>
                                                            <Input
                                                                value={link.platform}
                                                                className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                                placeholder="e.g. My Website"
                                                                onChange={(e) => { const u = [...socialLinks]; u[index].platform = e.target.value; setSocialLinks(u); }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-2.5 pt-1">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Social URL</Label>
                                                            <Input
                                                                value={link.url}
                                                                className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                                placeholder="https://..."
                                                                onChange={(e) => { const u = [...socialLinks]; u[index].url = e.target.value; setSocialLinks(u); }}
                                                            />
                                                        </div>

                                                        {(link.icon_type === 'url' || (!link.icon_type && link.icon_url && isCustom)) && (
                                                            <div className="space-y-1 animate-in fade-in duration-300">
                                                                <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Icon URL (SVG)</Label>
                                                                <Input
                                                                    value={link.icon_url || ''}
                                                                    placeholder="Custom Icon URL..."
                                                                    className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                                    onChange={(e) => { const u = [...socialLinks]; u[index].icon_url = e.target.value; u[index].icon_type = 'url'; setSocialLinks(u); }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Visibility & Status */}
                                                <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${link.is_visible !== false ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                                        <span className={`text-[10px] uppercase tracking-tighter font-bold transition-colors ${link.is_visible !== false ? 'text-foreground opacity-60' : 'text-muted-foreground opacity-40'}`}>
                                                            {link.is_visible !== false ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Label htmlFor={`visible-${link.id || index}`} className="text-[9px] uppercase tracking-widest opacity-40 font-bold cursor-pointer">Visible</Label>
                                                        <Switch
                                                            id={`visible-${link.id || index}`}
                                                            checked={link.is_visible !== false}
                                                            onCheckedChange={(checked) => {
                                                                const u = [...socialLinks];
                                                                u[index].is_visible = checked;
                                                                setSocialLinks(u);
                                                            }}
                                                            className="scale-75 data-[state=checked]:bg-primary/60"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Social Links Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Platform:</strong> Name of the social media platform.</li>
                                    <li>• <strong>Social URL:</strong> Direct link to your profile.</li>
                                    <li>• <strong>Icon:</strong> Upload a custom SVG icon or provide an image URL.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TECH STACK */}
                <TabsContent value="techs" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Tech Stack Icons</CardTitle>
                                <CardDescription>Floating icons position control. Use presets for standard orbit positions.</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={() => {
                                        setTechs([...techs, {
                                            name: '',
                                            icon_url: '',
                                            position_class: 'left-1/2 -translate-x-1/2 -top-20 md:-top-24',
                                            animation_class: 'animate-float-1',
                                            delay: 0,
                                            invert: false,
                                            is_visible: true,
                                            display_order: techs.length
                                        }]);
                                        setFocusedTech(techs.length);
                                        setTimeout(() => document.getElementById(`tech-${techs.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                    }}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Tech Icon
                                </Button>
                                <Button onClick={() => updateTechsMutation.mutate(techs)} disabled={updateTechsMutation.isPending} className="w-full sm:w-auto">
                                    {updateTechsMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Tech Stack
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {techs.map((tech, index) => {
                                    const matchedPreset = TECH_POSITION_PRESETS.find(p => p.value === tech.position_class);
                                    const isCustom = !matchedPreset;

                                    return (
                                        <Card
                                            key={index}
                                            id={`tech-${index}`}
                                            onClick={() => setFocusedTech(index)}
                                            className={`group relative overflow-hidden backdrop-blur-md transition-all duration-500 flex flex-col h-full cursor-pointer ${focusedTech === index
                                                ? 'border-primary ring-2 ring-primary/10 bg-primary/5 shadow-lg shadow-primary/5'
                                                : 'border-border/50 bg-card/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10'
                                                }`}
                                        >
                                            {/* Decorative Gradient Backdrop */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <CardContent className="p-5 flex flex-col flex-1 relative z-10">
                                                {/* Tile Header: Icon & Actions */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="relative">
                                                        <div className="w-16 h-16 border border-border/50 rounded-2xl flex items-center justify-center bg-background/80 shadow-2xl overflow-hidden relative group/icon">
                                                            {tech.icon_url ? (
                                                                <img src={tech.icon_url} alt={tech.name} className={`w-10 h-10 object-contain group-hover/icon:scale-110 transition-transform duration-300 ${tech.invert ? 'invert' : ''}`} />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                                                            )}
                                                            {(tech.icon_type === 'upload' || !tech.icon_type) && (
                                                                <label className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover/icon:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                                    <Upload className="h-6 w-6 text-white drop-shadow-md" />
                                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleIconUpload(e, 'tech', index)} />
                                                                </label>
                                                            )}
                                                        </div>
                                                        {/* Discreet Switcher */}
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                                                            <Tabs
                                                                value={tech.icon_type || 'upload'}
                                                                onValueChange={(v) => {
                                                                    const u = [...techs];
                                                                    u[index].icon_type = v;
                                                                    setTechs(u);
                                                                }}
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

                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className={`h-8 w-8 transition-colors ${tech.invert ? 'text-primary' : 'text-muted-foreground'} hover:bg-primary/10`}
                                                            onClick={() => { const u = [...techs]; u[index].invert = !u[index].invert; setTechs(u); }}
                                                            title="Invert Icon"
                                                        >
                                                            <Contrast className={`h-4 w-4 ${tech.invert ? 'fill-primary/20' : ''}`} />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-destructive hover:bg-destructive/10 transition-colors duration-300"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setTechs(techs.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Tile Body: Info */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="space-y-1">
                                                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tech Name</Label>
                                                        <Input
                                                            value={tech.name}
                                                            className="bg-background/20 border-border/30 px-3 h-8 font-bold text-[11px] focus:border-primary/50 transition-all shadow-none placeholder:opacity-50 peer"
                                                            placeholder="e.g. React"
                                                            onChange={(e) => { const u = [...techs]; u[index].name = e.target.value; setTechs(u); }}
                                                        />
                                                        <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full peer-focus:w-full peer-focus:bg-primary transition-all duration-500" />
                                                    </div>

                                                    <div className="space-y-2.5 pt-1">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Position Preset</Label>
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
                                                                <SelectTrigger className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors">
                                                                    <SelectValue placeholder="Position" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {TECH_POSITION_PRESETS.map((p) => (
                                                                        <SelectItem key={p.label} value={p.value} className="text-xs">{p.label}</SelectItem>
                                                                    ))}
                                                                    <SelectItem value="custom" className="text-xs">Custom (Advanced)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {isCustom && (
                                                            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                                                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Custom Positioning</Label>
                                                                <Input
                                                                    value={tech.position_class}
                                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                                    placeholder="absolute ..."
                                                                    onChange={(e) => { const u = [...techs]; u[index].position_class = e.target.value; setTechs(u); }}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Animation</Label>
                                                                <Input
                                                                    value={tech.animation_class}
                                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                                    placeholder="animate-float-1"
                                                                    onChange={(e) => { const u = [...techs]; u[index].animation_class = e.target.value; setTechs(u); }}
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Delay (s)</Label>
                                                                <Input
                                                                    type="number"
                                                                    step="0.1"
                                                                    value={tech.delay}
                                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                                    onChange={(e) => { const u = [...techs]; u[index].delay = parseFloat(e.target.value); setTechs(u); }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {tech.icon_type === 'url' && (
                                                            <div className="space-y-1 animate-in fade-in duration-300">
                                                                <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Icon URL (SVG/Img)</Label>
                                                                <Input
                                                                    value={tech.icon_url || ''}
                                                                    placeholder="Custom Icon URL..."
                                                                    className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                                    onChange={(e) => { const u = [...techs]; u[index].icon_url = e.target.value; setTechs(u); }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Visibility & Status */}
                                                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${tech.is_visible !== false ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                                            <span className={`text-[10px] uppercase tracking-tighter font-bold transition-colors ${tech.is_visible !== false ? 'text-foreground opacity-60' : 'text-muted-foreground opacity-40'}`}>
                                                                {tech.is_visible !== false ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Label htmlFor={`visible-tech-${tech.id || index}`} className="text-[9px] uppercase tracking-widest opacity-40 font-bold cursor-pointer">Visible</Label>
                                                            <Switch
                                                                id={`visible-tech-${tech.id || index}`}
                                                                checked={tech.is_visible !== false}
                                                                onCheckedChange={(checked) => {
                                                                    const u = [...techs];
                                                                    u[index].is_visible = checked;
                                                                    setTechs(u);
                                                                }}
                                                                className="scale-75 data-[state=checked]:bg-primary/60"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Tech Stack Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Tech Name:</strong> Name of the tool or language (e.g. "React").</li>
                                    <li>• <strong>Position:</strong> Choice of pre-set orbital positions around your photo.</li>
                                    <li>• <strong>Animation:</strong> Floating effect style for the icon.</li>
                                    <li>• <strong>Invert:</strong> Flip icon colors for better visibility on themed backgrounds.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BADGES */}
                <TabsContent value="badges" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Floating Badges</CardTitle>
                                <CardDescription>Position control for text badges (Use Presets)</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button onClick={() => {
                                    setBadges([...badges, { badge_text: '', position_class: 'absolute', display_order: badges.length }]);
                                    setFocusedBadge(badges.length);
                                    setTimeout(() => document.getElementById(`badge-${badges.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                }} variant="outline" className="w-full sm:w-auto">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Badge
                                </Button>
                                <Button onClick={() => updateBadgesMutation.mutate(badges)} disabled={updateBadgesMutation.isPending} className="w-full sm:w-auto">
                                    {updateBadgesMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Badges
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {badges.map((badge, index) => {
                                const matchedPreset = BADGE_POSITION_PRESETS.find(p => p.value === badge.position_class);
                                const isCustom = !matchedPreset;
                                return (
                                    <div
                                        key={index}
                                        id={`badge-${index}`}
                                        onClick={() => setFocusedBadge(index)}
                                        className={`relative bg-muted/30 p-4 rounded-lg border transition-all duration-300 cursor-pointer ${focusedBadge === index
                                            ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                                            : 'border-border'
                                            }`}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-4 pr-8">
                                                <div className="space-y-1">
                                                    <Label>Badge Text</Label>
                                                    <Input value={badge.badge_text} onChange={(e) => { const u = [...badges]; u[index].badge_text = e.target.value; setBadges(u); }} placeholder="Badge Text" />
                                                </div>

                                                <div className="space-y-1">
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
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBadges(badges.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Badges Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Badge Text:</strong> Content displayed in the floating badge.</li>
                                    <li>• <strong>Position:</strong> Corner presets for absolute placement in the hero.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HeroEditor;
