import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Save Progress
router.post('/progress', authenticateToken, async (req: Request, res: Response) => {
    const { animeId, progress } = req.body;

    try {
        await prisma.watchHistory.upsert({
            where: {
                userId_animeId: {
                    userId: req.user.id,
                    animeId
                }
            },
            update: { progress },
            create: {
                userId: req.user.id,
                animeId,
                progress
            }
        });

        // Also update Last Watched status to WATCHING if not COMPLETED
        // Optional logic: if progress > 90%, mark as COMPLETED?

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to save progress" });
    }
});

// Get Continue Watching List
router.get('/continue', authenticateToken, async (req: Request, res: Response) => {
    const history = await prisma.watchHistory.findMany({
        where: { userId: req.user.id },
        orderBy: { updatedAt: 'desc' },
        take: 10,
        include: {
            anime: {
                select: {
                    id: true,
                    title: true,
                    posterUrl: true,
                    slug: true,
                    episodes: {
                        take: 1,
                        orderBy: { number: 'asc' } // Just to have an episode ID to link to
                    }
                }
            }
        }
    });

    res.json(history);
});

export default router;
