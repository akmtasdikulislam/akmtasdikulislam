import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import TipTapEditor from '@/components/editor/TipTapEditor';
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
import { useCallback, useEffect, useState } from 'react';



const AboutEditor = () => {
    const { data, isLoading } = useAboutContent();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [aboutData, setAboutData] = useState({
        main_content: '',
    });

    const [highlights, setHighlights] = useState<Array<{ id?: string; title: string; description: string; detail: string; icon_name: string; display_order: number }>>([]);
    const [interests, setInterests] = useState<Array<{ id?: string; label: string; icon_name: string; display_order: number }>>([]);
    const [values, setValues] = useState<Array<{ id?: string; value_text: string; description: string; icon_name: string; display_order: number }>>([]);

    const [focusedHighlight, setFocusedHighlight] = useState<number | null>(null);
    const [focusedInterest, setFocusedInterest] = useState<number | null>(null);
    const [focusedValue, setFocusedValue] = useState<number | null>(null);

    useEffect(() => {
        if (data) {
            const ensureJson = (content: string) => {
                try {
                    if (content && content.trim()) {
                        JSON.parse(content);
                        return content;
                    }
                    return JSON.stringify({
                        type: 'doc',
                        content: [{ type: 'paragraph', content: [] }]
                    });
                } catch (e) {
                    return JSON.stringify({
                        type: 'doc',
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: content || '' }] }]
                    });
                }
            };

            setAboutData({
                main_content: ensureJson((data.about as any).main_content || ''),
            });
            setHighlights(data.highlights);
            setInterests(data.interests);
            setValues(data.values);
        }
    }, [data]);

    const handleContentChange = useCallback((json: string) => {
        setAboutData(prev => ({ ...prev, main_content: json }));
    }, []);

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
        <div className="space-y-6 w-full pb-20">
            <div className="max-w-6xl mx-auto w-full px-4">
                <h1 className="text-2xl sm:text-3xl font-bold">About Section Editor</h1>
                <p className="text-muted-foreground mt-1">
                    Edit all content in the About Me section
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4">
                <SectionHeadingEditor
                    sectionKey="about"
                    defaultValues={{
                        section_badge: (data?.about as any)?.section_badge,
                        section_title: (data?.about as any)?.section_title,
                        section_highlight: (data?.about as any)?.section_highlight,
                        section_description: (data?.about as any)?.section_description
                    }}
                />
            </div>

            <Tabs defaultValue="content" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="content" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Content</TabsTrigger>
                        <TabsTrigger value="highlights" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Highlights</TabsTrigger>
                        <TabsTrigger value="interests" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Interests</TabsTrigger>
                        <TabsTrigger value="values" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Core Values</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="content" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">

                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Main Content</CardTitle>
                                <CardDescription>The primary text describing you and your background</CardDescription>
                            </div>
                            <Button onClick={() => updateAboutMutation.mutate(aboutData)} disabled={updateAboutMutation.isPending} className="w-full sm:w-auto">
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
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="main_content">About Content</Label>
                                <p className="text-xs text-muted-foreground mb-4">Write your story using the rich text editor below.</p>
                                <div className="border border-border rounded-xl p-2 bg-background/50">
                                    <TipTapEditor
                                        content={aboutData.main_content}
                                        onChange={handleContentChange}
                                        placeholder="Start writing your story here..."
                                    />
                                </div>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Content Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>About Content:</strong> Your self-introduction and professional journey.</li>
                                    <li>• <strong>Formatting:</strong> Use the rich text editor to add structure and emphasis.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="highlights" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Highlights</CardTitle>
                                <CardDescription>Key information cards (Education, Location, etc.)</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={() => {
                                        setHighlights([...highlights, { title: '', description: '', detail: '', icon_name: '', display_order: highlights.length }]);
                                        setFocusedHighlight(highlights.length);
                                        setTimeout(() => document.getElementById(`highlight-${highlights.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                    }}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Highlight
                                </Button>

                                <Button onClick={() => updateHighlightsMutation.mutate(highlights)} disabled={updateHighlightsMutation.isPending} className="w-full sm:w-auto">
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
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {highlights.map((item, index) => (
                                <Card
                                    key={index}
                                    id={`highlight-${index}`}
                                    onClick={() => setFocusedHighlight(index)}
                                    className={`relative transition-all duration-300 border cursor-pointer ${focusedHighlight === index
                                        ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                                        : 'bg-card'
                                        }`}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex gap-2 items-end">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mb-3" />
                                            <div className="flex-1 space-y-3 pr-8">
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={item.title}
                                                            onChange={(e) => {
                                                                const updated = [...highlights];
                                                                updated[index].title = e.target.value;
                                                                setHighlights(updated);
                                                            }}
                                                            placeholder="Title (e.g., Education)"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Icon Name</Label>
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
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Description</Label>
                                                    <Input
                                                        value={item.description}
                                                        onChange={(e) => {
                                                            const updated = [...highlights];
                                                            updated[index].description = e.target.value;
                                                            setHighlights(updated);
                                                        }}
                                                        placeholder="Description"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Detail</Label>
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
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setHighlights(highlights.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Highlights Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Title:</strong> The category name (e.g. "Location", "Education").</li>
                                    <li>• <strong>Icon:</strong> A Lucide icon name (e.g. "MapPin", "GraduationCap").</li>
                                    <li>• <strong>Description:</strong> Primary information point (e.g. "BSc in CSE").</li>
                                    <li>• <strong>Detail:</strong> Supporting information (e.g. "CGPA: 3.8/4.0").</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="interests" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Interests</CardTitle>
                                <CardDescription>Tags showing your interests and hobbies</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={() => {
                                        setInterests([...interests, { label: '', icon_name: '', display_order: interests.length }]);
                                        setFocusedInterest(interests.length);
                                        setTimeout(() => document.getElementById(`interest-${interests.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                    }}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Interest
                                </Button>

                                <Button onClick={() => updateInterestsMutation.mutate(interests)} disabled={updateInterestsMutation.isPending} className="w-full sm:w-auto">
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
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {interests.map((item, index) => (
                                    <div
                                        key={index}
                                        id={`interest-${index}`}
                                        onClick={() => setFocusedInterest(index)}
                                        className={`relative flex gap-2 items-start mb-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer ${focusedInterest === index
                                            ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                                            : 'bg-muted/20 border-border/50'
                                            }`}
                                    >
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mt-3" />
                                        <div className="flex-1 grid grid-cols-2 gap-2 pr-8">
                                            <div className="space-y-1">
                                                <Label>Interest Label</Label>
                                                <Input
                                                    value={item.label}
                                                    onChange={(e) => {
                                                        const updated = [...interests];
                                                        updated[index].label = e.target.value;
                                                        setInterests(updated);
                                                    }}
                                                    placeholder="Interest label"
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Icon Name</Label>
                                                <Input
                                                    value={item.icon_name}
                                                    onChange={(e) => {
                                                        const updated = [...interests];
                                                        updated[index].icon_name = e.target.value;
                                                        setInterests(updated);
                                                    }}
                                                    placeholder="Icon name"
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setInterests(interests.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Interests Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Label:</strong> A short name for your interest or hobby.</li>
                                    <li>• <strong>Icon:</strong> A Lucide icon name representing your interest.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="values" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Core Values</CardTitle>
                                <CardDescription>Your core professional values</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <Button
                                    onClick={() => {
                                        setValues([...values, { value_text: '', description: '', icon_name: '', display_order: values.length }]);
                                        setFocusedValue(values.length);
                                        setTimeout(() => document.getElementById(`value-${values.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                    }}
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Value
                                </Button>

                                <Button onClick={() => updateValuesMutation.mutate(values)} disabled={updateValuesMutation.isPending} className="w-full sm:w-auto">
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
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {values.map((item, index) => (
                                <Card
                                    key={index}
                                    id={`value-${index}`}
                                    onClick={() => setFocusedValue(index)}
                                    className={`relative transition-all duration-300 border cursor-pointer ${focusedValue === index
                                        ? 'border-primary ring-2 ring-primary/10 bg-primary/5'
                                        : 'bg-card'
                                        }`}
                                >
                                    <CardContent className="pt-6">
                                        <div className="flex gap-2 items-end">
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mb-3" />
                                            <div className="flex-1 space-y-3 pr-8">
                                                <div className="grid gap-2 md:grid-cols-2">
                                                    <div className="space-y-1">
                                                        <Label>Value Title</Label>
                                                        <Input
                                                            value={item.value_text}
                                                            onChange={(e) => {
                                                                const updated = [...values];
                                                                updated[index].value_text = e.target.value;
                                                                setValues(updated);
                                                            }}
                                                            placeholder="Value (e.g., Innovation)"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Icon Name</Label>
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
                                                </div>
                                                <div className="space-y-1">
                                                    <Label>Description</Label>
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
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setValues(values.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                                <p className="font-medium mb-1">Core Values Configuration:</p>
                                <ul className="space-y-1 text-muted-foreground">
                                    <li>• <strong>Value:</strong> A key professional principle (e.g. "Integrity").</li>
                                    <li>• <strong>Icon:</strong> An icon that visualizes your core value.</li>
                                    <li>• <strong>Description:</strong> A brief explanation of how you live by this value.</li>
                                </ul>
                            </div>


                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AboutEditor;
