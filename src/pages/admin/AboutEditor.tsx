import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAboutContent } from '@/hooks/useHomepageContent';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GripVertical, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react';
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

    // Edit mode states
    const [isEditingHighlights, setIsEditingHighlights] = useState(false);
    const [isEditingInterests, setIsEditingInterests] = useState(false);
    const [isEditingValues, setIsEditingValues] = useState(false);

    // Dialog states
    const [highlightDialogOpen, setHighlightDialogOpen] = useState(false);
    const [interestDialogOpen, setInterestDialogOpen] = useState(false);
    const [valueDialogOpen, setValueDialogOpen] = useState(false);

    // Form data states
    const [highlightFormData, setHighlightFormData] = useState({ title: '', description: '', detail: '', icon_name: '' });
    const [interestFormData, setInterestFormData] = useState({ label: '', icon_name: '' });
    const [valueFormData, setValueFormData] = useState({ value_text: '', description: '', icon_name: '' });

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

    // Dialog handlers — Highlights
    const handleOpenHighlightDialog = () => {
        setHighlightFormData({ title: '', description: '', detail: '', icon_name: '' });
        setHighlightDialogOpen(true);
    };

    const handleSaveHighlight = () => {
        if (!highlightFormData.title) {
            toast({ title: 'Error', description: 'Please provide a title for the highlight.', variant: 'destructive' });
            return;
        }
        setHighlights([...highlights, { ...highlightFormData, display_order: highlights.length }]);
        setHighlightDialogOpen(false);
        setTimeout(() => document.getElementById(`highlight-${highlights.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    // Dialog handlers — Interests
    const handleOpenInterestDialog = () => {
        setInterestFormData({ label: '', icon_name: '' });
        setInterestDialogOpen(true);
    };

    const handleSaveInterest = () => {
        if (!interestFormData.label) {
            toast({ title: 'Error', description: 'Please provide a label for the interest.', variant: 'destructive' });
            return;
        }
        setInterests([...interests, { ...interestFormData, display_order: interests.length }]);
        setInterestDialogOpen(false);
        setTimeout(() => document.getElementById(`interest-${interests.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

    // Dialog handlers — Values
    const handleOpenValueDialog = () => {
        setValueFormData({ value_text: '', description: '', icon_name: '' });
        setValueDialogOpen(true);
    };

    const handleSaveValue = () => {
        if (!valueFormData.value_text) {
            toast({ title: 'Error', description: 'Please provide a title for the value.', variant: 'destructive' });
            return;
        }
        setValues([...values, { ...valueFormData, display_order: values.length }]);
        setValueDialogOpen(false);
        setTimeout(() => document.getElementById(`value-${values.length}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    };

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
        onError: (err: any) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
        onError: (err: any) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
        onError: (err: any) => {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">About Section Editor</h1>
                        <p className="text-muted-foreground mt-1">
                            Edit all content in the About Me section
                        </p>
                    </div>
                    <SectionVisibilityToggle sectionKey="about" label="About section" />
                </div>
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

                {/* CONTENT */}
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

                {/* HIGHLIGHTS */}
                <TabsContent value="highlights" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Highlights</CardTitle>
                                <CardDescription>Key information cards (Education, Location, etc.)</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                {!isEditingHighlights && (
                                    <Button onClick={handleOpenHighlightDialog} variant="outline" className="w-full sm:w-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Highlight
                                    </Button>
                                )}
                                {isEditingHighlights ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setHighlights(data?.highlights ?? []);
                                                setIsEditingHighlights(false);
                                            }}
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateHighlightsMutation.mutate(highlights, {
                                                    onSuccess: () => setIsEditingHighlights(false),
                                                })
                                            }
                                            disabled={updateHighlightsMutation.isPending}
                                            className="w-full sm:w-auto"
                                        >
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
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditingHighlights(true)}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Highlights
                                    </Button>
                                )}
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
                                            {isEditingHighlights && (
                                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mb-3" />
                                            )}
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
                                                            disabled={!isEditingHighlights}
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
                                                            disabled={!isEditingHighlights}
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
                                                        disabled={!isEditingHighlights}
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
                                                        disabled={!isEditingHighlights}
                                                    />
                                                </div>
                                            </div>
                                            {isEditingHighlights && (
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHighlights(highlights.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
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

                {/* INTERESTS */}
                <TabsContent value="interests" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Interests</CardTitle>
                                <CardDescription>Tags showing your interests and hobbies</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                {!isEditingInterests && (
                                    <Button onClick={handleOpenInterestDialog} variant="outline" className="w-full sm:w-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Interest
                                    </Button>
                                )}
                                {isEditingInterests ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setInterests(data?.interests ?? []);
                                                setIsEditingInterests(false);
                                            }}
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateInterestsMutation.mutate(interests, {
                                                    onSuccess: () => setIsEditingInterests(false),
                                                })
                                            }
                                            disabled={updateInterestsMutation.isPending}
                                            className="w-full sm:w-auto"
                                        >
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
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditingInterests(true)}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Interests
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {interests.map((item, index) => (
                                    <div
                                        key={index}
                                        id={`interest-${index}`}
                                        onClick={() => setFocusedInterest(index)}
                                        className={`relative flex gap-2 items-end p-4 rounded-lg border transition-all duration-300 cursor-pointer ${focusedInterest === index
                                            ? 'bg-primary/5 border-primary ring-2 ring-primary/10'
                                            : 'bg-muted/20 border-border/50'
                                            }`}
                                    >
                                        {isEditingInterests && (
                                            <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mb-3" />
                                        )}
                                        <div className="flex-1 grid grid-cols-2 gap-2">
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
                                                    disabled={!isEditingInterests}
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
                                                    disabled={!isEditingInterests}
                                                />
                                            </div>
                                        </div>
                                        {isEditingInterests && (
                                            <Button
                                                variant="ghost"
                                                className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setInterests(interests.filter((_, i) => i !== index));
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
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

                {/* CORE VALUES */}
                <TabsContent value="values" className="space-y-4 mt-10 max-w-6xl mx-auto w-full px-4">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-1.5">
                                <CardTitle>Core Values</CardTitle>
                                <CardDescription>Your core professional values</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                {!isEditingValues && (
                                    <Button onClick={handleOpenValueDialog} variant="outline" className="w-full sm:w-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Value
                                    </Button>
                                )}
                                {isEditingValues ? (
                                    <>
                                        <Button
                                            onClick={() => {
                                                setValues(data?.values ?? []);
                                                setIsEditingValues(false);
                                            }}
                                            variant="outline"
                                            className="w-full sm:w-auto"
                                        >
                                            Cancel Edit
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                updateValuesMutation.mutate(values, {
                                                    onSuccess: () => setIsEditingValues(false),
                                                })
                                            }
                                            disabled={updateValuesMutation.isPending}
                                            className="w-full sm:w-auto"
                                        >
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
                                    </>
                                ) : (
                                    <Button
                                        onClick={() => setIsEditingValues(true)}
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Values
                                    </Button>
                                )}
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
                                            {isEditingValues && (
                                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab mb-3" />
                                            )}
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
                                                            disabled={!isEditingValues}
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
                                                            disabled={!isEditingValues}
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
                                                        disabled={!isEditingValues}
                                                    />
                                                </div>
                                            </div>
                                            {isEditingValues && (
                                                <Button
                                                    variant="ghost"
                                                    className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setValues(values.filter((_, i) => i !== index));
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
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

            {/* Add Highlight Dialog */}
            <Dialog open={highlightDialogOpen} onOpenChange={setHighlightDialogOpen}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border/50">
                    <DialogHeader>
                        <DialogTitle>Add New Highlight</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <Label>Title *</Label>
                            <Input
                                value={highlightFormData.title}
                                onChange={(e) => setHighlightFormData({ ...highlightFormData, title: e.target.value })}
                                placeholder="e.g., Education"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Icon Name</Label>
                            <Input
                                value={highlightFormData.icon_name}
                                onChange={(e) => setHighlightFormData({ ...highlightFormData, icon_name: e.target.value })}
                                placeholder="e.g., GraduationCap"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <Input
                                value={highlightFormData.description}
                                onChange={(e) => setHighlightFormData({ ...highlightFormData, description: e.target.value })}
                                placeholder="e.g., BSc in CSE"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Detail</Label>
                            <Input
                                value={highlightFormData.detail}
                                onChange={(e) => setHighlightFormData({ ...highlightFormData, detail: e.target.value })}
                                placeholder="e.g., CGPA: 3.8/4.0"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setHighlightDialogOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveHighlight} className="flex-1">
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Interest Dialog */}
            <Dialog open={interestDialogOpen} onOpenChange={setInterestDialogOpen}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border/50">
                    <DialogHeader>
                        <DialogTitle>Add New Interest</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <Label>Label *</Label>
                            <Input
                                value={interestFormData.label}
                                onChange={(e) => setInterestFormData({ ...interestFormData, label: e.target.value })}
                                placeholder="e.g., Open Source"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Icon Name</Label>
                            <Input
                                value={interestFormData.icon_name}
                                onChange={(e) => setInterestFormData({ ...interestFormData, icon_name: e.target.value })}
                                placeholder="e.g., Code2"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setInterestDialogOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveInterest} className="flex-1">
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Value Dialog */}
            <Dialog open={valueDialogOpen} onOpenChange={setValueDialogOpen}>
                <DialogContent className="max-w-md bg-background/95 backdrop-blur-xl border-border/50">
                    <DialogHeader>
                        <DialogTitle>Add New Core Value</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-1">
                            <Label>Value Title *</Label>
                            <Input
                                value={valueFormData.value_text}
                                onChange={(e) => setValueFormData({ ...valueFormData, value_text: e.target.value })}
                                placeholder="e.g., Innovation"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Icon Name</Label>
                            <Input
                                value={valueFormData.icon_name}
                                onChange={(e) => setValueFormData({ ...valueFormData, icon_name: e.target.value })}
                                placeholder="e.g., Lightbulb"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Description</Label>
                            <Textarea
                                value={valueFormData.description}
                                onChange={(e) => setValueFormData({ ...valueFormData, description: e.target.value })}
                                placeholder="A brief explanation of this value..."
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setValueDialogOpen(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveValue} className="flex-1">
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AboutEditor;
