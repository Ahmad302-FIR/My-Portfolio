import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import type { Project, ProjectStatus } from '../../types/project';
import ImageUpload from '../../components/admin/common/ImageUpload';
import TechTagInput from '../../components/admin/common/TechTagInput';
import FeatureListInput from '../../components/admin/common/FeatureListInput';
import ProjectPreviewModal from '../../components/admin/common/ProjectPreviewModal';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';

const PRESET_COLORS = [
  { label: 'Cyan Accent', value: '#22D3EE' },
  { label: 'Violet Accent', value: '#8B5CF6' },
  { label: 'Teal Accent', value: '#14B8A6' },
  { label: 'Emerald Green', value: '#10B981' },
  { label: 'Amber Orange', value: '#F59E0B' },
];

export default function AdminProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Full Stack MERN Application');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePublicId, setImagePublicId] = useState('');
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Live');
  const [featured, setFeatured] = useState(true);
  const [order, setOrder] = useState<number>(1);
  const [color, setColor] = useState('#22D3EE');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load project if editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    projectService
      .getProjects()
      .then((all) => {
        const found = all.find((p) => p._id === id || p.id === id || p.slug === id);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setCategory(found.category);
          setShortDescription(found.shortDescription);
          setDescription(found.description);
          setImageUrl(found.imageUrl || '');
          setImagePublicId(found.imagePublicId || '');
          setLiveUrl(found.liveUrl || '');
          setStatus(found.status);
          setFeatured(found.featured);
          setOrder(found.order);
          setColor(found.color || '#22D3EE');
          setTechnologies(found.technologies || []);
          setFeatures(found.features || []);
        } else {
          setToast({
            id: String(Date.now()),
            type: 'error',
            message: `Project with ID ${id} could not be located.`,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // Auto-generate slug when title changes (only when creating)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Project title is required.';
    if (!slug.trim()) err.slug = 'Slug is required.';
    if (!shortDescription.trim()) err.shortDescription = 'Short description is required.';
    if (liveUrl.trim()) {
      if (!liveUrl.startsWith('http://') && !liveUrl.startsWith('https://')) {
        err.liveUrl = 'URL must start with http:// or https://';
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);

    try {
      let finalImageUrl = imageUrl;
      let finalImagePublicId = imagePublicId;

      if (pendingImageFile) {
        const uploadRes = await projectService.uploadScreenshot(pendingImageFile);
        finalImageUrl = uploadRes.url;
        finalImagePublicId = uploadRes.publicId;
      }

      const projectPayload = {
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim(),
        shortDescription: shortDescription.trim(),
        description: description.trim() || shortDescription.trim(),
        imageUrl: finalImageUrl,
        imagePublicId: finalImagePublicId,
        liveUrl: liveUrl.trim(),
        status,
        featured,
        order: Number(order) || 1,
        color,
        technologies,
        features,
      };

      if (isEditing && id) {
        await projectService.updateProject(id, projectPayload);
        setToast({
          id: String(Date.now()),
          type: 'success',
          message: 'Project updated successfully.',
        });
      } else {
        await projectService.createProject(projectPayload);
        setToast({
          id: String(Date.now()),
          type: 'success',
          message: 'Project created successfully.',
        });
      }

      setTimeout(() => {
        navigate('/admin/projects');
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error saving project.';
      setToast({
        id: String(Date.now()),
        type: 'error',
        message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await projectService.deleteProject(id);
      navigate('/admin/projects');
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Failed to delete project.',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-xs text-slate-500">
        <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
        Loading project fields...
      </div>
    );
  }

  // Active object for preview modal
  const previewProjectData: Partial<Project> = {
    title,
    slug,
    category,
    shortDescription,
    description,
    imageUrl,
    liveUrl,
    status,
    color,
    technologies,
    features,
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {isEditing ? `Edit: ${title || 'Project'}` : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? 'Update live URLs, media screenshots, and tech stack specification'
                : 'Publish a new project into your dynamic portfolio catalog'}
            </p>
          </div>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cyan-400/40 bg-cyan-400/10 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20 transition-colors"
          >
            <Eye size={14} />
            <span>Preview Card</span>
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
              title="Delete Project"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Project Title <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Digital Medical"
                className={`w-full rounded-xl border bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                  errors.title
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                URL Slug <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. digital-medical"
                className={`w-full rounded-xl border bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 font-mono ${
                  errors.slug
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              {errors.slug && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.slug}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Healthcare Platform / Full Stack MERN Application"
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Theme Color Accent
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-9 w-12 rounded-lg border border-slate-700 bg-transparent cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`h-6 w-6 rounded-md border transition-transform ${
                        color === c.value ? 'scale-110 border-white' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Description (Card Summary) <span className="text-cyan-400">*</span>
            </label>
            <textarea
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Concise 1-2 sentence overview for the card..."
              className={`w-full rounded-xl border bg-[#101D30] px-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none ${
                errors.shortDescription
                  ? 'border-rose-500/60 focus:ring-rose-500/20'
                  : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
              }`}
            />
            {errors.shortDescription && (
              <p className="mt-1 text-[11px] text-rose-400">{errors.shortDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Description (Modal & Detail View)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="In-depth project breakdown, architectural decisions, and capabilities..."
              className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Media Screenshot */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Project Screenshot</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload image file for local browser preview (Cloudinary upload ready)
              </p>
            </div>
          </div>

          <ImageUpload
            value={imageUrl}
            onChange={(url, file) => {
              setImageUrl(url);
              if (file) {
                setPendingImageFile(file);
              } else {
                setPendingImageFile(null);
                setImagePublicId('');
              }
            }}
          />
        </div>

        {/* Section 3: Live Link & Status Details */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Deployment & Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Live URL
              </label>
              <input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://your-app.vercel.app"
                className={`w-full rounded-xl border bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 font-mono ${
                  errors.liveUrl
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              {errors.liveUrl && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.liveUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 cursor-pointer"
              >
                <option value="Live" className="bg-[#101D30]">Live</option>
                <option value="In Development" className="bg-[#101D30]">In Development</option>
                <option value="Completed" className="bg-[#101D30]">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-400 focus:ring-cyan-400/20"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Featured Project Showcase
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Prominently highlight this project on public home showcase
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Technologies */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Technologies & Libraries
          </h3>
          <TechTagInput
            technologies={technologies}
            onChange={(tags) => setTechnologies(tags)}
          />
        </div>

        {/* Section 5: Key Features */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 pb-3 border-b border-slate-800">
            Key Features & Capabilities
          </h3>
          <FeatureListInput
            features={features}
            onChange={(items) => setFeatures(items)}
          />
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-700/60 bg-[#101D30]/90 backdrop-blur-md">
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20 transition-colors"
            >
              Preview
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-[#07111F] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSaving ? 'Saving...' : isEditing ? 'Update Project' : 'Publish Project'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <ProjectPreviewModal
        isOpen={isPreviewOpen}
        project={previewProjectData}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Delete Modal for Edit mode */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Project"
        message={`Delete "${title}"? This will permanently remove it from your projects list.`}
        confirmLabel="Delete Project"
        isDangerous
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
