import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  'typescript',
  'javascript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'html',
  'css',
  'scss',
  'json',
  'yaml',
  'markdown',
  'bash', 
  'shell',
  'sql',
  'plaintext',
];

export default ({ node, updateAttributes, editor }: any) => {
  const [language, setLanguage] = useState(node.attrs.language || 'typescript');
  const [filename, setFilename] = useState(node.attrs.filename || '');

  useEffect(() => {
    setLanguage(node.attrs.language || 'typescript');
    setFilename(node.attrs.filename || '');
  }, [node.attrs.language, node.attrs.filename]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateAttributes({ language: value });
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilename(value);
    updateAttributes({ filename: value });
  };

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="rounded-lg bg-[#0d1117] border border-border overflow-hidden my-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2">
            <Select
              value={language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="h-7 w-32 text-xs bg-transparent border-muted">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={filename}
              onChange={handleFilenameChange}
              placeholder="Filename (optional)"
              className="h-7 w-48 text-xs bg-transparent border-muted"
              contentEditable={false}
            />
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
        </div>

        {/* Code Content */}
        <NodeViewContent className="code-content-editable w-full min-h-[120px] p-4 bg-transparent font-mono text-sm text-green-400 overflow-x-auto block whitespace-pre-wrap" />
      </div>
    </NodeViewWrapper>
  );
};
