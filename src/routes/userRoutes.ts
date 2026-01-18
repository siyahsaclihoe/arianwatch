import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get My Profile
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
            watchList: { include: { anime: { select: { title: true, slug: true, posterUrl: true, episodes: { select: { id: true } } } } } }
        }
    });

    // Calculate stats
    const stats = {
        watching: user?.watchList.filter((w: any) => w.status === 'WATCHING').length || 0,
        completed: user?.watchList.filter((w: any) => w.status === 'COMPLETED').length || 0,
        planToWatch: user?.watchList.filter((w: any) => w.status === 'PLAN_TO_WATCH').length || 0,
        totalEpisodes: 0
    };

    const { password, ...userInfo } = user!;
    res.json({ ...userInfo, stats });
});

// Update Profile
router.put('/me', authenticateToken, async (req: Request, res: Response) => {
    const { bio, avatarUrl, coverUrl } = req.body;

    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data: { bio, avatarUrl, coverUrl }
    });

    const { password, ...userInfo } = updatedUser;
    res.json(userInfo);
});

// Update Watchlist Item
router.post('/watchlist', authenticateToken, async (req: Request, res: Response) => {
    const { animeId, status, progress, score } = req.body;

    const item = await prisma.watchList.upsert({
        where: {
            userId_animeId: {
                userId: req.user.id,
                animeId
            }
        },
        update: { status, progress, score },
        create: {
            userId: req.user.id,
            animeId,
            status,
            progress,
            score
        }
    });

    res.json(item);
});

export default router;
