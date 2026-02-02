import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const PARTICLE_COUNT = 8;
const GRID_SIZE = 60;

interface Position {
  x: number;
  y: number;
}

interface ParticleState {
  current: Position;
  target: Position;
  direction: 'horizontal' | 'vertical';
}

const Particle = ({ index }: { index: number }) => {
  const [state, setState] = useState<ParticleState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const getRandomGridPoint = useCallback((): Position => {
    const maxX = Math.floor(window.innerWidth / GRID_SIZE) * GRID_SIZE;
    const maxY = Math.floor((window.innerHeight * 2) / GRID_SIZE) * GRID_SIZE;
    return {
      x: Math.floor(Math.random() * (maxX / GRID_SIZE)) * GRID_SIZE,
      y: Math.floor(Math.random() * (maxY / GRID_SIZE)) * GRID_SIZE,
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const initial = getRandomGridPoint();
      const target = getRandomGridPoint();
      setState({
        current: initial,
        target: { x: target.x, y: initial.y },
        direction: 'horizontal',
      });
      setIsVisible(true);
    }, index * 300);

    return () => clearTimeout(timer);
  }, [index, getRandomGridPoint]);

  const moveToNextTarget = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;

      const newTarget = getRandomGridPoint();

      if (prev.direction === 'horizontal') {
        return {
          current: prev.target,
          target: { x: prev.target.x, y: newTarget.y },
          direction: 'vertical' as const,
        };
      } else {
        return {
          current: prev.target,
          target: { x: newTarget.x, y: prev.target.y },
          direction: 'horizontal' as const,
        };
      }
    });
  }, [getRandomGridPoint]);

  const handleAnimationComplete = useCallback(() => {
    moveToNextTarget();
  }, [moveToNextTarget]);

  if (!state || !isVisible) return null;

  const distance = state.direction === 'horizontal'
    ? Math.abs(state.target.x - state.current.x)
    : Math.abs(state.target.y - state.current.y);

  const duration = Math.max(3, distance / 30);

  // Determine tail direction based on movement
  const movingRight = state.target.x > state.current.x;
  const movingDown = state.target.y > state.current.y;

  // Tail rotation angle based on direction
  const tailRotation = state.direction === 'horizontal'
    ? (movingRight ? 180 : 0)
    : (movingDown ? 270 : 90);

  return (
    <motion.div
      className="absolute"
      initial={{ x: state.current.x, y: state.current.y }}
      animate={{ x: state.target.x, y: state.target.y }}
      transition={{
        duration,
        ease: "linear",
      }}
      onAnimationComplete={handleAnimationComplete}
      style={{ width: 4, height: 4 }}
    >
      {/* Meteor tail - long fiery trail */}
      <div
        className="absolute"
        style={{
          width: 45,
          height: 3,
          left: 2,
          top: 0.5,
          transform: `rotate(${tailRotation}deg)`,
          transformOrigin: 'left center',
          background: 'linear-gradient(90deg, hsl(160 84% 50% / 0.8) 0%, hsl(160 84% 45% / 0.5) 20%, hsl(160 84% 40% / 0.2) 60%, transparent 100%)',
          borderRadius: '0 2px 2px 0',
          filter: 'blur(1px)',
        }}
      />

      {/* Secondary tail glow - wider and softer */}
      <div
        className="absolute"
        style={{
          width: 35,
          height: 6,
          left: 2,
          top: -1,
          transform: `rotate(${tailRotation}deg)`,
          transformOrigin: 'left center',
          background: 'linear-gradient(90deg, hsl(160 84% 45% / 0.4) 0%, hsl(160 84% 40% / 0.15) 50%, transparent 100%)',
          borderRadius: '0 3px 3px 0',
          filter: 'blur(3px)',
        }}
      />

      {/* Outer glow around core */}
      <div
        className="absolute rounded-full"
        style={{
          width: 10,
          height: 10,
          left: -3,
          top: -3,
          background: 'radial-gradient(circle, hsl(160 84% 50% / 0.5) 0%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />

      {/* Core - tiny bright center */}
      <div
        className="absolute rounded-full"
        style={{
          width: 4,
          height: 4,
          left: 0,
          top: 0,
          background: 'hsl(160 84% 60%)',
          boxShadow: '0 0 4px hsl(160 84% 50% / 0.9), 0 0 8px hsl(160 84% 45% / 0.6)',
        }}
      />

      {/* Bright white center dot */}
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 2,
          height: 2,
          left: 1,
          top: 1,
        }}
      />
    </motion.div>
  );
};

const GlowingParticle = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
        <Particle key={index} index={index} />
      ))}
    </div>
  );
};

export default GlowingParticle;
