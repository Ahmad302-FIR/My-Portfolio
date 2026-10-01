import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import {
  User,
  Upload,
  Save,
  Plus,
  X,
  Briefcase,
  Sparkles,
  Link as LinkIcon,
  RefreshCw,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';

export default function AdminHeroContent() {
  const { refreshSettings } = usePortfolioSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroRole, setHeroRole] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [rotatingTitles, setRotatingTitles] = useState<string[]>([]);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [primaryCtaLabel, setPrimaryCtaLabel] = useState('');
  const [primaryCtaLink, setPrimaryCtaLink] = useState('');
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState('');
  const [secondaryCtaLink, setSecondaryCtaLink] = useState('');

  // Profile Image State
  const [profileImageUrl, setProfileImageUrl] = useState('/profile.jpg');
  const [profileImagePublicId, setProfileImagePublicId] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  useEffect(() => {
    settingsService
      .getPortfolioSettings()
      .then((s) => {
        setName(s.name || 'Muhammad Ahmed');
        setHeroTitle(s.heroTitle || 'Muhammad Ahmed');
        setHeroRole(s.heroRole || 'Full Stack MERN Developer');
        setHeroHeadline(s.heroHeadline || 'Crafting High-Impact Web Applications with Modern Engineering');
        setHeroDescription(
          s.heroDescription ||
            s.shortBio ||
            'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.'
        );
        setRotatingTitles(
          s.rotatingTitles && s.rotatingTitles.length > 0
            ? s.rotatingTitles
            : ['Full Stack Developer', 'MERN Stack Developer', 'React Developer', 'Backend API Developer']
        );
        setAvailability(s.availability || 'Available for freelance & full-time roles');
        setLocation(s.location || 'Pakistan');
        setLocationDetail(s.locationDetail || 'Peshawar, Pakistan');
        setPrimaryCtaLabel(s.primaryCtaLabel || 'View My Work');
        setPrimaryCtaLink(s.primaryCtaLink || '#projects');
        setSecondaryCtaLabel(s.secondaryCtaLabel || 'Contact Me');
        setSecondaryCtaLink(s.secondaryCtaLink || '#contact');
        setProfileImageUrl(s.profileImageUrl || '/profile.jpg');
        setProfileImagePublicId(s.profileImagePublicId || '');
      })
      .catch((err) => {
        console.error('Failed to load hero settings:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Please choose an image file (JPG, PNG, WebP).',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Image size exceeds maximum limit of 5MB.',
      });
      return;
    }

    setSelectedImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleUploadProfileImage = async () => {
    if (!selectedImageFile) return;

    setUploadingImage(true);
    try {
      const uploadRes = await settingsService.uploadProfileImage(selectedImageFile);
      if (uploadRes?.url) {
        setProfileImageUrl(uploadRes.url);
        setProfileImagePublicId(uploadRes.publicId || '');
        setSelectedImageFile(null);
        setImagePreview(null);

        // Immediately persist to settings
        await settingsService.updatePortfolioSettings({
          profileImageUrl: uploadRes.url,
          profileImagePublicId: uploadRes.publicId || '',
        });

        await refreshSettings();

        setToast({
          id: String(Date.now()),
          type: 'success',
          message: 'Profile image updated and saved successfully!',
        });
      }
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to upload profile image to Cloudinary.',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddRotatingTitle = () => {
    const trimmed = newTitleInput.trim();
    if (!trimmed) return;
    if (rotatingTitles.includes(trimmed)) {
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: 'This rotating title is already in the list.',
      });
      return;
    }
    setRotatingTitles([...rotatingTitles, trimmed]);
    setNewTitleInput('');
  };

  const handleRemoveRotatingTitle = (index: number) => {
    setRotatingTitles(rotatingTitles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsService.updatePortfolioSettings({
        name,
        heroTitle,
        heroRole,
        heroHeadline,
        heroDescription,
        shortBio: heroDescription,
        rotatingTitles,
        availability,
        location,
        locationDetail,
        primaryCtaLabel,
        primaryCtaLink,
        secondaryCtaLabel,
        secondaryCtaLink,
        profileImageUrl,
        profileImagePublicId,
      });

      await refreshSettings();

      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Profile & Hero settings saved successfully!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to save settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs text-slate-500">
        <span className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin inline-block mr-2" />
        Loading Profile & Hero configuration...
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Profile & Hero Section CMS</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, Cloudinary avatar image, hero headline, rotating role subtitles, and CTA buttons
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* =========================================================================
            PROFILE IMAGE MANAGEMENT
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-5 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <User size={18} className="text-cyan-500 dark:text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Profile Picture (Cloudinary)</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                This image is displayed in the Hero circle, About section frame, and Navbar logo
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Image Preview with gradient ring */}
            <div className="relative flex-shrink-0">
              <div className="h-28 w-28 rounded-full p-[2.5px] bg-gradient-to-tr from-cyan-400 via-teal-400 to-violet-500 shadow-md">
                <div className="h-full w-full rounded-full overflow-hidden bg-slate-900">
                  <img
                    src={imagePreview || profileImageUrl || '/profile.jpg'}
                    alt="Profile Preview"
                    className="h-full w-full object-cover object-[50%_15%]"
                  />
                </div>
              </div>
              {imagePreview && (
                <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-white shadow-xs">
                  New
                </span>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-500 transition-all shadow-xs"
                >
                  <Upload size={14} />
                  <span>Choose New Image</span>
                </button>

                {selectedImageFile && (
                  <button
                    type="button"
                    onClick={handleUploadProfileImage}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={13} className={uploadingImage ? 'animate-spin' : ''} />
                    <span>{uploadingImage ? 'Uploading to Cloudinary...' : 'Upload & Save Image'}</span>
                  </button>
                )}

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedImageFile(null);
                    }}
                    className="px-3 py-2 text-xs text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p>Supports PNG, JPG, JPEG, or WebP up to 5MB. Cloudinary auto-optimizes format and quality.</p>
                <p className="font-mono text-[10px] text-slate-400 truncate max-w-lg">
                  Current Source: {profileImageUrl}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PERSONAL & HERO IDENTITY
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Briefcase size={18} className="text-teal-500 dark:text-teal-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Personal & Professional Identity</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Primary name, professional role, and real-time availability indicator
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Professional Role / Main Title
              </label>
              <input
                type="text"
                value={heroRole}
                onChange={(e) => setHeroRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Availability Badge Statement
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Location (Short)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>
          </div>
        </div>

        {/* =========================================================================
            HERO HEADLINE & ROTATING TITLES
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <Sparkles size={18} className="text-violet-500 dark:text-violet-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Hero Headline & Animated Titles</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Front-facing headline, animated typing/sliding roles, and intro paragraph
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Hero Introduction Paragraph
            </label>
            <textarea
              rows={3}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none leading-relaxed"
            />
          </div>

          {/* Rotating Titles Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Rotating Role Titles (Animated in Hero subtitle)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30]/60 min-h-[50px]">
              {rotatingTitles.map((title, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25"
                >
                  <span>{title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRotatingTitle(i)}
                    className="hover:text-rose-500 transition-colors"
                    title="Remove title"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1.5 ml-auto">
                <input
                  type="text"
                  placeholder="Add role title..."
                  value={newTitleInput}
                  onChange={(e) => setNewTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRotatingTitle();
                    }
                  }}
                  className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRotatingTitle}
                  className="p-1 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                  title="Add Title"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HERO CALL-TO-ACTION BUTTONS
            ========================================================================= */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white dark:bg-[#0D1828]/80 backdrop-blur-md space-y-4 shadow-xs dark:shadow-xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
            <LinkIcon size={18} className="text-amber-500 dark:text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Hero Call-to-Action (CTA) Buttons</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configure button text and anchor targets for the primary and secondary hero buttons
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Button Label (e.g. View My Work)
              </label>
              <input
                type="text"
                value={primaryCtaLabel}
                onChange={(e) => setPrimaryCtaLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Primary Button Link (e.g. #projects)
              </label>
              <input
                type="text"
                value={primaryCtaLink}
                onChange={(e) => setPrimaryCtaLink(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Secondary Button Label (e.g. Contact Me)
              </label>
              <input
                type="text"
                value={secondaryCtaLabel}
                onChange={(e) => setSecondaryCtaLabel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Secondary Button Link (e.g. #contact)
              </label>
              <input
                type="text"
                value={secondaryCtaLink}
                onChange={(e) => setSecondaryCtaLink(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/70 bg-slate-50 dark:bg-[#101D30] px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile & Hero Settings'}</span>
          </button>
        </div>
      </form>

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
