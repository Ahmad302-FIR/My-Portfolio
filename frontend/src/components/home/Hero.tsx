import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ChevronRight, Download, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from '../common/SocialIcons';
import { rotatingTitles } from '../../data/portfolioData';
import { contactConfig } from '../../data/contact';
import { useReducedMotion } from '../../hooks';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const techStack = ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'JWT', 'TypeScript'];

// Tech badge data shown floating around the circular avatar
const floatingBadges = [
  { label: 'React', color: 'text-cyan-400 border-cyan-400/30', pos: '-top-3 left-2 sm:-top-4 sm:left-4', delay: 0 },
  { label: 'Node.js', color: 'text-green-400 border-green-400/30', pos: 'top-10 -right-4 sm:top-12 sm:-right-6', delay: 0.4 },
  { label: 'TypeScript', color: 'text-blue-400 border-blue-400/30', pos: 'bottom-14 -left-4 sm:bottom-16 sm:-left-6', delay: 0.8 },
  { label: 'MongoDB', color: 'text-emerald-400 border-emerald-400/30', pos: '-bottom-2 right-4 sm:-bottom-3 sm:right-6', delay: 0.2 },
];

export default function Hero() {
  const { settings } = usePortfolioSettings();
  const resumeUrl = settings.resumeUrl || contactConfig.resumePath;
  const [titleIndex, setTitleIndex] = useState(0);
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  // Mouse-based parallax (only on desktop, disabled for reduced-motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], reduced ? [0, 0] : [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduced ? [0, 0] : [-4, 4]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setTitleIndex((i) => (i + 1) % rotatingTitles.length);
    }, 2800);
    return () => clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const handleMouseMove = (e: MouseEvent) => {
      const frame = frameRef.current;
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reduced, mouseX, mouseY]);

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative z-10 min-h-screen flex items-center pt-20 pb-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-8 items-center">

          {/* ── LEFT: Text content ─────────────────────────── */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-400 text-xs font-semibold tracking-widest uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {settings.availability || 'Available for Work'}
              </span>
            </motion.div>

            {/* Name */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-50 leading-[1.1] tracking-tight">
                Muhammad{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-violet-400 bg-clip-text text-transparent">
                  Ahmed
                </span>
              </h1>

              {/* Rotating subtitle */}
              <div className="mt-3 h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={titleIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="text-xl sm:text-2xl font-semibold text-slate-300"
                  >
                    {rotatingTitles[titleIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              I build complete web products — from responsive frontend interfaces to secure backend
              APIs, databases, authentication, and production deployment.
            </p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-2">
              {techStack.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800/60 border border-slate-700/50 text-slate-400"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(34,211,238,0.25)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick('#projects')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow duration-300"
              >
                View My Work <ChevronRight size={16} />
              </motion.button>
              <motion.a
                href={resumeUrl}
                download="Muhammad-Ahmed-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 font-semibold text-sm hover:border-slate-500 transition-colors duration-200"
              >
                <Download size={15} /> Resume
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick('#contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/40 text-violet-400 font-semibold text-sm hover:bg-violet-500/10 transition-colors duration-200"
              >
                Contact Me
              </motion.button>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-4 mt-1">
              {[
                { href: contactConfig.github, Icon: GithubIcon, label: 'GitHub' },
                { href: contactConfig.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
                { href: contactConfig.whatsappUrl, Icon: WhatsAppIcon, label: 'WhatsApp' },
                { href: `mailto:${contactConfig.email}`, Icon: Mail, label: 'Email' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 transition-colors text-sm"
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Circular Professional Photo ──────────────────── */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            {/* Outer parallax wrapper */}
            <motion.div
              ref={frameRef}
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              animate={reduced ? {} : { y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Ambient glow layers */}
              <div
                className="absolute -inset-6 sm:-inset-8 rounded-full opacity-45 blur-3xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(34,211,238,0.28) 0%, rgba(139,92,246,0.24) 50%, transparent 75%)',
                }}
                aria-hidden="true"
              />

              {/* Slow-pulse secondary glow */}
              <motion.div
                className="absolute -inset-3 sm:-inset-4 rounded-full opacity-35 blur-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, rgba(139,92,246,0.25) 60%, transparent 75%)',
                }}
                animate={reduced ? {} : { scale: [1, 1.05, 1], opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />

              {/* Outer cyan → teal → violet gradient ring */}
              <div
                className="relative p-[3.5px] rounded-full shadow-[0_0_40px_rgba(34,211,238,0.2)]"
                style={{
                  background: 'linear-gradient(135deg, #22D3EE 0%, #14B8A6 45%, #8B5CF6 100%)',
                }}
              >
                {/* Inner thin border & dark background wrapper */}
                <div className="rounded-full p-[2.5px] bg-[#0D1828]">
                  {/* Perfectly circular photo container */}
                  <div
                    className="relative rounded-full overflow-hidden bg-gradient-to-b from-[#112238] to-[#07111F] shadow-2xl"
                    style={{ width: 'clamp(280px, 32vw, 360px)', height: 'clamp(280px, 32vw, 360px)' }}
                  >
                    {/* Subtle inner top glass sheen */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Real Photo centered and cropped cleanly */}
                    <img
                      src="/profile.jpg"
                      alt="Muhammad Ahmed — Full Stack MERN Developer"
                      className="w-full h-full object-cover object-[50%_15%] select-none scale-[1.05]"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />

                    {/* Bottom subtle ambient shade */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/4 rounded-b-full bg-gradient-to-t from-[#07111F]/50 to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Status chip positioned cleanly below circle */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-[#0D1828]/90 backdrop-blur-md border border-slate-700/60 shadow-xl flex items-center gap-2 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 text-xs font-medium">Open to Opportunities</span>
              </div>

              {/* Floating tech badges */}
              {floatingBadges.map(({ label, color, pos, delay }) => (
                <motion.div
                  key={label}
                  className={`absolute ${pos} z-20 pointer-events-none`}
                  animate={reduced ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                  <div className={`px-2.5 py-1 rounded-lg bg-[#0D1828]/90 backdrop-blur-md border text-xs font-semibold shadow-lg ${color}`}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs pointer-events-none"
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={16} />
          <span>Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
