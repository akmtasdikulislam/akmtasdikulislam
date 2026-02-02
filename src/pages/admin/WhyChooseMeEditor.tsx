import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    createWhyChooseReason,
    createWhyChooseStat,
    deleteWhyChooseReason,
    deleteWhyChooseStat,
    getAllWhyChooseData,
    updateWhyChooseContent,
    updateWhyChooseReason,
    updateWhyChooseStat
} from '@/integrations/supabase/whyChooseMeQueries';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from 'framer-motion';
import { GripVertical, Loader2, Plus, Save, Target, Trash2, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

function WhyChooseMeEditor() {
    const queryClient = useQueryClient();
    const [saving, setSaving] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['homepage', 'why_choose_me'],
        queryFn: getAllWhyChooseData,
    });

    const [content, setContent] = useState(data?.content || {});
    const [reasons, setReasons] = useState(data?.reasons || []);
    const [stats, setStats] = useState(data?.stats || []);

    // Update local state when data loads
    if (data && Object.keys(content).length === 0 && reasons.length === 0 && stats.length === 0) {
        setContent(data.content);
        setReasons(data.reasons);
        setStats(data.stats);
    }

    const updateContentMutation = useMutation({
        mutationFn: updateWhyChooseContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
            toast.success('Content updated successfully');
        },
        onError: () => toast.error('Failed to update content'),
    });

    const updateReasonMutation = useMutation({
        mutationFn: updateWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
        },
    });

    const createReasonMutation = useMutation({
        mutationFn: createWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
            toast.success('Reason added');
        },
    });

    const deleteReasonMutation = useMutation({
        mutationFn: deleteWhyChooseReason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
            toast.success('Reason deleted');
        },
    });

    const updateStatMutation = useMutation({
        mutationFn: updateWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
        },
    });

    const createStatMutation = useMutation({
        mutationFn: createWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
            toast.success('Stat added');
        },
    });

    const deleteStatMutation = useMutation({
        mutationFn: deleteWhyChooseStat,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'why_choose_me'] });
            toast.success('Stat deleted');
        },
    });

    const handleSaveAll = async () => {
        setSaving(true);
        try {
            await updateContentMutation.mutateAsync(content);
            
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Why Choose Me Section</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage section headings, reasons, and stats
                    </p>
                </div>
                <Button onClick={handleSaveAll} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save All Changes
                </Button>
            </div>

            {/* Section Headings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-card border border-border rounded-xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Section Headings
                </h2>

                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="badge">Badge Text</Label>
                        <Input
                            id="badge"
                            value={content.section_badge || ''}
                            onChange={(e) => setContent({ ...content, section_badge: e.target.value })}
                            placeholder="Why Me"
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="title">Section Title</Label>
                            <Input
                                id="title"
                                value={content.section_title || ''}
                                onChange={(e) => setContent({ ...content, section_title: e.target.value })}
                                placeholder="Why Choose"
                            />
                        </div>
                        <div>
                            <Label htmlFor="highlight">Highlighted Text</Label>
                            <Input
                                id="highlight"
                                value={content.section_highlight || ''}
                                onChange={(e) => setContent({ ...content, section_highlight: e.target.value })}
                                placeholder="Me?"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={content.section_description || ''}
                            onChange={(e) => setContent({ ...content, section_description: e.target.value })}
                            placeholder="What sets me apart from the rest"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Reasons */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Reasons ({reasons.length})</h2>
                    <Button onClick={addReason} size="sm">
                        <Plus className="w-4 h-4" />
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
                                    size="icon"
                                    onClick={() => deleteReasonMutation.mutate(reason.id)}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Stats ({stats.length})
                    </h2>
                    <Button onClick={addStat} size="sm">
                        <Plus className="w-4 h-4" />
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
                                    variant="outline"
                                    size="sm"
                                    onClick={() => deleteStatMutation.mutate(stat.id)}
                                    className="w-full"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WhyChooseMeEditor;
