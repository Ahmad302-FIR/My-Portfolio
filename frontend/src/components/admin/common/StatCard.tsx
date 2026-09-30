import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = '#22D3EE',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="relative rounded-2xl border border-slate-700/50 bg-[#0D1828]/80 p-5 backdrop-blur-md overflow-hidden flex flex-col justify-between"
    >
      {/* Glow accent */}
      <div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-100">
            {value}
          </h3>
        </div>

        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/5"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            borderColor: `${color}30`,
          }}
        >
          <Icon size={20} />
        </div>
      </div>

      {subtext && (
        <p className="mt-4 text-xs text-slate-500 font-medium">{subtext}</p>
      )}
    </motion.div>
  );
}
