import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MatrixDecryptLoaderProps {
  onComplete?: () => void;
}

const MatrixDecryptLoader = ({ onComplete }: MatrixDecryptLoaderProps) => {
  const targetText = "DECRYPTED";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
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
    }, 15); // Faster: was 25ms

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
      <div className="flex gap-1 font-mono text-2xl">
        {displayText.map((char, i) => (
          <motion.span
            key={i}
            className={i < revealed ? "text-primary" : "text-muted-foreground"}
            animate={i < revealed ? { scale: [1.2, 1] } : {}}
            transition={{ duration: 0.15 }}
            style={{
              textShadow: i < revealed ? "0 0 10px hsl(var(--primary))" : "none",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className={`font-mono text-xs ${complete ? "text-primary" : "text-muted-foreground"}`}>
        {complete ? "✓ DECRYPTION COMPLETE" : "◐ DECRYPTING..."}
      </div>
    </div>
  );
};

export default MatrixDecryptLoader;
