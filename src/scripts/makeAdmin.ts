import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const username = process.argv[2];

    if (!username) {
        console.log("Usage: npx ts-node src/scripts/makeAdmin.ts <username>");
        return;
    }

    const user = await prisma.user.update({
        where: { username: username },
        data: { role: 'ADMIN' },
    });

    console.log(`Successfully updated user ${user.username} to ADMIN role! 👑`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
