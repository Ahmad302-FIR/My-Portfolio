import { useState, useEffect, type FormEvent } from 'react';
import {
  FileText,
  Save,
  BarChart3,
  Layers,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import type { AboutHighlight, AboutStat } from '../../types/portfolio';

const AVAILABLE_ICONS = [
  { value: 'code', label: 'Code2 (Frontend/Code)' },
  { value: 'server', label: 'Server (Backend/APIs)' },
  { value: 'shield', label: 'ShieldCheck (Auth/Security)' },
  { value: 'rocket', label: 'Rocket (Deployment)' },
  { value: 'git-branch', label: 'GitBranch (Git/Workflow)' },
  { value: 'users', label: 'Users (Team/Collab)' },
  { value: 'zap', label: 'Zap (Performance/Speed)' },
];

export default function AdminAboutContent() {
  const { refreshSettings } = usePortfolioSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [aboutEyebrow, setAboutEyebrow] = useState('');
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBioParagraph1, setAboutBioParagraph1] = useState('');
  const [aboutBioParagraph2, setAboutBioParagraph2] = useState('');
  const [aboutBioParagraph3, setAboutBioParagraph3] = useState('');
  const [highlights, setHighlights] = useState<AboutHighlight[]>([]);
  const [stats, setStats] = useState<AboutStat[]>([]);

  useEffect(() => {
    settingsService
      .getPortfolioSettings()
      .then((s) => {
        setAboutEyebrow(s.aboutEyebrow || 'About Me');
        setAboutTitle(s.aboutTitle || 'The Person Behind the Code');
        setAboutBioParagraph1(
          s.aboutBioParagraph1 ||
            "I'm a MERN Stack Developer focused on building full-stack web applications, dashboards, SaaS-style products, and real-world digital solutions."
        );
        setAboutBioParagraph2(
          s.aboutBioParagraph2 ||
            'I work across frontend development, backend APIs, authentication, databases, deployment, and production problem-solving. My goal is always to ship things that work reliably and look professional.'
        );
        setAboutBioParagraph3(
          s.aboutBioParagraph3 ||
            "I'm currently building a healthcare platform with a team at SMIT Peshawar, using modern engineering practices: Git workflows, reusable components, and production-ready code."
        );
        setHighlights(
          s.aboutHighlights && s.aboutHighlights.length > 0
            ? s.aboutHighlights
            : [
                {
                  icon: 'code',
                  title: 'Full Stack MERN',
                  desc: 'End-to-end development from responsive UI to secure REST APIs and MongoDB schemas.',
                  color: 'text-cyan-400',
                  bg: 'bg-cyan-400/10 border-cyan-400/20',
                },
                {
                  icon: 'server',
                  title: 'REST API Development',
                  desc: 'Scalable, well-structured APIs with proper error handling and validation.',
                  color: 'text-violet-400',
                  bg: 'bg-violet-400/10 border-violet-400/20',
                },
                {
                  icon: 'shield',
                  title: 'Authentication & Authorization',
                  desc: 'JWT, bcrypt, OTP verification, and role-based access control.',
                  color: 'text-teal-400',
                  bg: 'bg-teal-400/10 border-teal-400/20',
                },
                {
                  icon: 'rocket',
                  title: 'Production Deployment',
                  desc: 'Deployment with Vercel, Netlify, Cloudinary, and environment configuration.',
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10 border-amber-400/20',
                },
              ]
        );
        setStats(
          s.aboutStats && s.aboutStats.length > 0
            ? s.aboutStats
            : [
                { icon: 'code', value: '3+', label: 'Full Stack Projects' },
                { icon: 'git-branch', value: 'Git', label: 'Team Collaboration' },
                { icon: 'users', value: 'Team', label: 'Real-World Experience' },
                { icon: 'zap', value: 'MERN', label: 'Modern Web Technologies' },
              ]
        );
      })
      .catch((err) => {
        console.error('Failed to load about content:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleHighlightChange = (index: number, field: keyof AboutHighlight, val: string) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: val };
    setHighlights(updated);
  };

  const handleStatChange = (index: number, field: keyof AboutStat, val: string) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: val };
    setStats(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsService.updatePortfolioSettings({
        aboutEyebrow,
        aboutTitle,
        aboutBioParagraph1,
        aboutBioParagraph2,
        aboutBioParagraph3,
        aboutHighlights: highlights,
        aboutStats: stats,
      });

      await refreshSettings();

      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'About section content updated successfully!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to update about content.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
        Loading About section content...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">About Section CMS</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize the headings, bio narrative paragraphs, capability highlight cards, and metric statistics
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================================================================
            SECTION HEADINGS & BIO PARAGRAPHS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <FileText size={18} className="text-cyan-500 dark:text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Section Headings & Bio Narrative</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Main titles and the 3 story paragraphs presented on the right side of the photo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Section Eyebrow (e.g. About Me)
              </label>
              <input
                type="text"
                value={aboutEyebrow}
                onChange={(e) => setAboutEyebrow(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Section Main Title (e.g. The Person Behind the Code)
              </label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Paragraph 1 (Core Focus & Specialization)
              </label>
              <textarea
                rows={2}
                value={aboutBioParagraph1}
                onChange={(e) => setAboutBioParagraph1(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Paragraph 2 (Engineering Scope & Reliability)
              </label>
              <textarea
                rows={2}
                value={aboutBioParagraph2}
                onChange={(e) => setAboutBioParagraph2(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Paragraph 3 (Current Engagement & Real-World Team Work)
              </label>
              <textarea
                rows={2}
                value={aboutBioParagraph3}
                onChange={(e) => setAboutBioParagraph3(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            CAPABILITY HIGHLIGHT CARDS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Layers size={18} className="text-violet-500 dark:text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Capability Highlight Cards (4 Grid Cards)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Key value proposition cards displayed under the bio narrative
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlights.map((hl, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30]/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Card #{i + 1}
                  </span>
                  <select
                    value={hl.icon}
                    onChange={(e) => handleHighlightChange(i, 'icon', e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={hl.title}
                    onChange={(e) => handleHighlightChange(i, 'title', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={2}
                    value={hl.desc}
                    onChange={(e) => handleHighlightChange(i, 'desc', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            METRIC STATS CARDS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <BarChart3 size={18} className="text-teal-500 dark:text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Metric Stats (Under Photo)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                The 4 quick stat boxes positioned below your circular portrait photo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30]/60 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    Stat #{i + 1}
                  </span>
                  <select
                    value={st.icon}
                    onChange={(e) => handleStatChange(i, 'icon', e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {AVAILABLE_ICONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Value (e.g. 3+, Git, Team, MERN)
                  </label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Label (e.g. Full Stack Projects)
                  </label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#0D1828] px-3 py-1.5 text-xs text-slate-800 dark:text-slate-300 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
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
            <span>{saving ? 'Saving Changes...' : 'Save About Section Settings'}</span>
          </button>
        </div>
      </form>

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
