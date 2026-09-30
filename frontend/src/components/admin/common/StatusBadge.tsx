import type { ProjectStatus } from '../../../types/project';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const isLive = status === 'Live';
  const isInDev = status === 'In Development';

  const baseClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  if (isLive) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 ${baseClasses}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Live
      </span>
    );
  }

  if (isInDev) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border border-amber-400/30 bg-amber-400/10 text-amber-400 ${baseClasses}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        In Development
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 ${baseClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
      {status}
    </span>
  );
}
