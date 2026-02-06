import SectionHeadingEditor from '@/components/admin/SectionHeadingEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useWhyChooseMeContent } from '@/hooks/useHomepageContent';
import {
    createWhyChooseReason,
    createWhyChooseStat,
    deleteWhyChooseReason,
    deleteWhyChooseStat,
    updateWhyChooseReason,
    updateWhyChooseStat
} from '@/integrations/supabase/whyChooseMeQueries';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from 'framer-motion';
import { GripVertical, Loader2, Plus, Save, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function WhyChooseMeEditor() {
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const { data, isLoading } = useWhyChooseMeContent();
    const [reasons, setReasons] = useState<any[]>([]);
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setReasons(data.reasons || []);
            setStats(data.stats || []);
        }
    }, [data]);

    const updateReasonMutation = useMutation({
        mutationFn: updateWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
        },
    });

    const createReasonMutation = useMutation({
        mutationFn: createWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
            toast.success('Reason added');
        },
    });

    const deleteReasonMutation = useMutation({
        mutationFn: deleteWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
            toast.success('Reason deleted');
        },
    });

    const updateStatMutation = useMutation({
        mutationFn: updateWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
        },
    });

    const createStatMutation = useMutation({
        mutationFn: createWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
            toast.success('Stat added');
        },
    });

    const deleteStatMutation = useMutation({
        mutationFn: deleteWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why-choose-me'] });
            toast.success('Stat deleted');
        },
    });

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            // Update all reasons
            for (const reason of reasons) {
                await updateReasonMutation.mutateAsync(reason);
            }

            // Update all stats
            for (const stat of stats) {
                await updateStatMutation.mutateAsync(stat);
            }

            toast.success('All changes saved successfully');
        } catch (error) {
            toast.error('Failed to save some changes');
        } finally {
            setSaving(false);
        }
    };

    const addReason = () => {
        const newReason = {
            icon_name: 'Target',
            title: 'New Reason',
            description: 'Description here',
            display_order: reasons.length + 1,
        };
        createReasonMutation.mutate(newReason);
    };

    const addStat = () => {
        const newStat = {
            stat_value: 0,
            stat_suffix: '+',
            stat_label: 'New Stat',
            display_order: stats.length + 1,
        };
        createStatMutation.mutate(newStat);
    };

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
                <h1 className="text-2xl sm:text-3xl font-bold">Why Choose Me Section</h1>
                <p className="text-muted-foreground mt-1">
                    Manage section headings, reasons, and stats
                </p>
            </div>

            <div className="max-w-6xl mx-auto w-full px-4">
                <SectionHeadingEditor
                    sectionKey="why-choose-me"
                    defaultValues={{
                        section_badge: (data?.content as any)?.section_badge,
                        section_title: (data?.content as any)?.section_title,
                        section_highlight: (data?.content as any)?.section_highlight,
                        section_description: (data?.content as any)?.section_description
                    }}
                />
            </div>

            <Tabs defaultValue="reasons" className="w-full">
                <div className="flex justify-center w-full px-4">
                    <TabsList className="inline-flex h-auto p-1 bg-muted/40 backdrop-blur-sm border border-border/50 rounded-xl overflow-x-auto max-w-full">
                        <TabsTrigger value="reasons" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Reasons</TabsTrigger>
                        <TabsTrigger value="stats" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Stats</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="reasons" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Reasons */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Reasons ({reasons.length})</h2>
                        <Button onClick={addReason} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Reason
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {reasons.map((reason: any, index: number) => (
                            <motion.div
                                key={reason.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-card border border-border rounded-xl">
                                <div className="flex items-start gap-3">
                                    <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-move" />
                                    <div className="flex-1 grid gap-3">
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <div>
                                                <Label>Icon Name (Lucide)</Label>
                                                <Input
                                                    value={reason.icon_name}
                                                    onChange={(e) => {
                                                        const updated = [...reasons];
                                                        updated[index].icon_name = e.target.value;
                                                        setReasons(updated);
                                                    }}
                                                    placeholder="Zap"
                                                />
                                            </div>
                                            <div>
                                                <Label>Title</Label>
                                                <Input
                                                    value={reason.title}
                                                    onChange={(e) => {
                                                        const updated = [...reasons];
                                                        updated[index].title = e.target.value;
                                                        setReasons(updated);
                                                    }}
                                                    placeholder="Fast & Efficient"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Description</Label>
                                            <Textarea
                                                value={reason.description}
                                                onChange={(e) => {
                                                    const updated = [...reasons];
                                                    updated[index].description = e.target.value;
                                                    setReasons(updated);
                                                }}
                                                rows={2}
                                                placeholder="Description"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                        onClick={() => deleteReasonMutation.mutate(reason.id)}
                                        title="Delete Reason"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium mb-1">Reasons Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Icon Name:</strong> A Lucide icon name (e.g. "Zap", "Shield", "Target").</li>
                            <li>• <strong>Title:</strong> A short heading for this specific reason.</li>
                            <li>• <strong>Description:</strong> A brief explanation of the feature or benefit.</li>
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSaveAll} disabled={saving} variant="outline">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Reasons
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-6 mt-10 max-w-6xl mx-auto w-full px-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Stats ({stats.length})
                        </h2>
                        <Button onClick={addStat} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Stat
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat: any, index: number) => (
                            <motion.div
                                key={stat.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-card border border-border rounded-xl">
                                <div className="space-y-3">
                                    <div>
                                        <Label>Value</Label>
                                        <Input
                                            type="number"
                                            value={stat.stat_value}
                                            onChange={(e) => {
                                                const updated = [...stats];
                                                updated[index].stat_value = parseInt(e.target.value);
                                                setStats(updated);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label>Suffix</Label>
                                        <Input
                                            value={stat.stat_suffix}
                                            onChange={(e) => {
                                                const updated = [...stats];
                                                updated[index].stat_suffix = e.target.value;
                                                setStats(updated);
                                            }}
                                            placeholder="+ or %"
                                        />
                                    </div>
                                    <div>
                                        <Label>Label</Label>
                                        <Input
                                            value={stat.stat_label}
                                            onChange={(e) => {
                                                const updated = [...stats];
                                                updated[index].stat_label = e.target.value;
                                                setStats(updated);
                                            }}
                                            placeholder="Projects Delivered"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full h-10 px-3 text-destructive hover:bg-destructive/10 transition-colors"
                                        onClick={() => deleteStatMutation.mutate(stat.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Stat
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium mb-1">Stats Configuration:</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• <strong>Value:</strong> The raw numeric data (e.g. "100").</li>
                            <li>• <strong>Suffix:</strong> Character shown after the number (e.g. "+", "%").</li>
                            <li>• <strong>Label:</strong> Description of the stat (e.g. "Happy Clients").</li>
                        </ul>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={handleSaveAll} disabled={saving} variant="outline">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Stats
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default WhyChooseMeEditor;
