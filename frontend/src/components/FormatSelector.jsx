import { useState } from 'react';
import { Download, Check } from 'lucide-react';

function formatSize(bytes) {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

export default function FormatSelector({ formats, onDownload, isDownloading }) {
  const [selectedId, setSelectedId] = useState(null);

  const handleDownload = () => {
    if (selectedId) {
      onDownload(selectedId);
    }
  };

  if (!formats || formats.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">No downloadable formats found.</p>
    );
  }

  const selectedFormat = formats.find(f => f.format_id === selectedId);

  return (
    <div className="space-y-3">
      <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin">
        {formats.map((fmt) => {
          const isSelected = fmt.format_id === selectedId;
          const sizeLabel = formatSize(fmt.filesize);
          const qualityLabel = fmt.quality;
          const tbrLabel = fmt.tbr ? `${fmt.tbr.toFixed(0)}kbps` : null;

          return (
            <button
              key={fmt.format_id}
              onClick={() => setSelectedId(fmt.format_id)}
              className={`w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition-colors text-left ${
                isSelected
                  ? 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300'
                  : 'bg-zinc-800/50 border border-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-indigo-400' : 'border-zinc-600'
                }`}>
                  {isSelected && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-indigo-400" />}
                </div>
                <span className="font-medium truncate">{qualityLabel}</span>
                <span className="text-zinc-500 shrink-0">.{fmt.ext}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-2xs sm:text-xs text-zinc-500 shrink-0">
                {sizeLabel && <span className="hidden sm:inline">{sizeLabel}</span>}
                {tbrLabel && <span className="hidden md:inline">{tbrLabel}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleDownload}
        disabled={!selectedId || isDownloading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {selectedId ? `Download ${selectedFormat?.quality || ''}` : 'Select a format'}
          </>
        )}
      </button>
    </div>
  );
}
