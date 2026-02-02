import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TipTapCodeBlockComponent from './TipTapCodeBlockComponent';

export interface CodeBlockOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tipTapCodeBlock: {
      setCodeBlock: (attributes?: { language?: string; filename?: string }) => ReturnType;
      toggleCodeBlock: (attributes?: { language?: string; filename?: string }) => ReturnType;
    };
  }
}

export const TipTapCodeBlock = Node.create<CodeBlockOptions>({
  name: 'codeBlock',

  content: 'text*',

  marks: '',

  group: 'block',

  code: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      language: {
        default: 'typescript',
        parseHTML: element => element.getAttribute('data-language'),
        renderHTML: attributes => {
          if (!attributes.language) {
            return {};
          }
          return {
            'data-language': attributes.language,
          };
        },
      },
      filename: {
        default: '',
        parseHTML: element => element.getAttribute('data-filename'),
        renderHTML: attributes => {
          if (!attributes.filename) {
            return {};
          }
          return {
            'data-filename': attributes.filename,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'pre',
        preserveWhitespace: 'full',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['code', {}, 0],
    ];
  },

  addCommands() {
    return {
      setCodeBlock:
        attributes =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
      toggleCodeBlock:
        attributes =>
        ({ commands }) => {
          return commands.toggleNode(this.name, 'paragraph', attributes);
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(TipTapCodeBlockComponent);
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-c': () => this.editor.commands.toggleCodeBlock(),
      Backspace: () => {
        const { empty, $anchor } = this.editor.state.selection;
        const isAtStart = $anchor.pos === 1;

        if (!empty || $anchor.parent.type.name !== this.name) {
          return false;
        }

        if (isAtStart || !$anchor.parent.textContent.length) {
          return this.editor.commands.clearNodes();
        }

        return false;
      },
    };
  },
});
