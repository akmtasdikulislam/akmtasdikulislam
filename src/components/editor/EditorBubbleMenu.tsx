
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BubbleMenu, BubbleMenuProps, Editor } from '@tiptap/react';
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Check,
    Code,
    Edit2,
    ExternalLink,
    Highlighter,
    Italic,
    LayoutTemplate,
    Link as LinkIcon,
    Strikethrough,
    Underline as UnderlineIcon,
    Unlink,
    X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface EditorBubbleMenuProps extends Omit<BubbleMenuProps, 'editor'> {
    editor: Editor;
}

export const EditorBubbleMenu = ({ editor, className, ...props }: EditorBubbleMenuProps) => {
    const [mode, setMode] = useState<'main' | 'link-edit' | 'link-preview'>('main');
    const [linkUrl, setLinkUrl] = useState('');

    const isLinkActive = editor.isActive('link');

    // Update mode based on selection
    useEffect(() => {
        if (isLinkActive) {
            setMode('link-preview');
            setLinkUrl(editor.getAttributes('link').href || '');
        } else {
            // If selection is empty and not on a link, we probably aren't showing the menu anyway
            // But if we are selecting text, default to main
            setMode('main');
            setLinkUrl('');
        }
    }, [isLinkActive, editor.state.selection]);

    const onSetLink = useCallback(() => {
        if (linkUrl.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setMode('link-preview');
    }, [editor, linkUrl]);

    const onUnlink = useCallback(() => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setMode('main');
    }, [editor]);

    const shouldShow = useCallback(({ editor, state, from, to }: any) => {
        const { selection } = state;
        const isTextSelected = !selection.empty;
        const isLink = editor.isActive('link');

        // Show menu if text is selected OR we are on a link
        return isTextSelected || isLink;
    }, []);

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 100,
                placement: 'top-start',
                maxWidth: 500,
                interactive: true,
            }}
            shouldShow={shouldShow}
            className={cn("flex items-center gap-1 p-1 bg-popover border border-border rounded-lg shadow-lg", className)}
            {...props}
        >
            {mode === 'main' && (
                <>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-accent')}>
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-accent')}>
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn('h-8 w-8 p-0', editor.isActive('underline') && 'bg-accent')}>
                        <UnderlineIcon className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleStrike().run()} className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-accent')}>
                        <Strikethrough className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleCode().run()} className={cn('h-8 w-8 p-0', editor.isActive('code') && 'bg-accent')}>
                        <Code className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setMode('link-edit');
                            const currentLink = editor.getAttributes('link').href;
                            if (currentLink) {
                                setLinkUrl(currentLink);
                            } else {
                                // Check if selection is a URL
                                const { from, to } = editor.state.selection;
                                const text = editor.state.doc.textBetween(from, to, ' ');
                                if (text && /^(https?:\/\/[^\s]+)$/.test(text)) {
                                    setLinkUrl(text);
                                } else {
                                    setLinkUrl('');
                                }
                            }
                        }}
                        className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-accent')}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </Button>

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().toggleHighlight().run()} className={cn('h-8 w-8 p-0', editor.isActive('highlight') && 'bg-accent')}>
                        <Highlighter className="w-4 h-4" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'left' }) && 'bg-accent')}>
                        <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'center' }) && 'bg-accent')}>
                        <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'right' }) && 'bg-accent')}>
                        <AlignRight className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'justify' }) && 'bg-accent')}>
                        <AlignJustify className="w-4 h-4" />
                    </Button>
                </>
            )}

            {mode === 'link-preview' && (
                <div className="flex items-center gap-2 p-1">
                    <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 underline truncate max-w-[200px] hover:text-blue-600 block px-2"
                    >
                        {linkUrl}
                    </a>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            setMode('link-edit');
                        }}
                        className="h-7 w-7 p-0"
                        title="Edit Link"
                    >
                        <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onUnlink}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        title="Remove Link"
                    >
                        <Unlink className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            window.open(linkUrl, '_blank');
                        }}
                        className="h-7 w-7 p-0"
                        title="Open Link"
                    >
                        <ExternalLink className="w-3 h-3" />
                    </Button>

                    <div className="w-px h-6 bg-border mx-1" />

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                            editor.chain().focus().extendMarkRange('link').deleteSelection().insertContent({
                                type: 'linkPreview',
                                attrs: { url: linkUrl }
                            }).run();
                            setMode('main');
                        }}
                        className="h-7 w-7 p-0"
                        title="Turn into Bookmark"
                    >
                        <LayoutTemplate className="w-3 h-3" />
                    </Button>
                </div>
            )}

            {mode === 'link-edit' && (
                <div className="flex items-center gap-2 p-1 min-w-[300px]">
                    <Input
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Paste or type a link..."
                        className="h-8 text-xs flex-1"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onSetLink();
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setMode(editor.isActive('link') ? 'link-preview' : 'main');
                            }
                        }}
                    />
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onSetLink}>
                        <Check className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => setMode(editor.isActive('link') ? 'link-preview' : 'main')}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </BubbleMenu>
    );
};
