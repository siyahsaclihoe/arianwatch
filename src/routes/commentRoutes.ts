import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';
import { getRank, calculateNextRank } from '../utils/rankSystem';

const router = Router();

// Get Comments for Anime
router.get('/:animeId', async (req: Request, res: Response) => {
    const comments = await prisma.comment.findMany({
        where: { animeId: req.params.animeId, parentId: null }, // Top level only, fetch children via include if needed? Or fetching all and building tree in frontend?
        // Let's fetch all and tree-ify in frontend for simplicity or fetch via relation
        include: {
            user: { select: { username: true, avatarUrl: true, rank: true, role: true } },
            children: {
                include: { user: { select: { username: true, avatarUrl: true, rank: true, role: true } } }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    res.json(comments);
});

// Post Comment
router.post('/', authenticateToken, async (req: Request, res: Response) => {
    const { content, animeId, parentId, isSpoiler } = req.body;

    // Create comment
    const comment = await prisma.comment.create({
        data: {
            content,
            animeId,
            userId: req.user.id,
            parentId,
            isSpoiler: isSpoiler || false
        },
        include: { user: true }
    });

    // Award XP
    const xpGain = 15;
    const user = await prisma.user.update({
        where: { id: req.user.id },
        data: { xp: { increment: xpGain } }
    });

    // Check Rank Up
    const newRank = getRank(user.xp);
    if (newRank !== user.rank) {
        await prisma.user.update({
            where: { id: user.id },
            data: { rank: newRank }
        });
        // Create Rank Up Notification
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Seviye Atladın! 🎉",
                message: `Tebrikler! Artık bir "${newRank}" oldun.`,
                type: 'LEVEL_UP'
            }
        });
    }

    // Create Notification for Parent Comment Author
    if (parentId) {
        const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
        if (parentComment && parentComment.userId !== req.user.id) {
            await prisma.notification.create({
                data: {
                    userId: parentComment.userId,
                    title: "Yeni Yanıt 💬",
                    message: `${user.username} yorumuna yanıt verdi.`,
                    type: 'REPLY',
                    link: `/anime/${animeId}` // Ideally anchor to comment
                }
            });
        }
    }

    res.json(comment);
});

// Vote on Comment (Upvote/Downvote)
router.post('/:id/vote', authenticateToken, async (req: Request, res: Response) => {
    const { type } = req.body; // 'up' or 'down'
    const commentId = req.params.id;

    try {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) {
            return res.status(404).json({ error: 'Yorum bulunamadı' });
        }

        // Update vote count
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: type === 'up'
                ? { upvotes: { increment: 1 } }
                : { downvotes: { increment: 1 } }
        });

        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Oy verilemedi' });
    }
});

export default router;
