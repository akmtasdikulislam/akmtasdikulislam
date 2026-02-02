import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading = ({
  badge,
  title,
  highlight,
  description,
  align = "center",
}: SectionHeadingProps) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col gap-4 ${alignClass} mb-12`}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs uppercase tracking-widest text-primary border border-primary/30 rounded-full bg-primary/5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
        {title}{" "}
        {highlight && <span className="text-gradient-green">{highlight}</span>}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
