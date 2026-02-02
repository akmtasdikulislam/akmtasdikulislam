import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Database,
  Globe,
  MessageSquare,
  Palette,
  ShoppingCart,
  Smartphone,
  Workflow
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Full Stack Web Development",
    description: "End-to-end web application development using modern technologies like React, Node.js, and databases. From concept to deployment.",
    features: ["Custom Web Apps", "REST APIs", "Database Design", "Cloud Deployment"],
  },
  {
    icon: Smartphone,
    title: "Responsive Web Design",
    description: "Beautiful, mobile-first websites that look stunning on all devices. Pixel-perfect implementation of your designs.",
    features: ["Mobile-First", "Cross-Browser", "Performance Optimized", "SEO Ready"],
  },
  {
    icon: Workflow,
    title: "n8n Automation",
    description: "Build powerful AI-driven workflows and automate repetitive tasks. Integrate multiple services seamlessly.",
    features: ["Workflow Design", "AI Integration", "API Connections", "Process Automation"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Solutions",
    description: "Custom online stores with secure payment integration, inventory management, and seamless user experience.",
    features: ["Custom Storefronts", "Payment Integration", "Inventory System", "Order Management"],
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Robust server-side solutions with secure APIs, authentication systems, and efficient database management.",
    features: ["API Development", "Authentication", "Database Design", "Security"],
  },
  {
    icon: Palette,
    title: "UI/UX Implementation",
    description: "Transform Figma, Adobe XD, or any design into pixel-perfect, interactive web interfaces.",
    features: ["Design to Code", "Interactive UI", "Animations", "Accessibility"],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 relative overflow-hidden bg-secondary/10">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="Services"
          title="How Can I"
          highlight="Help You?"
          description="Comprehensive solutions tailored to your needs"
        />

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative p-6 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 text-xs bg-secondary border border-transparent rounded-md text-muted-foreground tag-chip"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </motion.div>
          ))}
        </div>

        {/* CTA Section with animated gradient */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative p-8 md:p-12 border border-primary/30 rounded-3xl overflow-hidden"
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0 animated-gradient opacity-30" />

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Your{" "}
              <span className="text-gradient-green">Project?</span>
            </h3>
            <p className="text-muted-foreground mb-8">
              Let's discuss how I can help bring your ideas to life. Whether it's a
              new project or improving an existing one, I'm here to help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="glow" asChild>
                <a href="#contact">
                  <MessageSquare className="w-5 h-5" />
                  Get In Touch
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#projects">
                  <Globe className="w-5 h-5" />
                  View Projects
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
