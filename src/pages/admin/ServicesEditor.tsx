import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useServicesContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
// If IconSelect doesn't exist, I'll allow simple text input for icon name or list commonly used ones.
// I'll stick to Input for now or "Lucide Icon Name" placeholder.

const ServicesEditor = () => {
    const { data: initialServices, isLoading } = useServicesContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        if (initialServices) {
            setServices((initialServices as any).items || []);
        }
    }, [initialServices]);

    const updateServiceMutation = useMutation({
        mutationFn: async (service: any) => {
            if (service.id.startsWith('temp-')) {
                const { ...newService } = service;
                delete newService.id;
                await supabase.from('homepage_services').insert(newService);
            } else {
                await supabase.from('homepage_services').update(service).eq('id', service.id);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'services'] });
            toast({ title: 'Service updated' });
        }
    });

    const deleteServiceMutation = useMutation({
        mutationFn: async (id: string) => {
            await supabase.from('homepage_services').delete().eq('id', id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'services'] });
            toast({ title: 'Service deleted' });
        }
    });

    const addNewService = () => {
        setServices([...services, {
            id: `temp-${Date.now()}`,
            title: 'New Service',
            description: '',
            icon_name: 'Code',
            features: [],
            display_order: services.length + 1
        }]);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h2 className="text-3xl font-bold tracking-tight">Services Editor</h2>
                <p className="text-muted-foreground mt-1">
                    Manage the services you offer to clients
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4">
                <SectionHeadingEditor
                    sectionKey="services"
                    defaultValues={{
                        section_badge: (initialServices as any)?.content?.section_badge,
                        section_title: (initialServices as any)?.content?.section_title,
                        section_highlight: (initialServices as any)?.content?.section_highlight,
                        section_description: (initialServices as any)?.content?.section_description
                    }}
                />
            </div>

            <div className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Services ({services.length})</h3>
                    <Button onClick={addNewService} variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                </div>

                <div className="grid gap-6">
                    {services.map((service, index) => (
                        <Card key={service.id}>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1 w-1/3">
                                        <Label>Service Title</Label>
                                        <Input
                                            value={service.title}
                                            onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, title: e.target.value } : s))}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-primary hover:bg-primary/10 transition-colors"
                                            onClick={() => updateServiceMutation.mutate(service)}
                                        >
                                            <Save className="mr-2 h-4 w-4" /> Save
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => deleteServiceMutation.mutate(service.id)}
                                            title="Delete Service"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={service.description || ''}
                                            onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, description: e.target.value } : s))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Features (One per line)</Label>
                                        <Textarea
                                            value={Array.isArray(service.features) ? service.features.join('\n') : ''}
                                            onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, features: e.target.value.split('\n') } : s))}
                                            placeholder="Mobile First&#10;SEO Optimized&#10;Fast Loading"
                                            className="h-32 font-mono text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1 w-1/3">
                                    <Label>Icon Name (Lucide)</Label>
                                    <Input
                                        value={service.icon_name || ''}
                                        onChange={(e) => setServices(services.map(s => s.id === service.id ? { ...s, icon_name: e.target.value } : s))}
                                        placeholder="e.g. Code, Smartphone, Globe"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="bg-muted/50 p-3 rounded-lg text-sm mt-8">
                    <p className="font-medium mb-1">Services Configuration:</p>
                    <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Service Title:</strong> The name of the service (e.g., "Web Design").</li>
                        <li>• <strong>Description:</strong> A high-level overview of what this service entails.</li>
                        <li>• <strong>Features:</strong> A list of key selling points (one per line).</li>
                        <li>• <strong>Icon Name:</strong> A Lucide icon name (e.g., "Code", "Smartphone", "Globe").</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ServicesEditor;
