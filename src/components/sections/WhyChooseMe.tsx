import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeading from "@/components/ui/SectionHeading";
import { useWhyChooseMeContent } from "@/hooks/useHomepageContent";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

// Using function declaration to avoid arrow function encoding issues
function WhyChooseMe() {
  const { data, isLoading, isError } = useWhyChooseMeContent();

  if (isLoading) {
    return (
      <section id="why-me" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
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
      <section id="why-me" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <p className="text-destructive">Failed to load content</p>
          </div>
        </div>
      </section>
    );
  }

  const { content, reasons, stats } = data;

  return (
    <section id="why-me" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge={content.section_badge}
          title={content.section_title}
          highlight={content.section_highlight}
          description={content.section_description}
        />

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reasons.map((reason: any, index: number) => {
            // @ts-ignore - dynamic icon lookup
            const IconComponent = LucideIcons[reason.icon_name] || LucideIcons.Target;
            
            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 bg-card border border-border rounded-2xl service-card group hover:border-primary/30 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                  <IconComponent className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats bar with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative p-8 border border-primary/20 rounded-2xl overflow-hidden mb-8"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 animated-gradient opacity-20" />

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={stat.stat_value} suffix={stat.stat_suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.stat_label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseMe;
