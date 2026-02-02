import SectionHeading from "@/components/ui/SectionHeading";
import TechMarquee from "@/components/ui/TechMarquee";
import { motion } from "framer-motion";

const expertiseCategories = [
  {
    title: "Frontend",
    color: "primary",
    techs: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
      { name: "Bootstrap", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
      { name: "Sass", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
      { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    ],
  },
  {
    title: "Frameworks and Integrations",
    color: "accent",
    techs: [
      { name: "Material UI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
      { name: "Shadcn UI", icon: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4", invert: true },
      { name: "DaisyUI", icon: "https://img.daisyui.com/images/daisyui-logo/daisyui-logomark.svg" },
      { name: "Three.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg", invert: true },
      { name: "Mapbox", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Mapbox_logo_2019.svg/3840px-Mapbox_logo_2019.svg.png", invert: true, size: "w-16 h-8" },
      { name: "Radar", icon: "https://cdn.prod.website-files.com/6750910fb09989bf4799d719/678fd15ea9602bbb73d63c25_Radar.svg", size: "w-16 h-8", invert: true, grayscale: true },
      { name: "Stripe", icon: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", size: "w-12 h-8" },
      { name: "SSLCommerz", icon: "https://sslcommerz.com/wp-content/uploads/2021/11/logo.png", size: "w-20 h-8" },
    ],
  },
  {
    title: "Backend & Database",
    color: "destructive",
    techs: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
      { name: "Django", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg", invert: true },
      { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
      { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Supabase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
    ],
  },
  {
    title: "Tools & Platforms",
    color: "primary",
    techs: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "n8n", icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/n8n-color.png" },
      { name: "Wordpress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg", invert: true },
      { name: "Arduino", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
      { name: "Photoshop", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
      { name: "Illustrator", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg" },
    ],
  },
];

const programmingLanguages = [
  { name: "C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
];

const allTechs = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
];

const Expertise = () => {
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

        {/* Tech Marquee */}
        <div className="mb-12 -mx-4 md:mx-0">
          <TechMarquee items={allTechs} direction="left" speed="normal" />
          <TechMarquee items={programmingLanguages} direction="right" speed="slow" />
        </div>

        {/* Programming Languages Section */}
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
                key={lang.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all min-w-[100px]"
              >
                <img
                  src={lang.icon}
                  alt={lang.name}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm text-muted-foreground">
                  {lang.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {expertiseCategories.map((category, categoryIndex) => (
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
                {category.techs.map((tech: any, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + techIndex * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center gap-2 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/60 transition-colors"
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className={`object-contain ${tech.size || "w-8 h-8"} ${tech.invert ? "invert" : ""} ${tech.grayscale ? "grayscale" : ""}`}
                    />
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
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
              title: "MERN Stack",
              description: "Full-stack development with MongoDB, Express, React, and Node.js",
            },
            {
              icon: "https://avatars.githubusercontent.com/u/45487711?s=200&v=4",
              title: "n8n Automation",
              description: "Building AI-powered workflows and business process automation",
            },
            {
              icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
              title: "UI/UX Design",
              description: "Creating beautiful, user-centric interfaces with modern tools",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -8 }}
              className="p-6 bg-gradient-to-br from-card to-secondary/20 border border-border rounded-2xl group hover:border-primary/50 transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:glow-green-sm transition-all">
                <img src={item.icon} alt={item.title} className="w-10 h-10 object-contain" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Expertise;
