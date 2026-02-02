import { motion } from 'framer-motion';
import { createContext, ReactNode, useEffect, useState } from 'react';

interface TouchRipple {
  id: number;
  x: number;
  y: number;
}

interface CursorContextType {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
  isClicking: boolean;
  isUsingTouch: boolean;
}

export const CursorContext = createContext<CursorContextType | null>(null);

interface CursorProviderProps {
  children: ReactNode;
}

export const CursorProvider = ({ children }: CursorProviderProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isUsingTouch, setIsUsingTouch] = useState(false);
  const [touchRipples, setTouchRipples] = useState<TouchRipple[]>([]);

  // Enhanced input detection system
  useEffect(() => {
    // Initial detection: Check for touch capabilities
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasMouse = matchMedia('(pointer: fine)').matches;

    // If device has both capabilities, default to mouse unless touch is used first
    // If only touch, start in touch mode
    if (hasTouch && !hasMouse) {
      setIsUsingTouch(true);
    }
  }, []);

  useEffect(() => {
    // Mouse movement handler - indicates mouse input
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // When mouse moves, switch to mouse mode
      setIsUsingTouch(false);
    };

    // Mouse interaction handlers
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('hoverable')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // Touch event handler - indicates touch input
    const handleTouchStart = (e: TouchEvent) => {
      // When touch is used, switch to touch mode
      setIsUsingTouch(true);

      const touch = e.touches[0];
      const id = Date.now() + Math.random(); // Ensure unique ID

      setTouchRipples(prev => [...prev, {
        id,
        x: touch.clientX,
        y: touch.clientY
      }]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setTouchRipples(prev => prev.filter(r => r.id !== id));
      }, 800);
    };

    // Pointer event handler for hybrid device detection
    const handlePointerMove = (e: PointerEvent) => {
      // PointerEvent provides pointerType which can be 'mouse', 'pen', or 'touch'
      if (e.pointerType === 'touch') {
        setIsUsingTouch(true);
      } else if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        setIsUsingTouch(false);
      }
    };

    // Add all event listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const contextValue: CursorContextType = {
    mousePosition,
    isHovering,
    isClicking,
    isUsingTouch,
  };

  return (
    <CursorContext.Provider value={contextValue}>
      {children}

      {/* Touch Ripples - only on touch devices */}
      {touchRipples.map(ripple => (
        <div key={ripple.id}>
          {/* Multiple concentric rings for water ripple effect */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`${ripple.id}-${index}`}
              className="fixed pointer-events-none z-[9999]"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.15 // Stagger the rings
              }}
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div
                className="w-20 h-20 rounded-full border-2"
                style={{
                  borderColor: `hsl(160 84% 39% / ${0.6 - index * 0.15})`,
                  background: `radial-gradient(circle, hsl(160 84% 39% / ${0.3 - index * 0.1}) 0%, hsl(160 84% 39% / ${0.1 - index * 0.03}) 50%, transparent 70%)`
                }}
              />
            </motion.div>
          ))}
        </div>
      ))}

      {/* Custom Cursor - only on non-touch devices */}
      {/* Main arrow cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isClicking ? 0.8 : isHovering ? 1.15 : 1,
          rotate: isClicking ? -8 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 800,
          damping: 35,
          mass: 0.3,
        }}
        style={{
          display: isUsingTouch ? 'none' : 'block'
        }}
      >
        {/* Custom Arrow SVG - matching the CSS cursor shape */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-150"
          style={{
            filter: isHovering
              ? 'drop-shadow(0 0 12px hsl(160 84% 39% / 0.8)) drop-shadow(0 0 24px hsl(160 84% 39% / 0.4))'
              : 'drop-shadow(0 0 6px hsl(160 84% 39% / 0.5)) drop-shadow(0 0 12px hsl(160 84% 39% / 0.2))',
          }}
        >
          {/* Main arrow pointer - filled with white, green stroke */}
          <path
            d="M5 3l14 9-9 4-5-13z"
            fill="white"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Small tail/handle */}
          <path
            d="M14 17l3 3"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Primary following shadow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.3 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 120,
          damping: 20,
          mass: 0.6,
        }}
        style={{
          display: isUsingTouch ? 'none' : 'block'
        }}
      >
        <div
          className="w-14 h-14 -ml-5 -mt-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(160 84% 39% / 0.25) 0%, hsl(160 84% 39% / 0.1) 40%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Secondary following shadow - slower */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovering ? 1.4 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 15,
          mass: 1.0,
        }}
        style={{
          display: isUsingTouch ? 'none' : 'block'
        }}
      >
        <div
          className="w-20 h-20 -ml-8 -mt-6 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(160 84% 39% / 0.15) 0%, transparent 60%)',
          }}
        />
      </motion.div>

      {/* Click ripple effect */}
      {isClicking && !isUsingTouch && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9995]"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
          }}
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-primary/60"
          />
        </motion.div>
      )}

      {/* Hide default cursor on non-touch devices, keep visible on touch */}
      <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </CursorContext.Provider>
  );
};

export default CursorProvider;
