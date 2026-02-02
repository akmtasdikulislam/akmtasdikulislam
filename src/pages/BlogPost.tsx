import MatrixDecryptLoader from "@/components/loaders/MatrixDecryptLoader";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import AuthorCard from "@/components/ui/AuthorCard";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/ui/CodeBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import GlowingParticle from "@/components/ui/GlowingParticle";
import LinkPreviewCard from "@/components/ui/LinkPreviewCard";
import RelatedItems from "@/components/ui/RelatedItems";
import TableOfContents from "@/components/ui/TableOfContents";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Bookmark, Calendar, CheckCircle, ChevronDown, Clock, FileText, Info, Lightbulb, List, Share2, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[] | null;
  read_time: number | null;
  published_at: string | null;
  created_at: string;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  cover_image: string | null;
  category: string;
}

// Helper to generate slug from heading text
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  tip: Lightbulb,
};

const calloutStyles = {
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  tip: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
};

// Helper to extract text from TipTap node
const getTipTapText = (node: any): string => {
  if (node.type === 'text') return node.text;
  if (node.content) return node.content.map(getTipTapText).join('');
  return '';
};

// Extract headings from markdown content OR JSON blocks
const extractHeadings = (content: string): { id: string; title: string; level: number }[] => {
  const headings: { id: string; title: string; level: number }[] = [];

  try {
    const parsed = JSON.parse(content);

    // TipTap JSON
    if (parsed.type === 'doc' && Array.isArray(parsed.content)) {
      parsed.content.forEach((node: any) => {
        if (node.type === 'heading') {
          const text = getTipTapText(node);
          headings.push({ id: generateHeadingId(text), title: text, level: node.attrs.level });
        }
      });
      return headings;
    }

    // Legacy JSON Blocks
    if (Array.isArray(parsed)) {
      parsed.forEach((block: any) => {
        if (block.type === 'heading1') {
          headings.push({ id: generateHeadingId(block.content), title: block.content, level: 1 });
        } else if (block.type === 'heading2') {
          headings.push({ id: generateHeadingId(block.content), title: block.content, level: 2 });
        } else if (block.type === 'heading3') {
          headings.push({ id: generateHeadingId(block.content), title: block.content, level: 3 });
        }
      });
      return headings;
    }
  } catch (e) {
    // Fallback to markdown parsing below
  }

  // Markdown Fallback
  const lines = content.split('\n');
  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);

    if (h2Match) {
      const title = h2Match[1].trim();
      headings.push({ id: generateHeadingId(title), title, level: 2 });
    } else if (h3Match) {
      const title = h3Match[1].trim();
      headings.push({ id: generateHeadingId(title), title, level: 3 });
    }
  }

  return headings;
};

const BlogPost = () => {
  const { id } = useParams(); // This is the slug
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeadingId, setActiveHeadingId] = useState<string>("");

  // Extract headings for table of contents
  const tableOfContents = useMemo(() => {
    if (!post?.content) return [];
    return extractHeadings(post.content);
  }, [post?.content]);

  // Scroll spy for active heading
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeadingId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch the blog post by slug
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', id)
          .eq('status', 'published')
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Blog post not found');
          setLoading(false);
          return;
        }

        setPost(data);

        // Fetch related posts (same category, excluding current post)
        const { data: related } = await supabase
          .from('blog_posts')
          .select('id, title, slug, cover_image, category')
          .eq('status', 'published')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);

        if (related) {
          setRelatedPosts(related);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return '';
    }
  };

  // Render TipTap Nodes
  const renderTipTapNode = (node: any, index: number): React.ReactNode => {
    const style: React.CSSProperties = {};
    if (node.attrs && node.attrs.textAlign) {
      style.textAlign = node.attrs.textAlign;
    }

    switch (node.type) {
      case 'text':
        let textNode: React.ReactNode = node.text;
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === 'bold') textNode = <strong>{textNode}</strong>;
            if (mark.type === 'italic') textNode = <em>{textNode}</em>;
            if (mark.type === 'underline') textNode = <u>{textNode}</u>;
            if (mark.type === 'strike') textNode = <s>{textNode}</s>;
            if (mark.type === 'subscript') textNode = <sub>{textNode}</sub>;
            if (mark.type === 'superscript') textNode = <sup>{textNode}</sup>;
            if (mark.type === 'textStyle' && mark.attrs?.color) textNode = <span style={{ color: mark.attrs.color }}>{textNode}</span>;
            if (mark.type === 'code') textNode = <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">{textNode}</code>;
            if (mark.type === 'link') textNode = <a href={mark.attrs.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{textNode}</a>;
            if (mark.type === 'highlight') textNode = <mark className="bg-yellow-500/30 text-inherit px-0.5 rounded">{textNode}</mark>;
          });
        }
        return textNode;

      case 'paragraph':
        return (
          <p key={index} style={style} className="text-muted-foreground leading-relaxed mb-4 text-lg">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </p>
        );
      case 'heading':
        const Level = `h${node.attrs.level}` as keyof JSX.IntrinsicElements;
        const text = getTipTapText(node);
        const id = generateHeadingId(text);
        const classes = {
          1: "text-3xl font-bold mt-10 mb-6 scroll-mt-24",
          2: "text-2xl font-bold mt-8 mb-4 flex items-center gap-3 scroll-mt-24",
          3: "text-xl font-semibold mt-6 mb-3 scroll-mt-24"
        };
        return (
          <Level key={index} id={id} style={style} className={classes[node.attrs.level as 1 | 2 | 3]}>
            {node.attrs.level === 2 && <span className="w-1 h-8 bg-primary rounded-full" />}
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </Level>
        );
      case 'bulletList':
        return (
          <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground text-lg ml-4">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </ul>
        );
      case 'orderedList':
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground text-lg ml-4">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </ol>
        );
      case 'listItem':
        return <li key={index}>{node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}</li>;
      case 'taskList':
        return (
          <ul key={index} className="space-y-2 mb-6 ml-1">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </ul>
        );
      case 'taskItem':
        return (
          <li key={index} className="flex items-start gap-2 text-muted-foreground text-lg">
            <div className={cn("mt-1.5 w-4 h-4 rounded border flex items-center justify-center pointer-events-none", node.attrs.checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40")}>
              {node.attrs.checked && <CheckCircle className="w-3 h-3" />}
            </div>
            <span className={cn(node.attrs.checked && "line-through opacity-50")}>
              {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
            </span>
          </li>
        );
      case 'codeBlock':
        return (
          <div key={index} className="my-6 rounded-lg bg-[#0d1117] border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-4">
                {/* Language Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500/50" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">{node.attrs.language || 'text'}</span>
                </div>

                {/* Filename */}
                {node.attrs.filename && (
                  <span className="text-xs text-muted-foreground border-l border-border pl-4">
                    {node.attrs.filename}
                  </span>
                )}
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
            </div>
            <div className="p-0">
              <CodeBlock
                code={getTipTapText(node)}
                language={node.attrs.language || 'typescript'}
              />
            </div>
          </div>
        );
      case 'linkPreview':
        return (
          <div key={index} className="my-8">
            <LinkPreviewCard url={node.attrs.url} />
          </div>
        );
      case 'image':
        return (
          <div key={index} className="my-8 rounded-lg overflow-hidden border border-border">
            <img
              src={node.attrs.src}
              alt={node.attrs.alt || 'Blog image'}
              className="w-full h-auto object-cover"
            />
          </div>
        );
      case 'blockquote':
        return (
          <blockquote key={index} className="border-l-4 border-primary pl-6 italic text-xl text-muted-foreground my-8 py-2">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </blockquote>
        );
      case 'horizontalRule':
        return <hr key={index} className="my-10 border-border" />;

      case 'youtube':
        return (
          <div key={index} className="my-8 rounded-lg overflow-hidden border border-border aspect-video">
            <iframe
              src={node.attrs.src}
              className="w-full h-full"
              allowFullScreen
              title="Embedded youtube video"
            />
          </div>
        );

      case 'table':
        return (
          <div key={index} className="my-8 overflow-x-auto">
            <table className="w-full border-collapse border border-border text-left">
              <tbody>
                {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
              </tbody>
            </table>
          </div>
        );
      case 'tableRow':
        return (
          <tr key={index} className="border-b border-border">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </tr>
        );
      case 'tableHeader':
        return (
          <th key={index} className="p-3 border-r border-border bg-secondary/30 font-semibold align-top h-full">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </th>
        );
      case 'tableCell':
        return (
          <td key={index} className="p-3 border-r border-border align-top h-full">
            {node.content?.map((child: any, i: number) => renderTipTapNode(child, i))}
          </td>
        );

      default:
        return null;
    }
  };

  // Improved JSON Block renderer with Markdown fallback
  const renderContent = (content: string) => {
    let parsed = null;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      // Not JSON
    }

    // TipTap Content
    if (parsed && parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed.content.map((node: any, index: number) => renderTipTapNode(node, index));
    }

    // Legacy JSON Block Content
    if (Array.isArray(parsed)) {
      return parsed.map((block: any, index: number) => {
        switch (block.type) {
          case 'heading1':
            return (
              <h1 key={block.id || index} id={generateHeadingId(block.content)} className="text-3xl font-bold mt-10 mb-6 scroll-mt-24">
                {block.content}
              </h1>
            );
          case 'heading2':
            return (
              <h2 key={block.id || index} id={generateHeadingId(block.content)} className="text-2xl font-bold mt-8 mb-4 flex items-center gap-3 scroll-mt-24">
                <span className="w-1 h-8 bg-primary rounded-full" />
                {block.content}
              </h2>
            );
          case 'heading3':
            return (
              <h3 key={block.id || index} id={generateHeadingId(block.content)} className="text-xl font-semibold mt-6 mb-3 scroll-mt-24">
                {block.content}
              </h3>
            );
          case 'paragraph':
            return (
              <p key={block.id || index} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                {renderInlineFormatting(block.content)}
              </p>
            );
          case 'image':
            return (
              <div key={block.id || index} className="my-8 rounded-lg overflow-hidden border border-border">
                <img
                  src={block.meta?.imageUrl}
                  alt={block.meta?.imageAlt || 'Blog image'}
                  className="w-full h-auto object-cover"
                />
                {block.meta?.imageAlt && (
                  <p className="p-3 text-sm text-center text-muted-foreground bg-secondary/30">
                    {block.meta.imageAlt}
                  </p>
                )}
              </div>
            );
          case 'code':
            return (
              <div key={block.id || index} className="my-6">
                <CodeBlock
                  code={block.content}
                  language={block.meta?.language || 'typescript'}
                  filename={block.meta?.fileName}
                />
              </div>
            );
          case 'callout':
            const CalloutIcon = calloutIcons[block.meta?.calloutType as keyof typeof calloutIcons] || Info;
            return (
              <div key={block.id || index} className={cn("my-6 p-4 rounded-lg border flex items-start gap-3", calloutStyles[block.meta?.calloutType as keyof typeof calloutStyles] || calloutStyles.info)}>
                <CalloutIcon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-foreground/90">
                  {renderInlineFormatting(block.content)}
                </div>
              </div>
            );
          case 'quote':
            return (
              <blockquote key={block.id || index} className="border-l-4 border-primary pl-6 italic text-xl text-muted-foreground my-8 py-2">
                "{block.content}"
              </blockquote>
            );
          case 'divider':
            return <hr key={block.id || index} className="my-10 border-border" />;
          case 'bulletList':
            return (
              <ul key={block.id || index} className="list-disc list-inside space-y-2 mb-6 text-muted-foreground text-lg ml-4">
                {block.content.split('\n').map((item: string, i: number) => (
                  <li key={i}>{renderInlineFormatting(item)}</li>
                ))}
              </ul>
            );
          case 'numberedList':
            return (
              <ol key={block.id || index} className="list-decimal list-inside space-y-2 mb-6 text-muted-foreground text-lg ml-4">
                {block.content.split('\n').map((item: string, i: number) => (
                  <li key={i}>{renderInlineFormatting(item)}</li>
                ))}
              </ol>
            );
          case 'checkList':
            return (
              <div key={block.id || index} className="space-y-2 mb-6 ml-1">
                {block.content.split('\n').map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-muted-foreground text-lg">
                    <div className="mt-1.5 w-4 h-4 rounded border border-muted-foreground/40" />
                    <span>{renderInlineFormatting(item)}</span>
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      });
    }

    // Fallback to Markdown rendering
    const elements: JSX.Element[] = [];
    let index = 0;
    let remaining = content;

    while (remaining.length > 0) {
      // Check for fenced code blocks - supports ``` with optional space and language
      const codeBlockMatch = remaining.match(/^```\s*(\w*)\n([\s\S]*?)```/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1]?.trim() || 'typescript';
        const code = codeBlockMatch[2].trimEnd();
        elements.push(
          <div key={index++} className="my-6">
            <CodeBlock code={code} language={language} />
          </div>
        );
        remaining = remaining.slice(codeBlockMatch[0].length).trimStart();
        continue;
      }

      // Find the next code block position - also support optional space
      const nextCodeBlock = remaining.search(/```\s*\w*\n/);
      const textToProcess = nextCodeBlock === -1 ? remaining : remaining.slice(0, nextCodeBlock);

      if (nextCodeBlock === 0) {
        const lineEnd = remaining.indexOf('\n');
        if (lineEnd !== -1) {
          remaining = remaining.slice(lineEnd + 1);
        } else {
          break;
        }
        continue;
      }

      const paragraphs = textToProcess.split(/\n\n+/);

      for (const paragraph of paragraphs) {
        if (!paragraph.trim()) continue;

        if (paragraph.startsWith('# ')) {
          const text = paragraph.slice(2).trim();
          const headingId = generateHeadingId(text);
          elements.push(
            <h1 key={index++} id={headingId} className="text-3xl font-bold mt-8 mb-4 scroll-mt-24">
              {text}
            </h1>
          );
          continue;
        }

        if (paragraph.startsWith('## ')) {
          const text = paragraph.slice(3).trim();
          const headingId = generateHeadingId(text);
          elements.push(
            <h2 key={index++} id={headingId} className="text-2xl font-bold mt-8 mb-4 flex items-center gap-3 scroll-mt-24">
              <span className="w-1 h-8 bg-primary rounded-full" />
              {text}
            </h2>
          );
          continue;
        }

        if (paragraph.startsWith('### ')) {
          const text = paragraph.slice(4).trim();
          const headingId = generateHeadingId(text);
          elements.push(
            <h3 key={index++} id={headingId} className="text-xl font-semibold mt-6 mb-3 scroll-mt-24">
              {text}
            </h3>
          );
          continue;
        }

        if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(line => line.startsWith('- '));
          elements.push(
            <ul key={index++} className="list-disc list-inside space-y-2 mb-4 text-muted-foreground text-lg">
              {items.map((item, i) => (
                <li key={i}>{item.slice(2)}</li>
              ))}
            </ul>
          );
          continue;
        }

        if (/^\d+\.\s/.test(paragraph)) {
          const items = paragraph.split('\n').filter(line => /^\d+\.\s/.test(line));
          elements.push(
            <ol key={index++} className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground text-lg">
              {items.map((item, i) => (
                <li key={i}>{item.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          );
          continue;
        }

        if (paragraph.startsWith('> ')) {
          const quoteText = paragraph.slice(2);
          elements.push(
            <blockquote key={index++} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 text-lg">
              {quoteText}
            </blockquote>
          );
          continue;
        }

        elements.push(
          <p key={index++} className="text-muted-foreground leading-relaxed mb-4 text-lg">
            {renderInlineFormatting(paragraph)}
          </p>
        );
      }

      if (nextCodeBlock === -1) {
        break;
      }
      remaining = remaining.slice(nextCodeBlock);
    }

    return elements;
  };

  // Render inline formatting (bold, italic, inline code, links)
  const renderInlineFormatting = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;

    while (remaining.length > 0) {
      // Check for inline code
      const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
      if (inlineCodeMatch) {
        parts.push(
          <code key={keyIndex++} className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-foreground">
            {inlineCodeMatch[1]}
          </code>
        );
        remaining = remaining.slice(inlineCodeMatch[0].length);
        continue;
      }

      // Check for bold
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        parts.push(<strong key={keyIndex++} className="font-semibold text-foreground">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // Check for italic
      const italicMatch = remaining.match(/^\*([^*]+)\*/);
      if (italicMatch) {
        parts.push(<em key={keyIndex++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // Check for links
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        parts.push(
          <a key={keyIndex++} href={linkMatch[2]} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // Regular character
      const nextSpecial = remaining.search(/[`*\[]/);
      if (nextSpecial === -1) {
        parts.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        parts.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        parts.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return parts;
  };

  if (pageLoading) {
    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          >
            <MatrixDecryptLoader onComplete={() => setPageLoading(false)} />
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => navigate('/blogs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlowingParticle />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20">
        {/* Featured hero image */}
        <div className="absolute inset-0 h-[500px] overflow-hidden">
          <img
            src={post.cover_image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop"}
            alt={post.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          {/* Back link */}
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            {/* Category badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase tracking-widest text-primary border border-primary/30 rounded-full bg-primary/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              {post.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.read_time || 5} min read
              </span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-secondary rounded-full text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ThumbsUp className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 max-w-6xl mx-auto relative">
            {/* Main content */}
            <article className="prose prose-invert max-w-3xl flex-1 min-w-0">
              {/* Mobile Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="lg:hidden mb-8 not-prose">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 bg-card border border-border rounded-xl mb-2 text-sm font-semibold hover:bg-secondary/50 transition-colors group">
                      <List className="w-4 h-4 text-primary" />
                      Table of Contents
                      <ChevronDown className="w-4 h-4 ml-auto transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <TableOfContents
                        items={tableOfContents}
                        activeId={activeHeadingId}
                        hideHeader={true}
                        className="border-none shadow-none"
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {renderContent(post.content)}
              </motion.div>

              {/* Author card */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Written by</p>
                <AuthorCard />
              </div>
            </article>

            {/* Table of Contents Sidebar */}
            {tableOfContents.length > 0 && (
              <aside className="hidden lg:block w-64 flex-shrink-0 h-fit sticky top-24">
                <TableOfContents
                  items={tableOfContents}
                  activeId={activeHeadingId}
                />
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <RelatedItems
          title="Related Articles"
          items={relatedPosts.map((p) => ({
            id: p.slug,
            title: p.title,
            image: p.cover_image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop",
            category: p.category,
            type: "blog" as const,
          }))}
        />
      )}

      <Footer />
    </div>
  );
};

export default BlogPost;
