import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAboutContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const AboutEditor = () => {
    const { data, isLoading } = useAboutContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [aboutData, setAboutData] = useState({
        section_badge: '',
        section_title: '',
        section_highlight: '',
        section_description: '',
        paragraph_1: '',
        paragraph_2: '',
        paragraph_3: '',
    });

    const [highlights, setHighlights] = useState<Array<{ id?: string; title: string; description: string; detail: string; icon_name: string; display_order: number }>>([]);
    const [interests, setInterests] = useState<Array<{ id?: string; label: string; icon_name: string; display_order: number }>>([]);
    const [values, setValues] = useState<Array<{ id?: string; value_text: string; description: string; icon_name: string; display_order: number }>>([]);

    useEffect(() => {
        if (data) {
            setAboutData({
                section_badge: data.about.section_badge,
                section_title: data.about.section_title,
                section_highlight: data.about.section_highlight,
                section_description: data.about.section_description,
                paragraph_1: data.about.paragraph_1,
                paragraph_2: data.about.paragraph_2,
                paragraph_3: data.about.paragraph_3,
            });
            setHighlights(data.highlights);
            setInterests(data.interests);
            setValues(data.values);
        }
    }, [data]);

    const updateAboutMutation = useMutation({
        mutationFn: async (updatedData: typeof aboutData) => {
            const { data: result, error } = await supabase
                .from('homepage_about')
                .update(updatedData)
                .eq('id', data!.about.id)
                .select()
                .single();
            if (error) throw error;
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'about'] });
            toast({ title: 'Success', description: 'About section updated successfully' });
        },
    });

    const updateHighlightsMutation = useMutation({
        mutationFn: async (items: typeof highlights) => {
            await supabase.from('homepage_about_highlights').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { error } = await supabase.from('homepage_about_highlights').insert(items.map((item, idx) => ({
                title: item.title,
                description: item.description,
                detail: item.detail,
                icon_name: item.icon_name,
                display_order: idx,
            })));
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'about'] });
            toast({ title: 'Success', description: 'Highlights updated successfully' });
        },
    });

    const updateInterestsMutation = useMutation({
        mutationFn: async (items: typeof interests) => {
            await supabase.from('homepage_about_interests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { error } = await supabase.from('homepage_about_interests').insert(items.map((item, idx) => ({
                label: item.label,
                icon_name: item.icon_name,
                display_order: idx,
            })));
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'about'] });
            toast({ title: 'Success', description: 'Interests updated successfully' });
        },
    });

    const updateValuesMutation = useMutation({
        mutationFn: async (items: typeof values) => {
            await supabase.from('homepage_about_values').delete().neq('id', '00000000-0000-0000-0000-000000000000');
            const { error } = await supabase.from('homepage_about_values').insert(items.map((item, idx) => ({
                value_text: item.value_text,
                description: item.description,
                icon_name: item.icon_name,
                display_order: idx,
            })));
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'about'] });
            toast({ title: 'Success', description: 'Values updated successfully' });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl pb-20">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">About Section Editor</h1>
                <p className="text-muted-foreground mt-1">
                    Edit all content in the About Me section
                </p>
            </div>

            <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="highlights">Highlights</TabsTrigger>
                    <TabsTrigger value="interests">Interests</TabsTrigger>
                    <TabsTrigger value="values">Core Values</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Header</CardTitle>
                            <CardDescription>Badge, title, and description for the About section</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="badge">Section Badge</Label>
                                    <Input
                                        id="badge"
                                        value={aboutData.section_badge}
                                        onChange={(e) => setAboutData({ ...aboutData, section_badge: e.target.value })}
                                        placeholder="Get to know me"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="highlight">Highlight Word</Label>
                                    <Input
                                        id="highlight"
                                        value={aboutData.section_highlight}
                                        onChange={(e) => setAboutData({ ...aboutData, section_highlight: e.target.value })}
                                        placeholder="About"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="title">Section Title</Label>
                                <Input
                                    id="title"
                                    value={aboutData.section_title}
                                    onChange={(e) => setAboutData({ ...aboutData, section_title: e.target.value })}
                                    placeholder="About Me"
                                />
                            </div>

                            <div>
                                <Label htmlFor="desc">Section Description</Label>
                                <Textarea
                                    id="desc"
                                    value={aboutData.section_description}
                                    onChange={(e) => setAboutData({ ...aboutData, section_description: e.target.value })}
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Main Content</CardTitle>
                            <CardDescription>The three paragraphs of about text</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="p1">Paragraph 1</Label>
                                <Textarea
                                    id="p1"
                                    value={aboutData.paragraph_1}
                                    onChange={(e) => setAboutData({ ...aboutData, paragraph_1: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="p2">Paragraph 2</Label>
                                <Textarea
                                    id="p2"
                                    value={aboutData.paragraph_2}
                                    onChange={(e) => setAboutData({ ...aboutData, paragraph_2: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div>
                                <Label htmlFor="p3">Paragraph 3</Label>
                                <Textarea
                                    id="p3"
                                    value={aboutData.paragraph_3}
                                    onChange={(e) => setAboutData({ ...aboutData, paragraph_3: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <Button onClick={() => updateAboutMutation.mutate(aboutData)} disabled={updateAboutMutation.isPending}>
                                {updateAboutMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Content
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="highlights" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Highlights</CardTitle>
                            <CardDescription>Key information cards (Education, Location, etc.)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {highlights.map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <div className="flex gap-2 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-3">
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <Input
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const updated = [...highlights];
                                                            updated[index].title = e.target.value;
                                                            setHighlights(updated);
                                                        }}
                                                        placeholder="Title (e.g., Education)"
                                                    />
                                                    <Input
                                                        value={item.icon_name}
                                                        onChange={(e) => {
                                                            const updated = [...highlights];
                                                            updated[index].icon_name = e.target.value;
                                                            setHighlights(updated);
                                                        }}
                                                        placeholder="Icon (e.g., GraduationCap)"
                                                    />
                                                </div>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const updated = [...highlights];
                                                        updated[index].description = e.target.value;
                                                        setHighlights(updated);
                                                    }}
                                                    placeholder="Description"
                                                />
                                                <Input
                                                    value={item.detail}
                                                    onChange={(e) => {
                                                        const updated = [...highlights];
                                                        updated[index].detail = e.target.value;
                                                        setHighlights(updated);
                                                    }}
                                                    placeholder="Detail"
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                onClick={() => setHighlights([...highlights, { title: '', description: '', detail: '', icon_name: '', display_order: highlights.length }])}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Highlight
                            </Button>

                            <Button onClick={() => updateHighlightsMutation.mutate(highlights)} disabled={updateHighlightsMutation.isPending} className="w-full">
                                {updateHighlightsMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Highlights
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="interests" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Interests</CardTitle>
                            <CardDescription>Tags showing your interests and hobbies</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {interests.map((item, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                                        <Input
                                            value={item.label}
                                            onChange={(e) => {
                                                const updated = [...interests];
                                                updated[index].label = e.target.value;
                                                setInterests(updated);
                                            }}
                                            placeholder="Interest label"
                                            className="flex-1"
                                        />
                                        <Input
                                            value={item.icon_name}
                                            onChange={(e) => {
                                                const updated = [...interests];
                                                updated[index].icon_name = e.target.value;
                                                setInterests(updated);
                                            }}
                                            placeholder="Icon name"
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setInterests(interests.filter((_, i) => i !== index))}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={() => setInterests([...interests, { label: '', icon_name: '', display_order: interests.length }])}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Interest
                            </Button>

                            <Button onClick={() => updateInterestsMutation.mutate(interests)} disabled={updateInterestsMutation.isPending} className="w-full">
                                {updateInterestsMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Interests
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="values" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Values</CardTitle>
                            <CardDescription>Your core professional values</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {values.map((item, index) => (
                                <Card key={index}>
                                    <CardContent className="pt-6">
                                        <div className="flex gap-2 items-start">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                            <div className="flex-1 space-y-3">
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <Input
                                                        value={item.value_text}
                                                        onChange={(e) => {
                                                            const updated = [...values];
                                                            updated[index].value_text = e.target.value;
                                                            setValues(updated);
                                                        }}
                                                        placeholder="Value (e.g., Innovation)"
                                                    />
                                                    <Input
                                                        value={item.icon_name}
                                                        onChange={(e) => {
                                                            const updated = [...values];
                                                            updated[index].icon_name = e.target.value;
                                                            setValues(updated);
                                                        }}
                                                        placeholder="Icon (e.g., Lightbulb)"
                                                    />
                                                </div>
                                                <Textarea
                                                    value={item.description}
                                                    onChange={(e) => {
                                                        const updated = [...values];
                                                        updated[index].description = e.target.value;
                                                        setValues(updated);
                                                    }}
                                                    placeholder="Description"
                                                    rows={2}
                                                />
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => setValues(values.filter((_, i) => i !== index))}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <Button
                                onClick={() => setValues([...values, { value_text: '', description: '', icon_name: '', display_order: values.length }])}
                                variant="outline"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Value
                            </Button>

                            <Button onClick={() => updateValuesMutation.mutate(values)} disabled={updateValuesMutation.isPending} className="w-full">
                                {updateValuesMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Values
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AboutEditor;
