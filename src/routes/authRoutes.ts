import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma';

const router = Router();

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || username.length < 3) {
        return res.status(400).json({ error: "Kullanıcı adı en az 3 karakter olmalıdır" });
    }
    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: "Geçerli bir e-posta adresi girin" });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        // Don't send password back
        res.json({ message: "Welcome to ArianWatch! 🌸", userId: user.id });
    } catch (e: any) {
        console.error("Registration Error Detail:", e);
        if (e.code === 'P2002') {
            res.status(400).json({ error: "Bu e-posta veya kullanıcı adı zaten kullanılıyor" });
        } else {
            res.status(400).json({ error: "Kayıt sırasında bir hata oluştu" });
        }
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials :(" });
    }

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '7d' } // Longer token for convenience in dev
    );

    // Return user info excluding password
    const { password: _, ...userInfo } = user;

    res.json({ accessToken, user: userInfo });
});

// Admin Password Reset (with secret key - for development/emergency use)
router.post('/reset-password', async (req: Request, res: Response) => {
    const { email, newPassword, secretKey } = req.body;

    // Simple secret key protection (change this in production!)
    const RESET_SECRET = process.env.RESET_SECRET || 'arianwatch-reset-2024';

    if (secretKey !== RESET_SECRET) {
        return res.status(403).json({ error: "Geçersiz gizli anahtar" });
    }

    if (!email || !isValidEmail(email)) {
        return res.status(400).json({ error: "Geçerli bir e-posta adresi girin" });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "Bu e-posta ile kayıtlı kullanıcı bulunamadı" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.json({
            message: "Şifre başarıyla sıfırlandı! 🎉",
            username: user.username
        });
    } catch (e: any) {
        console.error("Password Reset Error:", e);
        res.status(500).json({ error: "Şifre sıfırlama sırasında bir hata oluştu" });
    }
});

export default router;
