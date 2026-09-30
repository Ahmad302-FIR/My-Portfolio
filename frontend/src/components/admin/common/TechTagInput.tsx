import { useState, type KeyboardEvent } from 'react';
import { Plus, X } from 'lucide-react';

interface TechTagInputProps {
  technologies: string[];
  onChange: (techs: string[]) => void;
  placeholder?: string;
}

export default function TechTagInput({
  technologies,
  onChange,
  placeholder = 'Add technology (e.g. React, TypeScript, Node.js)...',
}: TechTagInputProps) {
  const [inputVal, setInputVal] = useState('');

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!technologies.includes(trimmed)) {
      onChange([...technologies, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(technologies.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
        />
        <button
          type="button"
          onClick={addTag}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Rendered removable chips */}
      <div className="flex flex-wrap gap-2 min-h-[32px]">
        {technologies.map((tech, index) => (
          <span
            key={`${tech}-${index}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/80 px-3 py-1 text-xs text-slate-200"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="text-slate-400 hover:text-rose-400 transition-colors"
              aria-label={`Remove ${tech}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        {technologies.length === 0 && (
          <span className="text-xs text-slate-600 italic">
            No technologies added yet.
          </span>
        )}
      </div>
    </div>
  );
}
