import { motion } from "framer-motion";
import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  title: string;
  level?: number;
}

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  hideHeader?: boolean;
  className?: string; // Allow overriding styles
}

const TableOfContents = ({ items, activeId, hideHeader = false, className }: TableOfContentsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Update indicator position based on actual button positions
  useEffect(() => {
    if (!activeId || !containerRef.current) return;

    const activeButton = containerRef.current.querySelector(
      `[data-toc-id="${activeId}"]`
    ) as HTMLButtonElement;

    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicatorStyle({
        top: buttonRect.top - containerRect.top,
        height: buttonRect.height,
      });
    }
  }, [activeId, items]);

  return (
    <div
      className={`bg-card border border-border rounded-xl p-3 sm:p-4 max-h-[calc(100vh-120px)] overflow-y-auto ${className || ''}`}
    >
      {!hideHeader && (
        <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-border">
          <List className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm font-semibold">Table of Contents</span>
        </div>
      )}
      <nav ref={containerRef} className="relative">
        {/* Dynamic indicator line */}
        {activeId && indicatorStyle.height > 0 && (
          <motion.div
            className="absolute left-0 w-0.5 bg-primary rounded-full"
            initial={false}
            animate={{
              top: indicatorStyle.top,
              height: indicatorStyle.height,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}

        <div className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              data-toc-id={item.id}
              onClick={() => handleClick(item.id)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-300 ${activeId === item.id
                ? "bg-primary/10 text-primary pl-4"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              style={{ paddingLeft: item.level ? `${(item.level - 1) * 12 + 12}px` : "12px" }}
            >
              <span className={`transition-all duration-300 ${activeId === item.id ? "font-medium" : ""}`}>
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default TableOfContents;
