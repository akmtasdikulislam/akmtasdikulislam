import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PasswordCrackLoaderProps {
  onComplete?: () => void;
}

const PasswordCrackLoader = ({ onComplete }: PasswordCrackLoaderProps) => {
  const [revealed, setRevealed] = useState(0);
  const actualPassword = "UNLOCKED";
  const [scramble, setScramble] = useState("");
  const chars = "!@#$%^&*ABCXYZ123";
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const scrambleInterval = setInterval(() => {
      if (!complete) {
        setScramble(
          Array.from({ length: 8 - revealed }, () =>
            chars[Math.floor(Math.random() * chars.length)]
          ).join("")
        );
      }
    }, 15); // Faster: was 25ms

    const revealInterval = setInterval(() => {
      setRevealed((prev) => {
        if (prev >= 8) {
          setComplete(true);
          clearInterval(revealInterval);
          return 8;
        }
        return prev + 1;
      });
    }, 60); // Faster: was 120ms

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
    <div className="flex flex-col items-center gap-4">
      <div className="font-mono text-2xl tracking-widest">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className={i < revealed ? "text-primary" : "text-muted-foreground"}
            animate={i < revealed ? { scale: [1.2, 1] } : {}}
            transition={{ duration: 0.15 }}
            style={{
              textShadow: i < revealed ? "0 0 8px hsl(var(--primary))" : "none",
            }}
          >
            {i < revealed ? actualPassword[i] : scramble[i - revealed] || "●"}
          </motion.span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${complete ? "bg-primary" : "bg-muted-foreground"}`}
          animate={complete ? { scale: [1.3, 1] } : { opacity: [1, 0.3] }}
          transition={{ duration: 0.3, repeat: complete ? 0 : Infinity }}
        />
        <span className={`font-mono text-xs ${complete ? "text-primary" : "text-muted-foreground"}`}>
          {complete ? "✓ ACCESS GRANTED" : "DECRYPTING..."}
        </span>
      </div>
    </div>
  );
};

export default PasswordCrackLoader;
