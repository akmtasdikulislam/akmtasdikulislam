export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'checkList'
  | 'quote'
  | 'code'
  | 'image'
  | 'divider'
  | 'callout';

export interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  meta?: {
    language?: string;
    fileName?: string;
    imageUrl?: string;
    imageAlt?: string;
    calloutType?: 'info' | 'warning' | 'success' | 'tip';
    checked?: boolean; // For checkList
  };
}

export const BLOCK_MENU_OPTIONS: { type: BlockType; label: string }[] = [
  { type: 'paragraph', label: 'Text' },
  { type: 'heading1', label: 'Heading 1' },
  { type: 'heading2', label: 'Heading 2' },
  { type: 'heading3', label: 'Heading 3' },
  { type: 'bulletList', label: 'Bullet List' },
  { type: 'numberedList', label: 'Numbered List' },
  { type: 'checkList', label: 'To-do List' },
  { type: 'quote', label: 'Quote' },
  { type: 'code', label: 'Code Block' },
  { type: 'image', label: 'Image' },
  { type: 'callout', label: 'Callout' },
  { type: 'divider', label: 'Divider' },
];
