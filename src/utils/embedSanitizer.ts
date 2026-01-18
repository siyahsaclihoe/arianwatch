export const sanitizeEmbedUrl = (url: string): string | null => {
    const allowedDomains = [
        'sibnet.ru',
        'video.sibnet.ru',
        'aitrvip.com',
        'streamtape.com'
    ];

    try {
        const parsed = new URL(url);
        if (allowedDomains.some(d => parsed.hostname.endsWith(d))) {
            return url;
        }
    } catch (e) {
        return null;
    }
    return null;
};
