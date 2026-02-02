import SectionHeading from "@/components/ui/SectionHeading";
import { useAboutContent } from "@/hooks/useHomepageContent";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

const About = () => {
  const { data, isLoading, isError } = useAboutContent();

  // Show loading skeleton
  if (isLoading) {
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

  // Show error state
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
          badge={about.section_badge}
          title={about.section_title}
          highlight={about.section_highlight}
          description={about.section_description}
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
            <div className="p-4 sm:p-6 bg-card border border-border rounded-xl">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {about.paragraph_1}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {about.paragraph_2}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {about.paragraph_3}
              </p>
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
                  className="p-4 sm:p-6 bg-card border border-border rounded-xl tech-card group"
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
            {/* @ts-ignore */}
            {LucideIcons.Lightbulb && <LucideIcons.Lightbulb className="w-5 h-5 text-primary" />}
            My Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, index) => {
              // @ts-ignore - dynamic icon lookup
              const IconComponent = LucideIcons[interest.icon_name] || LucideIcons.Code2;

              return (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2 hover:border-primary/50 transition-all group tag-chip"
                >
                  <IconComponent className="w-4 h-4 text-primary" />
                  <span className="text-sm">{interest.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Core values - Row layout with icons and descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            {/* @ts-ignore */}
            {LucideIcons.Target && <LucideIcons.Target className="w-5 h-5 text-primary" />}
            Core Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((item, index) => {
              // @ts-ignore - dynamic icon lookup
              const IconComponent = LucideIcons[item.icon_name] || LucideIcons.Target;

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

export default About;
