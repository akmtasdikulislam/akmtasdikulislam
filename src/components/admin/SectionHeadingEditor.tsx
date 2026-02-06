
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSectionHeading } from '@/hooks/useHomepageContent';
import { updateSectionHeading } from '@/integrations/supabase/sectionHeadingQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SectionHeadingEditorProps {
    sectionKey: string;
    showBadge?: boolean;
    showTitle?: boolean;
    showHighlight?: boolean;
    showDescription?: boolean;
    defaultValues?: {
        section_badge?: string;
        section_title?: string;
        section_highlight?: string;
        section_description?: string;
    };
}

export default function SectionHeadingEditor({
    sectionKey,
    showBadge = true,
    showTitle = true,
    showHighlight = true,
    showDescription = true,
    defaultValues
}: SectionHeadingEditorProps) {
    const queryClient = useQueryClient();
    const { data: headingData, isLoading } = useSectionHeading(sectionKey);
    const [heading, setHeading] = useState({
        section_key: sectionKey,
        section_badge: '',
        section_title: '',
        section_highlight: '',
        section_description: ''
    });

    // We don't want to block with a spinner if row is missing, 
    // but we should still wait for the initial fetch to complete
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setHasAttemptedFetch(true);
            if (headingData) {
                setHeading({
                    section_key: sectionKey,
                    section_badge: headingData.section_badge || '',
                    section_title: headingData.section_title || '',
                    section_highlight: headingData.section_highlight || '',
                    section_description: headingData.section_description || ''
                });
            } else if (defaultValues) {
                setHeading({
                    section_key: sectionKey,
                    section_badge: defaultValues.section_badge || '',
                    section_title: defaultValues.section_title || '',
                    section_highlight: defaultValues.section_highlight || '',
                    section_description: defaultValues.section_description || ''
                });
            }
        }
    }, [headingData, sectionKey, isLoading, defaultValues]);

    const updateHeadingMutation = useMutation({
        mutationFn: updateSectionHeading,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['homepage', 'section_heading', sectionKey] });
            toast.success('Section heading updated');
        },
        onError: () => toast.error('Failed to update section heading'),
    });

    const handleSave = () => {
        updateHeadingMutation.mutate(heading);
    };

    if (isLoading && !hasAttemptedFetch) {
        return (
            <div className="p-6 border border-border rounded-xl bg-card/50">
                <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Section Headings
                </h2>
                <Button onClick={handleSave} disabled={updateHeadingMutation.isPending} size="sm">
                    {updateHeadingMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Headings
                </Button>
            </div>

            <div className="grid gap-4">
                {showBadge && (
                    <div>
                        <Label htmlFor={`badge-${sectionKey}`}>Badge Text</Label>
                        <Input
                            id={`badge-${sectionKey}`}
                            value={heading.section_badge}
                            onChange={(e) => setHeading({ ...heading, section_badge: e.target.value })}
                            placeholder="Section Badge"
                        />
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                    {showTitle && (
                        <div>
                            <Label htmlFor={`title-${sectionKey}`}>Section Title</Label>
                            <Input
                                id={`title-${sectionKey}`}
                                value={heading.section_title}
                                onChange={(e) => setHeading({ ...heading, section_title: e.target.value })}
                                placeholder="Section Title"
                            />
                        </div>
                    )}
                    {showHighlight && (
                        <div>
                            <Label htmlFor={`highlight-${sectionKey}`}>Highlighted Text</Label>
                            <Input
                                id={`highlight-${sectionKey}`}
                                value={heading.section_highlight}
                                onChange={(e) => setHeading({ ...heading, section_highlight: e.target.value })}
                                placeholder="Me?"
                            />
                        </div>
                    )}
                </div>

                {showDescription && (
                    <div>
                        <Label htmlFor={`description-${sectionKey}`}>Description</Label>
                        <Input
                            id={`description-${sectionKey}`}
                            value={heading.section_description}
                            onChange={(e) => setHeading({ ...heading, section_description: e.target.value })}
                            placeholder="Section Description"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
