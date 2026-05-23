const express = require('express');
const youtubedl = require('youtube-dl-exec');

const router = express.Router();

const SUPPORTED_DOMAINS = [
  'youtube.com', 'youtu.be',
  'instagram.com',
  'twitter.com', 'x.com',
  'tiktok.com',
  'facebook.com',
  'vimeo.com',
  'dailymotion.com',
];

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return SUPPORTED_DOMAINS.some(domain => url.hostname.includes(domain));
  } catch {
    return false;
  }
}

function formatFormats(formats) {
  const seen = new Set();
  const result = [];

  for (const f of formats) {
    if (f.vcodec === 'none' && f.acodec !== 'none') {
      result.push({
        format_id: f.format_id,
        ext: f.ext,
        quality: 'Audio Only',
        filesize: f.filesize || f.filesize_approx || null,
        tbr: f.tbr || null,
        vcodec: null,
        acodec: f.acodec,
      });
      continue;
    }

    const height = f.height || 0;
    const key = `${height}p` + (f.ext || '');
    if (seen.has(key)) continue;
    seen.add(key);

    result.push({
      format_id: f.format_id,
      ext: f.ext || 'mp4',
      quality: height >= 2160 ? '4K' : height >= 1440 ? '1440p' : height >= 1080 ? '1080p' : height >= 720 ? '720p' : height >= 480 ? '480p' : height >= 360 ? '360p' : `${height}p`,
      filesize: f.filesize || f.filesize_approx || null,
      tbr: f.tbr || null,
      resolution: f.width && height ? `${f.width}x${height}` : null,
      vcodec: f.vcodec,
      acodec: f.acodec,
    });
  }

  return result;
}

router.get('/', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Unsupported URL. Please provide a valid video URL from YouTube, Instagram, Twitter, TikTok, Facebook, Vimeo, or Dailymotion.' });
  }

  try {
    const data = await youtubedl(url, {
      dumpJson: true,
      noDownload: true,
      noPlaylist: true,
    });

    res.json({
      title: data.title,
      thumbnail: data.thumbnail,
      duration: data.duration,
      webpage_url: data.webpage_url,
      uploader: data.uploader || data.channel || null,
      formats: formatFormats(data.formats || []),
    });
  } catch (err) {
    const message = err.stderr || err.message || 'Unknown error';

    if (message.includes('Private video') || message.includes('private video')) {
      return res.status(403).json({ error: 'This video is private.' });
    }
    if (message.includes('Video unavailable') || message.includes('not available')) {
      return res.status(404).json({ error: 'Video is unavailable or has been removed.' });
    }
    if (message.includes('Unable to extract') || message.includes('Unsupported URL')) {
      return res.status(400).json({ error: 'Could not extract video information. The URL may be invalid or unsupported.' });
    }

    console.error('yt-dlp info error:', message);
    res.status(500).json({ error: 'Failed to fetch video information. Please try again.' });
  }
});

module.exports = router;
