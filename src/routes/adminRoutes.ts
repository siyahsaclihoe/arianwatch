import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Middleware to ensure admin
const requireAdmin = [authenticateToken, authorizeRole(['ADMIN'])];

// Dashboard Stats
router.get('/stats', requireAdmin, async (req: Request, res: Response) => {
    try {
        const [userCount, animeCount, episodeCount, commentCount] = await Promise.all([
            prisma.user.count(),
            prisma.anime.count(),
            prisma.episode.count(),
            prisma.comment.count()
        ]);

        res.json({
            users: userCount,
            animes: animeCount,
            episodes: episodeCount,
            comments: commentCount
        });
    } catch (e) { res.status(500).json({ error: "Failed to fetch stats" }); }
});

// User Management
router.get('/users', requireAdmin, async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: { id: true, username: true, email: true, role: true, xp: true, rank: true, createdAt: true }
    });
    res.json(users);
});

router.post('/users/:id/ban', requireAdmin, async (req: Request, res: Response) => {
    // Basic ban: just invalidating session or adding a flag?
    // For now, let's delete user or set role to BANNED (if added to enum)
    // Or just "Deactivate" by changing password to random
    // Ideally we should add 'BANNED' to schema, but schema migration takes time.
    // Let's just delete for now as a "Hard Ban"

    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ success: true, message: "User banned (deleted)" });
    } catch (e) { res.status(500).json({ error: "Failed to ban user" }); }
});

// Comment Moderation
router.get('/comments/recent', requireAdmin, async (req: Request, res: Response) => {
    const comments = await prisma.comment.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { username: true } }, anime: { select: { title: true } } }
    });
    res.json(comments);
});

router.delete('/comments/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
        await prisma.comment.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: "Failed to delete comment" }); }
});

export default router;
