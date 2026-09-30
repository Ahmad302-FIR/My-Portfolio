import { motion } from 'framer-motion';
import { Code2, Server, ShieldCheck, Rocket, Layers, Users, GitBranch, Zap } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { staggerContainer, cardVariants } from '../../utils/animations';

const highlights = [
  {
    icon: Layers,
    title: 'Full Stack Development',
    desc: 'End-to-end web applications from UI to database and deployment.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10 border-cyan-400/20',
  },
  {
    icon: Server,
    title: 'REST API Development',
    desc: 'Scalable, well-structured APIs with proper error handling and validation.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20',
  },
  {
    icon: ShieldCheck,
    title: 'Authentication & Authorization',
    desc: 'JWT, bcrypt, OTP verification, and role-based access control.',
    color: 'text-teal-400',
    bg: 'bg-teal-400/10 border-teal-400/20',
  },
  {
    icon: Rocket,
    title: 'Production Deployment',
    desc: 'Deployment with Vercel, Netlify, Cloudinary, and environment configuration.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
  },
];

const stats = [
  { icon: Code2, value: '3+', label: 'Full Stack Projects' },
  { icon: GitBranch, value: 'Git', label: 'Team Collaboration' },
  { icon: Users, value: 'Team', label: 'Real-World Experience' },
  { icon: Zap, value: 'MERN', label: 'Modern Web Technologies' },
];

export default function About() {
  return (
    <SectionWrapper id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="About Me"
          title="The Person Behind the Code"
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* ── Left: Photo + stats ────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Professional circular photo frame */}
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

              {/* Gradient border ring */}
              <div className="relative w-full h-full p-[2.5px] rounded-full bg-gradient-to-tr from-cyan-400/80 via-teal-400/70 to-violet-500/80 shadow-xl">
                {/* Inner border & background */}
                <div className="w-full h-full rounded-full p-[2px] bg-[#0D1828]">
                  {/* Photo container */}
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#112238] to-[#07111F]">
                    {/* Sheen overlay */}
                    <div
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.06] via-transparent to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    <img
                      src="/profile.jpg"
                      alt="Muhammad Ahmed — Full Stack MERN Developer"
                      className="w-full h-full object-cover object-[50%_15%] select-none scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />

                    {/* Bottom subtle ambient shade */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/4 rounded-b-full bg-gradient-to-t from-[#07111F]/40 to-transparent pointer-events-none z-10"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              {/* Name badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1 rounded-full bg-[#0D1828]/95 backdrop-blur-md border border-slate-700/60 shadow-lg text-center whitespace-nowrap">
                <p className="text-slate-200 text-xs font-semibold">Muhammad Ahmed</p>
                <p className="text-cyan-400/90 text-[10px] font-medium">Full Stack Developer</p>
              </div>
            </div>

            {/* Stats — pushed down to clear the badge */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-700/40 bg-[#0D1828]/60 p-4 flex flex-col gap-1"
                >
                  <Icon size={16} className="text-cyan-400 mb-1" />
                  <span className="text-slate-100 font-bold text-lg leading-none">{value}</span>
                  <span className="text-slate-500 text-xs leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Bio text + highlight cards ─────────── */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <div className="space-y-4">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                I'm a{' '}
                <span className="text-cyan-400 font-semibold">MERN Stack Developer</span> focused on
                building full-stack web applications, dashboards, SaaS-style products, and real-world
                digital solutions.
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                I work across frontend development, backend APIs, authentication, databases,
                deployment, and production problem-solving. My goal is always to ship things that
                work reliably and look professional.
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                I'm currently building a healthcare platform with a team at{' '}
                <span className="text-violet-400 font-medium">SMIT Peshawar</span>, using modern
                engineering practices: Git workflows, reusable components, and production-ready code.
              </p>
            </div>

            {/* Highlight cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {highlights.map(({ icon: Icon, title, desc, color, bg }) => (
                <motion.div
                  key={title}
                  variants={cardVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className={`rounded-xl border p-4 flex flex-col gap-3 ${bg} cursor-default`}
                >
                  <div className={`${color} flex items-center gap-2`}>
                    <Icon size={18} />
                    <span className="font-semibold text-sm">{title}</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
