import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';

export interface TiltCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt degrees (default: 8)
  scale?: number; // scale on hover (default: 1.02)
  glare?: boolean; // dynamic light sheen
  perspective?: number; // 3D perspective depth (default: 1000)
}

/**
 * 3D Interactive Tilt & Magnetic Parallax Card
 *
 * Tilts and shifts subtly in the direction of the cursor when hovered:
 * - Stays firmly anchored within its layout space without breaking out.
 * - Hardware accelerated with framer-motion springs for silky 60fps/120fps physics.
 * - Dynamic cursor glare light overlay that follows pointer position.
 * - Smooth spring return when cursor leaves.
 */
export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  glare = true,
  perspective = 1000,
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const scaleVal = useMotionValue(1);

  // Responsive, fluid spring configuration
  const springConfig = { stiffness: 280, damping: 22 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);
  const smoothScale = useSpring(scaleVal, { stiffness: 300, damping: 24 });

  // Tilting angles (subtle 3D angle toward cursor)
  const rotateX = useTransform(smoothY, [-1, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-1, 1], [-maxTilt, maxTilt]);

  // Subtle magnetic translation (shifting slightly with cursor without leaving grid)
  const translateX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const translateY = useTransform(smoothY, [-1, 1], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    // Normalizing from -1 (left/top) to +1 (right/bottom)
    const normX = (e.clientX - rect.left - width / 2) / (width / 2);
    const normY = (e.clientY - rect.top - height / 2) / (height / 2);

    rawX.set(Math.max(-1, Math.min(1, normX)));
    rawY.set(Math.max(-1, Math.min(1, normY)));

    if (glare) {
      setGlarePos({
        x: ((e.clientX - rect.left) / width) * 100,
        y: ((e.clientY - rect.top) / height) * 100,
      });
    }

    if (onMouseMove) {
      onMouseMove(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    scaleVal.set(scale);
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
    scaleVal.set(1);
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        x: translateX,
        y: translateY,
        scale: smoothScale,
        ...style,
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* Dynamic Cursor Light Sheen (Glare) */}
      {glare && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(34, 211, 238, 0.14) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}
