import { useState, useRef, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud, X, RefreshCw, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (imageUrl: string, file?: File) => void;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export default function ImageUpload({
  value,
  onChange,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload PNG, JPG, JPEG, or WEBP.');
      return;
    }

    // Validate size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg(`Image exceeds maximum size of ${maxSizeMB}MB.`);
      return;
    }

    // Create local object URL for preview (ready for Cloudinary backend later)
    try {
      const previewUrl = URL.createObjectURL(file);
      onChange(previewUrl, file);
    } catch (err) {
      console.error('Error generating preview URL:', err);
      setErrorMsg('Failed to process image file.');
    }
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
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setErrorMsg(null);
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload project screenshot"
      />

      {value ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl border border-slate-700/60 bg-[#101D30] overflow-hidden group">
          <div className="aspect-video w-full max-h-64 flex items-center justify-center bg-black/40 overflow-hidden">
            <img
              src={value}
              alt="Project preview"
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={triggerBrowse}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/90 text-slate-200 hover:text-cyan-400 border border-slate-700/60 text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <RefreshCw size={13} />
              Replace Image
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold backdrop-blur-md transition-colors"
            >
              <X size={13} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/5'
              : 'border-slate-700/60 bg-[#101D30]/60 hover:border-slate-600 hover:bg-[#101D30]'
          }`}
        >
          <div className="h-12 w-12 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-3">
            <UploadCloud size={24} />
          </div>

          <p className="text-xs font-semibold text-slate-200 text-center">
            Click to upload screenshot or drag & drop
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            PNG, JPG, JPEG, or WEBP (up to {maxSizeMB}MB)
          </p>

          <button
            type="button"
            className="mt-4 px-3.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 text-xs text-slate-300 font-medium hover:text-slate-100"
          >
            Browse files
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
