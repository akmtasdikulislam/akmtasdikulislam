import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUp, Github, Linkedin, Mail, Terminal } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#expertise" },
  { name: "Projects", href: "#projects" },
];

const services = [
  { name: "Web Development", href: "#services" },
  { name: "UI/UX Design", href: "#services" },
  { name: "n8n Automation", href: "#services" },
  { name: "E-commerce", href: "#services" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/akmtasdikulislam", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/akmtasdikulislam", label: "LinkedIn" },
  { icon: null, href: "https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2", label: "Upwork", isUpwork: true },
  { icon: null, href: "#", label: "Fiverr", isFiverr: true },
  { icon: Mail, href: "mailto:akmtasdikulislam@gmail.com", label: "Email" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 border-t border-border">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Back to top button - Centered at top */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ scale: 1.1, y: -3 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground glow-green"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column - Same logo as navbar */}
          <div className="space-y-4">
            <a href="#home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:glow-green-sm transition-all">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-wider">
                AKM<span className="text-primary">.</span>
              </span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CSE undergraduate at Bangladesh University of Professionals. Specializing in MERN stack development and n8n automation workflows.
            </p>
            {/* Social links - Updated order: GitHub, LinkedIn, Upwork, Email */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  {social.isUpwork ? (
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/upwork.svg"
                      alt="Upwork"
                      className="w-4 h-4 invert opacity-70"
                    />
                  ) : social.isFiverr ? (
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fiverr.svg"
                      alt="Fiverr"
                      className="w-4 h-4 invert opacity-70"
                    />
                  ) : (
                    <social.icon className="w-4 h-4" />
                  )}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="text-primary">&gt;</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="text-primary">&gt;</span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Let's Connect */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Let's Connect
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Interested in working together? Let's discuss your project.
            </p>
            <Button variant="glow" asChild className="w-full">
              <a href="#contact">
                <Mail className="w-4 h-4" />
                Get in Touch
              </a>
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-center text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-foreground font-medium">Akm Tasdikul Islam</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
