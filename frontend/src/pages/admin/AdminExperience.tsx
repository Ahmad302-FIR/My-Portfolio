import { useState, useEffect, type FormEvent } from 'react';
import {
  Plus,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { experienceService } from '../../services/experienceService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import type { ExperienceItem } from '../../types/portfolio';

export default function AdminExperience() {
  const { refreshSettings } = usePortfolioSettings();
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [expToDelete, setExpToDelete] = useState<ExperienceItem | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Form Fields
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formType, setFormType] = useState('');
  const [formPoints, setFormPoints] = useState<string[]>(['']);
  const [formCurrent, setFormCurrent] = useState(false);
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formActive, setFormActive] = useState(true);

  const fetchExperiences = async () => {
    try {
      const data = await experienceService.getAdminExperiences();
      setExperiences(data);
    } catch (err) {
      console.error('Failed to load experiences:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setFormCompany('');
    setFormRole('');
    setFormDuration('Present');
    setFormType('Internship · Team Project');
    setFormPoints(['']);
    setFormCurrent(false);
    setFormOrder(experiences.length + 1);
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExp(exp);
    setFormCompany(exp.company);
    setFormRole(exp.role);
    setFormDuration(exp.duration || 'Present');
    setFormType(exp.type || 'Full-time');
    setFormPoints(exp.points && exp.points.length > 0 ? [...exp.points] : ['']);
    setFormCurrent(Boolean(exp.current));
    setFormOrder(exp.order || 1);
    setFormActive(exp.active !== false);
    setIsModalOpen(true);
  };

  const handlePointChange = (index: number, val: string) => {
    const updated = [...formPoints];
    updated[index] = val;
    setFormPoints(updated);
  };

  const handleAddPoint = () => {
    setFormPoints([...formPoints, '']);
  };

  const handleRemovePoint = (index: number) => {
    if (formPoints.length <= 1) {
      setFormPoints(['']);
      return;
    }
    setFormPoints(formPoints.filter((_, i) => i !== index));
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formCompany.trim() || !formRole.trim()) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Organization and role are required.',
      });
      return;
    }

    const cleanedPoints = formPoints.map((p) => p.trim()).filter(Boolean);

    setModalSaving(true);
    try {
      if (editingExp) {
        const id = editingExp._id || editingExp.id!;
        await experienceService.updateExperience(id, {
          company: formCompany.trim(),
          role: formRole.trim(),
          duration: formDuration.trim(),
          type: formType.trim(),
          points: cleanedPoints,
          current: formCurrent,
          order: Number(formOrder),
          active: formActive,
        });
        setToast({ id: String(Date.now()), type: 'success', message: 'Experience updated successfully.' });
      } else {
        await experienceService.createExperience({
          company: formCompany.trim(),
          role: formRole.trim(),
          duration: formDuration.trim(),
          type: formType.trim(),
          points: cleanedPoints,
          current: formCurrent,
          order: Number(formOrder),
          active: formActive,
        });
        setToast({ id: String(Date.now()), type: 'success', message: 'Experience entry created successfully.' });
      }

      setIsModalOpen(false);
      await fetchExperiences();
      await refreshSettings();
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to save experience entry.',
      });
    } finally {
      setModalSaving(false);
    }
  };

  const handleToggleActive = async (exp: ExperienceItem) => {
    const id = exp._id || exp.id!;
    const newActive = !exp.active;
    try {
      await experienceService.updateExperience(id, { active: newActive });
      setExperiences((prev) =>
        prev.map((e) => (e._id === id || e.id === id ? { ...e, active: newActive } : e))
      );
      await refreshSettings();
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: `Marked "${exp.role}" as ${newActive ? 'active' : 'hidden'}.`,
      });
    } catch {
      setToast({ id: String(Date.now()), type: 'error', message: 'Failed to toggle status.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!expToDelete) return;
    const id = expToDelete._id || expToDelete.id!;
    try {
      await experienceService.deleteExperience(id);
      setExperiences((prev) => prev.filter((e) => e._id !== id && e.id !== id));
      await refreshSettings();
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: `Deleted experience "${expToDelete.role}".`,
      });
    } catch {
      setToast({ id: String(Date.now()), type: 'error', message: 'Failed to delete experience.' });
    } finally {
      setExpToDelete(null);
    }
  };

  const handleMove = async (exp: ExperienceItem, direction: 'up' | 'down') => {
    const index = experiences.findIndex((e) => e._id === exp._id || e.id === exp.id);
    if (direction === 'up' && index > 0) {
      const prev = experiences[index - 1];
      const newOrder1 = prev.order;
      const newOrder2 = exp.order;

      await experienceService.reorderExperiences([
        { id: exp._id || exp.id!, order: newOrder1 },
        { id: prev._id || prev.id!, order: newOrder2 },
      ]);
      await fetchExperiences();
      await refreshSettings();
    } else if (direction === 'down' && index < experiences.length - 1) {
      const next = experiences[index + 1];
      const newOrder1 = next.order;
      const newOrder2 = exp.order;

      await experienceService.reorderExperiences([
        { id: exp._id || exp.id!, order: newOrder1 },
        { id: next._id || next.id!, order: newOrder2 },
      ]);
      await fetchExperiences();
      await refreshSettings();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Experience & Timeline CMS</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your professional journey, internships, bootcamps, dates, and achievement bullet points
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1828]/60">
            <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
            Loading experience entries...
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1828]/60">
            No experiences found. Click "Add Experience" to create one.
          </div>
        ) : (
          experiences.map((exp, idx) => {
            const id = exp._id || exp.id;
            const Icon = exp.current ? Briefcase : GraduationCap;
            return (
              <div
                key={id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md shadow-xs dark:shadow-xl transition-all hover:border-cyan-400/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-11 w-11 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                        exp.current
                          ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-500 dark:text-cyan-400'
                          : 'border-violet-400/40 bg-violet-400/10 text-violet-500 dark:text-violet-400'
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          #{exp.order}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                            Current Role
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {exp.company}
                      </p>

                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Calendar size={12} />
                          {exp.duration}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] text-slate-500">
                          {exp.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    {/* Status Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(exp)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                        exp.active !== false
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-slate-500/30 bg-slate-500/10 text-slate-500'
                      }`}
                      title="Toggle active status"
                    >
                      {exp.active !== false ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      <span>{exp.active !== false ? 'Active' : 'Hidden'}</span>
                    </button>

                    {/* Move Up/Down */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700/60 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-800/40">
                      <button
                        type="button"
                        onClick={() => handleMove(exp, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(exp, 'down')}
                        disabled={idx === experiences.length - 1}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditModal(exp)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shadow-xs"
                      title="Edit Experience"
                    >
                      <Edit2 size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setExpToDelete(exp)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-xs"
                      title="Delete Experience"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Bullet Points Preview */}
                {exp.points && exp.points.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    <ul className="space-y-1.5 pl-2">
                      {exp.points.map((pt, pIdx) => (
                        <li
                          key={pIdx}
                          className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/80 mt-1.5 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {editingExp ? 'Edit Experience Record' : 'Add Experience Entry'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Role / Position Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Developer"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SMIT Peshawar"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (e.g. 2024 – Present)
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employment / Activity Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Internship · Team Project"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.checked)}
                    className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Mark as current role</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Visible on public portfolio</span>
                </label>
              </div>

              {/* Bullet Points Editor */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Key Achievements / Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPoint}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                  >
                    <Plus size={12} /> Add Point
                  </button>
                </div>

                <div className="space-y-2">
                  {formPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Achievement #${pIdx + 1}...`}
                        value={point}
                        onChange={(e) => handlePointChange(pIdx, e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePoint(pIdx)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove Point"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{modalSaving ? 'Saving...' : 'Save Experience'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(expToDelete)}
        title="Delete Experience"
        message={`Are you sure you want to delete "${expToDelete?.role} at ${expToDelete?.company}"?`}
        confirmLabel="Delete Experience"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setExpToDelete(null)}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
