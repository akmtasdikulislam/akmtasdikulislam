import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

interface AboutEditorSidebarProps {
    aboutData: {
        section_badge: string;
        section_title: string;
        section_highlight: string;
        section_description: string;
    };
    setAboutData: (data: any) => void;
    highlights: any[];
    setHighlights: (data: any[]) => void;
    interests: any[];
    setInterests: (data: any[]) => void;
    values: any[];
    setValues: (data: any[]) => void;
}

const AboutEditorSidebar = ({
    aboutData,
    setAboutData,
    highlights,
    setHighlights,
    interests,
    setInterests,
    values,
    setValues
}: AboutEditorSidebarProps) => {
    return (
        <div className="w-full lg:w-96 shrink-0 border-l border-border bg-card/30 overflow-y-auto lg:relative absolute lg:static inset-0 z-40 lg:z-auto">
            <div className="p-4 sm:p-6 space-y-6 pb-24">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Section Settings</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="badge">Section Badge</Label>
                        <Input
                            id="badge"
                            value={aboutData.section_badge}
                            onChange={(e) => setAboutData({ ...aboutData, section_badge: e.target.value })}
                            placeholder="Get to know me"
                            className="text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="highlight">Highlight Word</Label>
                        <Input
                            id="highlight"
                            value={aboutData.section_highlight}
                            onChange={(e) => setAboutData({ ...aboutData, section_highlight: e.target.value })}
                            placeholder="About"
                            className="text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Section Title</Label>
                        <Input
                            id="title"
                            value={aboutData.section_title}
                            onChange={(e) => setAboutData({ ...aboutData, section_title: e.target.value })}
                            placeholder="About Me"
                            className="text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="desc">Section Description</Label>
                        <Textarea
                            id="desc"
                            value={aboutData.section_description}
                            onChange={(e) => setAboutData({ ...aboutData, section_description: e.target.value })}
                            rows={3}
                            className="text-sm resize-none"
                        />
                    </div>
                </div>

                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="highlights">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Highlights ({highlights.length})</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            {highlights.map((item, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-background/50 space-y-2 relative group">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <GripVertical className="w-3 h-3 text-muted-foreground" />
                                            <Input
                                                value={item.title}
                                                onChange={(e) => {
                                                    const updated = [...highlights];
                                                    updated[index].title = e.target.value;
                                                    setHighlights(updated);
                                                }}
                                                placeholder="Title"
                                                className="h-8 text-xs font-semibold"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setHighlights(highlights.filter((_, i) => i !== index))}
                                        >
                                            <Trash2 className="w-3 h-3 text-destructive" />
                                        </Button>
                                    </div>
                                    <Input
                                        value={item.icon_name}
                                        onChange={(e) => {
                                            const updated = [...highlights];
                                            updated[index].icon_name = e.target.value;
                                            setHighlights(updated);
                                        }}
                                        placeholder="Icon Name"
                                        className="h-7 text-xs"
                                    />
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => {
                                            const updated = [...highlights];
                                            updated[index].description = e.target.value;
                                            setHighlights(updated);
                                        }}
                                        placeholder="Description"
                                        className="text-xs resize-none"
                                        rows={2}
                                    />
                                </div>
                            ))}
                            <Button
                                onClick={() => setHighlights([...highlights, { title: '', description: '', detail: '', icon_name: '', display_order: highlights.length }])}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Highlight
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="interests">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Interests ({interests.length})</AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-2">
                            {interests.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={item.label}
                                        onChange={(e) => {
                                            const updated = [...interests];
                                            updated[index].label = e.target.value;
                                            setInterests(updated);
                                        }}
                                        placeholder="Label"
                                        className="h-8 text-xs"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        onClick={() => setInterests(interests.filter((_, i) => i !== index))}
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                onClick={() => setInterests([...interests, { label: '', icon_name: '', display_order: interests.length }])}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Interest
                            </Button>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="values">
                        <AccordionTrigger className="text-sm font-semibold hover:no-underline">Core Values ({values.length})</AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2">
                            {values.map((item, index) => (
                                <div key={index} className="p-3 border rounded-lg bg-background/50 space-y-2 group relative">
                                    <div className="flex items-center justify-between">
                                        <Input
                                            value={item.value_text}
                                            onChange={(e) => {
                                                const updated = [...values];
                                                updated[index].value_text = e.target.value;
                                                setValues(updated);
                                            }}
                                            placeholder="Value"
                                            className="h-8 text-xs font-semibold"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setValues(values.filter((_, i) => i !== index))}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={item.description}
                                        onChange={(e) => {
                                            const updated = [...values];
                                            updated[index].description = e.target.value;
                                            setValues(updated);
                                        }}
                                        placeholder="Description"
                                        className="text-xs resize-none"
                                        rows={2}
                                    />
                                </div>
                            ))}
                            <Button
                                onClick={() => setValues([...values, { value_text: '', description: '', icon_name: '', display_order: values.length }])}
                                variant="outline"
                                size="sm"
                                className="w-full text-xs h-8"
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add Value
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default AboutEditorSidebar;
