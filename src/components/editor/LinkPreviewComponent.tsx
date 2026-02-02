import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import LinkPreviewCard from '@/components/ui/LinkPreviewCard';
import { NodeViewWrapper } from '@tiptap/react';
import {
    Check,
    LayoutTemplate,
    Link as LinkIcon,
    MoreHorizontal,
    Type
} from 'lucide-react';
import { useState } from 'react';

export const LinkPreviewComponent = ({ node, updateAttributes, editor, getPos }: any) => {
    const [url, setUrl] = useState(node.attrs.url || '');
    const [isEditing, setIsEditing] = useState(!node.attrs.url);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (url) {
            updateAttributes({ url });
            setIsEditing(false);
        }
    };

    const convertToLink = () => {
        if (typeof getPos === 'function') {
            const pos = getPos();
            // Replace the node with a paragraph containing the link
            editor.chain().focus()
                .deleteRange({ from: pos, to: pos + node.nodeSize })
                .insertContent([
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: url,
                                marks: [
                                    {
                                        type: 'link',
                                        attrs: { href: url }
                                    }
                                ]
                            }
                        ]
                    }
                ])
                .run();
        }
    };

    const convertToURL = () => {
        if (typeof getPos === 'function') {
            const pos = getPos();
            // Replace the node with a paragraph containing just the text
            editor.chain().focus()
                .deleteRange({ from: pos, to: pos + node.nodeSize })
                .insertContent([
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: url
                            }
                        ]
                    }
                ])
                .run();
        }
    };

    return (
        <NodeViewWrapper className="my-4 w-full group/wrapper relative py-2">
            {isEditing ? (
                <div className="flex items-center gap-2 p-2 border border-border rounded-md bg-accent/20 w-full">
                    <LinkIcon className="w-4 h-4 text-muted-foreground" />
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste a link to create a bookmark..."
                        className="h-8 text-sm flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSubmit();
                        }}
                    />
                    <Button size="sm" onClick={() => handleSubmit()}>
                        <Check className="w-4 h-4" />
                        Apply
                    </Button>
                </div>
            ) : (
                <div className="relative group w-full">
                    {/* Action Menu - Visible on Hover */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm" className="h-6 w-6 p-0 shadow-sm border border-border bg-background/80 backdrop-blur-sm">
                                    <MoreHorizontal className="w-3 h-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <LinkIcon className="w-3 h-3 mr-2" />
                                    Edit Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">View as</div>
                                <DropdownMenuItem disabled>
                                    <LayoutTemplate className="w-3 h-3 mr-2" />
                                    Card
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={convertToLink}>
                                    <LinkIcon className="w-3 h-3 mr-2" />
                                    Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={convertToURL}>
                                    <Type className="w-3 h-3 mr-2" />
                                    URL
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <LinkPreviewCard url={node.attrs.url} />
                </div>
            )}
        </NodeViewWrapper>
    );
};
