import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import {
  Code2,
  Lightbulb,
  MessageSquare,
  Shield,
  Target,
  Zap
} from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Fast & Efficient",
    description: "I deliver high-quality work quickly without compromising on standards. Time is valuable - yours and mine.",
  },
  {
    icon: Code2,
    title: "Clean Code",
    description: "I write maintainable, well-documented code following best practices and industry standards.",
  },
  {
    icon: Shield,
    title: "Reliable & Trustworthy",
    description: "Committed to deadlines and transparency. You'll always know the status of your project.",
  },
  {
    icon: MessageSquare,
    title: "Clear Communication",
    description: "Regular updates, responsive communication, and collaborative approach throughout the project.",
  },
  {
    icon: Lightbulb,
    title: "Problem Solver",
    description: "I don't just code - I think. Creative solutions to complex challenges are my forte.",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description: "Focused on delivering results that align with your business objectives and user needs.",
  },
];

const stats = [
  { value: 100, suffix: "%", label: "Client Satisfaction" },
  { value: 20, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "+", label: "Happy Clients" },
  { value: 2, suffix: "+", label: "Years Experience" },
];

const WhyChooseMe = () => {
  return (
    <section id="why-me" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Why Me"
          title="Why Choose"
          highlight="Me?"
          description="What sets me apart from the rest"
        />

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 bg-card border border-border rounded-2xl service-card group hover:border-primary/30 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                <reason.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{reason.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
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
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseMe;
