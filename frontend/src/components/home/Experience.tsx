import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { experiences as defaultExperiences } from '../../data/portfolioData';
import { staggerContainer, slideInLeft } from '../../utils/animations';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const iconMap: Record<string, React.ElementType> = {
  'smit-internship': Briefcase,
  'smit-training': GraduationCap,
};

const colorMap: Record<string, string> = {
  'smit-internship': 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400',
  'smit-training': 'border-violet-400/40 bg-violet-400/10 text-violet-400',
};

export default function Experience() {
  const { experiences } = usePortfolioSettings();

  const activeExperiences =
    experiences && experiences.length > 0
      ? experiences.filter((e) => e.active !== false)
      : defaultExperiences;

  return (
    <SectionWrapper id="experience" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've Worked & Learned"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="relative max-w-3xl mx-auto"
        >
          {/* Timeline line */}
          <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/30 to-transparent hidden sm:block" />

          <div className="space-y-8">
            {activeExperiences.map((exp, idx) => {
              const expKey = (exp as any)._id || exp.id || `exp-${idx}`;
              const isCurrent = Boolean((exp as any).current);
              const Icon =
                (exp.id && iconMap[exp.id]) || (isCurrent ? Briefcase : GraduationCap);
              const color =
                (exp.id && colorMap[exp.id]) ||
                (isCurrent
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
                  : 'border-violet-400/40 bg-violet-400/10 text-violet-400');

              return (
                <motion.article
                  key={expKey}
                  variants={slideInLeft}
                  className="flex gap-5 sm:gap-8"
                  aria-label={`${exp.role} at ${exp.company}`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl border flex items-center justify-center ${color}`}>
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <motion.div
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="flex-1 rounded-2xl border border-slate-700/40 bg-[#0D1828]/60 p-5 backdrop-blur-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-slate-100 font-bold text-base">{exp.role}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{exp.company}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-3 py-1 rounded-full border border-slate-700/40 text-slate-500 bg-slate-800/40">
                          {exp.duration}
                        </span>
                        <span className="text-xs text-slate-600">{exp.type}</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {(exp.points || []).map((point, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400 leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60 mt-2 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
