import SectionHeading from "@/components/ui/SectionHeading";
import { useAboutContent, useSectionHeading } from "@/hooks/useHomepageContent";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import React from 'react';

const About = () => {
  const { data, isLoading: aboutLoading, isError } = useAboutContent();
  const { data: heading, isLoading: headingLoading } = useSectionHeading('about');

  if (aboutLoading || headingLoading) {
    return (
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-dashed-grid opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-destructive">Failed to load about content</p>
          </div>
        </div>
      </section>
    );
  }

  const { about, highlights, interests, values } = data;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dashed-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge={heading?.section_badge || about.section_badge}
          title={heading?.section_title || about.section_title}
          highlight={heading?.section_highlight || about.section_highlight}
          description={heading?.section_description || about.section_description}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - About text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="text-muted-foreground leading-relaxed">
                {renderContent(about.main_content || '')}
              </div>
            </div>
          </motion.div>

          {/* Right - Highlights grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => {
              // @ts-ignore - dynamic icon lookup
              const IconComponent = LucideIcons[item.icon_name] || LucideIcons.Code2;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-card border border-border rounded-xl tech-card group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-1">{item.description}</p>
                  <p className="text-xs text-primary">{item.detail}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Interests - Full width row layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LucideIcons.Lightbulb className="w-5 h-5 text-primary" />
            My Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {interests.map((item, index) => {
              // @ts-ignore
              const IconComponent = LucideIcons[item.icon_name] || LucideIcons.Heart;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2 hover:border-primary/50 transition-all group tag-chip cursor-default"
                >
                  <IconComponent className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Core values - Row layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <LucideIcons.Target className="w-5 h-5 text-primary" />
            Core Values
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((item, index) => {
              // @ts-ignore
              const IconComponent = LucideIcons[item.icon_name] || LucideIcons.Zap;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="p-5 bg-card border border-border rounded-xl text-center hover:border-primary/30 transition-colors group"
                >
                  <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 group-hover:glow-green-sm transition-all">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{item.value_text}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- TipTap Rendering Helpers ---

const renderContent = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && parsed.type === 'doc' && Array.isArray(parsed.content)) {
      return parsed.content.map((node: any, index: number) => renderTipTapNode(node, index));
    }
    return <div className="whitespace-pre-line">{content}</div>;
  } catch (e) {
    return <div className="whitespace-pre-line">{content}</div>;
  }
};

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
          if (mark.type === 'bold') textNode = <strong key={mark.type}>{textNode}</strong>;
          if (mark.type === 'italic') textNode = <em key={mark.type}>{textNode}</em>;
          if (mark.type === 'underline') textNode = <u key={mark.type}>{textNode}</u>;
          if (mark.type === 'link') textNode = (
            <a
              key={mark.type}
              href={mark.attrs.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-all"
            >
              {textNode}
            </a>
          );
        });
      }
      return textNode;

    case 'paragraph':
      return (
        <p key={index} style={style} className="mb-4 last:mb-0">
          {node.content?.map((child: any, i: number) => (
            <React.Fragment key={i}>{renderTipTapNode(child, i)}</React.Fragment>
          ))}
        </p>
      );

    case 'bulletList':
      return (
        <ul key={index} className="list-disc list-inside space-y-1 mb-4 ml-2">
          {node.content?.map((child: any, i: number) => (
            <React.Fragment key={i}>{renderTipTapNode(child, i)}</React.Fragment>
          ))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={index} className="list-decimal list-inside space-y-1 mb-4 ml-2">
          {node.content?.map((child: any, i: number) => (
            <React.Fragment key={i}>{renderTipTapNode(child, i)}</React.Fragment>
          ))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={index}>
          {node.content?.map((child: any, i: number) => (
            <React.Fragment key={i}>{renderTipTapNode(child, i)}</React.Fragment>
          ))}
        </li>
      );

    case 'heading':
      const Level = `h${node.attrs.level}` as keyof JSX.IntrinsicElements;
      const classes = {
        1: "text-2xl font-bold mb-4",
        2: "text-xl font-bold mb-3",
        3: "text-lg font-semibold mb-2"
      };
      return (
        <Level key={index} style={style} className={(classes as any)[node.attrs.level]}>
          {node.content?.map((child: any, i: number) => (
            <React.Fragment key={i}>{renderTipTapNode(child, i)}</React.Fragment>
          ))}
        </Level>
      );

    default:
      return null;
  }
};

export default About;

