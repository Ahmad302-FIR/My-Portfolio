import { useState, useEffect, type FormEvent } from 'react';
import {
  GitBranch,
  Save,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Trash2,
  X,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import type { WorkflowStep, GithubPractice } from '../../types/portfolio';

const WORKFLOW_ICONS = [
  { value: 'lightbulb', label: 'Lightbulb (Plan)' },
  { value: 'layout', label: 'Layout (Design/UI)' },
  { value: 'code', label: 'Code2 (Develop)' },
  { value: 'check-circle', label: 'CheckCircle (Test)' },
  { value: 'git-branch', label: 'GitBranch (Commit/VCS)' },
  { value: 'upload-cloud', label: 'UploadCloud (Deploy)' },
  { value: 'trending-up', label: 'TrendingUp (Improve)' },
  { value: 'zap', label: 'Zap (Optimize)' },
  { value: 'shield', label: 'Shield (Security)' },
];

export default function AdminWorkflow() {
  const { refreshSettings } = usePortfolioSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Section text
  const [workflowEyebrow, setWorkflowEyebrow] = useState('');
  const [workflowTitle, setWorkflowTitle] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');

  // Steps & Practices
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [practices, setPractices] = useState<GithubPractice[]>([]);

  // New step/practice inline states
  const [newStepLabel, setNewStepLabel] = useState('');
  const [newStepIcon, setNewStepIcon] = useState('code');
  const [newPracticeLabel, setNewPracticeLabel] = useState('');
  const [newPracticeDesc, setNewPracticeDesc] = useState('');

  useEffect(() => {
    settingsService
      .getPortfolioSettings()
      .then((s) => {
        setWorkflowEyebrow(s.workflowEyebrow || 'Development Workflow');
        setWorkflowTitle(s.workflowTitle || 'How I Build Products');
        setWorkflowDescription(
          s.workflowDescription ||
            'A structured process from idea to production — consistently applied across every project.'
        );
        setSteps(
          s.workflowSteps && s.workflowSteps.length > 0
            ? s.workflowSteps
            : [
                { label: 'Plan', icon: 'lightbulb', order: 1, active: true },
                { label: 'Design', icon: 'layout', order: 2, active: true },
                { label: 'Develop', icon: 'code', order: 3, active: true },
                { label: 'Test', icon: 'check-circle', order: 4, active: true },
                { label: 'Git Commit', icon: 'git-branch', order: 5, active: true },
                { label: 'Deploy', icon: 'upload-cloud', order: 6, active: true },
                { label: 'Improve', icon: 'trending-up', order: 7, active: true },
              ]
        );
        setPractices(
          s.githubPractices && s.githubPractices.length > 0
            ? s.githubPractices
            : [
                { label: 'Clean Repository Structure', desc: 'Organized folders with separation of concerns' },
                { label: 'Reusable Components', desc: 'DRY patterns across projects' },
                { label: 'Git / GitHub Workflow', desc: 'Feature branches, commits, pull requests' },
                { label: 'Environment Variables', desc: '.env files, secrets management' },
                { label: 'API Integration', desc: 'Axios, fetch, error handling patterns' },
                { label: 'Production Deployment', desc: 'Vercel, Netlify, with proper configs' },
                { label: 'Meaningful Commits', desc: 'Descriptive messages and logical history' },
              ]
        );
      })
      .catch((err) => {
        console.error('Failed to load workflow settings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStepMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...steps];
    if (direction === 'up' && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    // Update order numbers
    setSteps(updated.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleToggleStepActive = (index: number) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], active: !updated[index].active };
    setSteps(updated);
  };

  const handleDeleteStep = (index: number) => {
    if (steps.length <= 1) {
      setToast({ id: String(Date.now()), type: 'info', message: 'You must have at least one workflow step.' });
      return;
    }
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const handleAddStep = () => {
    if (!newStepLabel.trim()) return;
    const newStep: WorkflowStep = {
      label: newStepLabel.trim(),
      icon: newStepIcon,
      order: steps.length + 1,
      active: true,
    };
    setSteps([...steps, newStep]);
    setNewStepLabel('');
    setNewStepIcon('code');
  };

  const handleAddPractice = () => {
    if (!newPracticeLabel.trim() || !newPracticeDesc.trim()) {
      setToast({ id: String(Date.now()), type: 'error', message: 'Practice label and description are required.' });
      return;
    }
    setPractices([...practices, { label: newPracticeLabel.trim(), desc: newPracticeDesc.trim() }]);
    setNewPracticeLabel('');
    setNewPracticeDesc('');
  };

  const handleDeletePractice = (index: number) => {
    setPractices(practices.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsService.updatePortfolioSettings({
        workflowEyebrow,
        workflowTitle,
        workflowDescription,
        workflowSteps: steps,
        githubPractices: practices,
      });

      await refreshSettings();

      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Workflow steps and practices updated successfully!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to update workflow settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
        Loading development workflow...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Development Workflow CMS</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize your engineering workflow steps (Plan → Deploy), reorder stages, and manage GitHub quality practices
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================================================================
            SECTION HEADINGS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <FileText size={18} className="text-cyan-500 dark:text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Workflow Headings</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Eyebrow, main headline, and intro subtitle
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={workflowEyebrow}
                onChange={(e) => setWorkflowEyebrow(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={workflowTitle}
                onChange={(e) => setWorkflowTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Section Description Subtitle
              </label>
              <textarea
                rows={2}
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            WORKFLOW SEQUENCE STEPS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Lightbulb size={18} className="text-amber-500 dark:text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Workflow Sequence Steps</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pill cards rendered horizontally with sequence arrows (01 → 02 → 03)
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30]/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 w-8 text-center">
                    0{i + 1}
                  </span>
                  <input
                    type="text"
                    value={step.label}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[i] = { ...updated[i], label: e.target.value };
                      setSteps(updated);
                    }}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1828] px-3 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none w-36 sm:w-48"
                  />
                  <select
                    value={step.icon}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[i] = { ...updated[i], icon: e.target.value };
                      setSteps(updated);
                    }}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1828] px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {WORKFLOW_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStepActive(i)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      step.active !== false
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-500/30 bg-slate-500/10 text-slate-500'
                    }`}
                  >
                    {step.active !== false ? <CheckCircle size={10} /> : <XCircle size={10} />}
                    <span>{step.active !== false ? 'Active' : 'Off'}</span>
                  </button>

                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleStepMove(i, 'up')}
                      disabled={i === 0}
                      className="p-1 rounded text-slate-500 hover:text-cyan-500 disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepMove(i, 'down')}
                      disabled={i === steps.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-cyan-500 disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteStep(i)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove step"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Step Form */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="New step label (e.g. Audit, Review)..."
                value={newStepLabel}
                onChange={(e) => setNewStepLabel(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none flex-1 min-w-[180px]"
              />
              <select
                value={newStepIcon}
                onChange={(e) => setNewStepIcon(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101D30] px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              >
                {WORKFLOW_ICONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddStep}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-colors"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            GITHUB & CODE PRACTICES
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <GitBranch size={18} className="text-violet-500 dark:text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">GitHub & Engineering Practices</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Quality standards presented in the lower grid box of the Workflow section
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {practices.map((pr, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30]/60 space-y-2 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleDeletePractice(i)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 transition-colors opacity-80 group-hover:opacity-100"
                  title="Remove practice"
                >
                  <X size={14} />
                </button>

                <input
                  type="text"
                  value={pr.label}
                  onChange={(e) => {
                    const updated = [...practices];
                    updated[i] = { ...updated[i], label: e.target.value };
                    setPractices(updated);
                  }}
                  className="w-[85%] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1828] px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                />

                <textarea
                  rows={2}
                  value={pr.desc}
                  onChange={(e) => {
                    const updated = [...practices];
                    updated[i] = { ...updated[i], desc: e.target.value };
                    setPractices(updated);
                  }}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1828] px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Add Practice */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Add New Practice Standard
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Practice title (e.g. CI/CD Pipelines)..."
                value={newPracticeLabel}
                onChange={(e) => setNewPracticeLabel(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Brief description (e.g. Automated test suites & linting)..."
                value={newPracticeDesc}
                onChange={(e) => setNewPracticeDesc(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#101D30] px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleAddPractice}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-500/20 transition-colors"
            >
              <Plus size={14} /> Add Practice
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving Changes...' : 'Save Workflow & Practices'}</span>
          </button>
        </div>
      </form>

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
