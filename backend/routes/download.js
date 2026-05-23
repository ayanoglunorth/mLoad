const express = require('express');
const youtubedl = require('youtube-dl-exec');

const router = express.Router();

function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

router.get('/', async (req, res) => {
  const { url, format_id } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  if (!format_id) {
    return res.status(400).json({ error: 'format_id is required' });
  }

  try {
    const info = await youtubedl(url, {
      dumpJson: true,
      noDownload: true,
      noPlaylist: true,
    });

    const title = sanitizeFilename(info.title || 'video');

    const formatInfo = (info.formats || []).find(f => f.format_id === format_id);
    const ext = formatInfo?.ext || 'mp4';

    const filename = `${title}.${ext}`;

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Transfer-Encoding', 'chunked');

    const subprocess = youtubedl.exec(url, {
      format: format_id,
      output: '-',
      noPlaylist: true,
    });

    subprocess.stdout.pipe(res);

    subprocess.stderr.on('data', (chunk) => {
      console.error('yt-dlp download stderr:', chunk.toString());
    });

    subprocess.on('error', (err) => {
      console.error('yt-dlp process error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Download failed.' });
      }
    });

    subprocess.on('close', (code) => {
      if (code !== 0 && !res.headersSent) {
        res.status(500).json({ error: `yt-dlp exited with code ${code}` });
      }
    });

    req.on('close', () => {
      if (subprocess && !subprocess.killed) {
        subprocess.kill();
      }
    });
  } catch (err) {
    const message = err.stderr || err.message || 'Unknown error';

    if (message.includes('Private video') || message.includes('private video')) {
      return res.status(403).json({ error: 'This video is private.' });
    }
    if (message.includes('Video unavailable') || message.includes('not available')) {
      return res.status(404).json({ error: 'Video is unavailable or has been removed.' });
    }

    console.error('yt-dlp download error:', message);
    res.status(500).json({ error: 'Failed to download media.' });
  }
});

module.exports = router;
