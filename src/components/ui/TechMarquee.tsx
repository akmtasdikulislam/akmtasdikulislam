import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TechItem {
  name: string;
  icon: string;
}

interface TechMarqueeProps {
  items: TechItem[];
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

const TechMarquee = ({ items, direction = "left", speed = "normal", className }: TechMarqueeProps) => {
  const speedClass = {
    slow: "animate-marquee-slow",
    normal: "animate-marquee",
    fast: "animate-marquee",
  };

  const duplicatedItems = [...items, ...items];

  return (
    <div className={cn("overflow-hidden py-4", className)}>
      <motion.div
        className={`flex gap-8 ${speedClass[speed]} ${direction === "right" ? "[animation-direction:reverse]" : ""}`}
        style={{ width: "max-content" }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-8 h-8 object-contain grayscale group-hover:grayscale-0 transition-all"
            />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechMarquee;
