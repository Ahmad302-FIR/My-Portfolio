import { useState } from 'react';
import { Activity, Utensils, Laptop, Layers, Globe } from 'lucide-react';

interface ProjectImageProps {
  imageUrl?: string;
  title: string;
  category: string;
  color?: string;
  liveUrl?: string;
  className?: string;
  aspectRatio?: string;
}

export default function ProjectImage({
  imageUrl,
  title,
  category,
  color = '#22D3EE',
  liveUrl,
  className = '',
}: ProjectImageProps) {
  const [imgError, setImgError] = useState(false);

  // Pick category icon
  const getCategoryIcon = () => {
    const lower = (category || '').toLowerCase();
    if (lower.includes('health') || lower.includes('medical')) return Activity;
    if (lower.includes('restaurant') || lower.includes('food')) return Utensils;
    if (lower.includes('laptop') || lower.includes('commerce') || lower.includes('shop'))
      return Laptop;
    return Layers;
  };

  const Icon = getCategoryIcon();

  // Clean domain display for the browser mockup address bar
  const getDomain = () => {
    if (!liveUrl) return 'localhost:3000';
    try {
      const parsed = new URL(liveUrl);
      return parsed.hostname;
    } catch {
      return liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
  };

  const hasValidImage = imageUrl && imageUrl.trim().length > 0 && !imgError;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0a1424] border-b border-slate-700/30 flex flex-col ${className}`}
    >
      {/* Browser mockup header bar */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-slate-800/80 bg-[#0d1828]/90 backdrop-blur-md z-10">
        <span className="h-2 w-2 rounded-full bg-rose-500/70" />
        <span className="h-2 w-2 rounded-full bg-amber-500/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-500/70" />

        <div className="ml-2.5 flex-1 h-5 rounded-full bg-slate-900/80 border border-slate-800/80 flex items-center px-2.5 gap-1.5 overflow-hidden">
          <Globe size={10} className="text-slate-500 flex-shrink-0" />
          <span className="text-[11px] text-slate-400 font-mono truncate select-none">
            {getDomain()}
          </span>
        </div>
      </div>

      {/* Main image / placeholder container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden flex items-center justify-center">
        {hasValidImage ? (
          <img
            src={imageUrl}
            alt={`${title} screenshot`}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          /* High-end engineering UI placeholder */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out">
            {/* Background grid + radial glow */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(148,163,184,0.15) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
              }}
            />

            <div
              className="absolute -inset-10 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              }}
            />

            {/* Central icon badge */}
            <div
              className="relative mb-3 h-12 w-12 rounded-xl flex items-center justify-center border shadow-lg transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: `${color}15`,
                borderColor: `${color}40`,
                color: color,
                boxShadow: `0 0 20px ${color}20`,
              }}
            >
              <Icon size={22} />
            </div>

            {/* Project title & category watermark */}
            <h4 className="text-sm font-semibold text-slate-200 tracking-tight leading-tight">
              {title}
            </h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px] truncate">
              {category}
            </p>

            {/* Interactive indicator pill */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-700/60 bg-slate-800/60 text-[10px] text-slate-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
              Live Deployment Active
            </div>
          </div>
        )}

        {/* Hover subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1828]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
