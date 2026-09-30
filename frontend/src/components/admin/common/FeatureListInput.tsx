import { useState, type KeyboardEvent } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface FeatureListInputProps {
  features: string[];
  onChange: (features: string[]) => void;
  placeholder?: string;
}

export default function FeatureListInput({
  features,
  onChange,
  placeholder = 'Add a key feature or milestone...',
}: FeatureListInputProps) {
  const [featureInput, setFeatureInput] = useState('');

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    onChange([...features, trimmed]);
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    onChange(features.filter((_, i) => i !== idx));
  };

  const moveFeature = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= features.length) return;
    const updated = [...features];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    onChange(updated);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={featureInput}
          onChange={(e) => setFeatureInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-700/60 bg-[#101D30] px-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
        />
        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Feature Items List */}
      <div className="space-y-2">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-300"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <span className="flex-shrink-0 h-5 w-5 rounded-md bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                {idx + 1}
              </span>
              <span className="truncate">{feature}</span>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => moveFeature(idx, idx - 1)}
                disabled={idx === 0}
                className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => moveFeature(idx, idx + 1)}
                disabled={idx === features.length - 1}
                className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <ArrowDown size={13} />
              </button>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-1"
                title="Remove feature"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {features.length === 0 && (
          <p className="text-xs text-slate-600 italic">No features added yet.</p>
        )}
      </div>
    </div>
  );
}
