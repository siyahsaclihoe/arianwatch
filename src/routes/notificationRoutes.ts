import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Get Notifications
router.get('/', authenticateToken, async (req: Request, res: Response) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, isRead: false }
        });

        res.json({ notifications, unreadCount });
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// Mark as Read
router.put('/:id/read', authenticateToken, async (req: Request, res: Response) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id, userId: req.user.id },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to update notification" });
    }
});

// Mark ALL as Read
router.put('/read-all', authenticateToken, async (req: Request, res: Response) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: "Failed to update notifications" });
    }
});

export default router;
