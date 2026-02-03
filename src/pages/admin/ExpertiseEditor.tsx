import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useExpertiseContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Contrast, Link, Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const ExpertiseEditor = () => {
    const { data, isLoading } = useExpertiseContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [techs, setTechs] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setTechs((data as any).techs || []);
            setCards((data as any).cards || []);
        }
    }, [data]);

    const updateTechMutation = useMutation({
        mutationFn: async (tech: any) => {
            if (tech.id.startsWith('temp-')) {
                const { ...newTech } = tech;
                delete newTech.id;
                await supabase.from('homepage_expertise_techs').insert(newTech);
            } else {
                await supabase.from('homepage_expertise_techs').update(tech).eq('id', tech.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'expertise'] });
            toast({ title: 'Expertise updated' });
        }
    });

    const deleteTechMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_expertise_techs').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'expertise'] });
            toast({ title: 'Tech deleted' });
        }
    });

    // Similar mutations for cards...
    const updateCardMutation = useMutation({
        mutationFn: async (card: any) => {
            if (card.id.startsWith('temp-')) {
                const { ...newCard } = card;
                delete newCard.id;
                await supabase.from('homepage_expertise_cards').insert(newCard);
            } else {
                await supabase.from('homepage_expertise_cards').update(card).eq('id', card.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'expertise'] });
            toast({ title: 'Card updated' });
        }
    });

    const deleteCardMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_expertise_cards').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'expertise'] });
            toast({ title: 'Card deleted' });
        }
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'tech' | 'card') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${type}-icon-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (uploadError) {
            toast({ title: 'Upload failed', variant: 'destructive' });
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);

        if (type === 'tech') {
            const updated = techs.map(t => t.id === id ? { ...t, icon_url: publicUrl } : t);
            setTechs(updated);
            // Auto-save or wait for manual save? Let's auto-save for image mainly
        } else {
            const updated = cards.map(c => c.id === id ? { ...c, icon_url: publicUrl } : c);
            setCards(updated);
        }
    };

    const addNewTech = () => {
        setTechs([...techs, {
            id: `temp-${Date.now()}`,
            name: 'New Tech',
            category: 'Frontend',
            icon_url: '',
            is_marquee: false,
            in_expertise_grid: true,
            display_order: techs.length + 1
        }]);
    };

    const addNewCard = () => {
        setCards([...cards, {
            id: `temp-${Date.now()}`,
            title: 'New Card',
            description: '',
            icon_url: '',
            display_order: cards.length + 1
        }]);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h2 className="text-3xl font-bold tracking-tight">Expertise Editor</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your technical skills and expertise cards
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4">
                <SectionHeadingEditor
                    sectionKey="expertise"
                    defaultValues={{
                        section_badge: (data as any)?.content?.section_badge,
                        section_title: (data as any)?.content?.section_title,
                        section_highlight: (data as any)?.content?.section_highlight,
                        section_description: (data as any)?.content?.section_description
                    }}
                />
            </div>

            <Tabs defaultValue="techs" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="techs" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Technologies</TabsTrigger>
                        <TabsTrigger value="cards" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Expertise Cards</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="techs" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {techs.map((tech, index) => (
                            <Card key={tech.id} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
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
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, tech.id, 'tech')} />
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
                                                className="h-8 w-8 text-primary hover:bg-primary/10 transition-colors"
                                                onClick={() => updateTechMutation.mutate(tech)}
                                                title="Save Tech"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors duration-300"
                                                onClick={() => deleteTechMutation.mutate(tech.id)}
                                                title="Delete Tech"
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
                                                onChange={(e) => {
                                                    const updated = techs.map(t => t.id === tech.id ? { ...t, name: e.target.value } : t);
                                                    setTechs(updated);
                                                }}
                                            />
                                            <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full peer-focus:w-full peer-focus:bg-primary transition-all duration-500" />
                                        </div>

                                        <div className="space-y-2.5 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Category</Label>
                                                <Select value={tech.category} onValueChange={(v) => {
                                                    const updated = techs.map(t => t.id === tech.id ? { ...t, category: v } : t);
                                                    setTechs(updated);
                                                }}>
                                                    <SelectTrigger className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Frontend">Frontend</SelectItem>
                                                        <SelectItem value="Backend">Backend</SelectItem>
                                                        <SelectItem value="Tools">Tools</SelectItem>
                                                        <SelectItem value="Language">Language</SelectItem>
                                                        <SelectItem value="Framework">Framework</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {tech.icon_type === 'url' && (
                                                <div className="space-y-1 animate-in fade-in duration-300">
                                                    <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Icon URL (SVG/Img)</Label>
                                                    <Input
                                                        value={tech.icon_url || ''}
                                                        placeholder="Custom Icon URL..."
                                                        className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                        onChange={(e) => {
                                                            const updated = techs.map(t => t.id === tech.id ? { ...t, icon_url: e.target.value } : t);
                                                            setTechs(updated);
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 pt-4 border-t border-border/40 mt-4 h-10">
                                                <div className="flex-1 flex items-center justify-between">
                                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Marquee</Label>
                                                    <Switch
                                                        checked={tech.is_marquee}
                                                        onCheckedChange={(c) => {
                                                            const updated = techs.map(t => t.id === tech.id ? { ...t, is_marquee: c } : t);
                                                            setTechs(updated);
                                                        }}
                                                        className="scale-75 data-[state=checked]:bg-primary/60"
                                                    />
                                                </div>
                                                <Separator orientation="vertical" className="h-4 bg-border/50" />
                                                <div className="flex-1 flex items-center justify-between">
                                                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Grid</Label>
                                                    <Switch
                                                        checked={tech.in_expertise_grid}
                                                        onCheckedChange={(c) => {
                                                            const updated = techs.map(t => t.id === tech.id ? { ...t, in_expertise_grid: c } : t);
                                                            setTechs(updated);
                                                        }}
                                                        className="scale-75 data-[state=checked]:bg-primary/60"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button onClick={addNewTech} variant="outline" className="flex-1">
                            <Plus className="mr-2 h-4 w-4" /> Add Tech Icon
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="cards" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {cards.map((card, index) => (
                            <Card key={card.id} className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full">
                                {/* Decorative Gradient Backdrop */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <CardContent className="p-5 flex flex-col flex-1 relative z-10">
                                    {/* Tile Header: Icon & Actions */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 border border-border/50 rounded-2xl flex items-center justify-center bg-background/80 shadow-2xl overflow-hidden relative group/icon">
                                                {card.icon_url ? (
                                                    <img src={card.icon_url} alt={card.title} className="w-10 h-10 object-contain group-hover/icon:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                                                )}
                                                {(card.icon_type === 'upload' || !card.icon_type) && (
                                                    <label className="absolute inset-0 flex items-center justify-center bg-primary/30 opacity-0 group-hover/icon:opacity-100 cursor-pointer backdrop-blur-[2px] transition-all">
                                                        <Upload className="h-6 w-6 text-white drop-shadow-md" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, card.id, 'card')} />
                                                    </label>
                                                )}
                                            </div>
                                            {/* Discreet Switcher */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                                                <Tabs
                                                    value={card.icon_type || 'upload'}
                                                    onValueChange={(v) => {
                                                        const u = [...cards];
                                                        u[index].icon_type = v;
                                                        setCards(u);
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
                                                className="h-8 w-8 text-primary hover:bg-primary/10 transition-colors"
                                                onClick={() => updateCardMutation.mutate(card)}
                                                title="Save Card"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive transition-colors duration-300"
                                                onClick={() => deleteCardMutation.mutate(card.id)}
                                                title="Delete Card"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Tile Body: Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Card Title</Label>
                                            <Input
                                                value={card.title}
                                                className="bg-background/20 border-border/30 px-3 h-8 font-bold text-[11px] focus:border-primary/50 transition-all shadow-none placeholder:opacity-50 peer"
                                                placeholder="e.g. Web Development"
                                                onChange={(e) => {
                                                    const updated = cards.map(c => c.id === card.id ? { ...c, title: e.target.value } : c);
                                                    setCards(updated);
                                                }}
                                            />
                                            <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-0.5 group-hover:w-full peer-focus:w-full peer-focus:bg-primary transition-all duration-500" />
                                        </div>

                                        <div className="space-y-2.5 pt-1">
                                            <div className="space-y-1">
                                                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Description</Label>
                                                <Input
                                                    value={card.description || ''}
                                                    className="bg-background/20 h-8 text-[11px] border-border/30 focus:border-primary/50 transition-colors"
                                                    placeholder="Brief description..."
                                                    onChange={(e) => {
                                                        const updated = cards.map(c => c.id === card.id ? { ...c, description: e.target.value } : c);
                                                        setCards(updated);
                                                    }}
                                                />
                                            </div>

                                            {card.icon_type === 'url' && (
                                                <div className="space-y-1 animate-in fade-in duration-300">
                                                    <Label className="text-[10px] uppercase tracking-widest text-primary font-bold">Icon URL (SVG/Img)</Label>
                                                    <Input
                                                        value={card.icon_url || ''}
                                                        placeholder="Custom Icon URL..."
                                                        className="bg-background/20 h-8 text-[11px] border-primary/20 focus:border-primary transition-colors"
                                                        onChange={(e) => {
                                                            const updated = cards.map(c => c.id === card.id ? { ...c, icon_url: e.target.value } : c);
                                                            setCards(updated);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-8">
                        <Button onClick={addNewCard} variant="outline" className="flex-1">
                            <Plus className="mr-2 h-4 w-4" /> Add Expertise Card
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ExpertiseEditor;
