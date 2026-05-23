'use client';

import { useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import URLInput from '@/components/URLInput';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ResultCard from '@/components/ResultCard';
import ErrorMessage from '@/components/ErrorMessage';

export default function Home() {
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);
    setInfo(null);

    try {
      const encodedUrl = encodeURIComponent(url);
      const res = await fetch(`/api/info?url=${encodedUrl}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setInfo(data);
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Network error. Make sure the backend server is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = useCallback(async (formatId) => {
    if (!info) return;
    setIsDownloading(true);

    try {
      const params = new URLSearchParams({
        url: info.webpage_url,
        format_id: formatId,
      });

      const a = document.createElement('a');
      a.href = `/api/download?${params.toString()}`;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  }, [info]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-zinc-100 text-sm sm:text-base">mLoad</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 pt-20 sm:pt-28 pb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight">
            Universal Media Downloader
          </h1>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-md mx-auto">
            Paste a link from YouTube, Instagram, Twitter, TikTok, and more. Download in any quality.
          </p>
        </div>

        <URLInput onFetch={handleFetch} isLoading={isLoading} />

        <ErrorMessage message={error} onDismiss={() => setError(null)} />

        {isLoading && <LoadingSkeleton />}

        {info && !isLoading && (
          <ResultCard
            data={info}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
        )}

        <footer className="mt-auto pt-16 text-center text-xs text-zinc-600">
          mLoad uses yt-dlp for media extraction. Respect content creators and copyright laws.
        </footer>
      </main>
    </div>
  );
}
