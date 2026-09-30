import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Info, ChevronDown, ChevronUp } from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import { projectService } from '../../services/projectService';
import { staggerContainer, cardVariants } from '../../utils/animations';
import type { Project } from '../../types/project';
import ProjectImage from './ProjectImagePlaceholder';
import ProjectDetailsModal from './ProjectDetailsModal';

function TechBadge({ name }: { name: string }) {
  return (
    <span className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-700/50 bg-slate-800/50 text-slate-400">
      {name}
    </span>
  );
}

function FeatureChip({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/30">
      <span className="h-1 w-1 rounded-full bg-cyan-400" />
      {text}
    </span>
  );
}

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusColor =
    project.status === 'Live'
      ? 'border-emerald-400/30 text-emerald-400 bg-emerald-400/5'
      : project.status === 'In Development'
      ? 'border-amber-400/30 text-amber-400 bg-amber-400/5'
      : 'border-cyan-400/30 text-cyan-400 bg-cyan-400/5';

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative rounded-2xl border border-slate-700/40 bg-[#0D1828]/80 backdrop-blur-sm overflow-hidden flex flex-col"
      aria-label={`Project: ${project.title}`}
    >
      {/* Color accent top bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${project.color || '#22D3EE'}, transparent)`,
        }}
      />

      {/* Browser mockup & screenshot container with hover zoom */}
      <div className="relative">
        <ProjectImage
          imageUrl={project.imageUrl}
          title={project.title}
          category={project.category}
          color={project.color}
          liveUrl={project.liveUrl}
        />

        {/* Floating status & category badges on top of preview */}
        <div className="absolute top-2.5 right-3 z-20 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border backdrop-blur-md ${statusColor}`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full mr-1.5 ${
                project.status === 'Live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {project.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-6 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="text-xs font-semibold uppercase tracking-wider block mb-1"
              style={{ color: project.color || '#22D3EE' }}
            >
              {project.category}
            </span>
            <h3 className="text-slate-100 font-bold text-lg leading-tight">
              {project.title}
            </h3>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((t) => (
            <TechBadge key={t} name={t} />
          ))}
        </div>

        {/* Features toggle */}
        {project.features && project.features.length > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors w-fit select-none"
              aria-expanded={expanded}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? 'Hide key features' : 'Show key features'}
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {project.features.map((f) => (
                      <FeatureChip key={f} text={f} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Action Buttons: Live Demo & View Details (No GitHub Button) */}
        <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-slate-700/30">
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all duration-200"
              style={{
                background: `linear-gradient(135deg, ${project.color || '#22D3EE'}40, ${
                  project.color || '#22D3EE'
                }22)`,
                border: `1px solid ${project.color || '#22D3EE'}55`,
              }}
              aria-label={`Live demo of ${project.title}`}
            >
              <ExternalLink size={12} /> Live Demo
            </motion.a>
          )}

          <motion.button
            type="button"
            onClick={() => onViewDetails(project)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-all duration-200 ml-auto"
            aria-label={`View details of ${project.title}`}
          >
            <Info size={12} className="text-cyan-400" /> View Details
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic project retrieval from projectService (admin-ready)
  useEffect(() => {
    let isMounted = true;
    projectService
      .getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load projects from service:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDetails = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsModalOpen(false);
  };

  return (
    <SectionWrapper id="projects" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="What I've Built"
          description="Real-world full-stack products — from healthcare platforms to restaurant systems and e-commerce applications."
          align="center"
        />

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
            <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mr-3" />
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No projects found.
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-5%' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <ProjectCard
                key={project._id || project.id || project.slug}
                project={project}
                onViewDetails={handleOpenDetails}
              />
            ))}
          </motion.div>
        )}

        {/* Dynamic Project Details Modal */}
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </SectionWrapper>
  );
}
