import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';

const router = Router();

// Get active slides (Public)
router.get('/', async (req, res) => {
    try {
        const slides = await prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
        res.json(slides);
    } catch (e) { res.status(500).json({ error: "Failed to fetch slides" }); }
});

// Admin: Get all slides
router.get('/all', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req, res) => {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(slides);
    } catch (e) { res.status(500).json({ error: "Failed to fetch slides" }); }
});

// Admin: Create slide
router.post('/', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { title, description, imageUrl, animeId, order, isActive } = req.body;
    try {
        const slide = await prisma.heroSlide.create({
            data: {
                title,
                description,
                imageUrl,
                animeId: animeId || null,
                order: Number(order) || 0,
                isActive: String(isActive) === 'true'
            }
        });
        res.json(slide);
    } catch (e) {
        console.error("Hero create error:", e);
        res.status(400).json({ error: "Failed to create slide: " + (e as Error).message });
    }
});

// Admin: Update slide
router.put('/:id', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, imageUrl, animeId, order, isActive } = req.body;
    try {
        const slide = await prisma.heroSlide.update({
            where: { id },
            data: {
                title,
                description,
                imageUrl,
                animeId,
                order: order !== undefined ? Number(order) : undefined,
                isActive: isActive !== undefined ? Boolean(isActive) : undefined
            }
        });
        res.json(slide);
    } catch (e) { res.status(400).json({ error: "Failed to update slide" }); }
});

// Admin: Delete slide
router.delete('/:id', authenticateToken, authorizeRole(['ADMIN', 'MODERATOR']), async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.heroSlide.delete({ where: { id } });
        res.json({ message: "Slide deleted" });
    } catch (e) { res.status(400).json({ error: "Failed to delete slide" }); }
});

export default router;
