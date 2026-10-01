import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ChevronRight, Download, Copy, Check } from 'lucide-react';
import { GithubIcon, LinkedinIcon, WhatsAppIcon, GmailIcon } from '../common/SocialIcons';
import { rotatingTitles } from '../../data/portfolioData';
import { contactConfig } from '../../data/contact';
import { useReducedMotion } from '../../hooks';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import TiltCard from '../common/TiltCard';

const techStack = ['React', 'Node.js', 'Express', 'MongoDB', 'REST API', 'JWT', 'TypeScript'];

// Tech badge data shown floating around the circular avatar
const floatingBadges = [
  { label: 'React', color: 'text-cyan-600 dark:text-cyan-400 border-cyan-500/30 dark:border-cyan-400/30', pos: '-top-3 left-2 sm:-top-4 sm:left-4', delay: 0 },
  { label: 'Node.js', color: 'text-emerald-600 dark:text-green-400 border-emerald-500/30 dark:border-green-400/30', pos: 'top-10 -right-4 sm:top-12 sm:-right-6', delay: 0.4 },
  { label: 'TypeScript', color: 'text-blue-600 dark:text-blue-400 border-blue-500/30 dark:border-blue-400/30', pos: 'bottom-14 -left-4 sm:bottom-16 sm:-left-6', delay: 0.8 },
  { label: 'MongoDB', color: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-400/30', pos: '-bottom-2 right-4 sm:-bottom-3 sm:right-6', delay: 0.2 },
];

export default function Hero() {
  const { settings } = usePortfolioSettings();
  const resumeUrl = settings.resumeUrl || contactConfig.resumePath;
  const [titleIndex, setTitleIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      // Disappear when scrolled down past 80px, reappear when back at top hero area
      setShowScrollIndicator(window.scrollY <= 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactConfig.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };
  const frameRef = useRef<HTMLDivElement>(null);

  // Mouse-based parallax (only on desktop, disabled for reduced-motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], reduced ? [0, 0] : [4, -4]);
  const rotateY = useTransform(springX, [-0.5, 0.5], reduced ? [0, 0] : [-4, 4]);

  const activeTitles =
    settings.rotatingTitles && settings.rotatingTitles.length > 0
      ? settings.rotatingTitles
      : rotatingTitles;

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setTitleIndex((i) => (i + 1) % activeTitles.length);
    }, 2800);
    return () => clearInterval(id);
  }, [reduced, activeTitles.length]);

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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 dark:border-cyan-400/30 bg-cyan-500/10 dark:bg-cyan-400/5 text-cyan-600 dark:text-cyan-400 text-xs font-semibold tracking-widest uppercase shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-pulse" />
                {settings.availability || 'Available for Work'}
              </span>
            </motion.div>

            {/* Name */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-[1.1] tracking-tight">
                {settings.name ? (
                  <>
                    {settings.name.split(' ')[0]}{' '}
                    <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-violet-500 dark:from-cyan-400 dark:via-teal-400 dark:to-violet-400 bg-clip-text text-transparent">
                      {settings.name.split(' ').slice(1).join(' ') || ''}
                    </span>
                  </>
                ) : (
                  <>
                    Muhammad{' '}
                    <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-violet-500 dark:from-cyan-400 dark:via-teal-400 dark:to-violet-400 bg-clip-text text-transparent">
                      Ahmed
                    </span>
                  </>
                )}
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
                    className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {activeTitles[titleIndex % activeTitles.length]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
              {settings.heroDescription ||
                settings.shortBio ||
                'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.'}
            </p>

            {/* Tech stack pills */}
            <div className="flex flex-wrap gap-2">
              {techStack.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-400 shadow-xs"
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
                onClick={() => handleNavClick(settings.primaryCtaLink || '#projects')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow duration-300"
              >
                {settings.primaryCtaLabel || 'View My Work'} <ChevronRight size={16} />
              </motion.button>
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:border-slate-400 dark:hover:border-slate-500 transition-colors duration-200 shadow-xs"
              >
                <Download size={15} /> Resume
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleNavClick(settings.secondaryCtaLink || '#contact')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/40 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:bg-violet-500/10 transition-colors duration-200 bg-white/80 dark:bg-transparent shadow-xs"
              >
                {settings.secondaryCtaLabel || 'Contact Me'}
              </motion.button>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              {[
                {
                  href: settings.github || contactConfig.github,
                  Icon: GithubIcon,
                  label: 'GitHub',
                  brandClass: 'brand-icon-github',
                  badgeClass: 'hover:bg-slate-200/80 dark:hover:bg-slate-800/80 hover:border-slate-400 dark:hover:border-slate-600',
                },
                {
                  href: settings.linkedin || contactConfig.linkedin,
                  Icon: LinkedinIcon,
                  label: 'LinkedIn',
                  brandClass: 'brand-icon-linkedin',
                  badgeClass: 'hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/40',
                },
                {
                  href: settings.whatsappUrl || settings.whatsapp || contactConfig.whatsappUrl,
                  Icon: WhatsAppIcon,
                  label: 'WhatsApp',
                  brandClass: 'brand-icon-whatsapp',
                  badgeClass: 'hover:bg-[#25D366]/10 hover:border-[#25D366]/40',
                },
                {
                  href: `mailto:${settings.email || contactConfig.email}`,
                  Icon: GmailIcon,
                  label: 'Gmail',
                  brandClass: 'brand-icon-gmail',
                  badgeClass: 'hover:bg-[#EA4335]/10 hover:border-[#EA4335]/40',
                },
              ].map(({ href, Icon, label, brandClass, badgeClass }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/40 text-sm transition-all duration-200 shadow-xs ${badgeClass}`}
                >
                  <span className={`${brandClass} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
                    <Icon size={17} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                    {label}
                  </span>
                </a>
              ))}

              {/* Quick Copy Email Button */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 dark:hover:border-cyan-400/40 text-xs font-medium transition-all shadow-xs"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check size={13} className="text-emerald-500 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-700/30 max-w-xl">
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">3+</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-500 font-medium">Live Web Products</span>
              </div>
              <div className="flex flex-col border-x border-slate-200 dark:border-slate-700/30 px-3">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-500 to-violet-500 dark:from-teal-400 dark:to-violet-400 bg-clip-text text-transparent">MERN</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-500 font-medium">Full-Stack Stack</span>
              </div>
              <div className="flex flex-col pl-1">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-500 to-cyan-500 dark:from-violet-400 dark:to-cyan-400 bg-clip-text text-transparent">Fast</span>
                <span className="text-[11px] text-slate-600 dark:text-slate-500 font-medium">Response & Delivery</span>
              </div>
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

              {/* Outer cyan → teal → violet gradient ring with interactive 3D cursor tilt */}
              <TiltCard
                maxTilt={12}
                scale={1.03}
                glare={true}
                className="rounded-full shadow-[0_0_40px_rgba(34,211,238,0.2)]"
              >
                <div
                  className="relative p-[3.5px] rounded-full shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #22D3EE 0%, #14B8A6 45%, #8B5CF6 100%)',
                  }}
                >
                  {/* Perfectly circular photo container directly inside gradient ring */}
                  <div
                    className="relative rounded-full overflow-hidden"
                    style={{ width: 'clamp(280px, 32vw, 360px)', height: 'clamp(280px, 32vw, 360px)' }}
                  >
                    {/* Subtle inner top glass sheen */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] via-transparent to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Real Photo centered and cropped cleanly */}
                    <img
                      src={settings.profileImageUrl || '/profile.jpg'}
                      alt={`${settings.name || 'Muhammad Ahmed'} — Full Stack MERN Developer`}
                      className="w-full h-full object-cover object-[50%_15%] select-none scale-[1.05]"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
              </TiltCard>

              {/* Status chip positioned cleanly below circle */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#0D1828]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 shadow-xl flex items-center gap-2 whitespace-nowrap">
                <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="text-slate-800 dark:text-slate-300 text-xs font-medium">Open to Opportunities</span>
              </div>

              {/* Floating tech badges */}
              {floatingBadges.map(({ label, color, pos, delay }) => (
                <motion.div
                  key={label}
                  className={`absolute ${pos} z-20 pointer-events-none`}
                  animate={reduced ? {} : { y: [0, -5, 0] }}
                  transition={{ duration: 3 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                  <div className={`px-2.5 py-1 rounded-lg bg-white/95 dark:bg-[#0D1828]/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 text-xs font-semibold shadow-lg ${color}`}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator: clickable to #about, fades out on scroll down, reappears at top */}
        <motion.button
          type="button"
          onClick={() => handleNavClick('#about')}
          aria-label="Scroll to About section"
          className="group absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-400 text-xs transition-colors duration-200 cursor-pointer focus:outline-none z-20"
          animate={
            showScrollIndicator
              ? reduced
                ? { opacity: 1, y: 0 }
                : { opacity: 1, y: [0, 6, 0] }
              : { opacity: 0, y: 14 }
          }
          transition={
            showScrollIndicator
              ? {
                  y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.3 },
                }
              : { duration: 0.25 }
          }
          style={{
            pointerEvents: showScrollIndicator ? 'auto' : 'none',
          }}
        >
          <span className="font-medium tracking-wider uppercase text-[10px] text-slate-400 group-hover:text-cyan-400 transition-colors">
            Scroll
          </span>
          <ArrowDown size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </motion.button>
      </div>
    </section>
  );
}
