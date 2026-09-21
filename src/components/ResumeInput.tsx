import { useState, useCallback } from 'react';
import { FileText, Upload, X, Check } from 'lucide-react';

interface ResumeInputProps {
  value: string;
  onChange: (text: string) => void;
  label: string;
  placeholder: string;
  acceptFiles?: boolean;
}

export default function ResumeInput({
  value,
  onChange,
  label,
  placeholder,
  acceptFiles = false,
}: ResumeInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const validTypes = ['.txt', '.text', '.md', '.markdown'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) {
      setError('Please upload a .txt or .md file. PDF/DOCX parsing requires a server-side step.');
      return;
    }
    if (file.size > 500_000) {
      setError('File is too large (max 500KB). Please paste the text instead.');
      return;
    }
    const text = await file.text();
    setFileName(file.name);
    onChange(text);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const charCount = value.length;

  return (
    <div className="flex flex-col h-full">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
        <FileText className="w-4 h-4 text-cyan-400" />
        {label}
      </label>
      {acceptFiles && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`mb-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
          }`}
        >
          <label className="flex items-center justify-center gap-2 py-4 px-3 cursor-pointer">
            <Upload className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">
              {fileName ? (
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Check className="w-3.5 h-3.5" /> {fileName}
                </span>
              ) : (
                'Drop a .txt file or click to browse'
              )}
            </span>
            <input
              type="file"
              accept=".txt,.text,.md,.markdown"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
      )}
      <div className="relative flex-1 flex flex-col">
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (fileName && e.target.value !== value) setFileName(null);
          }}
          placeholder={placeholder}
          className="flex-1 w-full resize-none rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm leading-relaxed p-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all min-h-[200px]"
        />
        <div className="flex items-center justify-between mt-2">
          {error ? (
            <span className="text-xs text-red-400">{error}</span>
          ) : (
            <span className="text-xs text-slate-600">{charCount} characters</span>
          )}
          {value && (
            <button
              onClick={() => { onChange(''); setFileName(null); setError(null); }}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
