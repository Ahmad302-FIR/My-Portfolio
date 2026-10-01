import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, type LucideIcon } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  labelPrefix?: string; // e.g. "Status", "Category", "Sort"
  icon?: LucideIcon;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
  menuWidth?: string;
  align?: 'left' | 'right';
}

export default function CustomDropdown({
  labelPrefix,
  icon: Icon,
  value,
  options,
  onChange,
  className = '',
  menuWidth = 'min-w-[200px]',
  align = 'left',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Find currently active option label
  const activeOption = options.find((opt) => opt.value === value);
  const displayLabel = activeOption ? activeOption.label : value;

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block ${isOpen ? 'z-50' : 'z-20'} ${className}`}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all select-none border ${
          isOpen
            ? 'border-cyan-500/50 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/15'
            : 'border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-[#101D30] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
      >
        {Icon && (
          <Icon
            size={13}
            className={`flex-shrink-0 transition-colors ${
              isOpen
                ? 'text-cyan-600 dark:text-cyan-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          />
        )}

        <span className="truncate max-w-[160px]">
          {labelPrefix && (
            <span className="text-slate-400 dark:text-slate-500 mr-1 font-normal">
              {labelPrefix}:
            </span>
          )}
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {displayLabel}
          </span>
        </span>

        <ChevronDown
          size={13}
          className={`flex-shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-cyan-500' : ''
          }`}
        />
      </button>

      {/* Floating Menu Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className={`absolute top-full mt-1.5 z-50 ${
              align === 'right' ? 'right-0' : 'left-0'
            } ${menuWidth} max-w-[280px] max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/95 dark:bg-[#0D1828]/95 backdrop-blur-xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 py-1.5 focus:outline-none`}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check size={13} className="text-cyan-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
