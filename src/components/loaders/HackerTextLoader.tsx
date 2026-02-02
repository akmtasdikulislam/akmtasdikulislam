import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface HackerTextLoaderProps {
  onComplete?: () => void;
}

const HackerTextLoader = ({ onComplete }: HackerTextLoaderProps) => {
  const targetText = "AUTHORIZED";
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [displayText, setDisplayText] = useState(Array(targetText.length).fill(""));
  const [revealed, setRevealed] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const scrambleInterval = setInterval(() => {
      if (!complete) {
        setDisplayText((prev) =>
          prev.map((_, i) =>
            i < revealed ? targetText[i] : chars[Math.floor(Math.random() * chars.length)]
          )
        );
      }
    }, 15); // Faster: was 20ms

    const revealInterval = setInterval(() => {
      setRevealed((prev) => {
        if (prev >= targetText.length) {
          setComplete(true);
          setDisplayText(targetText.split(""));
          clearInterval(revealInterval);
          return targetText.length;
        }
        return prev + 1;
      });
    }, 50); // Faster: was 100ms

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
    };
  }, [revealed, complete]);

  // Call onComplete shortly after animation finishes
  useEffect(() => {
    if (complete && onComplete) {
      const timer = setTimeout(onComplete, 200); // Small delay after completion
      return () => clearTimeout(timer);
    }
  }, [complete, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-0.5 font-mono text-2xl tracking-widest">
        {displayText.map((char, i) => (
          <motion.span
            key={i}
            className={i < revealed ? "text-primary" : "text-muted-foreground"}
            style={{
              textShadow: i < revealed ? "0 0 10px hsl(var(--primary))" : "none",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className={`font-mono text-xs ${complete ? "text-primary" : "text-muted-foreground"}`}>
        {complete ? "✓ DECRYPTION COMPLETE" : `[${revealed}/${targetText.length}] DECRYPTING...`}
      </div>
    </div>
  );
};

export default HackerTextLoader;
