import SectionHeading from "@/components/ui/SectionHeading";
import TechMarquee from "@/components/ui/TechMarquee";
import { useExpertiseContent } from "@/hooks/useHomepageContent";
import { motion } from "framer-motion";

const Expertise = () => {
  const { data, isLoading } = useExpertiseContent();

  if (isLoading) return null;

  const techs = data?.techs || [];
  const cards = data?.cards || [];

  // Filter techs
  const programmingLanguages = techs.filter(t => t.category === 'Language');

  // Marquee Logic (Split into two rows)
  const marqueeTechs = techs.filter(t => t.is_marquee !== false); // Default to true if null
  const half = Math.ceil(marqueeTechs.length / 2);
  const row1 = marqueeTechs.slice(0, half).map(t => ({ ...t, icon: t.icon_url || '' }));
  const row2 = marqueeTechs.slice(half).map(t => ({ ...t, icon: t.icon_url || '' }));

  // Category Logic
  const categoryMap: Record<string, { title: string; color: string }> = {
    'frontend': { title: 'Frontend', color: 'primary' },
    'framework': { title: 'Frameworks and Integrations', color: 'accent' },
    'backend': { title: 'Backend & Database', color: 'destructive' },
    'tools': { title: 'Tools & Platforms', color: 'primary' }
  };

  const normalize = (s: string) => s ? s.toLowerCase() : '';

  const displayCategories = ['frontend', 'framework', 'backend', 'tools'].map(key => {
    const categoryTechs = techs.filter(t =>
      normalize(t.category) === key &&
      (t.in_expertise_grid !== false) // Default to true if null
    );

    return {
      ...categoryMap[key],
      techs: categoryTechs
    };
  }).filter(cat => cat.techs.length > 0);

  return (
    <section id="expertise" className="py-24 relative overflow-hidden bg-secondary/10">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeading
          badge="My Skills"
          title="Tech"
          highlight="Expertise"
          description="Technologies and tools I work with to bring ideas to life"
        />

        {/* Tech Marquee - Dual Rows */}
        <div className="mb-12 -mx-4 md:mx-0 space-y-0">
          <TechMarquee items={row1} direction="left" speed="normal" className="py-2" />
          <TechMarquee items={row2} direction="right" speed="slow" className="py-2" />
        </div>

        {/* Programming Languages Section */}
        {programmingLanguages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-xl font-semibold mb-6 text-center">
              <span className="text-muted-foreground">Programming</span>{" "}
              <span className="text-primary">Languages</span>
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {programmingLanguages.map((lang, index) => (
                <motion.div
                  key={lang.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all min-w-[100px]"
                >
                  {lang.icon_url && <img
                    src={lang.icon_url}
                    alt={lang.name}
                    className={`w-10 h-10 object-contain ${lang.invert_icon ? "invert" : ""}`}
                  />}
                  <span className="text-sm text-muted-foreground">
                    {lang.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {displayCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors group"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full bg-${category.color}`} />
                {category.title}
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {category.techs.map((tech: any, techIndex: number) => (
                  <motion.div
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/60 transition-colors"
                  >
                    {tech.icon_url && <img
                      src={tech.icon_url}
                      alt={tech.name}
                      className={`object-contain w-8 h-8 ${tech.invert_icon ? "invert" : ""}`}
                    />}
                    <span className="text-xs text-muted-foreground text-center">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special expertise cards */}
        {cards.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {cards.map((item: any, index: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-6 bg-gradient-to-br from-card to-secondary/20 border border-border rounded-2xl group hover:border-primary/50 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                  {item.icon_url && <img src={item.icon_url} alt={item.title} className="w-10 h-10 object-contain" />}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Expertise;
