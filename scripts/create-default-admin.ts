import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
    console.log('👷 Creating default admin user...');

    const email = 'admin@evopeptides.com';
    const password = 'EvoAdmin2026!'; // Meets complexity: >8 chars, 1 uppercase, 1 number
    const fullName = 'System Administrator';

    try {
        // Check if exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            console.log(`⚠️ User ${email} already exists.`);
            if (existing.role === 'admin') {
                console.log('✅ User is already an admin.');
            } else {
                console.log('🔄 Promoting user to admin...');
                await prisma.user.update({
                    where: { email },
                    data: { role: 'admin' }
                });
                console.log('✅ User promoted to admin.');
            }
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                fullName,
                role: 'admin',
                emailVerified: true
            }
        });

        console.log('✅ Admin user created successfully:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('   Create Date: ' + user.createdAt.toISOString());

    } catch (e) {
        console.error('❌ Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
