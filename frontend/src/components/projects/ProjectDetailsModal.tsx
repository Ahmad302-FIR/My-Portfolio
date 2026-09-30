import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CheckCircle2, Tag, Calendar, Layers } from 'lucide-react';
import type { Project } from '../../types/project';
import ProjectImage from './ProjectImagePlaceholder';

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
  // Close on Escape & handle body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  const statusColor =
    project.status === 'Live'
      ? 'border-emerald-400/40 text-emerald-400 bg-emerald-400/10'
      : project.status === 'In Development'
      ? 'border-amber-400/40 text-amber-400 bg-amber-400/10'
      : 'border-cyan-400/40 text-cyan-400 bg-cyan-400/10';

  const formattedDate = project.updatedAt
    ? new Date(project.updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-details-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#07111F]/85 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700/60 bg-[#0D1828] shadow-2xl shadow-black/60 z-10 flex flex-col"
          >
            {/* Top Accent bar */}
            <div
              className="h-1.5 w-full flex-shrink-0"
              style={{
                background: `linear-gradient(90deg, ${project.color || '#22D3EE'}, rgba(139,92,246,0.6), transparent)`,
              }}
            />

            {/* Header with Title & Close button */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-800/80 bg-[#101D30]/60">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-cyan-400/10 border border-cyan-400/25 text-cyan-400">
                    <Tag size={11} />
                    {project.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColor}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        project.status === 'Live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                      }`}
                    />
                    {project.status}
                  </span>
                  {formattedDate && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
                      <Calendar size={11} />
                      Updated {formattedDate}
                    </span>
                  )}
                </div>

                <h3
                  id="project-details-title"
                  className="text-xl sm:text-2xl font-bold text-slate-50 leading-tight mt-1"
                >
                  {project.title}
                </h3>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="h-8 w-8 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:border-slate-500 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Large Mockup / Image */}
              <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-lg">
                <ProjectImage
                  imageUrl={project.imageUrl}
                  title={project.title}
                  category={project.category}
                  color={project.color}
                  liveUrl={project.liveUrl}
                  className="rounded-t-xl"
                />
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Project Overview
                </h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {project.description || project.shortDescription}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Layers size={13} className="text-cyan-400" />
                  Technologies & Tools
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Key Features & Architecture
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/30 border border-slate-800"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-cyan-400 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-xs text-slate-300 leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#101D30]/80 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                slug: {project.slug}
              </span>

              <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-slate-100 hover:border-slate-500 text-xs font-semibold transition-colors"
                >
                  Close
                </button>

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all duration-200"
                    style={{
                      background: `linear-gradient(135deg, ${project.color || '#22D3EE'}, #0891B2)`,
                      boxShadow: `0 4px 16px ${project.color || '#22D3EE'}30`,
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
