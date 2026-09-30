import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Database, Image, Mail, Lock, ArrowDown } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { apiEndpoints } from '../../data/portfolioData';
import { staggerContainer, cardVariants, fadeUpVariants } from '../../utils/animations';

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
    bg: 'bg-cyan-400/5 border-cyan-400/20',
    items: ['JWT tokens', 'bcrypt hashing', 'OTP verification', 'Protected routes', 'Role-based access'],
  },
  {
    icon: Globe,
    title: 'API Development',
    color: 'text-violet-400',
    bg: 'bg-violet-400/5 border-violet-400/20',
    items: ['RESTful endpoints', 'Request validation', 'Error handling', 'API integration', 'Status codes'],
  },
  {
    icon: Database,
    title: 'Database',
    color: 'text-teal-400',
    bg: 'bg-teal-400/5 border-teal-400/20',
    items: ['MongoDB', 'Mongoose ODM', 'Schema design', 'Data relationships', 'Query optimization'],
  },
  {
    icon: Image,
    title: 'Media Handling',
    color: 'text-amber-400',
    bg: 'bg-amber-400/5 border-amber-400/20',
    items: ['Multer uploads', 'Cloudinary storage', 'Image optimization', 'File type validation'],
  },
  {
    icon: Mail,
    title: 'Email Services',
    color: 'text-rose-400',
    bg: 'bg-rose-400/5 border-rose-400/20',
    items: ['Nodemailer', 'OTP emails', 'Confirmation emails', 'Transactional flow'],
  },
  {
    icon: Lock,
    title: 'Security',
    color: 'text-slate-300',
    bg: 'bg-slate-800/40 border-slate-700/30',
    items: ['Environment variables', 'Input validation', 'Authorization checks', 'Error boundaries'],
  },
];

export default function Backend() {
  return (
    <SectionWrapper id="backend" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Beyond the UI"
          title="I Also Build the Systems Behind the Interface"
          description="Full-stack means both sides. Here's what I handle on the backend."
          align="center"
        />

        {/* Architecture flow */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-14 flex-wrap"
        >
          {archSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className={`rounded-xl border px-5 py-3 text-center ${step.border} bg-[#0D1828]/60`}>
                <p className={`${step.color} font-bold text-sm`}>{step.label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{step.sub}</p>
              </div>
              {i < archSteps.length - 1 && (
                <div className="flex flex-col items-center sm:rotate-[-90deg]">
                  <ArrowDown size={14} className="text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Backend capability cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
        >
          {backendCards.map(({ icon: Icon, title, color, bg, items }) => (
            <motion.div
              key={title}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-2xl border p-5 flex flex-col gap-4 ${bg}`}
            >
              <div className={`flex items-center gap-2 ${color}`}>
                <Icon size={18} />
                <span className="font-semibold text-sm">{title}</span>
              </div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${color.replace('text-', 'bg-')} flex-shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* API terminal showcase */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/80 backdrop-blur-sm overflow-hidden"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/30 bg-[#101D30]/60">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            <span className="ml-3 text-slate-500 text-xs font-mono">api-endpoints.http — AKR Restaurant Backend</span>
          </div>

          <div className="p-5 font-mono text-sm space-y-3">
            {apiEndpoints.map((endpoint, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 py-2 px-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
              >
                <span
                  className={`w-12 text-xs font-bold flex-shrink-0 ${
                    endpoint.method === 'GET'
                      ? 'text-cyan-400'
                      : endpoint.method === 'POST'
                      ? 'text-green-400'
                      : endpoint.method === 'PATCH'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {endpoint.method}
                </span>
                <span className="text-slate-300 flex-1 truncate">{endpoint.path}</span>
                <span
                  className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded ${
                    endpoint.status === 200
                      ? 'text-green-400 bg-green-400/10'
                      : 'text-cyan-400 bg-cyan-400/10'
                  }`}
                >
                  {endpoint.status} {endpoint.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
