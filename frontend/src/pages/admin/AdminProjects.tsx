import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Star,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import type { Project } from '../../types/project';
import StatusBadge from '../../components/admin/common/StatusBadge';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import ProjectDetailsModal from '../../components/projects/ProjectDetailsModal';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'order' | 'date'>('order');

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadProjects = () => {
    setLoading(true);
    projectService
      .getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load projects:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Distinct categories list
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.technologies || []).some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          );
        const matchesStatus =
          statusFilter === 'All' || p.status === statusFilter;
        const matchesCategory =
          categoryFilter === 'All' || p.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'order') return a.order - b.order;
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
  }, [projects, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    const targetId = projectToDelete._id || projectToDelete.id || projectToDelete.slug;
    try {
      await projectService.deleteProject(targetId);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: `Project "${projectToDelete.title}" deleted successfully.`,
      });
      setProjectToDelete(null);
      loadProjects();
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Failed to delete project. Please retry.',
      });
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    const targetId = project._id || project.id || project.slug;
    try {
      await projectService.updateProject(targetId, {
        featured: !project.featured,
      });
      loadProjects();
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: `Updated featured status for "${project.title}".`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Project Catalog</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage public portfolio projects, live demos, and technical specifications
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-[#07111F] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, technology, or category..."
            className="w-full rounded-xl border border-slate-700/70 bg-[#101D30] pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-[#101D30] text-xs">
            <Filter size={13} className="text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#101D30]">Status: All</option>
              <option value="Live" className="bg-[#101D30]">Live</option>
              <option value="In Development" className="bg-[#101D30]">In Development</option>
              <option value="Completed" className="bg-[#101D30]">Completed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-[#101D30] text-xs">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer max-w-[150px] truncate"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#101D30]">
                  Category: {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-[#101D30] text-xs">
            <ArrowUpDown size={13} className="text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'order' | 'date')}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="order" className="bg-[#101D30]">Sort: Display Order</option>
              <option value="date" className="bg-[#101D30]">Sort: Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table & Card list */}
      <div className="rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
            Loading project specifications...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No projects matched your active filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#101D30]/60 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Live URL</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredProjects.map((project) => (
                  <tr
                    key={project._id || project.id || project.slug}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Order column */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-400">
                      #{project.order}
                    </td>

                    {/* Project title + tech preview */}
                    <td className="py-4 px-4 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border shadow-md"
                          style={{
                            backgroundColor: `${project.color || '#22D3EE'}15`,
                            borderColor: `${project.color || '#22D3EE'}40`,
                            color: project.color || '#22D3EE',
                          }}
                        >
                          {project.title[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors truncate">
                            {project.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-mono">
                              /{project.slug}
                            </span>
                            <span className="text-[10px] text-slate-500">·</span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                              {project.technologies.slice(0, 3).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {project.category}
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={project.status} size="sm" />
                    </td>

                    {/* Featured toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(project)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          project.featured
                            ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                            : 'border-slate-800 bg-slate-800/40 text-slate-600 hover:text-slate-400'
                        }`}
                        title={
                          project.featured ? 'Featured on home' : 'Click to feature'
                        }
                      >
                        <Star
                          size={14}
                          className={project.featured ? 'fill-violet-400' : ''}
                        />
                      </button>
                    </td>

                    {/* Live URL */}
                    <td className="py-4 px-4 whitespace-nowrap max-w-[180px]">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline truncate max-w-[170px]"
                        >
                          <ExternalLink size={12} className="flex-shrink-0" />
                          <span className="truncate">
                            {project.liveUrl.replace(/^https?:\/\//, '')}
                          </span>
                        </a>
                      ) : (
                        <span className="text-slate-600 italic">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => setViewProject(project)}
                          className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/40 transition-colors"
                          title="View Details"
                        >
                          <Eye size={13} />
                        </button>
                        <Link
                          to={`/admin/projects/edit/${project._id || project.slug}`}
                          className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors inline-block"
                          title="Edit Project"
                        >
                          <Edit2 size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className="p-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-rose-400 hover:border-rose-400/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(projectToDelete)}
        title="Delete Project"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This item will be removed from your catalog.`}
        confirmLabel="Delete Project"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setProjectToDelete(null)}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={viewProject}
        isOpen={Boolean(viewProject)}
        onClose={() => setViewProject(null)}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
