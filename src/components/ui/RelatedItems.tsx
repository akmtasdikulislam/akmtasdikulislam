import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface RelatedItem {
  id: string;
  title: string;
  image: string;
  category?: string;
  type: "blog" | "project";
}

interface RelatedItemsProps {
  title: string;
  items: RelatedItem[];
}

const RelatedItems = ({ title, items }: RelatedItemsProps) => {
  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-gradient-green">{title.split(" ").slice(-1)}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.type === "blog" ? `/blog/${item.id}` : `/project/${item.id}`}
                className="group block bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-4">
                  {item.category && (
                    <span className="text-xs text-primary mb-2 block">
                      {item.category}
                    </span>
                  )}
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center text-sm text-primary mt-2">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedItems;
