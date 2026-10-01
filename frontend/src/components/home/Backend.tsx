import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Database, Image, Mail, Lock, ArrowDown, Terminal, Copy, Check } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import TiltCard from '../common/TiltCard';
import { staggerContainer, cardVariants, fadeUpVariants } from '../../utils/animations';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const archSteps = [
  { label: 'Frontend', sub: 'React / Next.js', color: 'text-cyan-400', border: 'border-cyan-400/30' },
  { label: 'REST API', sub: 'Express.js Routes', color: 'text-violet-400', border: 'border-violet-400/30' },
  { label: 'Node.js', sub: 'Server / Middleware', color: 'text-teal-400', border: 'border-teal-400/30' },
  { label: 'MongoDB', sub: 'Mongoose ODM', color: 'text-amber-400', border: 'border-amber-400/30' },
  { label: 'Services', sub: 'Cloudinary · Email', color: 'text-rose-400', border: 'border-rose-400/30' },
];

const backendCards = [
  {
    icon: ShieldCheck,
    title: 'Authentication',
    color: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    bg: 'bg-cyan-400/5 border-cyan-400/20',
    items: ['JWT tokens', 'bcrypt hashing', 'OTP verification', 'Protected routes', 'Role-based access'],
  },
  {
    icon: Globe,
    title: 'API Development',
    color: 'text-violet-400',
    dotColor: 'bg-violet-400',
    bg: 'bg-violet-400/5 border-violet-400/20',
    items: ['RESTful endpoints', 'Request validation', 'Error handling', 'API integration', 'Status codes'],
  },
  {
    icon: Database,
    title: 'Database',
    color: 'text-teal-400',
    dotColor: 'bg-teal-400',
    bg: 'bg-teal-400/5 border-teal-400/20',
    items: ['MongoDB', 'Mongoose ODM', 'Schema design', 'Data relationships', 'Query optimization'],
  },
  {
    icon: Image,
    title: 'Media Handling',
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    bg: 'bg-amber-400/5 border-amber-400/20',
    items: ['Multer uploads', 'Cloudinary storage', 'Image optimization', 'File type validation'],
  },
  {
    icon: Mail,
    title: 'Email Services',
    color: 'text-rose-400',
    dotColor: 'bg-rose-400',
    bg: 'bg-rose-400/5 border-rose-400/20',
    items: ['Nodemailer', 'OTP emails', 'Confirmation emails', 'Transactional flow'],
  },
  {
    icon: Lock,
    title: 'Security',
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    bg: 'bg-emerald-400/5 border-emerald-400/20',
    items: ['Environment variables', 'Input validation', 'Authorization checks', 'Error boundaries'],
  },
];

interface ApiEndpointItem {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  title: string;
  type: 'live' | 'demo';
  status: number;
  latency: string;
  response: Record<string, any>;
}

const interactiveEndpoints: ApiEndpointItem[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    title: 'Cluster Health & Runtime Status',
    type: 'live',
    status: 200,
    latency: '14ms',
    response: {
      status: 'operational',
      database: 'connected (MongoDB Atlas)',
      stack: 'Node.js · Express · TypeScript',
      security: {
        helmet: true,
        rateLimiting: true,
        cors: true,
      },
      latency: '14ms',
    },
  },
  {
    id: 'projects',
    method: 'GET',
    path: '/api/projects',
    title: 'Public Projects Catalog API',
    type: 'live',
    status: 200,
    latency: '22ms',
    response: {
      status: 'success',
      count: 3,
      data: [
        { title: 'Digital Medical', category: 'Healthcare', status: 'In Development' },
        { title: 'AKR Restaurant', category: 'Full Stack MERN', status: 'Live' },
        { title: 'Laptop Shop', category: 'E-commerce', status: 'Live' },
      ],
    },
  },
  {
    id: 'auth',
    method: 'POST',
    path: '/api/auth/login',
    title: 'Admin Authentication Handshake',
    type: 'demo',
    status: 200,
    latency: '34ms',
    response: {
      status: 'demo_verified',
      authStrategy: 'HTTP-Only Signed Cookie · Session Token',
      security: 'CSRF Protection · Brute-force Limiter Active',
      message: 'Simulated preview — Production credentials require verified physical 2FA',
    },
  },
  {
    id: 'messages',
    method: 'POST',
    path: '/api/messages',
    title: 'Inquiry Dispatch Pipeline',
    type: 'demo',
    status: 201,
    latency: '42ms',
    response: {
      status: 'simulated_success',
      validation: 'payload sanitized & schema verified',
      storage: 'inquiry recorded in MongoDB',
      dispatch: 'notification pipeline triggered',
      message: 'Demo execution — safe simulation without triggering real external notifications',
    },
  },
];

export default function Backend() {
  const { settings } = usePortfolioSettings();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointItem>(interactiveEndpoints[0]);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSelect = (ep: ApiEndpointItem) => {
    setIsSimulating(true);
    setSelectedEndpoint(ep);
    setTimeout(() => setIsSimulating(false), 120);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEndpoint.response, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <SectionWrapper id="backend" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={settings.backendEyebrow || 'Beyond the UI'}
          title={settings.backendTitle || 'I Also Build the Systems Behind the Interface'}
          description={
            settings.backendDescription ||
            "Full-stack means both sides. Here's what I handle on the backend."
          }
          align="center"
        />

        {/* Architecture flow */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 mb-14 flex-wrap"
        >
          {archSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col md:flex-row items-center w-full md:w-auto md:gap-2">
              <div
                className={`w-[82%] max-w-[320px] md:w-auto md:max-w-none rounded-xl border px-6 py-3.5 md:px-5 md:py-3 text-center ${step.border} bg-[#0D1828]/60 shadow-xs`}
              >
                <p className={`${step.color} font-bold text-base md:text-sm`}>{step.label}</p>
                <p className="text-slate-400 md:text-slate-500 text-xs mt-1 md:mt-0.5">{step.sub}</p>
              </div>
              {i < archSteps.length - 1 && (
                <div className="flex flex-col items-center justify-center my-2.5 md:my-0 md:rotate-[-90deg] flex-shrink-0">
                  <ArrowDown size={14} className="text-slate-500 md:text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Backend capability cards with 3D tilt */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
        >
          {backendCards.map(({ icon: Icon, title, color, dotColor, bg, items }) => (
            <TiltCard
              key={title}
              variants={cardVariants}
              maxTilt={8}
              scale={1.02}
              glare={true}
              className={`rounded-2xl border p-5 flex flex-col gap-4 ${bg} cursor-default`}
            >
              <div className={`flex items-center gap-2 ${color}`}>
                <Icon size={18} />
                <span className="font-semibold text-sm">{title}</span>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${dotColor} flex-shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          ))}
        </motion.div>

        {/* Interactive API Terminal Workbench */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/80 backdrop-blur-sm overflow-hidden shadow-lg"
        >
          {/* Terminal header */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-700/30 bg-[#101D30]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              <div className="flex items-center gap-1.5 ml-2.5 font-mono text-xs text-slate-400">
                <Terminal size={13} className="text-cyan-400" />
                <span>interactive-rest-api.sh</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                HTTP {selectedEndpoint.status} OK
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Latency: <span className="text-cyan-400 font-semibold">{selectedEndpoint.latency}</span>
              </span>
            </div>
          </div>

          {/* Endpoint selector pills with horizontal scroll on mobile */}
          <div className="px-3 py-2 border-b border-slate-800/80 bg-[#0A1424]/60 flex items-center gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            {interactiveEndpoints.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              const isLive = ep.type === 'live';
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => handleSelect(ep)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs flex-shrink-0 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-400/15 border border-cyan-500/40 dark:border-cyan-400/40 text-cyan-600 dark:text-cyan-300 shadow-xs font-semibold'
                      : 'bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`font-bold text-[10px] px-1.5 py-0.5 rounded leading-none ${
                      ep.method === 'GET'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span>{ep.path}</span>
                  <span
                    className={`text-[9px] font-sans font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full leading-none ${
                      isLive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                    }`}
                  >
                    {isLive ? 'Live' : 'Demo'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Endpoint details & response view */}
          <div className="p-3.5 space-y-2.5 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-1 border-b border-slate-800/60 text-slate-400">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-300 font-semibold">{selectedEndpoint.title}</span>
                {selectedEndpoint.type === 'live' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Endpoint
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-sans font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Simulated Demo (Protected)
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors ml-auto cursor-pointer"
                title="Copy response JSON"
              >
                {copiedResponse ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {/* Code / JSON response display with compact height & internal scroll */}
            <div className="relative rounded-xl border border-slate-800 bg-[#07111F] p-3.5 overflow-x-auto max-h-[185px] overflow-y-auto scrollbar-thin shadow-inner">
              {isSimulating ? (
                <div className="flex items-center justify-center py-6 text-cyan-400 gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  <span>Executing {selectedEndpoint.method} {selectedEndpoint.path}...</span>
                </div>
              ) : (
                <pre className="text-slate-200 leading-snug font-mono text-[11.5px]">
                  <code>{JSON.stringify(selectedEndpoint.response, null, 2)}</code>
                </pre>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
