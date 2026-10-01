import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollY } from '../../hooks';

export default function ScrollToTop() {
  const scrollY = useScrollY();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleProgress, { passive: true });
    return () => window.removeEventListener('scroll', handleProgress);
  }, []);

  const isVisible = scrollY > 400;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(34,211,238,0.35)' }}
          whileTap={{ scale: 0.92 }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full bg-white/95 dark:bg-[#0D1828]/90 backdrop-blur-md border border-slate-200 dark:border-cyan-400/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shadow-md dark:shadow-xl transition-colors hover:border-cyan-400/60"
        >
          {/* Progress circle */}
          <svg className="absolute -inset-0.5 h-12 w-12 -rotate-90 pointer-events-none" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-slate-200 dark:text-slate-800/40"
              strokeWidth="2.5"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              className="text-cyan-400 transition-all duration-150"
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <ArrowUp size={16} className="relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
