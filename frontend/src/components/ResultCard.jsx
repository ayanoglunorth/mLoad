import { Clock, User } from 'lucide-react';
import FormatSelector from './FormatSelector';

function formatDuration(seconds) {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function ResultCard({ data, onDownload, isDownloading, onClear }) {
  const { title, thumbnail, duration, uploader, formats } = data;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="relative aspect-video bg-zinc-800">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-zinc-200 text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(duration)}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-zinc-100 line-clamp-2 leading-snug">
              {title}
            </h2>
            {uploader && (
              <p className="text-sm text-zinc-400 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {uploader}
              </p>
            )}
          </div>

          <FormatSelector
            formats={formats}
            onDownload={onDownload}
            isDownloading={isDownloading}
          />
        </div>
      </div>
    </div>
  );
}
