import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"binary" | "typewriter" | "exit">("binary");
  const [displayText, setDisplayText] = useState("");
  const [streams, setStreams] = useState<string[][]>([]);
  const welcomeText = "Welcome";

  // Initialize binary streams
  useEffect(() => {
    const initialStreams = Array.from({ length: 8 }, () => 
      Array.from({ length: 12 }, () => Math.random() > 0.5 ? '1' : '0')
    );
    setStreams(initialStreams);
  }, []);

  // Animate binary streams
  useEffect(() => {
    if (phase !== "binary") return;
    
    const interval = setInterval(() => {
      setStreams(prev => prev.map(stream => {
        const newStream = [...stream.slice(1), Math.random() > 0.5 ? '1' : '0'];
        return newStream;
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    // Phase 1: Binary stream for 1500ms
    const binaryTimer = setTimeout(() => {
      setPhase("typewriter");
    }, 1500);

    return () => clearTimeout(binaryTimer);
  }, []);

  useEffect(() => {
    if (phase === "typewriter") {
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= welcomeText.length) {
          setDisplayText(welcomeText.slice(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setPhase("exit");
            setTimeout(onComplete, 400);
          }, 300);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [phase, onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
        >
          <div className="relative flex flex-col items-center justify-center">
            {phase === "binary" && (
              <div className="relative">
                {/* Binary streams - vertical columns */}
                <div className="flex gap-4 md:gap-6">
                  {streams.map((stream, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {stream.map((bit, j) => {
                        // Determine color based on position
                        const isBottom = j === stream.length - 1;
                        const isNearBottom = j > stream.length - 4;
                        
                        let colorClass = "text-muted-foreground/40"; // default dimmed
                        let glowColor = "none";
                        
                        if (isBottom) {
                          // Bottom-most bit: green for 1, blue for 0
                          colorClass = bit === '1' ? 'text-primary' : 'text-accent';
                          glowColor = bit === '1' 
                            ? '0 0 10px hsl(160 100% 45%)' 
                            : '0 0 10px hsl(200 100% 50%)';
                        } else if (isNearBottom) {
                          // Near bottom: brighter white/foreground
                          colorClass = "text-foreground/70";
                        }
                        
                        return (
                          <span
                            key={j}
                            className={`font-mono text-lg md:text-xl transition-all duration-100 ${colorClass}`}
                            style={{ textShadow: glowColor }}
                          >
                            {bit}
                          </span>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Center PROCESSING overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-background/90 backdrop-blur-sm px-6 py-4 rounded-lg border border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-primary"
                      />
                      <span className="font-mono text-sm text-primary uppercase tracking-[0.3em]">
                        Processing
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {phase === "typewriter" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center"
              >
                <h1 className="text-4xl md:text-5xl font-mono">
                  <span className="text-primary">&gt; </span>
                  <span className="text-foreground">{displayText}</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-primary"
                  >
                    _
                  </motion.span>
                </h1>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
