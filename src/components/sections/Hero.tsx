import profilePhoto from "@/assets/profile-photo.png";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import TypeWriter from "@/components/ui/TypeWriter";
import { useHeroContent } from "@/hooks/useHomepageContent";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowDown, Download, Terminal } from "lucide-react";

const Hero = () => {
  const { data, isLoading, isError } = useHeroContent();

  if (isLoading) {
    return (
      <section id="home" className="relative min-h-screen flex flex-col pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-dashed-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section id="home" className="relative min-h-screen flex flex-col pt-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center">
          <p className="text-destructive mb-4">Failed to load content</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </section>
    );
  }

  const { hero, roles, techs, badges, stats, socialLinks } = data;

  const displaySocialLinks = (socialLinks || []).filter(link => link.is_visible !== false);

  const mappedSocialLinks = displaySocialLinks.map((link) => {
    let icon = null;
    if (link.icon_name) {
      // @ts-ignore
      const IconComponent = LucideIcons[link.icon_name];
      icon = IconComponent;
    }
    return {
      ...link,
      icon,
      isUpwork: link.platform.toLowerCase().includes('upwork'),
      isFiverr: link.platform.toLowerCase().includes('fiverr'),
    };
  });

  return (
    <section id="home" className="relative min-h-screen flex flex-col pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-dashed-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-hero" />

      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[80px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">{hero.greeting_badge}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Hi, I'm <span className="text-gradient-green">{hero.name}</span>
            </h1>

            <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-6 h-8 sm:h-10 font-mono">
              <span className="text-primary">&gt;</span>{" "}
              <TypeWriter words={roles.map(r => r.role_text)} typingSpeed={80} deletingSpeed={40} />
            </div>

            <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">{hero.description}</p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <Button size="lg" variant="glow" asChild className="w-full sm:w-auto min-h-[48px]">
                <a href="#contact"><Terminal className="w-4 h-4" /> Let's Talk</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto min-h-[48px]">
                <a href="#" download><Download className="w-4 h-4" /> Download CV</a>
              </Button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {mappedSocialLinks.map((social) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  {social.icon_url ? (
                    <img src={social.icon_url} alt={social.platform} className="w-5 h-5 invert opacity-70 hover:opacity-100" />
                  ) : social.icon ? (
                    <social.icon className="w-5 h-5" />
                  ) : null}
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

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                {/* Floating Tech Logos */}
                {techs.map((tech) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.9, scale: 1 }}
                    transition={{ delay: tech.delay, duration: 0.5 }}
                    whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0], transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute ${tech.position_class} ${tech.animation_class} hidden lg:block z-20 cursor-pointer`}
                  >
                    <motion.div
                      className="w-9 h-9 p-1.5 bg-card/90 border border-border/50 rounded-lg backdrop-blur-sm shadow-lg hover:border-primary/50 hover:shadow-primary/20 hover:shadow-lg transition-all duration-300"
                      whileHover={{ boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)" }}
                    >
                      {tech.icon_url && <img src={tech.icon_url} alt={tech.name} className={`w-full h-full object-contain ${tech.invert ? "invert" : ""}`} />}
                    </motion.div>
                  </motion.div>
                ))}

                {/* Floating Badges */}
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -5, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.95 }}
                    className={`${badge.position_class} hidden lg:block z-10 cursor-pointer`}
                  >
                    <motion.span
                      className="px-3 py-1 text-xs font-mono bg-card/80 border border-border/50 rounded-full text-muted-foreground backdrop-blur-sm whitespace-nowrap hover:border-primary/50 hover:text-primary transition-all duration-300 inline-block"
                      whileHover={{ boxShadow: "0 0 15px rgba(34, 197, 94, 0.3)" }}
                    >
                      {badge.badge_text}
                    </motion.span>
                  </motion.div>
                ))}

                <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/30 glow-green relative bg-gradient-to-b from-primary/20 to-transparent">
                  <img src={hero.profile_photo_url || profilePhoto} alt={hero.name} className="w-full h-full object-cover object-top" />
                </div>

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}
                  className="absolute -right-2 sm:-right-4 top-6 sm:top-8 px-3 sm:px-4 py-2 bg-card border border-primary/30 rounded-lg glow-green-sm z-10"
                >
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={stats.find(s => s.stat_label.includes('Experience'))?.stat_value || 2} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground">Years Exp.</div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2, type: "spring" }}
                  className="absolute -left-2 sm:-left-4 bottom-6 sm:bottom-8 px-3 sm:px-4 py-2 bg-card border border-primary/30 rounded-lg z-10"
                >
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={stats.find(s => s.stat_label.includes('Projects'))?.stat_value || 20} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-4 sm:p-6 bg-card/50 border border-border rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-0 md:divide-x divide-border">
            {stats.map((stat) => (
              <div key={stat.id} className="text-center px-2 sm:px-4">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  <AnimatedCounter target={stat.stat_value} suffix={stat.stat_suffix} />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.stat_label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
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
