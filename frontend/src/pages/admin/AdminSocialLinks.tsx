import { useState, useEffect, type FormEvent } from 'react';
import {
  Share2,
  Save,
  Mail,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  WhatsAppIcon,
  GmailIcon,
} from '../../components/common/SocialIcons';
import { settingsService } from '../../services/settingsService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';

export default function AdminSocialLinks() {
  const { refreshSettings } = usePortfolioSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Social & Contact State
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [linkedinDisplay, setLinkedinDisplay] = useState('');
  const [github, setGithub] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState('');

  useEffect(() => {
    settingsService
      .getPortfolioSettings()
      .then((s) => {
        setEmail(s.email || 'info.ahmadkhan.com@gmail.com');
        setPhone(s.phone || '+92 329 5664981');
        setWhatsapp(s.whatsapp || 'https://wa.me/923295664981');
        setLinkedin(s.linkedin || 'https://www.linkedin.com/in/muhammad-ahmed-6867a5370');
        setLinkedinDisplay(s.linkedinDisplay || 'Muhammad Ahmed');
        setGithub(s.github || 'https://github.com/Ahmad302-FIR');
        setGithubUsername(s.githubUsername || 'Ahmad302-FIR');
        setLocation(s.location || 'Pakistan');
        setLocationDetail(s.locationDetail || 'Peshawar, Pakistan');
      })
      .catch((err) => {
        console.error('Failed to load social settings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsService.updatePortfolioSettings({
        email,
        phone,
        whatsapp,
        linkedin,
        linkedinDisplay,
        github,
        githubUsername,
        location,
        locationDetail,
      });

      await refreshSettings();

      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Social links and contact endpoints saved successfully!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to save social links.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
        Loading social and contact endpoints...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Social & Contact Links CMS</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure professional networks, WhatsApp direct chat link, email address, and geographic location tags
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================================================================
            PROFESSIONAL NETWORKS (LINKEDIN & GITHUB)
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Share2 size={18} className="text-violet-500 dark:text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Professional Networks</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Connected accounts appearing across Hero badges, Contact cards, and Footer links
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LinkedIn URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <LinkedinIcon size={14} className="text-[#0A66C2]" />
                  <span>LinkedIn Profile URL</span>
                </label>
                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Test</span> <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
                required
              />
            </div>

            {/* LinkedIn Display Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn Display Name (Contact Card)
              </label>
              <input
                type="text"
                value={linkedinDisplay}
                onChange={(e) => setLinkedinDisplay(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <GithubIcon size={14} className="text-slate-700 dark:text-slate-300" />
                  <span>GitHub Profile URL</span>
                </label>
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Test</span> <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
                required
              />
            </div>

            {/* GitHub Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub Username (Contact Card)
              </label>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            COMMUNICATION & CHAT CHANNELS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Mail size={18} className="text-teal-500 dark:text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Direct Contact Channels</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Email and WhatsApp links used by quick contact buttons and inquiry forms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <GmailIcon size={14} className="text-[#EA4335]" />
                <span>Primary Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
                required
              />
            </div>

            {/* WhatsApp Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span>Phone / WhatsApp Display Number</span>
              </label>
              <input
                type="text"
                placeholder="+92 329 5664981"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
              />
            </div>

            {/* WhatsApp Direct URL */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <WhatsAppIcon size={14} className="text-[#25D366]" />
                  <span>WhatsApp Direct URL (wa.me)</span>
                </label>
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Test Chat</span> <ExternalLink size={10} />
                  </a>
                )}
              </div>
              <input
                type="url"
                placeholder="https://wa.me/923295664981"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            LOCATION DETAILS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <MapPin size={18} className="text-cyan-500 dark:text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Location Settings</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Short and detailed regional descriptions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Country / Region (Short)
              </label>
              <input
                type="text"
                placeholder="Pakistan"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                City, Country (Contact Card Detail)
              </label>
              <input
                type="text"
                placeholder="Peshawar, Pakistan"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>
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
            <span>{saving ? 'Saving Changes...' : 'Save Social & Contact Links'}</span>
          </button>
        </div>
      </form>

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
