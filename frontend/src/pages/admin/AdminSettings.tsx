import { useState, useEffect, type FormEvent } from 'react';
import {
  Save,
  Globe,
  Share2,
  FileText,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  Download,
  AlertCircle,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { contactConfig } from '../../data/contact';
import { settingsService } from '../../services/settingsService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import ResumeUpload from '../../components/admin/common/ResumeUpload';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';

interface PortfolioFormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  whatsappUrl: string;
  availability: string;
  heroTitle: string;
  heroSubtitle: string;
  shortBio: string;
}

export default function AdminSettings() {
  const { refreshSettings } = usePortfolioSettings();

  // 1. Portfolio & Profile Form State
  const [profile, setProfile] = useState<PortfolioFormState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('portfolio_admin_settings');
        if (stored) return JSON.parse(stored);
      } catch (err) {
        console.warn('Failed to load stored settings:', err);
      }
    }
    return {
      name: contactConfig.name,
      email: contactConfig.email,
      phone: contactConfig.phone,
      location: contactConfig.location,
      linkedin: contactConfig.linkedin,
      github: contactConfig.github,
      whatsappUrl: contactConfig.whatsappUrl,
      availability: contactConfig.availability,
      heroTitle: 'Muhammad Ahmed',
      heroSubtitle: 'Full Stack MERN Developer',
      shortBio:
        'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
    };
  });

  const [isSavingPortfolio, setIsSavingPortfolio] = useState(false);

  // 2. Resume Management State
  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(null);
  const [currentResumeName, setCurrentResumeName] = useState('Muhammad-Ahmed-Resume.pdf');
  const [currentResumeUrl, setCurrentResumeUrl] = useState('/Muhammad-Ahmed-Resume.pdf');
  const [isUpdatingResume, setIsUpdatingResume] = useState(false);

  // Load latest settings and active resume on mount
  useEffect(() => {
    settingsService
      .getPortfolioSettings()
      .then((s) => {
        setProfile((prev) => ({
          ...prev,
          name: s.name || prev.name,
          email: s.email || prev.email,
          phone: s.phone || prev.phone,
          location: s.location || prev.location,
          linkedin: s.linkedin || prev.linkedin,
          github: s.github || prev.github,
          whatsappUrl: s.whatsappUrl || prev.whatsappUrl,
          availability: s.availability || prev.availability,
          heroTitle: s.heroTitle || prev.heroTitle,
          heroSubtitle: s.heroSubtitle || prev.heroSubtitle,
          shortBio: s.shortBio || prev.shortBio,
        }));
        if (s.resumeUrl) {
          setCurrentResumeUrl(s.resumeUrl);
          const filename = s.resumeUrl.split('/').pop() || 'Muhammad-Ahmed-Resume.pdf';
          setCurrentResumeName(filename);
        }
      })
      .catch((err) => {
        console.warn('Could not load portfolio settings from backend:', err);
      });
  }, []);

  // 3. Password Management State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Handle Portfolio & Content Form Submit
  const handlePortfolioSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingPortfolio(true);

    try {
      await settingsService.updatePortfolioSettings(profile);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Portfolio settings saved successfully.',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to save portfolio settings.',
      });
    } finally {
      setIsSavingPortfolio(false);
    }
  };

  // Handle Resume Update Submit
  const handleResumeSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedResumeFile) {
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: 'Please select a new PDF resume document to upload.',
      });
      return;
    }

    setIsUpdatingResume(true);
    try {
      const res = await settingsService.updateResume(selectedResumeFile);
      if (res.resumeUrl) {
        setCurrentResumeUrl(res.resumeUrl);
        setCurrentResumeName(res.filename || selectedResumeFile.name);
      }
      setSelectedResumeFile(null);
      await refreshSettings();
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Resume updated successfully.',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to process resume file.',
      });
    } finally {
      setIsUpdatingResume(false);
    }
  };

  // Handle Password Change Submit
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!currentPassword) {
      errs.current = 'Current password is required.';
    }

    if (!newPassword) {
      errs.new = 'New password is required.';
    } else if (newPassword.length < 8) {
      errs.new = 'New password must be at least 8 characters long.';
    } else if (currentPassword && newPassword === currentPassword) {
      errs.new = 'New password cannot be identical to current password.';
    }

    if (!confirmPassword) {
      errs.confirm = 'Please confirm your new password.';
    } else if (newPassword && confirmPassword !== newPassword) {
      errs.confirm = 'Passwords do not match.';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsUpdatingPassword(true);
    try {
      await settingsService.changePassword(currentPassword, newPassword);

      // SECURITY: Instantly purge all password state from memory
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Password updated successfully.',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to update password.',
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Portfolio Settings</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure public portfolio content, social links, resume documents, and account credentials
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: HERO & PORTFOLIO CONTENT
          ========================================================================= */}
      <form onSubmit={handlePortfolioSubmit} className="space-y-6">
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe size={16} className="text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Hero & Portfolio Content
              </h3>
              <p className="text-[11px] text-slate-400">
                Front-facing headlines, hero title, and introduction summary
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="heroTitle" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Headline
              </label>
              <input
                id="heroTitle"
                type="text"
                value={profile.heroTitle}
                onChange={(e) => setProfile({ ...profile, heroTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="heroSubtitle" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hero Role / Subtitle
              </label>
              <input
                id="heroSubtitle"
                type="text"
                value={profile.heroSubtitle}
                onChange={(e) => setProfile({ ...profile, heroSubtitle: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="shortBio" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Short Bio Description
            </label>
            <textarea
              id="shortBio"
              rows={3}
              value={profile.shortBio}
              onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
              className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="availability" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Availability Statement
              </label>
              <input
                id="availability"
                type="text"
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            SECTION 2: SOCIAL & MEDIA URLS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Share2 size={16} className="text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">Social & Media URLs</h3>
              <p className="text-[11px] text-slate-400">
                Connected professional profiles, GitHub account, and contact endpoints
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-xs font-semibold text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                id="linkedin"
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 font-mono"
              />
            </div>

            <div>
              <label htmlFor="github" className="block text-xs font-semibold text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                id="github"
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 font-mono"
              />
            </div>

            <div>
              <label htmlFor="whatsappUrl" className="block text-xs font-semibold text-slate-300 mb-1.5">
                WhatsApp Direct Link
              </label>
              <input
                id="whatsappUrl"
                type="url"
                value={profile.whatsappUrl}
                onChange={(e) => setProfile({ ...profile, whatsappUrl: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 font-mono"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20 font-mono"
              />
            </div>
          </div>

          {/* Submit Actions for Portfolio & Social */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSavingPortfolio}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
            >
              <Save size={15} />
              <span>{isSavingPortfolio ? 'Saving Changes...' : 'Save Portfolio Settings'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* =========================================================================
          SECTION 3: RESUME / CV MANAGEMENT
          ========================================================================= */}
      <form onSubmit={handleResumeSubmit} className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <FileText size={16} className="text-teal-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Resume / CV</h3>
            <p className="text-[11px] text-slate-400">
              Manage public portfolio PDF curriculum vitae and download buttons
            </p>
          </div>
        </div>

        {/* Current Active Resume Card */}
        <div className="p-4 rounded-xl border border-slate-800 bg-[#101D30]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-teal-400/10 border border-teal-400/30 text-teal-400 flex items-center justify-center flex-shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">
                Current Resume Document
              </span>
              <p className="text-xs font-bold text-slate-200 truncate mt-0.5">
                {currentResumeName}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <a
              href={currentResumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:border-slate-500 transition-colors"
            >
              <ExternalLink size={12} />
              <span>View Current Resume</span>
            </a>
            <a
              href={currentResumeUrl}
              download={currentResumeName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20 transition-colors"
            >
              <Download size={12} />
              <span>Download Resume</span>
            </a>
          </div>
        </div>

        {/* PDF Upload Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Upload Replacement Resume (PDF)
          </label>
          <ResumeUpload
            selectedFile={selectedResumeFile}
            onFileSelect={(file) => setSelectedResumeFile(file)}
            maxSizeMB={5}
          />
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingResume || !selectedResumeFile}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-bold text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/35 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            <span>{isUpdatingResume ? 'Updating Resume...' : 'Update Resume'}</span>
          </button>
        </div>
      </form>

      {/* =========================================================================
          SECTION 4: SECURITY & PASSWORD
          ========================================================================= */}
      <form onSubmit={handlePasswordSubmit} className="p-6 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md space-y-6 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <ShieldCheck size={16} className="text-violet-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">Security & Password</h3>
            <p className="text-[11px] text-slate-400">
              Update administrator credentials and manage authentication security
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Password */}
          <div>
            <label htmlFor="currentPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Current Password <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock size={14} />
              </div>
              <input
                id="currentPassword"
                type={showCurrentPw ? 'text' : 'password'}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordErrors.current) setPasswordErrors({ ...passwordErrors, current: '' });
                }}
                placeholder="Enter current password"
                className={`w-full rounded-xl border bg-[#101D30] pl-9 pr-9 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                  passwordErrors.current
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showCurrentPw ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {passwordErrors.current && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle size={11} /> {passwordErrors.current}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
              New Password <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <KeyRound size={14} />
              </div>
              <input
                id="newPassword"
                type={showNewPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordErrors.new) setPasswordErrors({ ...passwordErrors, new: '' });
                }}
                placeholder="Min. 8 characters"
                className={`w-full rounded-xl border bg-[#101D30] pl-9 pr-9 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                  passwordErrors.new
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
              >
                {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {passwordErrors.new && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle size={11} /> {passwordErrors.new}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Confirm New Password <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <KeyRound size={14} />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (passwordErrors.confirm) setPasswordErrors({ ...passwordErrors, confirm: '' });
                }}
                placeholder="Repeat new password"
                className={`w-full rounded-xl border bg-[#101D30] pl-9 pr-9 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 ${
                  passwordErrors.confirm
                    ? 'border-rose-500/60 focus:ring-rose-500/20'
                    : 'border-slate-700/60 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {passwordErrors.confirm && (
              <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle size={11} /> {passwordErrors.confirm}
              </p>
            )}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-xs font-bold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 transition-all disabled:opacity-50"
          >
            <Lock size={15} />
            <span>{isUpdatingPassword ? 'Updating Password...' : 'Change Password'}</span>
          </button>
        </div>
      </form>

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
