import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTestimonialsContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Star, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';

const TestimonialsEditor = () => {
    const { data: initialData, isLoading } = useTestimonialsContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [testimonials, setTestimonials] = useState<any[]>([]);

    useEffect(() => {
        if (initialData) setTestimonials(initialData);
    }, [initialData]);

    const updateMutation = useMutation({
        mutationFn: async (item: any) => {
            if (item.id.startsWith('temp-')) {
                const { ...newItem } = item;
                delete newItem.id;
                await supabase.from('homepage_testimonials').insert(newItem);
            } else {
                await supabase.from('homepage_testimonials').update(item).eq('id', item.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'testimonials'] });
            toast({ title: 'Testimonial updated' });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_testimonials').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'testimonials'] });
            toast({ title: 'Testimonial deleted' });
        }
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const filePath = `avatar-${Math.random()}.${file.name.split('.').pop()}`;
        const { error } = await supabase.storage.from('portfolio').upload(filePath, file);
        if (error) { toast({ title: 'Upload failed' }); return; }
        const { data: { publicUrl } } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        setTestimonials(testimonials.map(t => t.id === id ? { ...t, avatar_url: publicUrl } : t));
    };

    const addNew = () => {
        setTestimonials([...testimonials, {
            id: `temp-${Date.now()}`,
            name: 'New Reviewer',
            role: 'Client',
            content: '',
            rating: 5,
            display_order: testimonials.length + 1,
            is_visible: true
        }]);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Testimonials Editor</h2>
                <Button onClick={addNew}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
            </div>

            <div className="grid gap-6">
                {testimonials.map((item) => (
                    <Card key={item.id}>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-start gap-6">
                                <div className="space-y-2 text-center">
                                    <div className="w-20 h-20 border rounded-full overflow-hidden bg-secondary/20 relative group mx-auto">
                                        {item.avatar_url ? <img src={item.avatar_url} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-xs">No Img</span>}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer text-white text-xs rounded-full">
                                            <Upload className="h-6 w-6" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(e, item.id)} />
                                        </label>
                                    </div>
                                    <div className="text-xs text-muted-foreground">Avatar</div>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Name</Label>
                                            <Input value={item.name} onChange={(e) => setTestimonials(testimonials.map(t => t.id === item.id ? { ...t, name: e.target.value } : t))} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Role / Company</Label>
                                            <Input value={item.role || ''} onChange={(e) => setTestimonials(testimonials.map(t => t.id === item.id ? { ...t, role: e.target.value } : t))} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label>Content</Label>
                                        <Textarea value={item.content} onChange={(e) => setTestimonials(testimonials.map(t => t.id === item.id ? { ...t, content: e.target.value } : t))} rows={3} />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-2">
                                            <Label className="flex items-center gap-2">Rating: {item.rating} <Star className="h-3 w-3 fill-primary text-primary" /></Label>
                                            <Slider
                                                value={[item.rating]}
                                                max={5}
                                                min={1}
                                                step={1}
                                                onValueChange={(v) => setTestimonials(testimonials.map(t => t.id === item.id ? { ...t, rating: v[0] } : t))}
                                            />
                                        </div>
                                        <div className="flex gap-2 self-end">
                                            <Button size="sm" variant="outline" onClick={() => updateMutation.mutate(item)}><Save className="mr-2 h-4 w-4" /> Save</Button>
                                            <Button size="icon" variant="destructive" onClick={() => deleteMutation.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsEditor;
