import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticateToken } from '../middleware/authMiddleware';
import axios from 'axios';

const router = Router();

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const MODEL = 'llama3.2:latest';

// AI Anime Recommendation (with optional auth for personalization)
router.post('/recommend', async (req: Request, res: Response) => {
    const { message, history = [], userId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Mesaj gerekli' });
    }

    try {
        // Get anime catalog
        const animes = await prisma.anime.findMany({
            select: {
                id: true,
                title: true,
                synopsis: true,
                genres: true,
                year: true,
                popularity: true
            },
            take: 30,
            orderBy: { popularity: 'desc' }
        });

        // Create anime catalog string
        const animeCatalog = animes.map(a =>
            `- ${a.title} (${a.year}): ${a.genres}`
        ).join('\n');

        // Get user data if userId provided
        let userData = '';
        let userName = 'Kanka';

        if (userId) {
            try {
                // Get user basic info
                const user = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if (user) {
                    userName = user.username;

                    // Get watchlist separately
                    const watchListData = await prisma.watchList.findMany({
                        where: { userId: userId },
                        include: { anime: true },
                        take: 20
                    });

                    // Get watch history separately
                    const watchHistoryData = await prisma.watchHistory.findMany({
                        where: { userId: userId },
                        include: { anime: true },
                        orderBy: { updatedAt: 'desc' },
                        take: 10
                    });

                    // Process watchlist
                    const watchlist = watchListData.filter((w: any) => w.status !== 'REMOVED');
                    const watchingList = watchlist.filter((w: any) => w.status === 'WATCHING').map((w: any) => w.anime?.title || '');
                    const plannedList = watchlist.filter((w: any) => w.status === 'PLAN_TO_WATCH').map((w: any) => w.anime?.title || '');
                    const completedList = watchlist.filter((w: any) => w.status === 'COMPLETED').map((w: any) => w.anime?.title || '');

                    // Watch history
                    const recentlyWatched = watchHistoryData.map((h: any) => h.anime?.title || '').filter(Boolean);

                    // Favorite genres from watchlist
                    const allGenres: string[] = [];
                    watchlist.forEach((w: any) => {
                        if (w.anime?.genres) {
                            const genres = w.anime.genres.split(',').map((g: string) => g.trim());
                            allGenres.push(...genres);
                        }
                    });
                    const genreCounts: Record<string, number> = {};
                    allGenres.forEach((g: string) => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
                    const favoriteGenres = Object.entries(genreCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([genre]) => genre);

                    userData = `
KULLANICI BİLGİLERİ (${userName}):
- Şu an izliyor: ${watchingList.length > 0 ? watchingList.join(', ') : 'Henüz yok'}
- İzlemeyi planlıyor: ${plannedList.length > 0 ? plannedList.slice(0, 5).join(', ') : 'Henüz yok'}
- Tamamladıkları: ${completedList.length > 0 ? completedList.slice(0, 5).join(', ') : 'Henüz yok'}
- Son izledikleri: ${recentlyWatched.length > 0 ? recentlyWatched.slice(0, 5).join(', ') : 'Henüz yok'}
- Favori türleri: ${favoriteGenres.length > 0 ? favoriteGenres.join(', ') : 'Belirsiz'}
`;
                }
            } catch (e) {
                console.log('User data fetch error:', e);
                // Continue without user data
            }
        }

        // Build conversation history
        const conversationHistory = history.map((h: any) =>
            `${h.role === 'user' ? userName : 'Itachi'}: ${h.content}`
        ).join('\n');

        // Itachi style system prompt
        const systemPrompt = `Sen "Itachi" adında ArianWatch'un AI asistanısın. Bilge, sakin ama samimi bir karaktersin.

KİŞİLİĞİN:
- Kullanıcıya adıyla hitap et (${userName})
- "Dostum", "Kanka", "Kardeşim" gibi samimi hitaplar kullan
- Bilge ve düşünceli konuş ama aşırı resmi olma
- Emoji kullan �
- Anime konusunda uzman ve yardımsever ol
- Türkçe konuş

${userData}

ANİME KATALOĞU:
${animeCatalog}

KURALLAR:
1. SADECE yukarıdaki katalogdaki animelerden öneri yap
2. Kullanıcının izleme geçmişini ve tercihlerini dikkate al
3. Zaten izlediklerini tekrar önerme
4. Anime isimlerini ** arasında yaz (örn: **One Piece**)
5. Kısa ve samimi yanıtlar ver
6. Neden o animeyi önerdiğini açıkla`;

        const prompt = conversationHistory
            ? `${systemPrompt}\n\nÖnceki konuşma:\n${conversationHistory}\n\n${userName}: ${message}\n\nAri:`
            : `${systemPrompt}\n\n${userName}: ${message}\n\nAri:`;

        // Call Ollama API
        const response = await axios.post(OLLAMA_URL, {
            model: MODEL,
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                num_predict: 300
            }
        }, {
            timeout: 120000
        });

        const aiResponse = response.data.response || 'Ay pardon kanka, bir sorun oldu. Tekrar dener misin?';

        // Extract mentioned anime titles for linking
        const mentionedAnimes = animes.filter(a =>
            aiResponse.toLowerCase().includes(a.title.toLowerCase())
        ).map(a => ({ id: a.id, title: a.title }));

        res.json({
            response: aiResponse,
            mentionedAnimes
        });

    } catch (error: any) {
        console.error('AI Error:', error.message, error.code);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                error: 'Ollama çalışmıyor kanka! Terminal\'de "ollama serve" yaz.',
                hint: 'ollama serve'
            });
        }

        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return res.status(504).json({
                error: 'Llama biraz yavaş çalışıyor, bir daha dene kanka! 🐢',
                hint: 'Model ilk çalıştırmada yavaş olabilir, biraz bekle.'
            });
        }

        res.status(500).json({
            error: 'Bi\' sıkıntı oldu, tekrar dener misin?',
            details: error.message
        });
    }
});

// Check AI availability
router.get('/status', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
        const models = response.data.models || [];
        res.json({
            available: true,
            models: models.map((m: any) => m.name)
        });
    } catch (error) {
        res.json({ available: false, error: 'Ollama servisi çalışmıyor' });
    }
});

export default router;
