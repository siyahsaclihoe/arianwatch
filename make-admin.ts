import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const username = process.argv[2];

    if (!username) {
        console.error("Lütfen bir kullanıcı adı belirtin.");
        console.error("Kullanım: npx ts-node make-admin.ts \"KullaniciAdi\"");
        process.exit(1);
    }

    try {
        console.log(`🔍 '${username}' aranıyor...`);
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            console.error(`❌ Kullanıcı bulunamadı: ${username}`);
            process.exit(1);
        }

        const updatedUser = await prisma.user.update({
            where: { username },
            data: { role: 'ADMIN' }
        });

        console.log(`✅ BAŞARILI: ${updatedUser.username} (${updatedUser.email}) artık bir ADMIN! 🎉`);
    } catch (e) {
        console.error("Hata oluştu:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
