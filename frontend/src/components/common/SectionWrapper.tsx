import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUpVariants, reducedMotionVariants } from '../../utils/animations';
import { useReducedMotion } from '../../hooks';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = '' }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={prefersReduced ? reducedMotionVariants : fadeUpVariants}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.section>
  );
}
