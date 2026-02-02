import { Button } from '@/components/ui/button';
import Color from '@tiptap/extension-color';
import Dropcursor from '@tiptap/extension-dropcursor';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  CheckSquare,
  Code2,
  ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote
} from 'lucide-react';
import { useEffect } from 'react';
import { BlockHandle } from './BlockHandle';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { LinkPreviewExtension } from './LinkPreviewExtension';
import { TipTapCodeBlock } from './TipTapCodeBlock';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string, textContent: string) => void;
  placeholder?: string;
}

const TipTapEditor = ({ content, onChange, placeholder }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default code block to use custom one
      }),
      TipTapCodeBlock,
      LinkPreviewExtension,
      Dropcursor.configure({
        color: 'hsl(var(--primary))',
        width: 4,
        class: 'transition-all duration-200 ease-in-out opacity-100', // Add some transition if possible, though class might not be supported directly by all versions, standard config is best
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary hover:underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: false,
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Type '/' for commands...",
      }),
      Subscript,
      Superscript,
    ],
    content: content && content.trim() ? JSON.parse(content) : '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json), editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] px-2 py-1 tiptap-editor',
      },
      handlePaste: (view, event, _slice) => {
        const text = event.clipboardData?.getData('text/plain');
        if (!text) return false;

        // Simple URL regex check
        const urlRegex = /^(https?:\/\/[^\s]+)$/;
        if (urlRegex.test(text.trim())) {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;

          // Check if we are in an empty paragraph
          const node = $from.node();
          if (node.type.name === 'paragraph' && node.content.size === 0) {
            event.preventDefault();
            view.dispatch(view.state.tr.replaceSelectionWith(
              view.state.schema.nodes.linkPreview.create({ url: text.trim() })
            ));
            return true;
          }
        }
        return false;
      },
      handleDrop: (view, event, _slice, _moved) => {
        if (!event.dataTransfer || !event.dataTransfer.types.includes('application/x-tiptap-node')) {
          return false;
        }

        const data = event.dataTransfer.getData('application/x-tiptap-node');
        if (!data) return false;

        event.preventDefault();

        const pos = view.posAtCoords({ left: event.clientX, top: event.clientY });
        if (!pos) return false;

        try {
          const { nodeJSON, fromPos } = JSON.parse(data);
          let dropPos = pos.pos;

          // Move logic
          const tr = view.state.tr;
          const fromNode = view.state.doc.nodeAt(fromPos);
          if (!fromNode) return false;

          // Check if dropping on itself
          if (dropPos >= fromPos && dropPos <= fromPos + fromNode.nodeSize) {
            return false;
          }

          // Delete original
          tr.delete(fromPos, fromPos + fromNode.nodeSize);

          // Adjust insertion position if we deleted before the drop point
          if (fromPos < dropPos) {
            dropPos -= fromNode.nodeSize;
          }

          // Insert
          const node = view.state.schema.nodeFromJSON(nodeJSON);
          tr.insert(dropPos, node);

          view.dispatch(tr);
          return true;
        } catch (e) {
          console.error("Drop handling error", e);
          return false;
        }
      }
    },
  });

  // Update content when prop changes (for loading existing posts)
  useEffect(() => {
    if (editor && content && content.trim()) {
      try {
        const currentContent = JSON.stringify(editor.getJSON());
        if (currentContent !== content) {
          editor.commands.setContent(JSON.parse(content));
        }
      } catch (e) {
        // If content is not valid JSON, clear the editor
        console.error('Invalid content format:', e);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const url = window.prompt('Image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLinkPreview = () => {
    // Insert an empty link preview block, it will show the input
    editor.chain().focus().insertContent({ type: 'linkPreview', attrs: { url: '' } }).run();
  };

  return (
    <div className="relative">
      {/* Bubble Menu - appears on text selection OR link active */}
      <EditorBubbleMenu editor={editor} />

      {/* Floating Menu - appears on empty lines and "/" trigger */}
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100, placement: 'bottom-start' }}
          className="flex flex-col gap-1 p-2 bg-popover border border-border rounded-lg shadow-lg min-w-[240px]"
          shouldShow={({ state, editor }) => {
            const { $from } = state.selection;
            const currentLineText = $from.nodeBefore?.textContent || '';

            // Show on empty lines OR when "/" is typed
            return editor.isEmpty || currentLineText.endsWith('/');
          }}
        >
          <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
            Turn into
          </div>
          <div className="flex flex-wrap gap-1 justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className="h-8 px-2 text-xs justify-start"
            >
              H1
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className="h-8 px-2 text-xs justify-start"
            >
              H2
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className="h-8 px-2 text-xs justify-start"
            >
              H3
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className="h-8 px-2 text-xs justify-start"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              Task List
            </Button>
          </div>

          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className="h-8 px-2 text-xs justify-start flex-1"
            >
              <List className="w-4 h-4 mr-1" />
              Bullet
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className="h-8 px-2 text-xs justify-start flex-1"
            >
              <ListOrdered className="w-4 h-4 mr-1" />
              Numbered
            </Button>
          </div>


          <div className="h-px bg-border my-1" />

          <div className="flex flex-wrap gap-1 justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className="h-8 px-2 text-xs justify-start"
            >
              <Quote className="w-4 h-4 mr-1" />
              Quote
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className="h-8 px-2 text-xs justify-start"
            >
              <Code2 className="w-4 h-4 mr-1" />
              Code Block
            </Button>

          </div>
          <div className="flex flex-wrap gap-1 justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="h-8 px-2 text-xs justify-start"
            >
              <Minus className="w-4 h-4 mr-1" />
              Divider
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={addImage}
              className="h-8 px-2 text-xs justify-start"
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Image
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={addLinkPreview}
              className="h-8 px-2 text-xs justify-start"
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              Bookmark
            </Button>
          </div>


        </FloatingMenu>
      )}

      {/* Editor Content with block handle */}
      <div className="tiptap-editor-wrapper relative">
        {editor && <BlockHandle editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TipTapEditor;
