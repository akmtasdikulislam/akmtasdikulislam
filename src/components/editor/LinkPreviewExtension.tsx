
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkPreviewComponent } from './LinkPreviewComponent';

export const LinkPreviewExtension = Node.create({
    name: 'linkPreview',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            url: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="link-preview"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'link-preview' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(LinkPreviewComponent);
    },

    addCommands() {
        return {
            setLinkPreview:
                (options: { url: string }) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        } as any;
    },
});
