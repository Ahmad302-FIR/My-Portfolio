import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({ toast, onDismiss, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss, duration]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 max-w-sm rounded-xl border p-4 shadow-2xl backdrop-blur-xl bg-[#0D1828]/95"
        style={{
          borderColor: isSuccess
            ? 'rgba(52, 211, 153, 0.4)'
            : isError
            ? 'rgba(244, 63, 94, 0.4)'
            : 'rgba(34, 211, 238, 0.4)',
        }}
      >
        <div className="flex-shrink-0">
          {isSuccess && <CheckCircle2 size={18} className="text-emerald-400" />}
          {isError && <AlertCircle size={18} className="text-rose-400" />}
          {!isSuccess && !isError && <Info size={18} className="text-cyan-400" />}
        </div>

        <p className="text-xs font-medium text-slate-200 leading-snug flex-1">
          {toast.message}
        </p>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          aria-label="Dismiss toast"
        >
          <X size={14} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
