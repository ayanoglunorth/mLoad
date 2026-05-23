'use client';

import { useState, useCallback } from 'react';
import { Link, ClipboardPaste, Loader2, Download } from 'lucide-react';

export default function URLInput({ onFetch, isLoading }) {
  const [url, setUrl] = useState('');

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      // Clipboard access denied or not available
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-1.5 sm:gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
        <Link className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 shrink-0" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste video URL..."
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-sm leading-tight min-w-0"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handlePaste}
          disabled={isLoading}
          title="Paste from clipboard"
          className="p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 shrink-0"
        >
          <ClipboardPaste className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-700 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors disabled:cursor-not-allowed shrink-0"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <><Download className="w-3.5 h-3.5 sm:hidden" /><span className="hidden sm:inline">Fetch Media</span></>
          )}
        </button>
      </div>
    </form>
  );
}
