import { motion } from 'framer-motion';
import {
  Code2,
  Server,
  ShieldCheck,
  Rocket,
  Users,
  GitBranch,
  Zap,
  Globe,
  Database,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import TiltCard from '../common/TiltCard';
import { staggerContainer, cardVariants } from '../../utils/animations';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const iconLookup: Record<string, LucideIcon> = {
  code: Code2,
  server: Server,
  shield: ShieldCheck,
  rocket: Rocket,
  users: Users,
  'git-branch': GitBranch,
  zap: Zap,
  globe: Globe,
  database: Database,
  cpu: Cpu,
};

const defaultHighlights = [
  {
    icon: 'code',
    title: 'Full Stack MERN',
    desc: 'End-to-end development from responsive UI to secure REST APIs and MongoDB schemas.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20',
  },
  {
    icon: 'server',
    title: 'REST API Development',
    desc: 'Scalable, well-structured APIs with proper error handling and validation.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20',
  },
  {
    icon: 'shield',
    title: 'Authentication & Authorization',
    desc: 'JWT, bcrypt, OTP verification, and role-based access control.',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10 border-teal-400/20',
  },
  {
    icon: 'rocket',
    title: 'Production Deployment',
    desc: 'Deployment with Vercel, Netlify, Cloudinary, and environment configuration.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
];

const defaultStats = [
  { icon: 'code', value: '3+', label: 'Full Stack Projects' },
  { icon: 'git-branch', value: 'Git', label: 'Team Collaboration' },
  { icon: 'users', value: 'Team', label: 'Real-World Experience' },
  { icon: 'zap', value: 'MERN', label: 'Modern Web Technologies' },
];

export default function About() {
  const { settings } = usePortfolioSettings();

  const activeHighlights =
    settings.aboutHighlights && settings.aboutHighlights.length > 0
      ? settings.aboutHighlights
      : defaultHighlights;

  const activeStats =
    settings.aboutStats && settings.aboutStats.length > 0
      ? settings.aboutStats
      : defaultStats;

  return (
    <SectionWrapper id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={settings.aboutEyebrow || 'About Me'}
          title={settings.aboutTitle || 'The Person Behind the Code'}
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* ── Left: Photo + stats ────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Professional circular photo frame with interactive 3D cursor tilt */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto mb-2">
              {/* Ambient glow */}
              <div
                className="absolute -inset-4 rounded-full opacity-30 blur-2xl pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(139,92,246,0.2) 60%, transparent 80%)',
                }}
                aria-hidden="true"
              />

              <TiltCard
                maxTilt={12}
                scale={1.03}
                glare={true}
                className="w-full h-full rounded-full"
              >
                {/* Gradient border ring */}
                <div className="relative w-full h-full p-[3px] rounded-full bg-gradient-to-tr from-cyan-400/80 via-teal-400/70 to-violet-500/80 shadow-xl overflow-hidden">
                  {/* Photo container directly inside gradient ring */}
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    {/* Sheen overlay */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] via-transparent to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    <img
                      src={settings.profileImageUrl || '/profile.jpg'}
                      alt={`${settings.name || 'Muhammad Ahmed'} — Full Stack MERN Developer`}
                      className="w-full h-full object-cover object-[50%_15%] select-none scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </div>
              </TiltCard>

              {/* Name badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-white/95 dark:bg-[#0D1828]/95 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 shadow-lg text-center whitespace-nowrap pointer-events-none">
                <p className="text-slate-800 dark:text-slate-200 text-xs font-semibold">{settings.name || 'Muhammad Ahmed'}</p>
                <p className="text-cyan-600 dark:text-cyan-400/90 text-[10px] font-medium">
                  {settings.heroSubtitle || settings.heroRole || 'Full Stack Developer'}
                </p>
              </div>
            </div>

            {/* Stats — interactive tilt cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {activeStats.map((item) => {
                const Icon = iconLookup[item.icon] || Code2;
                return (
                  <TiltCard
                    key={item.label}
                    maxTilt={8}
                    scale={1.02}
                    className="rounded-xl border border-slate-700/40 bg-[#0D1828]/60 p-4 flex flex-col gap-1 cursor-default"
                  >
                    <Icon size={16} className="text-cyan-400 mb-1" />
                    <span className="text-slate-100 font-bold text-lg leading-none">{item.value}</span>
                    <span className="text-slate-500 text-xs leading-snug">{item.label}</span>
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* ── Right: Bio text + highlight cards ─────────── */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="space-y-4">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {settings.aboutBioParagraph1 || (
                  <>
                    I'm a <span className="text-cyan-400 font-semibold">MERN Stack Developer</span>{' '}
                    focused on building full-stack web applications, dashboards, SaaS-style products,
                    and real-world digital solutions.
                  </>
                )}
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                {settings.aboutBioParagraph2 ||
                  'I work across frontend development, backend APIs, authentication, databases, deployment, and production problem-solving. My goal is always to ship things that work reliably and look professional.'}
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                {settings.aboutBioParagraph3 || (
                  <>
                    I'm currently building a healthcare platform with a team at{' '}
                    <span className="text-violet-400 font-medium">SMIT Peshawar</span>, using modern
                    engineering practices: Git workflows, reusable components, and production-ready code.
                  </>
                )}
              </p>
            </div>

            {/* Highlight cards with 3D tilt */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {activeHighlights.map((hl) => {
                const Icon = iconLookup[hl.icon] || Code2;
                return (
                  <TiltCard
                    key={hl.title}
                    variants={cardVariants}
                    maxTilt={8}
                    scale={1.02}
                    className={`rounded-xl border p-4 flex flex-col gap-3 ${hl.bg || 'bg-cyan-400/10 border-cyan-400/20'} cursor-default`}
                  >
                    <div className={`${hl.color || 'text-cyan-400'} flex items-center gap-2`}>
                      <Icon size={18} />
                      <span className="font-semibold text-sm">{hl.title}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{hl.desc}</p>
                  </TiltCard>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
