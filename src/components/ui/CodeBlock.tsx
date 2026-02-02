import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

// Kamekazi Dark theme colors
const themeColors = {
  background: "#282c34",
  foreground: "#abb2bf",
  lineNumbers: "#495162",
  cursor: "#528bff",
  selection: "#677696",
  keyword: "#c678dd",
  function: "#61afef",
  string: "#98c379",
  variable: "#e06c75",
  className: "#d19a66",
  number: "#d19a66",
  operator: "#56b6c2",
  comment: "#7f848e",
  punctuation: "#abb2bf",
  property: "#e06c75",
};

// Simple syntax highlighter for TypeScript/JavaScript
const highlightCode = (code: string): JSX.Element[] => {
  const lines = code.split("\n");
  
  return lines.map((line, lineIndex) => {
    const tokens: JSX.Element[] = [];
    let remaining = line;
    let keyIndex = 0;

    // Pattern matching for syntax highlighting
    const patterns: { regex: RegExp; color: string }[] = [
      // Comments
      { regex: /^(\/\/.*)/, color: themeColors.comment },
      // Strings (double quotes)
      { regex: /^("[^"]*")/, color: themeColors.string },
      // Strings (single quotes)
      { regex: /^('[^']*')/, color: themeColors.string },
      // Strings (template literals)
      { regex: /^(`[^`]*`)/, color: themeColors.string },
      // Keywords
      { regex: /^(const|let|var|function|async|await|return|import|export|from|default|if|else|for|while|class|interface|type|extends|implements|new|this|super|try|catch|throw|typeof|instanceof)\b/, color: themeColors.keyword },
      // Boolean/null
      { regex: /^(true|false|null|undefined)\b/, color: themeColors.variable },
      // Numbers
      { regex: /^(\d+\.?\d*)/, color: themeColors.number },
      // Function calls
      { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/, color: themeColors.function },
      // Property access
      { regex: /^\.([a-zA-Z_][a-zA-Z0-9_]*)/, color: themeColors.property },
      // Type annotations
      { regex: /^:\s*([A-Z][a-zA-Z0-9_<>[\],\s]*)/, color: themeColors.className },
      // Operators
      { regex: /^([=+\-*/<>!&|?:]+)/, color: themeColors.operator },
      // Punctuation
      { regex: /^([{}[\]();,])/, color: themeColors.punctuation },
      // JSX tags
      { regex: /^(<\/?[A-Z][a-zA-Z0-9]*)/, color: themeColors.className },
      { regex: /^(<\/?[a-z][a-zA-Z0-9-]*)/, color: themeColors.property },
      // Identifiers (catch-all)
      { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)/, color: themeColors.foreground },
      // Whitespace
      { regex: /^(\s+)/, color: themeColors.foreground },
    ];

    while (remaining.length > 0) {
      let matched = false;

      for (const { regex, color } of patterns) {
        const match = remaining.match(regex);
        if (match) {
          const text = match[1] || match[0];
          tokens.push(
            <span key={`${lineIndex}-${keyIndex++}`} style={{ color }}>
              {text}
            </span>
          );
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Handle unmatched character
        tokens.push(
          <span key={`${lineIndex}-${keyIndex++}`} style={{ color: themeColors.foreground }}>
            {remaining[0]}
          </span>
        );
        remaining = remaining.slice(1);
      }
    }

    return (
      <div key={lineIndex} className="table-row">
        <span 
          className="table-cell pr-4 text-right select-none text-xs"
          style={{ color: themeColors.lineNumbers }}
        >
          {lineIndex + 1}
        </span>
        <span className="table-cell">{tokens}</span>
      </div>
    );
  });
};

const CodeBlock = ({ code, language = "typescript", filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="relative group rounded-lg overflow-hidden border border-border"
      style={{ backgroundColor: themeColors.background }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-2 border-b border-border"
        style={{ backgroundColor: "#111111" }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ff5f56" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ffbd2e" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27c93f" }} />
          </div>
          {filename && (
            <span 
              className="text-xs font-mono ml-3"
              style={{ color: themeColors.comment }}
            >
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4" style={{ color: "#98c379" }} />
          ) : (
            <Copy className="w-4 h-4" style={{ color: themeColors.comment }} />
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre 
          className="p-4 text-sm font-mono leading-relaxed table"
          style={{ color: themeColors.foreground }}
        >
          <code>{highlightCode(code)}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
