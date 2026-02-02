import SectionHeading from "@/components/ui/SectionHeading";
import { motion } from "framer-motion";
import {
  BookOpen,
  Bot,
  Clock,
  Code2,
  GraduationCap,
  Lightbulb,
  MapPin,
  Palette,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wrench,
  Zap
} from "lucide-react";

const highlights = [
  {
    icon: GraduationCap,
    title: "Education",
    description: "CSE at Bangladesh University of Professionals",
    detail: "3rd Semester | 2025 Batch",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Dhaka, Bangladesh",
    detail: "Available for remote work",
  },
  {
    icon: Code2,
    title: "Specialization",
    description: "Full Stack Development",
    detail: "MERN Stack & n8n Automation",
  },
  {
    icon: Zap,
    title: "Experience",
    description: "2+ Years",
    detail: "Web Development & Automation",
  },
];

const interests = [
  { icon: Code2, label: "Programming" },
  { icon: Bot, label: "Automation" },
  { icon: Palette, label: "UI/UX Design" },
  { icon: Trophy, label: "Competitive Coding" },
  { icon: BookOpen, label: "Learning" },
  { icon: Wrench, label: "Building Products" },
  { icon: Target, label: "Problem Solving" },
  { icon: Zap, label: "Web Development" },
  { icon: Lightbulb, label: "Tech Innovation" },
  { icon: Clock, label: "Productivity" },
];

const coreValues = [
  {
    icon: Target,
    value: "Goal-Driven",
    description: "Focused on delivering results"
  },
  {
    icon: Zap,
    value: "Disciplined",
    description: "Consistent and structured approach"
  },
  {
    icon: Users,
    value: "Professional",
    description: "Client-focused communication"
  },
  {
    icon: Sparkles,
    value: "Growth-Minded",
    description: "Always learning and improving"
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dashed-grid opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="About Me"
          title="Who I"
          highlight="Am?"
          description="A passionate developer who loves turning ideas into reality through code"
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
                I'm <span className="text-foreground font-semibold">Akm Tasdikul Islam</span>,
                a Computer Science & Engineering undergraduate at Bangladesh University of Professionals.
                With over 2 years of hands-on experience in web development, I specialize in building
                modern, responsive, and user-centric applications.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                My expertise spans the entire MERN stack (MongoDB, Express.js, React, Node.js),
                and I'm also proficient in n8n automation workflows. I believe in writing clean,
                maintainable code and creating seamless user experiences.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I achieved GPA 5.00 in both SSC and HSC board examinations, demonstrating my
                commitment to excellence. When I'm not coding, you'll find me exploring new
                technologies, participating in competitive programming, or building innovative
                side projects.
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
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-4 sm:p-6 bg-card border border-border rounded-xl tech-card group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-1">{item.description}</p>
                <p className="text-xs text-primary">{item.detail}</p>
              </motion.div>
            ))}
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
            <Lightbulb className="w-5 h-5 text-primary" />
            My Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-4 py-2 bg-card border border-border rounded-full flex items-center gap-2 hover:border-primary/50 transition-all group tag-chip"
              >
                <interest.icon className="w-4 h-4 text-primary" />
                <span className="text-sm">{interest.label}</span>
              </motion.div>
            ))}
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
            <Target className="w-5 h-5 text-primary" />
            Core Values
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((item, index) => (
              <motion.div
                key={item.value}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -3 }}
                className="p-5 bg-card border border-border rounded-xl text-center hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-3 group-hover:glow-green-sm transition-all">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.value}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
