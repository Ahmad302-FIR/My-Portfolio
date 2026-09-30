import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { FileText, UploadCloud, X, RefreshCw, AlertCircle, CheckCircle2, FileCheck } from 'lucide-react';

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  maxSizeMB?: number;
}

export default function ResumeUpload({
  onFileSelect,
  selectedFile,
  maxSizeMB = 5,
}: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // Validate type (must be PDF)
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setErrorMsg('Invalid file format. Only PDF documents (.pdf) are accepted.');
      onFileSelect(null);
      return;
    }

    // Validate size (max 5MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg(`File exceeds maximum size of ${maxSizeMB}MB.`);
      onFileSelect(null);
      return;
    }

    onFileSelect(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndProcessFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndProcessFile(file);
  };

  const handleRemove = () => {
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMsg(null);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload PDF resume document"
      />

      {selectedFile ? (
        /* Selected File Card */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-cyan-400/40 bg-cyan-400/5 backdrop-blur-md">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <FileCheck size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100 truncate block">
                  {selectedFile.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 flex-shrink-0">
                  <CheckCircle2 size={10} /> Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {formatFileSize(selectedFile.size)} · Portable Document Format (PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
            <button
              type="button"
              onClick={triggerBrowse}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
            >
              <RefreshCw size={12} />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <X size={12} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerBrowse();
            }
          }}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10'
              : 'border-slate-700/60 bg-[#101D30]/60 hover:border-slate-600 hover:bg-[#101D30]'
          }`}
        >
          <div className="h-12 w-12 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-3">
            <UploadCloud size={24} />
          </div>

          <p className="text-xs font-semibold text-slate-200 text-center">
            Click to select PDF or drag & drop file here
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Accepts Adobe Acrobat PDF format only (up to {maxSizeMB}MB)
          </p>

          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 text-xs text-slate-200 font-medium hover:text-white hover:border-slate-500 transition-colors"
          >
            <FileText size={13} className="text-cyan-400" />
            <span>Browse Computer</span>
          </button>
        </div>
      )}

      {/* Validation Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-400 pt-1">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Informational Guidance Note */}
      <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
        Upload a new PDF resume here. Once backend integration is enabled, the uploaded resume will automatically replace the current portfolio resume.
      </p>
    </div>
  );
}
