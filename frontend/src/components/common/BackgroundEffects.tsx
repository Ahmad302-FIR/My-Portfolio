import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

// Animated background orbs + enhanced high-tech grid + glowing constellation particles
export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      color: string;
      baseAlpha: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Neon palette matching dark or light theme
    const colors = isLight
      ? [
          '14, 165, 233', // sky-500
          '13, 148, 136', // teal-600
          '124, 58, 237', // violet-600
          '2, 132, 199',  // sky-600
        ]
      : [
          '34, 211, 238', // cyan-400
          '20, 184, 166', // teal-500
          '139, 92, 246', // violet-500
          '56, 189, 248', // sky-400
        ];

    // Responsive particle count (max 75 for optimal performance)
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.28,
        dy: (Math.random() - 0.5) * 0.28,
        color: colors[i % colors.length],
        baseAlpha: isLight ? Math.random() * 0.4 + 0.25 : Math.random() * 0.45 + 0.2,
      });
    }

    const maxDist = 95;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle constellation lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isLight ? 0.16 : 0.12);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight
              ? `rgba(14, 165, 233, ${lineAlpha})`
              : `rgba(34, 211, 238, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and animate glowing particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.baseAlpha})`;
        if (p.r > 1.2) {
          ctx.shadowBlur = isLight ? 4 : 6;
          ctx.shadowColor = `rgba(${p.color}, ${isLight ? 0.4 : 0.6})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isLight]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* High-tech Grid with refined contrast */}
      <div
        className={`absolute inset-0 ${isLight ? 'opacity-[0.065]' : 'opacity-[0.05]'}`}
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(rgba(14, 165, 233, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14, 165, 233, 0.3) 1px, transparent 1px)'
            : 'linear-gradient(rgba(34, 211, 238, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.45) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      {/* Vibrant Atmospheric Gradient Orbs */}
      {/* Top-Left Glow */}
      <motion.div
        className="absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(20,184,166,0.06) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(20,184,166,0.08) 40%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        animate={{ x: [0, 45, 0], y: [0, 35, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Middle-Right Glow */}
      <motion.div
        className="absolute top-1/4 -right-36 h-[580px] w-[580px] rounded-full"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.05) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(99,102,241,0.07) 45%, transparent 70%)',
          filter: 'blur(85px)',
        }}
        animate={{ x: [0, -35, 0], y: [0, 45, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Bottom-Left Glow */}
      <motion.div
        className="absolute bottom-16 left-1/4 h-[480px] w-[480px] rounded-full"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(20,184,166,0.10) 0%, rgba(14,165,233,0.05) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(20,184,166,0.14) 0%, rgba(34,211,238,0.06) 40%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        animate={{ x: [0, 25, 0], y: [0, -35, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Center-Right Indigo Glow */}
      <motion.div
        className="absolute top-2/3 right-1/4 h-[420px] w-[420px] rounded-full"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.13) 0%, transparent 70%)',
          filter: 'blur(75px)',
        }}
        animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Canvas constellation particles */}
      <canvas ref={canvasRef} className={`absolute inset-0 ${isLight ? 'opacity-90' : 'opacity-85'}`} />
    </div>
  );
}
