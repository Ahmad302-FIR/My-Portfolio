import { useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { skillCategories as defaultSkillCategories, techMarqueeItems as defaultTechMarqueeItems } from '../../data/portfolioData';
import { staggerContainer, cardVariants } from '../../utils/animations';
import { usePortfolioSettings } from '../../context/PortfolioContext';

const categoryColor: Record<string, string> = {
  Frontend: 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5',
  Backend: 'text-violet-400 border-violet-400/20 bg-violet-400/5',
  Database: 'text-teal-400 border-teal-400/20 bg-teal-400/5',
  'Tools & Deployment': 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  Practices: 'text-slate-300 border-slate-600/30 bg-slate-800/30',
};

const categoryHeader: Record<string, string> = {
  Frontend: 'from-cyan-400/20 to-transparent',
  Backend: 'from-violet-400/20 to-transparent',
  Database: 'from-teal-400/20 to-transparent',
  'Tools & Deployment': 'from-amber-400/20 to-transparent',
  Practices: 'from-slate-500/20 to-transparent',
};

export default function Skills() {
  const { skills, settings } = usePortfolioSettings();

  const categories = useMemo(() => {
    if (!skills || skills.length === 0) {
      return defaultSkillCategories;
    }

    // Group active skills by category maintaining order
    const categoryMap = new Map<string, { label: string; skills: { name: string }[] }>();

    for (const skill of skills) {
      if (skill.active === false) continue;
      const cat = skill.category || 'Additional';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, { label: cat, skills: [] });
      }
      categoryMap.get(cat)!.skills.push({ name: skill.name });
    }

    return Array.from(categoryMap.values());
  }, [skills]);

  const marqueeItems =
    settings.techMarqueeItems && settings.techMarqueeItems.length > 0
      ? settings.techMarqueeItems
      : defaultTechMarqueeItems;

  return (
    <SectionWrapper id="skills" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Technical Skills"
          title="Tools I Work With"
          description="A full-stack toolkit — frontend, backend, database, and everything in between."
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-5%' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {categories.map((category) => {
            const colorClass = categoryColor[category.label] ?? 'text-slate-300 border-slate-600/30 bg-slate-800/30';
            const headerClass = categoryHeader[category.label] ?? 'from-slate-500/20 to-transparent';
            return (
              <motion.div
                key={category.label}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/60 backdrop-blur-sm overflow-hidden"
              >
                {/* Header */}
                <div className={`px-5 py-4 bg-gradient-to-r ${headerClass} border-b border-slate-700/30`}>
                  <span className={`text-sm font-semibold ${colorClass.split(' ')[0]}`}>
                    {category.label}
                  </span>
                </div>

                {/* Skills grid */}
                <div className="p-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <motion.span
                      key={skill.name}
                      whileHover={{ scale: 1.06 }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${colorClass} cursor-default transition-all duration-150`}
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Marquee */}
        <div className="mt-14 overflow-hidden relative">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="px-5 py-2.5 rounded-full border border-slate-700/40 bg-slate-800/30 text-slate-500 text-sm font-medium whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
