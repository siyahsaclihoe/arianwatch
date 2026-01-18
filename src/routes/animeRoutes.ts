import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import { sanitizeEmbedUrl } from '../utils/embedSanitizer';

const router = Router();

// Random Anime
router.get('/random', async (req: Request, res: Response) => {
    try {
        const count = await prisma.anime.count();
        const skip = Math.floor(Math.random() * count);
        const randomAnime = await prisma.anime.findFirst({
            take: 1,
            skip: skip
        });

        if (randomAnime) {
            res.json({ id: randomAnime.id });
        } else {
            res.status(404).json({ error: "No anime found" });
        }
    } catch (e) { res.status(500).json({ error: "Failed to get random anime" }); }
});

// Get Anime List (Public)
router.get('/', async (req, res) => {
    // Support search, genre, year, and sort
    const { search, genre, year, sort, limit } = req.query;

    let orderBy: any = { popularity: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'oldest') orderBy = { createdAt: 'asc' };
    if (sort === 'popularity') orderBy = { popularity: 'desc' };

    const where: any = {};
    if (search) where.title = { contains: String(search) };
    if (genre) where.genres = { contains: String(genre) };
    if (year) where.year = Number(year);

    const take = limit ? Number(limit) : 20;

    const animes = await prisma.anime.findMany({
        where,
        take,
        orderBy,
        include: { episodes: true }
    });
    res.json(animes);
});

// Get Single Anime with Episodes (Public)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const anime = await prisma.anime.findUnique({
        where: { id },
        include: { episodes: { orderBy: { number: 'asc' } } }
    });
    if (!anime) return res.status(404).json({ error: "Anime not found" });
    res.json(anime);
});

// Admin: Add Anime
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { title, slug, synopsis, genres, year, posterUrl, broadcastDay, broadcastTime } = req.body;

    try {
        const anime = await prisma.anime.create({
            data: {
                title,
                slug: slug || title.toLowerCase().replace(/ /g, '-'),
                synopsis,
                genres,
                year: Number(year),
                posterUrl,
                broadcastDay: broadcastDay !== undefined && broadcastDay !== '' ? Number(broadcastDay) : null,
                broadcastTime: broadcastTime || null
            }
        });
        res.json(anime);
    } catch (e) {
        res.status(400).json({ error: "Failed to create anime. Slug might be taken." });
    }
});

// Admin: Add Episode
router.post('/:id/episodes', authenticateToken, authorizeRole(['ADMIN', 'TRANSLATOR']), async (req: Request, res: Response) => {
    const { number, embedUrl, title, introStart, introEnd } = req.body;

    const episode = await prisma.episode.create({
        data: {
            animeId: req.params.id,
            number: Number(number),
            title,
            embedUrl,
            introStart: introStart ? Number(introStart) : null,
            introEnd: introEnd ? Number(introEnd) : null
        }
    });
    res.json(episode);
});

// Admin: Update Episode
router.put('/:animeId/episodes/:episodeId', authenticateToken, authorizeRole(['ADMIN', 'TRANSLATOR']), async (req: Request, res: Response) => {
    const { episodeId } = req.params;
    const { number, embedUrl, title, introStart, introEnd } = req.body;

    try {
        const episode = await prisma.episode.update({
            where: { id: episodeId },
            data: {
                number: number ? Number(number) : undefined,
                title,
                embedUrl,
                introStart: introStart !== undefined ? Number(introStart) : undefined,
                introEnd: introEnd !== undefined ? Number(introEnd) : undefined
            }
        });
        res.json(episode);
    } catch (e) {
        res.status(400).json({ error: "Failed to update episode" });
    }
});

// Admin: Update Anime
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, slug, synopsis, genres, year, posterUrl, broadcastDay, broadcastTime } = req.body;

    try {
        const anime = await prisma.anime.update({
            where: { id },
            data: {
                title,
                slug: slug || title?.toLowerCase().replace(/ /g, '-'),
                synopsis,
                genres,
                year: year ? Number(year) : undefined,
                posterUrl,
                broadcastDay: broadcastDay !== undefined && broadcastDay !== '' ? Number(broadcastDay) : null,
                broadcastTime: broadcastTime || null
            }
        });
        res.json(anime);
    } catch (e) {
        res.status(400).json({ error: "Failed to update anime" });
    }
});

// Admin: Delete Episode (MUST be before /:id to avoid route conflict)
router.delete('/:animeId/episodes/:episodeId', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { episodeId } = req.params;

    try {
        await prisma.episode.delete({
            where: { id: episodeId }
        });
        res.json({ message: "Episode deleted" });
    } catch (e) {
        res.status(400).json({ error: "Failed to delete episode" });
    }
});

// Admin: Delete Anime (cascades to episodes)
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // First delete all related episodes
        await prisma.episode.deleteMany({ where: { animeId: id } });
        // Then delete watchlist entries
        await prisma.watchList.deleteMany({ where: { animeId: id } });
        // Then delete watch history
        await prisma.watchHistory.deleteMany({ where: { animeId: id } });
        // Then delete comments
        await prisma.comment.deleteMany({ where: { animeId: id } });
        // Finally delete the anime
        await prisma.anime.delete({ where: { id } });
        res.json({ message: "Anime and all related data deleted" });
    } catch (e) {
        console.error("Delete anime error:", e);
        res.status(400).json({ error: "Failed to delete anime" });
    }
});

export default router;
