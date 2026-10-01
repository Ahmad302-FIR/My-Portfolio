import { motion } from 'framer-motion';
import { Lightbulb, Layout, Code2, CheckCircle, GitBranch, UploadCloud, TrendingUp, Zap, Shield, Sparkles } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { workflowSteps as defaultWorkflowSteps } from '../../data/portfolioData';
import { contactConfig } from '../../data/contact';
import { staggerContainer, cardVariants } from '../../utils/animations';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const iconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  layout: Layout,
  code: Code2,
  'check-circle': CheckCircle,
  'git-branch': GitBranch,
  'upload-cloud': UploadCloud,
  'trending-up': TrendingUp,
  zap: Zap,
  shield: Shield,
  sparkles: Sparkles,
};

const stepColors = [
  'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  'text-violet-400 border-violet-400/30 bg-violet-400/5',
  'text-teal-400 border-teal-400/30 bg-teal-400/5',
  'text-amber-400 border-amber-400/30 bg-amber-400/5',
  'text-rose-400 border-rose-400/30 bg-rose-400/5',
  'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'text-green-400 border-green-400/30 bg-green-400/5',
];

const defaultGithubPractices = [
  { label: 'Clean Repository Structure', desc: 'Organized folders with separation of concerns' },
  { label: 'Reusable Components', desc: 'DRY patterns across projects' },
  { label: 'Git / GitHub Workflow', desc: 'Feature branches, commits, pull requests' },
  { label: 'Environment Variables', desc: '.env files, secrets management' },
  { label: 'API Integration', desc: 'Axios, fetch, error handling patterns' },
  { label: 'Production Deployment', desc: 'Vercel, Netlify, with proper configs' },
  { label: 'Meaningful Commits', desc: 'Descriptive messages and logical history' },
];

export default function Workflow() {
  const { settings } = usePortfolioSettings();

  const steps =
    settings.workflowSteps && settings.workflowSteps.length > 0
      ? settings.workflowSteps.filter((s) => s.active !== false)
      : defaultWorkflowSteps;

  const practices =
    settings.githubPractices && settings.githubPractices.length > 0
      ? settings.githubPractices
      : defaultGithubPractices;

  const githubUrl = settings.github || contactConfig.github;

  return (
    <SectionWrapper id="workflow" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={settings.workflowEyebrow || 'Development Workflow'}
          title={settings.workflowTitle || 'How I Build Products'}
          description={
            settings.workflowDescription ||
            'A structured process from idea to production — consistently applied across every project.'
          }
          align="center"
        />

        {/* Workflow steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="flex flex-wrap justify-center gap-3.5 mb-16"
        >
          {steps.map((step, i) => {
            const Icon = (step.icon && iconMap[step.icon]) || Code2;
            const color = stepColors[i % stepColors.length];
            return (
              <div key={step.label} className="flex items-center gap-2">
                <motion.div
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.04, transition: { duration: 0.2 } }}
                  className={`rounded-xl border px-4 py-3 flex flex-col items-center gap-1.5 min-w-[80px] ${color}`}
                >
                  <span className="text-[10px] font-mono opacity-60 font-bold">
                    0{i + 1}
                  </span>
                  <Icon size={18} />
                  <span className="text-xs font-semibold whitespace-nowrap">{step.label}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <span className="text-slate-600 text-lg font-light hidden sm:block">→</span>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* GitHub practices */}
        <div className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/30 flex items-center gap-3">
            <GitBranch size={16} className="text-slate-400" />
            <span className="text-slate-300 font-semibold text-sm">Code Quality & GitHub Practices</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs text-cyan-400 hover:underline"
            >
              View GitHub →
            </a>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/20"
          >
            {practices.map(({ label, desc }) => (
              <motion.div
                key={label}
                variants={cardVariants}
                className="p-5 flex flex-col gap-1 hover:bg-slate-800/20 transition-colors"
              >
                <span className="text-slate-200 text-sm font-medium">{label}</span>
                <span className="text-slate-500 text-xs leading-relaxed">{desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
