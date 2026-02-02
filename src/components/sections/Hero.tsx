import profilePhoto from "@/assets/profile-photo.png";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import TypeWriter from "@/components/ui/TypeWriter";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Terminal } from "lucide-react";

const roles = [
  "Full Stack Developer",
  "MERN Stack Expert",
  "n8n Automation Specialist",
  "AI Agent & Chatbot Builder",
  "Problem Solver",
];

const socialLinks = [
  { icon: Github, href: "https://github.com/akmtasdikulislam", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/akmtasdikulislam", label: "LinkedIn" },
  { icon: null, href: "https://www.upwork.com/freelancers/~01fe1fc80c8877ffe2", label: "Upwork", isUpwork: true },
  { icon: null, href: "#", label: "Fiverr", isFiverr: true },
  { icon: Mail, href: "mailto:akmtasdikulislam@gmail.com", label: "Email" },
];

// 10 logos positioned in a circle (every 36 degrees) around the photo
// Using CSS transforms with calculated positions for even circular distribution
const floatingTechLogos = [
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    // 0° - Top center
    position: "left-1/2 -translate-x-1/2 -top-20 md:-top-24",
    animation: "animate-float-1",
    delay: 0,
  },
  {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    invert: true,
    // 36° - Top right
    position: "right-0 -top-14 md:-top-16 translate-x-8 md:translate-x-12",
    animation: "animate-float-2",
    delay: 0.5,
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    // 72° - Right upper
    position: "-right-16 md:-right-20 top-8 md:top-10",
    animation: "animate-float-3",
    delay: 1,
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    // 108° - Right middle
    position: "-right-18 md:-right-24 top-1/2 -translate-y-1/2",
    animation: "animate-float-1",
    delay: 1.5,
  },
  {
    name: "n8n",
    icon: "https://avatars.githubusercontent.com/u/45487711?s=200&v=4",
    // 144° - Right lower
    position: "-right-16 md:-right-20 bottom-8 md:bottom-10",
    animation: "animate-float-2",
    delay: 2,
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    // 180° - Bottom right
    position: "right-0 -bottom-14 md:-bottom-16 translate-x-8 md:translate-x-12",
    animation: "animate-float-3",
    delay: 0.8,
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    invert: true,
    // 216° - Bottom center
    position: "left-1/2 -translate-x-1/2 -bottom-20 md:-bottom-24",
    animation: "animate-float-1",
    delay: 1.2,
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    // 252° - Bottom left
    position: "left-0 -bottom-14 md:-bottom-16 -translate-x-8 md:-translate-x-12",
    animation: "animate-float-2",
    delay: 0.3,
  },
  {
    name: "Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    // 288° - Left lower
    position: "-left-16 md:-left-20 bottom-8 md:bottom-10",
    animation: "animate-float-1",
    delay: 0.6,
  },
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    // 324° - Left middle
    position: "-left-18 md:-left-24 top-1/2 -translate-y-1/2",
    animation: "animate-float-3",
    delay: 1.8,
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    // Extra - Left upper
    position: "-left-16 md:-left-20 top-8 md:top-10",
    animation: "animate-float-2",
    delay: 1.4,
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    // Extra - Top left
    position: "left-0 -top-14 md:-top-16 -translate-x-8 md:-translate-x-12",
    animation: "animate-float-3",
    delay: 0.9,
  },
];

// Floating text badges positioned in corners (away from logos)
const floatingBadges = [
  { text: "System Builder", position: "absolute -top-8 -right-32 md:-right-44" },
  { text: "MERN Expert", position: "absolute top-1/3 -left-36 md:-left-48" },
  { text: "Workflow Expert", position: "absolute bottom-1/3 -right-32 md:-right-44" },
  { text: "SaaS Builder", position: "absolute -bottom-8 -left-32 md:-left-44" },
];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col pt-20 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-dashed-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Animated background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col">
        <div className="grid lg:grid-cols-2 gap-12 items-center flex-1">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1"
          >
            {/* Greeting badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Available for Freelance & Remote Work</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Hi, I'm{" "}
              <span className="text-gradient-green">Akm Tasdikul Islam</span>
            </h1>

            {/* Typing animation */}
            <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 h-8 sm:h-10 font-mono">
              <span className="text-primary">&gt;</span>{" "}
              <TypeWriter words={roles} typingSpeed={80} deletingSpeed={40} />
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
              CSE undergraduate at Bangladesh University of Professionals with 2+ years of experience
              building modern web applications. Passionate about clean code, automation, and creating
              exceptional digital experiences.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <Button size="lg" variant="glow" asChild className="w-full sm:w-auto min-h-[48px]">
                <a href="#contact">
                  <Terminal className="w-4 h-4" />
                  Let's Talk
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-h-[48px]">
                <a href="#" download>
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </Button>
            </div>

            {/* Social links - Updated order */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  {social.isUpwork ? (
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/upwork.svg"
                      alt="Upwork"
                      className="w-5 h-5 invert opacity-70 group-hover:opacity-100"
                    />
                  ) : social.isFiverr ? (
                    <img
                      src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/fiverr.svg"
                      alt="Fiverr"
                      className="w-5 h-5 invert opacity-70 group-hover:opacity-100"
                    />
                  ) : (
                    <social.icon className="w-5 h-5" />
                  )}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right content - Photo with floating tech logos */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Decorative rings */}
              <motion.div
                className="absolute inset-0 border-2 border-primary/20 rounded-full"
                style={{ width: "120%", height: "120%", left: "-10%", top: "-10%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 border border-dashed border-primary/30 rounded-full"
                style={{ width: "140%", height: "140%", left: "-20%", top: "-20%" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Photo container with floating logos around it */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Floating tech logos close to the photo with micro-interactions - Hidden on mobile to prevent overflow */}
                {floatingTechLogos.map((tech) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ delay: tech.delay, duration: 0.5 }}
                    whileHover={{
                      scale: 1.3,
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute ${tech.position} ${tech.animation} hidden lg:block z-20 cursor-pointer`}
                  >
                    <motion.div
                      className="w-9 h-9 p-1.5 bg-card/90 border border-border/50 rounded-lg backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300"
                      whileHover={{
                        boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)"
                      }}
                    >
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className={`w-full h-full object-contain ${tech.invert ? "invert" : ""}`}
                      />
                    </motion.div>
                  </motion.div>
                ))}

                {/* Floating text badges with micro-interactions */}
                {floatingBadges.map((badge, index) => (
                  <motion.div
                    key={badge.text}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`${badge.position} hidden lg:block z-10 cursor-pointer`}
                  >
                    <motion.span
                      className="px-3 py-1 text-xs font-mono bg-card/80 border border-border/50 rounded-full text-muted-foreground backdrop-blur-sm whitespace-nowrap hover:border-primary/50 hover:text-primary transition-all duration-300 inline-block"
                      whileHover={{
                        boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)"
                      }}
                    >
                      {badge.text}
                    </motion.span>
                  </motion.div>
                ))}

                <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 glow-green relative bg-gradient-to-b from-primary/20 to-transparent">
                  <img
                    src={profilePhoto}
                    alt="Akm Tasdikul Islam"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Experience badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute -right-2 sm:-right-4 top-6 sm:top-8 px-3 sm:px-4 py-2 bg-card border border-primary/30 rounded-lg glow-green-sm z-10"
                >
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={2} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground">Years Exp.</div>
                </motion.div>

                {/* Projects badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  className="absolute -left-2 sm:-left-4 bottom-6 sm:bottom-8 px-3 sm:px-4 py-2 bg-card border border-primary/30 rounded-lg z-10"
                >
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={20} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row - Single container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-4 sm:p-6 bg-card/50 border border-border rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-0 md:divide-x divide-border">
            {[
              { label: "Client Satisfaction", value: 100, suffix: "%" },
              { label: "Projects Completed", value: 20, suffix: "+" },
              { label: "Technologies", value: 15, suffix: "+" },
              { label: "Years Experience", value: 2, suffix: "+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center px-2 sm:px-4"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator - Fixed to bottom of viewport */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="py-8 hidden md:flex justify-center"
        >
          <motion.a
            href="#about"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-xs uppercase tracking-widest">Scroll Down</span>
            <ArrowDown className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
