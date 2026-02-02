import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useExpertiseContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const ExpertiseEditor = () => {
    const { data, isLoading } = useExpertiseContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [techs, setTechs] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setTechs(data.techs || []);
            setCards(data.cards || []);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Expertise Editor</h2>
            </div>

            <Tabs defaultValue="techs">
                <TabsList>
                    <TabsTrigger value="techs">Technologies</TabsTrigger>
                    <TabsTrigger value="cards">Expertise Cards</TabsTrigger>
                </TabsList>

                <TabsContent value="techs" className="space-y-4">
                    <Button onClick={addNewTech}><Plus className="mr-2 h-4 w-4" /> Add Tech</Button>
                    <div className="grid gap-4">
                        {techs.map((tech) => (
                            <Card key={tech.id}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 border rounded flex items-center justify-center bg-secondary/20 relative group">
                                        {tech.icon_url ? <img src={tech.icon_url} className="w-8 h-8 object-contain" /> : <span className="text-xs">No Icon</span>}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-white text-xs rounded">
                                            <Upload className="h-4 w-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, tech.id, 'tech')} />
                                        </label>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <Label>Name</Label>
                                            <Input value={tech.name} onChange={(e) => setTechs(techs.map(t => t.id === tech.id ? { ...t, name: e.target.value } : t))} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Category</Label>
                                            <Select value={tech.category} onValueChange={(v) => setTechs(techs.map(t => t.id === tech.id ? { ...t, category: v } : t))}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Frontend">Frontend</SelectItem>
                                                    <SelectItem value="Backend">Backend</SelectItem>
                                                    <SelectItem value="Tools">Tools</SelectItem>
                                                    <SelectItem value="Language">Language</SelectItem>
                                                    <SelectItem value="Framework">Framework</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center gap-2 pt-6">
                                            <Switch checked={tech.is_marquee} onCheckedChange={(c) => setTechs(techs.map(t => t.id === tech.id ? { ...t, is_marquee: c } : t))} />
                                            <Label>Marquee</Label>
                                        </div>
                                        <div className="flex items-center gap-2 pt-6">
                                            <Switch checked={tech.in_expertise_grid} onCheckedChange={(c) => setTechs(techs.map(t => t.id === tech.id ? { ...t, in_expertise_grid: c } : t))} />
                                            <Label>Grid</Label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => updateTechMutation.mutate(tech)}><Save className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => deleteTechMutation.mutate(tech.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="cards" className="space-y-4">
                    <Button onClick={addNewCard}><Plus className="mr-2 h-4 w-4" /> Add Card</Button>
                    <div className="grid gap-4">
                        {cards.map((card) => (
                            <Card key={card.id}>
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 border rounded flex items-center justify-center bg-secondary/20 relative group">
                                        {card.icon_url ? <img src={card.icon_url} className="w-8 h-8 object-contain" /> : <span className="text-xs">No Icon</span>}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-white text-xs rounded">
                                            <Upload className="h-4 w-4" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, card.id, 'card')} />
                                        </label>
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Title</Label>
                                            <Input value={card.title} onChange={(e) => setCards(cards.map(c => c.id === card.id ? { ...c, title: e.target.value } : c))} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Description</Label>
                                            <Input value={card.description || ''} onChange={(e) => setCards(cards.map(c => c.id === card.id ? { ...c, description: e.target.value } : c))} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="ghost" onClick={() => updateCardMutation.mutate(card)}><Save className="h-4 w-4" /></Button>
                                        <Button size="icon" variant="destructive" onClick={() => deleteCardMutation.mutate(card.id)}><Trash2 className="h-4 w-4" /></Button>
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

export default ExpertiseEditor;
