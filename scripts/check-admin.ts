import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAdmins() {
    console.log('🔍 Checking for admin users...');

    // We need to use the connection string from .env
    // Ensure DATABASE_URL is set

    try {
        const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { email: true, fullName: true, createdAt: true }
        });

        if (admins.length === 0) {
            console.log('❌ No admin users found in the database.');
        } else {
            console.log(`✅ Found ${admins.length} admin user(s):`);
            admins.forEach(admin => {
                console.log(`   - ${admin.fullName} (${admin.email}) [Created: ${admin.createdAt.toISOString()}]`);
            });
        }
    } catch (e) {
        console.error('Error querying database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmins();
