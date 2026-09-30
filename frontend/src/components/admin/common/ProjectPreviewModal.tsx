import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Info, Eye } from 'lucide-react';
import type { Project } from '../../../types/project';
import ProjectImage from '../../projects/ProjectImagePlaceholder';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  project: Partial<Project>;
  onClose: () => void;
}

export default function ProjectPreviewModal({
  isOpen,
  project,
  onClose,
}: ProjectPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const title = project.title || 'Untitled Project';
  const category = project.category || 'General Web Application';
  const status = project.status || 'In Development';
  const color = project.color || '#22D3EE';
  const technologies = project.technologies || [];
  const shortDescription =
    project.shortDescription ||
    project.description ||
    'Provide a brief overview for the public project card.';

  const statusColor =
    status === 'Live'
      ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10'
      : status === 'In Development'
      ? 'border-amber-400/30 text-amber-400 bg-amber-400/10'
      : 'border-cyan-400/30 text-cyan-400 bg-cyan-400/10';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07111F]/80 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl border border-slate-700/60 bg-[#0D1828] p-6 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-cyan-400" />
              <h3 className="text-sm font-semibold text-slate-100">
                Public Card Preview
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Public Card Mockup */}
          <div className="mt-5">
            <div className="rounded-2xl border border-slate-700/40 bg-[#0D1828] overflow-hidden flex flex-col shadow-xl">
              {/* Color accent top line */}
              <div
                className="h-1 w-full"
                style={{
                  background: `linear-gradient(90deg, ${color}, transparent)`,
                }}
              />

              {/* Preview image */}
              <div className="relative">
                <ProjectImage
                  imageUrl={project.imageUrl}
                  title={title}
                  category={category}
                  color={color}
                  liveUrl={project.liveUrl}
                />
                <div className="absolute top-2.5 right-3 z-20">
                  <span
                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border backdrop-blur-md ${statusColor}`}
                  >
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                        status === 'Live'
                          ? 'bg-emerald-400 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                    {status}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col gap-3">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color }}
                >
                  {category}
                </span>

                <h4 className="text-base font-bold text-slate-100 leading-tight">
                  {title}
                </h4>

                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {shortDescription}
                </p>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[10px] font-medium rounded border border-slate-700/50 bg-slate-800/60 text-slate-400"
                    >
                      {t}
                    </span>
                  ))}
                  {technologies.length === 0 && (
                    <span className="text-[11px] text-slate-600 italic">
                      No technologies specified
                    </span>
                  )}
                </div>

                {/* Action buttons (Public: Live Demo + View Details, No GitHub) */}
                <div className="flex items-center gap-2 pt-3 mt-2 border-t border-slate-700/30">
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white opacity-90 cursor-default"
                    style={{
                      background: `linear-gradient(135deg, ${color}40, ${color}20)`,
                      border: `1px solid ${color}50`,
                    }}
                  >
                    <ExternalLink size={11} /> Live Demo
                  </span>

                  <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 ml-auto opacity-90 cursor-default">
                    <Info size={11} className="text-cyan-400" /> View Details
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700/60 bg-slate-800/50 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
            >
              Done Previewing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
