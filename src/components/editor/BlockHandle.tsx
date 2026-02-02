import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Editor } from '@tiptap/react';
import { CheckSquare, Code2, Copy, GripVertical, Heading1, Heading2, Heading3, List, ListOrdered, MoreHorizontal, Quote, Trash2, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface BlockHandleProps {
  editor: Editor;
}

export const BlockHandle = ({ editor }: BlockHandleProps) => {
  const [visible, setVisible] = useState(false);
  const [blockRect, setBlockRect] = useState<{ top: number; left: number; width: number; height: number }>({ top: 0, left: 0, width: 0, height: 0 });
  const [currentNode, setCurrentNode] = useState<{ node: any; pos: number } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleRef = useRef<HTMLDivElement>(null);
  const editorDomRef = useRef<HTMLElement | null>(null);
  // Refs to access latest state in event listeners without re-binding
  const menuOpenRef = useRef(menuOpen);
  const isDraggingRef = useRef(isDragging);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    if (!editor) return;
    editorDomRef.current = editor.view.dom as HTMLElement;

    const handleMouseMove = (e: MouseEvent) => {
      // If dragging or menu is open, don't update visibility logic
      if (menuOpenRef.current || isDraggingRef.current) return;

      const editorDom = editorDomRef.current;
      if (!editorDom) return;

      const editorRect = editorDom.getBoundingClientRect();

      // Define the "Active Zone"
      // We extend the left boundary to include the gutter where the handle lives
      // Notions gutter is quite wide, lets give 100px of breathing room on the left
      const GUTTER_WIDTH = 100;
      const isInsideHorizontal =
        e.clientX >= (editorRect.left - GUTTER_WIDTH) &&
        e.clientX <= (editorRect.right + 50); // slight buffer on right too

      const isInsideVertical =
        e.clientY >= editorRect.top &&
        e.clientY <= editorRect.bottom;

      if (!isInsideHorizontal || !isInsideVertical) {
        setVisible(false);
        return;
      }

      // Project the cursor X to inside the editor content to find the line
      // We use left + 10px (just inside the padding) to ensure we hit text/block logic
      const elementAtPos = editor.view.posAtCoords({
        left: editorRect.left + 50, // Probe 50px inside the editor
        top: e.clientY
      });

      if (!elementAtPos) {
        setVisible(false);
        return;
      }

      const resolvedPos = editor.state.doc.resolve(elementAtPos.pos);
      // We use logic to find the block wrapper
      // depth - 1 usually gives the block level element if we are in text
      let node = resolvedPos.node(resolvedPos.depth);
      let nodePos = resolvedPos.before(resolvedPos.depth);

      // Adjust for depth to find the top-level block (handled block)
      // We want to handle direct children of the doc usually, or at least common blocks
      // If we are deep nested, we might want to go up? 
      // For now, let's stick to the previous logic of depth matching or finding specific types?
      // Actually standard logic:
      // If node is text, we want parent.
      if (node.isText) {
        node = resolvedPos.node(resolvedPos.depth - 1);
        nodePos = resolvedPos.before(resolvedPos.depth - 1);
      }

      // Don't show for doc node itself
      if (!node || node.type.name === 'doc') {
        setVisible(false);
        return;
      }

      // Get DOM node for this block
      const domNode = editor.view.nodeDOM(nodePos);
      if (!(domNode instanceof HTMLElement)) {
        setVisible(false);
        return;
      }

      // Precise Vertical Check
      // Only show if the mouse is actually vertically aligned with THIS specific block
      // This prevents the "nearest neighbor" logic of posAtCoords from keeping the handle 
      // on the last block when you hover way below it within the editor rect.
      const nodeRect = domNode.getBoundingClientRect();
      const isVerticallyAligned =
        e.clientY >= nodeRect.top &&
        e.clientY <= (nodeRect.bottom); // slightly loose

      if (!isVerticallyAligned) {
        // If we are not over this specific node, maybe we are in the gap?
        // For now, let's hide to be precise.
        // Or we might want to try finding the node exactly at Y?
        // posAtCoords usually does that.
        // If posAtCoords found a node, but the mouse Y is outside that node's rect, 
        // it means posAtCoords snapped to nearest.
        setVisible(false);
        return;
      }

      setCurrentNode({ node, pos: nodePos });

      setBlockRect({
        top: nodeRect.top - editorRect.top,
        left: nodeRect.left - editorRect.left,
        width: nodeRect.width,
        height: nodeRect.height,
      });
      setVisible(true);
    };

    // We attach to window/document to ensure we catch gutter movements
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [editor]);

  const deleteBlock = () => {
    if (!currentNode) return;
    const { pos, node } = currentNode;
    editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
  };

  const duplicateBlock = () => {
    if (!currentNode) return;
    const { pos, node } = currentNode;
    editor.chain().focus().insertContentAt(pos + node.nodeSize, node.toJSON()).run();
  };

  const turnInto = (type: string, level?: 1 | 2 | 3) => {
    if (!currentNode) return;

    // Select the node first
    editor.chain().focus().setTextSelection(currentNode.pos).run();

    switch (type) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading':
        if (level) editor.chain().focus().setHeading({ level }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'taskList':
        editor.chain().focus().toggleTaskList().run();
        break;
      case 'blockquote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'codeBlock':
        editor.chain().focus().toggleCodeBlock().run();
        break;
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    if (!currentNode) return;

    setIsDragging(true);

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-tiptap-node', JSON.stringify({
      nodeJSON: currentNode.node.toJSON(),
      fromPos: currentNode.pos,
    }));
    // Fallback for native handlers (like Dropcursor) to recognize this is a draggable item
    e.dataTransfer.setData('text/plain', currentNode.node.textContent);

    // Create a custom drag image from the actual block content
    const domNode = editor.view.nodeDOM(currentNode.pos) as HTMLElement;
    if (domNode) {
      const rect = domNode.getBoundingClientRect();

      const dragWrapper = document.createElement('div');
      dragWrapper.className = 'prose prose-lg dark:prose-invert'; // Add prose classes for styling
      dragWrapper.style.position = 'absolute';
      dragWrapper.style.top = '-10000px';
      dragWrapper.style.left = '-10000px';
      dragWrapper.style.width = `${rect.width}px`;
      // dragWrapper.style.height = `${rect.height}px`; // Let height be auto
      dragWrapper.style.backgroundColor = 'hsl(var(--background))';
      // vivid styling to make it very visible
      dragWrapper.style.border = '2px solid hsl(var(--primary))';
      dragWrapper.style.borderRadius = '0.5rem';
      dragWrapper.style.padding = '1rem'; // Add some padding
      dragWrapper.style.boxShadow = '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.2)'; // Deep shadow
      dragWrapper.style.opacity = '1';
      dragWrapper.style.zIndex = '9999';
      dragWrapper.style.pointerEvents = 'none';
      // Add a transform to simulate lifting
      dragWrapper.style.transform = 'scale(1.02) rotate(1deg)';
      dragWrapper.style.transformOrigin = 'center';

      // Clone the block content
      const clone = domNode.cloneNode(true) as HTMLElement;
      clone.style.margin = '0';
      dragWrapper.appendChild(clone);

      document.body.appendChild(dragWrapper);

      // Offset the drag image so the cursor is on the left
      e.dataTransfer.setDragImage(dragWrapper, 0, 0);

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(dragWrapper);
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };


  if (!visible && !menuOpen && !isDragging) return null;
  // Note: We might return null if currentNode is lost, but we generally keep currentNode state until new one is found.
  // Although if !visible (which means mouse moved away), and !menuOpen/!isDragging, we DO want to hide.
  // But inside JSX we check if (!visible || !currentNode).
  // We should change this check logic.
  // Actually, if we force 'visible' to be true/unmount condition....

  // Logic:
  // If we are dragging or menu is open, we MUST render, even if 'visible' (calculated from mouse move) is false.
  const shouldRender = (visible && currentNode) || (menuOpen && currentNode) || (isDragging && currentNode);

  if (!shouldRender || !currentNode) return null;

  return (
    <div
      ref={handleRef}
      className="block-handle-overlay pointer-events-none"
      style={{
        position: 'absolute',
        top: `${blockRect.top}px`,
        left: `${blockRect.left}px`,
        width: `${blockRect.width}px`,
        height: `${blockRect.height}px`,
        zIndex: 50,
      }}
      onDragOver={handleDragOver}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        if (!menuOpen && !isDragging) {
          setVisible(false);
        }
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-4 p-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-grab active:cursor-grabbing pointer-events-auto absolute -left-8 top-1 transition-colors"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4" />
      </Button>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer pointer-events-auto absolute right-0 top-1 transition-colors"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={deleteBlock} className="text-destructive focus:text-destructive focus:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={duplicateBlock}>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="w-4 h-4 mr-2" />
              Turn into
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => turnInto('paragraph')}>
                <Type className="w-4 h-4 mr-2" />
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('heading', 1)}>
                <Heading1 className="w-4 h-4 mr-2" />
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('heading', 2)}>
                <Heading2 className="w-4 h-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('heading', 3)}>
                <Heading3 className="w-4 h-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => turnInto('bulletList')}>
                <List className="w-4 h-4 mr-2" />
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('orderedList')}>
                <ListOrdered className="w-4 h-4 mr-2" />
                Numbered List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('taskList')}>
                <CheckSquare className="w-4 h-4 mr-2" />
                Task List
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => turnInto('blockquote')}>
                <Quote className="w-4 h-4 mr-2" />
                Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => turnInto('codeBlock')}>
                <Code2 className="w-4 h-4 mr-2" />
                Code Block
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
