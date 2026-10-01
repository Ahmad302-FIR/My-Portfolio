import { useState, useEffect, useMemo, type FormEvent } from 'react';
import {
  Plus,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Save,
} from 'lucide-react';
import { skillService } from '../../services/skillService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import CustomDropdown from '../../components/admin/common/CustomDropdown';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import type { SkillItem } from '../../types/portfolio';

const STANDARD_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'Tools & Deployment',
  'Practices',
];

export default function AdminSkills() {
  const { refreshSettings } = usePortfolioSettings();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<SkillItem | null>(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Frontend');
  const [formIconKey, setFormIconKey] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formActive, setFormActive] = useState(true);

  const fetchSkills = async () => {
    try {
      const data = await skillService.getAdminSkills();
      setSkills(data);
    } catch (err) {
      console.error('Failed to load skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormName('');
    setFormCategory('Frontend');
    setFormIconKey('');
    setFormOrder(skills.length + 1);
    setFormActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category);
    setFormIconKey(skill.iconKey || '');
    setFormOrder(skill.order);
    setFormActive(skill.active !== false);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setToast({ id: String(Date.now()), type: 'error', message: 'Skill name is required.' });
      return;
    }

    setModalSaving(true);
    try {
      if (editingSkill) {
        const id = editingSkill._id || editingSkill.id!;
        await skillService.updateSkill(id, {
          name: formName.trim(),
          category: formCategory,
          iconKey: formIconKey.trim(),
          order: Number(formOrder),
          active: formActive,
        });
        setToast({ id: String(Date.now()), type: 'success', message: 'Skill updated successfully.' });
      } else {
        await skillService.createSkill({
          name: formName.trim(),
          category: formCategory,
          iconKey: formIconKey.trim(),
          order: Number(formOrder),
          active: formActive,
        });
        setToast({ id: String(Date.now()), type: 'success', message: 'Skill created successfully.' });
      }

      setIsModalOpen(false);
      await fetchSkills();
      await refreshSettings();
    } catch (err: any) {
      setToast({ id: String(Date.now()), type: 'error', message: err.message || 'Failed to save skill.' });
    } finally {
      setModalSaving(false);
    }
  };

  const handleToggleActive = async (skill: SkillItem) => {
    const id = skill._id || skill.id!;
    const newActive = !skill.active;
    try {
      await skillService.updateSkill(id, { active: newActive });
      setSkills((prev) => prev.map((s) => (s._id === id || s.id === id ? { ...s, active: newActive } : s)));
      await refreshSettings();
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: `Marked "${skill.name}" as ${newActive ? 'active' : 'inactive'}.`,
      });
    } catch {
      setToast({ id: String(Date.now()), type: 'error', message: 'Failed to toggle status.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!skillToDelete) return;
    const id = skillToDelete._id || skillToDelete.id!;
    try {
      await skillService.deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      await refreshSettings();
      setToast({ id: String(Date.now()), type: 'success', message: `Deleted skill "${skillToDelete.name}".` });
    } catch {
      setToast({ id: String(Date.now()), type: 'error', message: 'Failed to delete skill.' });
    } finally {
      setSkillToDelete(null);
    }
  };

  const handleMove = async (skill: SkillItem, direction: 'up' | 'down') => {
    const id = skill._id || skill.id;
    const catSkills = skills.filter((s) => s.category === skill.category);
    const index = catSkills.findIndex((s) => s._id === id || s.id === id);

    if (direction === 'up' && index > 0) {
      const prev = catSkills[index - 1];
      const newOrder1 = prev.order;
      const newOrder2 = skill.order;

      await skillService.reorderSkills([
        { id: skill._id || skill.id!, order: newOrder1 },
        { id: prev._id || prev.id!, order: newOrder2 },
      ]);
      await fetchSkills();
      await refreshSettings();
    } else if (direction === 'down' && index < catSkills.length - 1) {
      const next = catSkills[index + 1];
      const newOrder1 = next.order;
      const newOrder2 = skill.order;

      await skillService.reorderSkills([
        { id: skill._id || skill.id!, order: newOrder1 },
        { id: next._id || next.id!, order: newOrder2 },
      ]);
      await fetchSkills();
      await refreshSettings();
    }
  };

  // Filtered skills
  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [skills, searchQuery, categoryFilter]);

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category)));
    const allCats = Array.from(new Set(['All', ...STANDARD_CATEGORIES, ...cats]));
    return allCats.map((c) => ({ value: c, label: c === 'All' ? 'All Categories' : c }));
  }, [skills]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Technical Skills CMS</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your technical toolsets, languages, libraries, category assignments, and display order
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative z-30 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md flex flex-col sm:flex-row gap-3 shadow-xs dark:shadow-none">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill name or category..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] pl-10 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
        </div>

        <CustomDropdown
          labelPrefix="Category"
          icon={Filter}
          value={categoryFilter}
          options={categoryOptions}
          onChange={(val) => setCategoryFilter(val)}
          menuWidth="min-w-[200px]"
        />
      </div>

      {/* Skills Table */}
      <div className="relative z-10 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md overflow-hidden shadow-xs dark:shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">
            <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
            Loading technical skills...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500">
            No skills matched your search or category filter.
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#101D30]/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3 w-14 text-center">Order</th>
                  <th className="py-3 px-4">Skill Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center w-24">Reorder</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {filteredSkills.map((skill) => {
                  const id = skill._id || skill.id;
                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Order column */}
                      <td className="py-3 px-3 font-mono font-semibold text-slate-400 dark:text-slate-500 text-center w-14">
                        #{skill.order}
                      </td>

                      {/* Skill Name */}
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-cyan-400" />
                          <span>{skill.name}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300">
                          {skill.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(skill)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                            skill.active !== false
                              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'border-slate-500/30 bg-slate-500/10 text-slate-500'
                          }`}
                          title="Click to toggle active status"
                        >
                          {skill.active !== false ? (
                            <>
                              <CheckCircle size={10} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={10} /> Hidden
                            </>
                          )}
                        </button>
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(skill, 'up')}
                            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-500 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(skill, 'down')}
                            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-cyan-500 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => openEditModal(skill)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/40 transition-colors shadow-xs"
                            title="Edit Skill"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSkillToDelete(skill)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-400/40 transition-colors shadow-xs"
                            title="Delete Skill"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {editingSkill ? 'Edit Skill Specification' : 'Add New Skill'}
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
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. React.js, Docker, GraphQL"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  {STANDARD_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Icon Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. react, node"
                    value={formIconKey}
                    onChange={(e) => setFormIconKey(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="skillActiveCheckbox"
                  checked={formActive}
                  onChange={(e) => setFormActive(e.target.checked)}
                  className="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="skillActiveCheckbox" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Visible on public portfolio
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
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
                  <span>{modalSaving ? 'Saving...' : 'Save Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(skillToDelete)}
        title="Delete Skill"
        message={`Are you sure you want to remove "${skillToDelete?.name}" from your portfolio skills?`}
        confirmLabel="Delete Skill"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSkillToDelete(null)}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
