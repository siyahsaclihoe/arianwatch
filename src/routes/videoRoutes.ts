import express from 'express';
import axios from 'axios';

const router = express.Router();

// Video proxy endpoint to bypass CORS
router.get('/stream', async (req, res) => {
    try {
        const videoUrl = req.query.url as string;

        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        // Validate URL
        try {
            new URL(videoUrl);
        } catch {
            return res.status(400).json({ error: 'Invalid URL' });
        }

        // Get range header for video seeking
        const range = req.headers.range;

        const headers: any = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': new URL(videoUrl).origin,
        };

        if (range) {
            headers['Range'] = range;
        }

        const response = await axios({
            method: 'get',
            url: videoUrl,
            responseType: 'stream',
            headers,
            timeout: 30000,
        });

        // Forward relevant headers
        const contentType = response.headers['content-type'] || 'video/mp4';
        const contentLength = response.headers['content-length'];
        const contentRange = response.headers['content-range'];
        const acceptRanges = response.headers['accept-ranges'];

        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Range');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

        if (acceptRanges) {
            res.setHeader('Accept-Ranges', acceptRanges);
        } else {
            res.setHeader('Accept-Ranges', 'bytes');
        }

        if (contentLength) {
            res.setHeader('Content-Length', contentLength);
        }

        if (contentRange) {
            res.setHeader('Content-Range', contentRange);
            res.status(206);
        } else {
            res.status(200);
        }

        // Pipe the video stream
        response.data.pipe(res);

        // Handle client disconnect
        req.on('close', () => {
            response.data.destroy();
        });

    } catch (error: any) {
        console.error('Video proxy error:', error.message);

        if (error.response?.status === 403) {
            return res.status(403).json({ error: 'Access denied by video source' });
        }

        if (error.code === 'ECONNABORTED') {
            return res.status(504).json({ error: 'Video source timeout' });
        }

        res.status(500).json({ error: 'Failed to stream video' });
    }
});

// OPTIONS request for CORS preflight
router.options('/stream', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range');
    res.status(204).end();
});

export default router;
